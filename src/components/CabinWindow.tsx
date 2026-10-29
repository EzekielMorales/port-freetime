import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';

interface CabinWindowProps {
  isDarkMode: boolean;
  shade: number; // 0 (fully open) to 1 (fully closed)
  onShadeChange: (shade: number) => void;
  className?: string;
}

const wo = 600;
const Zr = 900;
const at = { top: 132, bottom: 716, left: 79, right: 520 };
const ks = 170;
const Fm = { top: 179, bottom: 653, left: 118, right: 481 };
const Dm = 150;
const $m = 723;
const Bm = 210;
const yd = ($m - Bm) / Zr;
const xo = 300 * yd; // ~171px travel

const Ss = (e: { top: number; bottom: number; left: number; right: number }, t: number, n: number) =>
  `inset(${((e.top - n) / Zr) * 100}% ${((wo - e.right - n) / wo) * 100}% ${((Zr - e.bottom - n) / Zr) * 100}% ${((e.left - n) / wo) * 100}% round ${(t + n) / 3}px)`;

const Wa = Ss(Fm, Dm, 2);
const Va = Ss(at, ks, 6);
const Ha = Ss(at, ks, 0);

const Um: React.CSSProperties = {
  left: `${at.left / 3}px`,
  top: `${at.top / 3}px`,
  width: `${(at.right - at.left) / 3}px`,
  height: `${(at.bottom - at.top) / 3}px`,
  borderRadius: `${ks / 3}px`,
};

const Wm = 'linear-gradient(to bottom, #5CADF4 0%, #94CCFB 33%, #C8E6FB 45%, #FFFFFF 50%)';

