import React from 'react';

interface BoardingPassBackProps {
  className?: string;
}

export const BoardingPassBack: React.FC<BoardingPassBackProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-[620px] max-w-[94vw] h-[230px] rounded-[16px] bg-[#1d4ed8] text-white select-none overflow-hidden border border-[#1e40af] shadow-2xl flex flex-col justify-center items-center ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #2563eb 0%, #1d4ed8 70%, #1e3a8a 100%)
        `,
      }}
    >
      {/* Topographical Contour Watermark Lines (SVG) - White line art */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 overflow-hidden rounded-[16px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 620 230"
      >
        <path
          d="M-40,60 Q80,10 180,70 T360,40 T540,80 T700,50"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
        />
        <path
          d="M-20,90 Q100,40 200,100 T380,70 T560,110 T720,80"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <path
          d="M-50,120 Q70,70 170,130 T350,100 T530,140 T690,110"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <path
          d="M-30,150 Q110,100 210,160 T390,130 T570,170 T730,140"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <path
          d="M-40,180 Q80,130 190,190 T370,160 T550,200 T710,170"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <circle cx="120" cy="90" r="50" fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="4 4" opacity="0.5" />
        <circle cx="510" cy="70" r="40" fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="4 4" opacity="0.4" />
      </svg>

      {/* Center Branding (Matches Image 3 perfectly!) */}
      <div className="relative z-10 flex flex-col items-center space-y-2">
        {/* Northern Air Globe Logo */}
        <svg className="w-10 h-10 text-white opacity-95" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        {/* Brand Text in White */}
        <div className="text-center">
          <span className="block font-black tracking-[0.28em] text-[15px] uppercase text-white font-mono">
            NORTHERN AIR
          </span>
          <span className="block text-[8px] font-bold tracking-[0.35em] uppercase text-blue-200/80 font-mono mt-0.5">
            SHAPING THE JOURNEY
          </span>
        </div>
      </div>

      {/* Subtle Perforation Fold Line on Back */}
      <div className="absolute top-0 bottom-0 right-[155px] border-r border-dashed border-white/20"></div>

      {/* Corner Airline Alliance Mark */}
      <div className="absolute bottom-3 right-5 text-[8px] font-mono tracking-widest text-white/50 uppercase">
        A RED DOVE ALLIANCE MEMBER
      </div>
    </div>
  );
};
