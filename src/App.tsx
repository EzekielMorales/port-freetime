import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BoardingPass } from './components/BoardingPass';
import { PassengerData, DEFAULT_PASSENGER } from './types';
import { ScannerMachine, ScannerStatus } from './components/ScannerMachine';
import { NextPage } from './components/NextPage';
import { sound } from './utils/audio';



export function App() {
  const [currentPage, setCurrentPage] = useState<'gate' | 'dashboard'>('gate');
  const [passenger] = useState<PassengerData>(DEFAULT_PASSENGER);

  // Scanner status: 'idle' | 'reading' | 'success'
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [progress, setProgress] = useState(0);

  // Card physics state (Always right-side-up, crisp and clean!)
  // Slot resting position (exact match to Image 2 - card seated comfortably inside scanner slot)
  const RESTING_Y = 58;
  const AIR_HOME = { x: 0, y: 0 };

  const [cardPos, setCardPos] = useState(AIR_HOME);
  const [cardRot, setCardRot] = useState({ x: 0, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cardState, setCardState] = useState<'floating' | 'in_slot'>('floating');

  // Physics refs
  const posRef = useRef(AIR_HOME);
  const velRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0, y: 0, z: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(AIR_HOME);
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastChirpTimeRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Horizontal swipe tracking (detects swiping from left to right)
  const enteredSlotFromLeftRef = useRef(false);
  const minSwipeXRef = useRef(0);

  // Slot boundaries (relative to card resting origin)
  const SLOT_X_BOUNDS = 220;      // Slot width range
  const SWIPE_SUCCESS_X = 90;     // Swiped across to the right side (Matches Image 2)

  useEffect(() => {
    sound.enabled = true;
  }, []);

  // Ambient idle levitation loop (only when floating in mid-air above machine)
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

  // Trigger success sequence
  const handleSuccess = useCallback(() => {
    setStatus('success');
    setProgress(1);
    sound.playSuccess();

    // Settle card at the right side of the slot
    posRef.current = { x: SWIPE_SUCCESS_X + 15, y: RESTING_Y };
    rotRef.current = { x: 0, y: 0, z: 0 };
    setCardPos({ ...posRef.current });
    setCardRot({ ...rotRef.current });

    // Transition to flight dashboard after brief celebration delay
    setTimeout(() => {
      setCurrentPage('dashboard');
    }, 850);
  }, []);

  // Spring animation to target position (either air home or seated in slot)
  const springTo = (
    targetX: number,
    targetY: number,
    nextState: 'floating' | 'in_slot',
    initialVx = 0,
    initialVy = 0
  ) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let currentX = posRef.current.x;
    let currentY = posRef.current.y;
    let vx = initialVx * 0.35;
    let vy = initialVy * 0.35;
    let currentRotZ = rotRef.current.z;
    let currentRotX = rotRef.current.x;

    const springK = 0.16;
    const damping = 0.76;
    let lastTime = performance.now();

    const step = (now: number) => {
      if (isDraggingRef.current || status === 'success') return;

      const dt = Math.min(2.5, (now - lastTime) / 16.66);
      lastTime = now;

      const ax = -springK * (currentX - targetX);
      const ay = -springK * (currentY - targetY);

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
        Math.abs(currentX - targetX) < 0.5 &&
        Math.abs(currentY - targetY) < 0.5 &&
        Math.abs(vx) < 0.2 &&
        Math.abs(vy) < 0.2
      ) {
        posRef.current = { x: targetX, y: targetY };
        rotRef.current = { x: 0, y: 0, z: 0 };
        setCardPos({ x: targetX, y: targetY });
        setCardRot({ x: 0, y: 0, z: 0 });
        setCardState(nextState);
        setStatus('idle');
        setProgress(0);
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
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

    enteredSlotFromLeftRef.current = posRef.current.x < -30;
    minSwipeXRef.current = posRef.current.x;

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    sound.playSlide(0.4);
  };

  // Pointer Move (Free 3D dragging in air OR swipe along slot track)
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

    const SLOT_THRESHOLD_Y = 32;
    const isEnteringSlot = rawY >= SLOT_THRESHOLD_Y && Math.abs(rawX) <= SLOT_X_BOUNDS;

    if (isEnteringSlot) {
      // =========================================================================
      // INSIDE SCANNER SLOT:
      // Hard depth floor so it NEVER pokes out the bottom ("ไม่ทะลุ")
      // =========================================================================
      const clampedY = Math.min(RESTING_Y, rawY);
      const clampedX = Math.max(-SLOT_X_BOUNDS, Math.min(SLOT_X_BOUNDS, rawX));
      const tiltZ = Math.max(-8, Math.min(8, vx * 0.1));

      posRef.current = { x: clampedX, y: clampedY };
      rotRef.current = { x: 0, y: 0, z: tiltZ };
      setCardPos({ x: clampedX, y: clampedY });
      setCardRot({ x: 0, y: 0, z: tiltZ });

      // Track left-to-right swipe motion
      if (clampedX < -30) {
        enteredSlotFromLeftRef.current = true;
      }
      minSwipeXRef.current = Math.min(minSwipeXRef.current, clampedX);

      // Swipe progress
      const swipeProg = Math.max(0, Math.min(1, (clampedX + 110) / 220));
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
      if (clampedX >= SWIPE_SUCCESS_X && (enteredSlotFromLeftRef.current || minSwipeXRef.current < 20)) {
        isDraggingRef.current = false;
        setIsDragging(false);
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        } catch {
          // Ignore
        }
        handleSuccess();
      }
    } else {
      // =========================================================================
      // IN THE AIR (Above the slot): Free 3D floating movement
      // =========================================================================
      const tiltZ = Math.max(-16, Math.min(16, vx * 0.15 + (grabOffsetRef.current.x / 180) * 3));
      const tiltX = Math.max(-14, Math.min(14, -vy * 0.12));

      // Hard depth ceiling: Cannot go deeper than RESTING_Y even outside horizontal slot
      const clampedY = Math.min(RESTING_Y, rawY);

      posRef.current = { x: rawX, y: clampedY };
      rotRef.current = { x: tiltX, y: 0, z: tiltZ };
      setCardPos({ x: rawX, y: clampedY });
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
      sound.playSlide(0.3);

      // Did user release inside the slot?
      if (posRef.current.y >= 32 && Math.abs(posRef.current.x) <= SLOT_X_BOUNDS) {
        // PLACED IN SLOT! ("ตอนลากไปวางอ่ะ ผมอยากให้มันวางได้ ไม่ทะลุ")
        // Dock comfortably into the slot floor:
        const targetX = Math.abs(posRef.current.x) < 40 ? 0 : Math.max(-110, Math.min(110, posRef.current.x));
        springTo(targetX, RESTING_Y, 'in_slot', velRef.current.x, velRef.current.y);
      } else {
        // RELEASED IN THE AIR:
        // Springs back up to floating position and resumes floating!
        springTo(0, 0, 'floating', velRef.current.x, velRef.current.y);
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
    posRef.current = { ...AIR_HOME };
    rotRef.current = { x: 0, y: 0, z: 0 };
    setCardPos({ ...AIR_HOME });
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
