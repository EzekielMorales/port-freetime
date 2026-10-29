import React from 'react';

export type ScannerStatus = 'idle' | 'reading' | 'success';

interface ScannerMachineProps {
  status: ScannerStatus;
  progress?: number;
  className?: string;
}

export const ScannerMachine: React.FC<ScannerMachineProps> = ({
  status,
  progress = 0,
  className = '',
}) => {
  const isReading = status === 'reading';
  const isSuccess = status === 'success';
  const displayText = isSuccess ? 'SUCCESS' : isReading ? 'READING' : 'READY';

  return (
    <div className={`relative w-[580px] max-w-[94vw] h-[160px] select-none pointer-events-none ${className}`}>
      
      {/* ================= 1. REAR WALL & SLOT TROUGH (Behind Card) ================= */}
      {/* Sits at z-0, visible inside the slot and along the top rim */}
      <div className="absolute inset-0 rounded-[18px] bg-[#cbc3ac] border-t-[3px] border-[#dfd9c7] border-x border-[#b5aa91] border-b-[5px] border-[#9c9177] shadow-scanner overflow-hidden z-0 machine-grain">
        
        {/* Top Rim of Rear Wall with Slanted Ventilation Slits */}
        <div className="w-full h-8 bg-gradient-to-b from-[#e0dacf] via-[#d3cbab] to-[#cbc3ac] border-b border-[#aba087] px-7 flex justify-between items-center">
          {/* Left rear vent bank */}
          <div className="flex space-x-[7px] items-center opacity-85">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`rear-vent-l-${i}`}
                className="w-[3px] h-[14px] bg-[#1a1714] rounded-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.4)] transform -skew-x-[18deg]"
              />
            ))}
          </div>
          {/* Center spacer */}
          <div className="w-12 h-[1px] bg-[#a89d84] opacity-50 rounded-full"></div>
          {/* Right rear vent bank */}
          <div className="flex space-x-[7px] items-center opacity-85">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`rear-vent-r-${i}`}
                className="w-[3px] h-[14px] bg-[#1a1714] rounded-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.4)] transform skew-x-[18deg]"
              />
            ))}
          </div>
        </div>

        {/* The Deep Slot Cavity Floor */}
        <div className="w-[96%] mx-auto mt-0.5 h-[24px] rounded-[3px] bg-[#0f0e0c] shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)] border border-[#26221c] flex items-center justify-between px-4">
          <div className="w-5 h-[2px] bg-[#332e26] rounded-full"></div>
          <div className="text-[7px] font-mono tracking-[3px] text-[#423c31] uppercase">
            MAG-STRIPE SENSOR
          </div>
          <div className="w-5 h-[2px] bg-[#332e26] rounded-full"></div>
        </div>
      </div>

      {/* ================= 2. FRONT CASING (In Front of Card) ================= */}
      {/* Positioned at z-20 so card slides behind this front panel */}
      <div className="absolute inset-0 z-20 rounded-[18px] bg-[#ded8c6] border-t-[3px] border-[#ece6d8] border-b-[5px] border-[#a89c82] border-x border-[#c8bea6] shadow-scanner overflow-hidden machine-grain">
        
        {/* Top Chamfer Bevel with Front Ventilation Slits */}
        <div className="w-full h-8 bg-gradient-to-b from-[#e8e2d2] via-[#ded8c6] to-[#d8d1be] border-b border-[#c2b79f] px-7 flex justify-between items-center relative">
          {/* Top highlight */}
          <div className="absolute -top-[1px] left-4 right-4 h-[1px] bg-white opacity-40"></div>

          {/* Left front vent bank */}
          <div className="flex space-x-[7px] items-center">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`front-vent-l-${i}`}
                className="w-[3px] h-[15px] bg-[#1d1b17] rounded-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.45)] transform -skew-x-[18deg]"
              />
            ))}
          </div>

          {/* Center notch */}
          <div className="w-12 h-[2px] bg-[#aba087] opacity-40 rounded-full"></div>

          {/* Right front vent bank */}
          <div className="flex space-x-[7px] items-center">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`front-vent-r-${i}`}
                className="w-[3px] h-[15px] bg-[#1d1b17] rounded-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.45)] transform skew-x-[18deg]"
              />
            ))}
          </div>
        </div>

        {/* Center Recessed Panel with Display and LED */}
        <div className="px-7 pt-3.5 pb-2">
          <div className="relative w-full h-[76px] rounded-[10px] bg-[#cfc7b4] border-t border-[#aba088] border-b border-[#ece6d6] shadow-[inset_0_2px_5px_rgba(0,0,0,0.38)] p-2 flex items-center justify-between">
            
            {/* Display Window */}
            <div className="relative flex-1 h-full rounded-[6px] bg-[#0c0e0d] border border-[#222624] shadow-[inset_0_2px_8px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center overflow-hidden">
              {/* Matrix dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Display Text */}
              <div
                className={`font-matrix text-2xl font-bold tracking-[0.24em] transition-all duration-150 select-none ${
                  isSuccess
                    ? 'text-[#34d399] glow-green'
                    : isReading
                    ? 'text-[#fbbf24] glow-amber'
                    : 'text-[#48534a]'
                }`}
                style={{
                  textShadow: isSuccess
                    ? '0 0 10px #10b981, 0 0 20px #059669'
                    : isReading
                    ? '0 0 10px #f59e0b, 0 0 22px #d97706'
                    : '0 0 1px rgba(0,0,0,0.9)',
                }}
              >
                {displayText}
              </div>

              {/* Glass highlight */}
              <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/12 to-transparent pointer-events-none"></div>
            </div>

            {/* Status Indicator LED (Warm Radial Bloom) */}
            <div className="w-[72px] flex items-center justify-center relative">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#c6bfae] to-[#9a8e77] border border-[#756a54] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.6)] flex items-center justify-center">
                
                <div className="w-5 h-5 rounded-full bg-[#181613] border border-[#3f392f] flex items-center justify-center shadow-inner">
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                      isSuccess
                        ? 'bg-[#6ee7b7] border border-[#a7f3d0]'
                        : isReading
                        ? 'bg-[#fef08a] border border-[#fef9c3]'
                        : 'bg-[#221e17] border border-[#14120e]'
                    }`}
                    style={{
                      boxShadow: isSuccess
                        ? '0 0 14px 5px rgba(52, 211, 153, 0.95), 0 0 32px 14px rgba(16, 185, 129, 0.65)'
                        : isReading
                        ? '0 0 16px 6px rgba(251, 191, 36, 0.95), 0 0 36px 16px rgba(245, 158, 11, 0.8)'
                        : 'inset 0 1px 2px rgba(0,0,0,0.9)',
                    }}
                  >
                    {(isReading || isSuccess) && (
                      <div className="w-1.5 h-1.5 mx-auto mt-0.5 rounded-full bg-white opacity-95 blur-[0.2px]"></div>
                    )}
                  </div>
                </div>

                {/* Amber / Green Radial Bloom */}
                {isReading && (
                  <div className="absolute -inset-7 rounded-full bg-amber-400/35 blur-xl pointer-events-none animate-pulse"></div>
                )}
                {isSuccess && (
                  <div className="absolute -inset-7 rounded-full bg-emerald-400/40 blur-xl pointer-events-none"></div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom edge labels */}
        <div className="flex justify-between items-center px-7 pt-1 text-[8px] font-mono tracking-widest text-[#9c917a] uppercase opacity-60">
          <span>OPTICAL MAG-STRIPE READER</span>
          <span>SERVO MK-IV</span>
        </div>
      </div>

      {/* Shadow under the machine */}
      <div className="w-[92%] mx-auto h-5 bg-black/20 blur-md rounded-full mt-[-8px]"></div>

      {/* Progress Track when reading */}
      {isReading && (
        <div className="w-48 mx-auto mt-3 h-1 bg-gray-300/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-75"
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
};
