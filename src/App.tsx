import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BoardingPass } from './components/BoardingPass';
import { PassengerData, DEFAULT_PASSENGER } from './types';
import { ScannerMachine, ScannerStatus } from './components/ScannerMachine';
import { NextPage } from './components/NextPage';
import { sound } from './utils/audio';

type CardState = 'floating' | 'in_slot' | 'on_desk';

export function App() {
  const [currentPage, setCurrentPage] = useState<'gate' | 'dashboard'>('gate');
  const [passenger] = useState<PassengerData>(DEFAULT_PASSENGER);

  // Scanner status: 'idle' | 'reading' | 'success'
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [progress, setProgress] = useState(0);

  // Card physics state (Always right-side-up, crisp and clean!)
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [cardRot, setCardRot] = useState({ x: 0, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cardState, setCardState] = useState<CardState>('floating');

  // Physics refs
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0, y: 0, z: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastChirpTimeRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Horizontal swipe tracking (detects swiping from left to right)
  const enteredSlotFromLeftRef = useRef(false);
  const minSwipeXRef = useRef(0);

  // Slot boundaries (relative to card resting origin)
  const SLOT_Y_MIN = 45;          // Card bottom reaches slot
  const SLOT_Y_MAX = 78;          // Card inside slot channel
  const SLOT_X_BOUNDS = 220;      // Slot width range
  const SWIPE_SUCCESS_X = 90;     // Swiped across to the right side (Matches Image 2)

  useEffect(() => {
    sound.enabled = true;
  }, []);

  // Trigger success sequence
  const handleSuccess = useCallback(() => {
    setStatus('success');
    setProgress(1);
    sound.playSuccess();

    // Settle card at the right side of the slot (Matches Image 2)
    posRef.current = { x: SWIPE_SUCCESS_X + 15, y: 65 };
    rotRef.current = { x: 0, y: 0, z: 0 };
    setCardPos({ ...posRef.current });
    setCardRot({ ...rotRef.current });

    // Transition to flight dashboard after brief celebration delay
    setTimeout(() => {
      setCurrentPage('dashboard');
    }, 850);
  }, []);

  // Ambient idle levitation loop (only when floating above machine)
  useEffect(() => {
    let idleAnimId: number;
    const runIdleAnim = () => {
      if (!isDraggingRef.current && status === 'idle' && cardState === 'floating') {
        const t = performance.now();
        const floatY = Math.sin(t * 0.0018) * 4.5;
        const floatRotZ = Math.cos(t * 0.0015) * 0.6;
        const floatRotX = Math.sin(t * 0.002) * 0.4;

        if (Math.abs(posRef.current.x) < 2 && Math.abs(posRef.current.y) < 2) {
          setCardPos({ x: 0, y: floatY });
          setCardRot({ x: floatRotX, y: 0, z: floatRotZ });
        }
      }
      idleAnimId = requestAnimationFrame(runIdleAnim);
    };

    idleAnimId = requestAnimationFrame(runIdleAnim);
    return () => cancelAnimationFrame(idleAnimId);
  }, [status, cardState]);

  // Spring animation to hover position above machine
  const springToHome = (initialVx: number, initialVy: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let currentX = posRef.current.x;
    let currentY = posRef.current.y;
    let vx = initialVx * 0.4;
    let vy = initialVy * 0.4;
    let currentRotZ = rotRef.current.z;
    let currentRotX = rotRef.current.x;

    const springK = 0.14;
    const damping = 0.76;
    let lastTime = performance.now();

    const step = (now: number) => {
      if (isDraggingRef.current || status === 'success') return;

      const dt = Math.min(2.5, (now - lastTime) / 16.66);
      lastTime = now;

      const ax = -springK * currentX;
      const ay = -springK * currentY;

      vx = (vx + ax * dt) * Math.pow(damping, dt);
      vy = (vy + ay * dt) * Math.pow(damping, dt);

      currentX += vx * dt;
      currentY += vy * dt;

      currentRotZ *= Math.pow(0.85, dt);
      currentRotX *= Math.pow(0.85, dt);

      posRef.current = { x: currentX, y: currentY };
      rotRef.current = { x: currentRotX, y: 0, z: currentRotZ };
      setCardPos({ x: currentX, y: currentY });
      setCardRot({ x: currentRotX, y: 0, z: currentRotZ });

      if (
        Math.abs(currentX) < 0.5 &&
        Math.abs(currentY) < 0.5 &&
        Math.abs(vx) < 0.2 &&
        Math.abs(vy) < 0.2
      ) {
        posRef.current = { x: 0, y: 0 };
        rotRef.current = { x: 0, y: 0, z: 0 };
        setCardPos({ x: 0, y: 0 });
        setCardRot({ x: 0, y: 0, z: 0 });
        setCardState('floating');
        setStatus('idle');
        setProgress(0);
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  // Drop and rest on desk surface below machine (Clean, right-side-up, no weird mirroring!)
  const dropToDesk = (targetX: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sound.playDrop();

    const targetDeskY = 215; // Desk surface position
    const clampedDeskX = Math.max(-150, Math.min(150, targetX));
    const targetRotX = 35;   // Perspective tilt on table
    const targetRotZ = -3;   // Natural slight angle

    let currentX = posRef.current.x;
    let currentY = posRef.current.y;
    let currentRotX = rotRef.current.x;
    let currentRotZ = rotRef.current.z;

    let startTime: number | null = null;
    const duration = 350;

    const step = (now: number) => {
      if (isDraggingRef.current) return;
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);

      const x = currentX + (clampedDeskX - currentX) * ease;
      const y = currentY + (targetDeskY - currentY) * ease;
      const rx = currentRotX + (targetRotX - currentRotX) * ease;
      const rz = currentRotZ + (targetRotZ - currentRotZ) * ease;

      posRef.current = { x, y };
      rotRef.current = { x: rx, y: 0, z: rz };
      setCardPos({ x, y });
      setCardRot({ x: rx, y: 0, z: rz });

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setCardState('on_desk');
        setStatus('idle');
        setProgress(0);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  // Pointer Down (Pick Up Card)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status === 'success') return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    isDraggingRef.current = true;
    setIsDragging(true);

    const cardRect = e.currentTarget.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    grabOffsetRef.current = {
      x: e.clientX - cardCenterX,
      y: e.clientY - cardCenterY,
    };

    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { ...posRef.current };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velRef.current = { x: 0, y: 0 };

    enteredSlotFromLeftRef.current = false;
    minSwipeXRef.current = posRef.current.x;

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    sound.playSlide(0.4);
  };

  // Pointer Move (Free 2D/3D movement + Horizontal Slot Swiping)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || status === 'success') return;

    const now = performance.now();
    const dt = Math.max(8, now - lastPointerRef.current.time);
    
    const vx = ((e.clientX - lastPointerRef.current.x) / dt) * 16.66;
    const vy = ((e.clientY - lastPointerRef.current.y) / dt) * 16.66;
    velRef.current = { x: vx, y: vy };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };

    const rawX = startPosRef.current.x + (e.clientX - startPointerRef.current.x);
    const rawY = startPosRef.current.y + (e.clientY - startPointerRef.current.y);

    // Natural 3D velocity tilt
    const tiltZ = Math.max(-18, Math.min(18, vx * 0.15 + (grabOffsetRef.current.x / 180) * 3));
    const tiltX = Math.max(-14, Math.min(14, -vy * 0.12));

    // Check if card is in the horizontal slot channel
    const isInSlotHeight = rawY >= SLOT_Y_MIN && rawY <= SLOT_Y_MAX + 15;
    const isInSlotWidth = Math.abs(rawX) <= SLOT_X_BOUNDS;

    if (isInSlotHeight && isInSlotWidth) {
      // =========================================================================
      // CARD IS INSIDE THE SCANNER SLOT (SWIPE FROM LEFT TO RIGHT)
      // =========================================================================
      setCardState('in_slot');
      
      // Lock vertical depth to the slot track (Cannot poke through the bottom!)
      const slotY = Math.max(SLOT_Y_MIN, Math.min(SLOT_Y_MAX, rawY));
      const slotRotZ = tiltZ * 0.15;

      posRef.current = { x: rawX, y: slotY };
      rotRef.current = { x: 0, y: 0, z: slotRotZ };
      setCardPos({ x: rawX, y: slotY });
      setCardRot({ x: 0, y: 0, z: slotRotZ });

      // Track left-to-right swipe motion
      if (rawX < -30) {
        enteredSlotFromLeftRef.current = true;
      }
      minSwipeXRef.current = Math.min(minSwipeXRef.current, rawX);

      // Swipe progress
      const swipeProg = Math.max(0, Math.min(1, (rawX + 110) / 220));
      setProgress(swipeProg);

      if (status !== 'reading') {
        setStatus('reading');
      }

      // Scanner audio ticks while swiping
      if (now - lastChirpTimeRef.current > 90) {
        sound.playReadingChirp();
        sound.playSlide(0.3);
        lastChirpTimeRef.current = now;
      }

      // SUCCESS TRIGGER: Reached right side of machine
      if (rawX >= SWIPE_SUCCESS_X && (enteredSlotFromLeftRef.current || minSwipeXRef.current < 20)) {
        isDraggingRef.current = false;
        setIsDragging(false);
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        } catch {
          // Ignore
        }
        handleSuccess();
        return;
      }
    } else {
      // =========================================================================
      // CARD IS OUTSIDE THE SLOT (FREE 2D/3D MOVING ANYWHERE)
      // =========================================================================
      setCardState('floating');

      posRef.current = { x: rawX, y: rawY };
      rotRef.current = { x: tiltX, y: 0, z: tiltZ };
      setCardPos({ x: rawX, y: rawY });
      setCardRot({ x: tiltX, y: 0, z: tiltZ });

      if (status !== 'idle') {
        setStatus('idle');
        setProgress(0);
      }
    }
  };

  // Pointer Up / Release
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }

    if (status !== 'success') {
      setStatus('idle');
      setProgress(0);

      // If dropped below the machine (y > 130), rest on desk surface (Clean, right-side up!)
      if (posRef.current.y > 130) {
        dropToDesk(posRef.current.x);
      } else {
        // Otherwise spring back to hovering above machine
        sound.playSlide(0.3);
        springToHome(velRef.current.x, velRef.current.y);
      }
    }
  };

  const handleSkip = () => {
    sound.playClick();
    setCurrentPage('dashboard');
  };

  const handleReset = () => {
    sound.playClick();
    try {
      delete document.documentElement.dataset.theme;
    } catch {
      // Ignore
    }
    setCurrentPage('gate');
    setStatus('idle');
    setProgress(0);
    setCardState('floating');
    posRef.current = { x: 0, y: 0 };
    rotRef.current = { x: 0, y: 0, z: 0 };
    setCardPos({ x: 0, y: 0 });
    setCardRot({ x: 0, y: 0, z: 0 });
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  if (currentPage === 'dashboard') {
    return <NextPage passenger={passenger} onBack={handleReset} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f4f3f0] flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">
      
      {/* Top spacer */}
      <div className="h-4"></div>

      {/* ================= MAIN INTERACTIVE STAGE ================= */}
      <main className="flex-1 w-full flex flex-col justify-center items-center my-auto relative">
        <div className="relative flex flex-col items-center">
          
          {/* ================= 1. THE BOARDING PASS (z-10, FREE 2D/3D MOVEMENT) ================= */}
          <div className="relative z-10">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`touch-none will-change-transform ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                transform: `
                  perspective(1200px)
                  translate3d(${cardPos.x}px, ${cardPos.y}px, ${isDragging ? 25 : 0}px)
                  rotateX(${cardRot.x}deg)
                  rotateZ(${cardRot.z}deg)
                  scale(${isDragging ? 1.02 : 1})
                `,
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              }}
            >
              <BoardingPass passenger={passenger} isDragging={isDragging} />
            </div>
          </div>

          {/* ================= 2. THE SCANNER MACHINE (z-20, UNIFIED 3D CASING) ================= */}
          {/* Positioned directly under the card's resting position, card slides into the slot! */}
          <div className="mt-8 relative z-20 pointer-events-none">
            <ScannerMachine status={status} progress={progress} />
          </div>

          {/* ================= 3. INSTRUCTION TEXT (Wave Animation) ================= */}
          <div className="mt-8 text-center select-none">
            <p className="text-gray-600 text-lg md:text-xl font-normal tracking-wide inline-flex items-center justify-center flex-wrap">
              {(() => {
                let charCount = 0;
                const words = ["Swipe", "boarding", "pass", "to", "enter"];
                return words.map((word, wIdx) => (
                  <span key={wIdx} className="inline-flex mr-[0.32em] last:mr-0">
                    {word.split('').map((char, cIdx) => {
                      const delay = (charCount++) * 0.055;
                      return (
                        <span
                          key={cIdx}
                          style={{ animationDelay: `${delay.toFixed(3)}s` }}
                          className="wave-char font-normal"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                ));
              })()}
            </p>
          </div>

        </div>
      </main>

      {/* ================= FOOTER WITH SKIP BUTTON ================= */}
      <footer className="w-full max-w-6xl flex justify-end items-center pb-2 px-8 z-30">
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-800 transition-colors text-base font-sans tracking-wide py-1 px-3 rounded hover:bg-gray-200/50"
        >
          Skip
        </button>
      </footer>

    </div>
  );
}

export default App;