export const CabinWindow: React.FC<CabinWindowProps> = ({
  shade,
  onShadeChange,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startY: number; startShade: number; moved: boolean }>({
    startY: 0,
    startShade: 0,
    moved: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cloud layers drifting animation positions
  const [cloudOffset, setCloudOffset] = useState(0);

  // 60FPS Photorealistic Cloudscape Animation
  useEffect(() => {
    let animId: number;
    let offset = 0;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const width = 200;
    const height = 300;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }

    // Procedural volumetric cloud particles
    const cloudParticles: Array<{
      x: number;
      y: number;
      rx: number;
      ry: number;
      speed: number;
      opacity: number;
      tone: number;
    }> = [];

    for (let i = 0; i < 24; i++) {
      cloudParticles.push({
        x: Math.random() * (width + 100),
        y: height * 0.48 + Math.random() * (height * 0.38),
        rx: 35 + Math.random() * 45,
        ry: 16 + Math.random() * 20,
        speed: 0.18 + Math.random() * 0.18,
        opacity: 0.5 + Math.random() * 0.45,
        tone: 0.88 + Math.random() * 0.12,
      });
    }

    const loop = () => {
      offset += 0.08;
      setCloudOffset(offset);

      if (ctx && canvas) {
        ctx.clearRect(0, 0, width, height);

        // Sky atmosphere
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#5CADF4');
        skyGrad.addColorStop(0.33, '#94CCFB');
        skyGrad.addColorStop(0.45, '#C8E6FB');
        skyGrad.addColorStop(0.5, '#FFFFFF');
        skyGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw billowy drifting clouds
        for (let i = 0; i < cloudParticles.length; i++) {
          const p = cloudParticles[i];
          p.x -= p.speed;
          if (p.x < -p.rx * 2) {
            p.x = width + p.rx * 2;
            p.y = height * 0.48 + Math.random() * (height * 0.38);
          }

          const puffGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            p.rx * 0.1,
            p.x,
            p.y,
            p.rx
          );
          const lum = Math.round(255 * p.tone);
          puffGrad.addColorStop(0, `rgba(${lum}, ${lum}, ${lum}, ${p.opacity})`);
          puffGrad.addColorStop(0.6, `rgba(240, 246, 255, ${p.opacity * 0.7})`);
          puffGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = puffGrad;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Horizon fog wash
        const fogGrad = ctx.createLinearGradient(0, height * 0.65, 0, height);
        fogGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        fogGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.95)');
        fogGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, height * 0.65, width, height * 0.35);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer drag logic
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = {
        startY: e.clientY,
        startShade: shade,
        moved: false,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      sound.playSlide(0.3);
    },
    [shade]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - dragRef.current.startY;
      if (Math.abs(deltaY) > 3) {
        dragRef.current.moved = true;
      }
      const next = Math.max(0, Math.min(1, dragRef.current.startShade + deltaY / xo));
      onShadeChange(next);
    },
    [isDragging, onShadeChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignore
      }

      // If user tapped without dragging, toggle shade
      if (!dragRef.current.moved) {
        if (shade > 0.5) {
          onShadeChange(0);
          sound.playSlide(0.4);
        } else {
          onShadeChange(1);
          sound.playClick();
        }
        return;
      }

      // Otherwise snap to closest state
      if (shade > 0.45) {
        onShadeChange(1);
        sound.playClick();
      } else {
        onShadeChange(0);
        sound.playSlide(0.4);
      }
    },
    [isDragging, shade, onShadeChange]
  );

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={className}
      style={{
        position: 'relative',
        width: '200px',
        height: '300px',
        margin: '0 auto',
        isolation: 'isolate',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. SKY & DRIFTING CLOUDS (CLIPPED TO INNER WINDOW APERTURE)               */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: Wa,
          WebkitClipPath: Wa,
          background: Wm,
          overflow: 'hidden',
        }}
      >
        {/* Real-time moving canvas sky and volumetric clouds */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Real cloud.png puffs drifting smoothly across the window */}
        <img
          src="/cloud.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'absolute',
            left: `${-30 - (cloudOffset % 120)}%`,
            top: '34%',
            width: '105%',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />
        <img
          src="/cloud.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'absolute',
            left: `${30 - (cloudOffset * 1.3 % 140)}%`,
            top: '30%',
            width: '100%',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
        <img
          src="/cloud.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'absolute',
            left: `${-15 - (cloudOffset * 0.8 % 130)}%`,
            top: '46%',
            width: '135%',
            opacity: 0.95,
            pointerEvents: 'none',
          }}
        />

        {/* Bottom Horizon Fog */}
        <div
          style={{
            position: 'absolute',
            inset: '64% 0 0 0',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #FFFFFF 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. RECESSED INNER RIM (WINDOW BACK)                                       */}
      {/* ========================================================================= */}
      <img
        src="/window-back.webp"
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          filter: `brightness(${1 - shade * 0.86})`,
          transition: isDragging ? 'none' : 'filter 0.3s ease-out',
        }}
      />

      {/* ========================================================================= */}
      {/* 3. WINDOW SHUTTER (PULL-DOWN ACCORDION/SLAT SHADE)                        */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: Va,
          WebkitClipPath: Va,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/window-shutter.webp"
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            filter: `brightness(${1 - shade * 0.82})`,
            transform: `translate3d(0, ${-(1 - shade) * yd * 100}%, 0)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s ease-out',
          }}
        />
        {/* Shutter Recessed Shadow Mask */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            ...Um,
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 11px rgba(28, 25, 22, 0.42), inset 0 0 3px rgba(28, 25, 22, 0.30)',
            maskImage: 'url(/window-shutter.webp)',
            WebkitMaskImage: 'url(/window-shutter.webp)',
            maskSize: '200px 300px',
            WebkitMaskSize: '200px 300px',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: `${-79 / 3}px ${-132 / 3 - (1 - shade) * xo}px`,
            WebkitMaskPosition: `${-79 / 3}px ${-132 / 3 - (1 - shade) * xo}px`,
            transition: isDragging ? 'none' : 'mask-position 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. WINDOW FRONT MOLDED BEZEL                                              */}
      {/* ========================================================================= */}
      <img
        src="/window-front.webp"
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          filter: `brightness(${1 - shade * 0.8})`,
          transition: isDragging ? 'none' : 'filter 0.3s ease-out',
        }}
      />

      {/* Multiply dark shading tone over front bezel in Dark Mode */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          maskImage: 'url(/window-front.webp)',
          WebkitMaskImage: 'url(/window-front.webp)',
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          opacity: shade * 0.55,
          background: 'linear-gradient(to bottom, #6a6e78 0%, #878b95 38%, #a2a7ae 100%)',
          transition: isDragging ? 'none' : 'opacity 0.3s ease-out',
        }}
      />

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE GRAB/DRAG BUTTON AREA                                      */}
      {/* ========================================================================= */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-pressed={shade > 0.5}
        title={shade > 0.5 ? 'Open the window shade' : 'Close the window shade'}
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: Ha,
          WebkitClipPath: Ha,
          background: 'none',
          border: 0,
          padding: 0,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
          zIndex: 30,
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          {shade > 0.5 ? 'Open the window shade' : 'Close the window shade'}
        </span>
      </button>
    </div>
  );
};
