import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Scene from "./Scene";
import * as THREE from "three";
import normalizeWheel from "normalize-wheel";
import { asset } from "../../utils/assets";

interface ExperienceProps {
  onReturnToLog?: () => void;
  onReturnToGate?: () => void;
}

const Experience: React.FC<ExperienceProps> = ({
  onReturnToLog,
  onReturnToGate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const camera = useRef<any>(null);
  const cameraGroup = useRef<any>(null);
  const scrollProgress = useRef(0);
  const targetScrollProgress = useRef(0);
  const baseScrollSpeed = 0.0085;
  const scrollSpeedMultiplier = useRef(1);
  const lerpFactor = 0.1;
  const isSwiping = useRef(false);
  const mousePositionOffset = useRef(new THREE.Vector3());
  const mouseRotationOffset = useRef(new THREE.Euler());
  const lastTouchY = useRef<number | null>(null);

  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const handleToggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsNativeFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsNativeFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const targetEl = containerRef.current;
    if (!targetEl) return;

    const handleWheel = (e: WheelEvent) => {
      const normalized = normalizeWheel(e);

      // If near the start of the 3D scene and scrolling UP,
      // allow default browser scroll to naturally return up to the flight log!
      if (targetScrollProgress.current <= 0.005 && normalized.pixelY < 0) {
        return;
      }

      // Otherwise scrub the 3D scene
      e.preventDefault();
      targetScrollProgress.current +=
        Math.sign(normalized.pixelY) *
        baseScrollSpeed *
        scrollSpeedMultiplier.current *
        Math.min(Math.abs(normalized.pixelY) / 100, 1);

      if (targetScrollProgress.current < 0) {
        targetScrollProgress.current = 0;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const width = rect ? rect.width : window.innerWidth;
      const height = rect ? rect.height : window.innerHeight;
      const left = rect ? rect.left : 0;
      const top = rect ? rect.top : 0;

      const mouseX = ((clientX - left) / width) * 2 - 1;
      const mouseY = ((clientY - top) / height) * 2 - 1;

      const sensitivityX = 0.05;
      const sensitivityY = 0.05;

      mousePositionOffset.current.x = mouseX * sensitivityX;
      mousePositionOffset.current.y = mouseY * sensitivityY;

      const rotationSensitivityX = 0.05;
      const rotationSensitivityY = 0.05;

      mouseRotationOffset.current.x = mouseY * rotationSensitivityX;
      mouseRotationOffset.current.y = mouseX * rotationSensitivityY;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isSwiping.current = true;
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping.current) return;
      if (lastTouchY.current !== null) {
        const deltaY = e.touches[0].clientY - lastTouchY.current;
        const touchMultiplier = 0.3;
        targetScrollProgress.current +=
          Math.sign(deltaY) *
          baseScrollSpeed *
          touchMultiplier *
          scrollSpeedMultiplier.current;
      }
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isSwiping.current = false;
      lastTouchY.current = null;
    };

    const handleMouseDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isSwiping.current = true;
    };

    const handleMouseDrag = (e: MouseEvent) => {
      if (!isSwiping.current) return;
      const mouseMultiplier = 0.2;
      targetScrollProgress.current +=
        Math.sign(e.movementY) *
        baseScrollSpeed *
        scrollSpeedMultiplier.current *
        mouseMultiplier;
    };

    const handleMouseUp = () => {
      isSwiping.current = false;
    };

    targetEl.addEventListener("wheel", handleWheel as EventListener, { passive: false });
    targetEl.addEventListener("mousedown", handleMouseDown as EventListener);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseDrag);
    window.addEventListener("mouseup", handleMouseUp);
    targetEl.addEventListener("touchstart", handleTouchStart as EventListener, { passive: false });
    targetEl.addEventListener("touchmove", handleTouchMove as EventListener, { passive: false });
    targetEl.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      targetEl.removeEventListener("wheel", handleWheel as EventListener);
      targetEl.removeEventListener("mousedown", handleMouseDown as EventListener);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      targetEl.removeEventListener("touchstart", handleTouchStart as EventListener);
      targetEl.removeEventListener("touchmove", handleTouchMove as EventListener);
      targetEl.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-[#dceae3]"
    >
      {/* Minimalist Top-Right Navigation Controls */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <div className="paper-dock-container">
          {onReturnToLog && (
            <button
              type="button"
              onClick={onReturnToLog}
              className="paper-dock-btn"
              title="Return to Flight Log"
            >
              <span className="text-sm font-bold leading-none">↑</span>
              <span>Flight Log</span>
            </button>
          )}
          {onReturnToGate && (
            <button
              type="button"
              onClick={onReturnToGate}
              className="paper-dock-btn"
              title="Return to Gate"
            >
              <span>Gate</span>
            </button>
          )}
          <div className="paper-dock-divider" />
          <button
            type="button"
            onClick={() => {
              targetScrollProgress.current = 0;
            }}
            title="Restart Journey"
            className="paper-dock-icon-btn"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleToggleNativeFullscreen}
            title={isNativeFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="paper-dock-icon-btn"
          >
            {isNativeFullscreen ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Top Floating Cloud Mist Overhang */}
      <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none z-10 overflow-hidden">
        {/* Soft mist overlay from solid #dceae3 blending into the 3D sketchbook */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dceae3] via-[#dceae3]/75 to-transparent z-[2]" />
        
        {/* Softly masked cloud drifts */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          }}
        >
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute -top-10 -left-16 w-[440px] opacity-65 filter blur-[0.5px] pointer-events-none select-none cloud-drift-1"
            draggable="false"
          />
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute -top-12 right-4 w-[520px] opacity-60 filter blur-[0.5px] pointer-events-none select-none cloud-drift-2"
            draggable="false"
          />
        </div>
      </div>



      <Canvas
        shadows
        flat={true}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene
          cameraGroup={cameraGroup}
          camera={camera}
          scrollProgress={scrollProgress}
          targetScrollProgress={targetScrollProgress}
          lerpFactor={lerpFactor}
          mousePositionOffset={mousePositionOffset}
          mouseRotationOffset={mouseRotationOffset}
          scrollSpeedMultiplier={scrollSpeedMultiplier}
        />

        <group ref={cameraGroup}>
          <PerspectiveCamera
            ref={camera}
            makeDefault
            fov={35}
          />
        </group>
      </Canvas>
    </div>
  );
};

export default Experience;
