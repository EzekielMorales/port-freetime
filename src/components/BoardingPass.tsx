import React from 'react';
import { PassengerData, DEFAULT_PASSENGER } from '../types';

export type { PassengerData };

interface BoardingPassProps {
  passenger?: PassengerData;
  isDragging?: boolean;
  className?: string;
}

export const BoardingPass: React.FC<BoardingPassProps> = ({
  passenger = DEFAULT_PASSENGER,
  isDragging = false,
  className = '',
}) => {
  return (
    <div
      className={`relative w-[620px] max-w-[94vw] h-[230px] rounded-[16px] bg-[#fcfbf9] text-[#1b263b] select-none border border-[#dfd9cb] transition-shadow duration-200 overflow-hidden ${
        isDragging
          ? 'shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.6)] cursor-grabbing'
          : 'shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.22)] cursor-grab'
      } ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 25%, rgba(27, 59, 138, 0.02) 0%, transparent 60%),
          radial-gradient(circle at 85% 75%, rgba(27, 59, 138, 0.03) 0%, transparent 50%),
          radial-gradient(#000000 0.4px, transparent 0.4px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 8px 8px',
      }}
    >
      {/* Topographical Contour Watermark Lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.22] overflow-hidden rounded-[16px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 620 230"
      >
        <path
          d="M-20,40 Q80,10 160,50 T320,30 T480,70 T640,40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
        />
        <path
          d="M-10,70 Q90,30 180,80 T340,60 T500,100 T650,70"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
        />
        <path
          d="M-30,100 Q60,60 150,110 T310,90 T470,130 T630,100"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
        />
        <path
          d="M-15,130 Q100,90 190,140 T350,120 T510,160 T660,130"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
        />
        <path
          d="M-20,160 Q70,120 170,170 T330,150 T490,190 T640,160"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
        />
        <circle cx="85" cy="80" r="45" fill="none" stroke="#2563eb" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.35" />
        <circle cx="535" cy="50" r="35" fill="none" stroke="#2563eb" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.25" />
      </svg>

      {/* Main Container: Left Pass + Separator + Right Stub */}
      <div className="relative z-10 w-full h-full flex">
        
        {/* ================= LEFT MAIN PASS (~74%) ================= */}
        <div className="flex-1 h-full pl-5 pr-4 py-3 flex flex-col justify-between">
          
          {/* Header Row */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-200/90 pb-2">
              <div className="flex items-center space-x-2">
                {/* Blue decorative hatch */}
                <div className="flex space-x-[2.5px] mr-1">
                  <div className="w-[3px] h-4 bg-blue-700 rounded-sm"></div>
                  <div className="w-[3px] h-4 bg-blue-600 rounded-sm"></div>
                  <div className="w-[3px] h-4 bg-blue-500 rounded-sm"></div>
                </div>
                {/* Globe Logo */}
                <svg className="w-4 h-4 text-blue-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <div className="flex items-center space-x-1.5 font-bold tracking-wider text-[11px] text-blue-900">
                  <span>NORTHERN AIR</span>
                  <span className="text-gray-300 font-normal">|</span>
                  <span className="text-[9px] font-semibold tracking-widest text-gray-500 uppercase">SHAPING THE JOURNEY</span>
                </div>
              </div>

              {/* Alliance Member badge */}
              <div className="flex items-center space-x-1 text-[8.5px] tracking-wider text-gray-500 uppercase font-mono">
                <span>A RED DOVE ALLIANCE MEMBER</span>
                <span className="w-2.5 h-2.5 rounded-full border border-red-500 text-red-500 inline-flex items-center justify-center text-[7px] font-bold">🕊</span>
              </div>
            </div>

            {/* Top Info Row */}
            <div className="mt-2.5 flex items-start justify-between text-left">
              {/* Passenger name & role */}
              <div className="w-[195px] flex-shrink-0">
                <span className="block text-[8px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">
                  PASSENGER
                </span>
                <span className="block text-[14px] font-black tracking-wide text-gray-900 leading-tight truncate">
                  {passenger.name}
                </span>
                <span className="block text-[7px] font-semibold tracking-wider text-blue-700 uppercase font-mono leading-tight">
                  {passenger.role}
                </span>
              </div>

              {/* Flight */}
              <div className="w-[65px] flex-shrink-0 pl-1">
                <span className="block text-[8px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">
                  FLIGHT
                </span>
                <span className="block text-[12.5px] font-bold text-gray-800 font-mono">
                  {passenger.flight}
                </span>
              </div>

              {/* Date */}
              <div className="w-[85px] flex-shrink-0 pl-1">
                <span className="block text-[8px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">
                  DATE
                </span>
                <span className="block text-[11.5px] font-bold text-gray-800 whitespace-nowrap font-mono">
                  {passenger.date}
                </span>
              </div>

              {/* Origin -> Destination */}
              <div className="flex items-start space-x-3 text-right flex-shrink-0 pl-2">
                <div>
                  <span className="block text-[8px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">FROM</span>
                  <span className="block text-[15px] font-black text-blue-900 leading-tight">{passenger.originCode}</span>
                  <span className="block text-[6.5px] text-gray-500 truncate max-w-[50px] font-mono">{passenger.originCity}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">TO</span>
                  <span className="block text-[15px] font-black text-blue-900 leading-tight">{passenger.destCode}</span>
                  <span className="block text-[6.5px] text-gray-500 truncate max-w-[60px] font-mono">{passenger.destCity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Gate, Boarding, Seat, Class, Seq */}
          <div className="relative flex items-center justify-between border-t border-b border-gray-200/70 py-1.5 my-1">
            <div className="flex items-center space-x-5 text-left">
              <div>
                <span className="block text-[7.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">GATE</span>
                <span className="block text-[13px] font-bold text-gray-900 font-mono">{passenger.gate}</span>
              </div>
              <div>
                <span className="block text-[7.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">BOARDING</span>
                <span className="block text-[13px] font-bold text-blue-900 font-mono">{passenger.boardingTime}</span>
                <span className="block text-[6.5px] text-gray-400 font-mono">2 AUG 2026</span>
              </div>
              <div>
                <span className="block text-[7.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">SEAT</span>
                <span className="block text-[13px] font-extrabold text-gray-900 font-mono">{passenger.seat}</span>
                <span className="block text-[6.5px] text-gray-400 font-mono">{passenger.seatType}</span>
              </div>
              <div>
                <span className="block text-[7.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">CLASS</span>
                <span className="block text-[13px] font-bold text-gray-900 font-mono">{passenger.cabinClass}</span>
                <span className="block text-[6.5px] text-gray-400 font-mono">{passenger.classType}</span>
              </div>
              <div>
                <span className="block text-[7.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">SEQ</span>
                <span className="block text-[13px] font-bold text-gray-900 font-mono">{passenger.seq}</span>
              </div>
            </div>

            {/* Circular Stamp / Seal */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-25">
              <svg className="w-14 h-14 text-blue-950" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
                <path id="circleText2" d="M 50 15 A 35 35 0 0 1 50 85 A 35 35 0 0 1 50 15" fill="none" />
                <text fontSize="7" fill="currentColor" letterSpacing="2px" fontWeight="bold">
                  <textPath href="#circleText2" startOffset="5%">
                    NORTHERN AIR • VERIFIED
                  </textPath>
                </text>
                <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="38" x2="50" y2="62" stroke="currentColor" strokeWidth="0.5" />
                <line x1="38" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>

          {/* Bottom Barcode & Advisory */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-1.5 text-[7.5px] text-blue-900 font-medium tracking-tight">
              <span className="font-bold text-blue-600">✈</span>
              <span>BOARDING GATE CLOSES 15 MINUTES BEFORE DEPARTURE</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">PLEASE BE AT THE GATE ON TIME</span>
            </div>

            {/* Realistic Barcode */}
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <div className="h-5 flex items-end space-x-[1.2px] overflow-hidden">
                  {[3,1,2,4,1,3,1,2,1,4,2,1,3,1,2,4,1,2,3,1,4,1,2,3,2,1,3,1,4,2,1,3,1,2,4,1,3,2,1,4,1,2,3,1,2,4,3,1,2,1,4,2,3,1,2,4,1,3,2,1,4,1,2,3,1,4,2,1,3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-gray-900 h-full"
                      style={{ width: `${w * 1.3}px` }}
                    />
                  ))}
                </div>
                <span className="text-[6.5px] font-mono tracking-[3.5px] text-gray-500 mt-0.5">
                  TD1887-MAN-REM-0029-2026
                </span>
              </div>

              <div className="text-[7px] text-gray-400 font-mono">
                DOC ID: NA-9824
              </div>
            </div>
          </div>
        </div>

        {/* ================= PERFORATION SEPARATOR ================= */}
        <div className="relative w-0 flex flex-col justify-between items-center my-[-1px]">
          {/* Top Notch Cutout */}
          <div className="absolute -top-[1px] -left-[7px] w-[14px] h-[10px] bg-[#f4f3f0] rounded-b-full border-b border-l border-r border-[#dfd9cb]"></div>
          
          {/* Dashed Perforation Line */}
          <div className="h-full border-r border-dashed border-gray-300"></div>
          
          {/* Bottom Notch Cutout */}
          <div className="absolute -bottom-[1px] -left-[7px] w-[14px] h-[10px] bg-[#f4f3f0] rounded-t-full border-t border-l border-r border-[#dfd9cb]"></div>
        </div>

        {/* ================= RIGHT TEAR-OFF STUB (~26%) ================= */}
        <div className="w-[155px] h-full pl-3 pr-3.5 py-3 flex flex-col justify-between relative text-left">
          {/* Stub Header */}
          <div className="flex items-center justify-between border-b border-gray-200/90 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 text-blue-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="text-[9px] font-bold tracking-wider text-blue-900">NORTHERN AIR</span>
            </div>
          </div>

          {/* Stub Passenger Details */}
          <div className="space-y-1 my-1">
            <div>
              <span className="block text-[7px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">PASSENGER</span>
              <span className="block text-[11px] font-extrabold text-gray-900 truncate leading-tight">{passenger.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[6.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">FLIGHT</span>
                <span className="block text-[9.5px] font-bold text-gray-800 font-mono">{passenger.flight}</span>
              </div>
              <div>
                <span className="block text-[6.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">DATE</span>
                <span className="block text-[9px] font-bold text-gray-800 whitespace-nowrap font-mono">{passenger.date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-0.5">
              <div>
                <span className="block text-[6.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">FROM</span>
                <span className="block text-[11px] font-black text-blue-900 leading-tight">{passenger.originCode}</span>
              </div>
              <span className="text-[10px] text-blue-700">✈</span>
              <div>
                <span className="block text-[6.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">TO</span>
                <span className="block text-[11px] font-black text-blue-900 leading-tight">{passenger.destCode}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-1 border-t border-gray-100">
              <div>
                <span className="block text-[6.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">SEAT</span>
                <span className="block text-[10px] font-bold text-gray-900 font-mono">{passenger.seat}</span>
              </div>
              <div>
                <span className="block text-[6.5px] font-bold tracking-widest text-blue-800/80 uppercase font-mono">CLASS</span>
                <span className="block text-[10px] font-bold text-gray-900 font-mono">{passenger.cabinClass}</span>
              </div>
            </div>
          </div>

          {/* Stub Small Barcode */}
          <div className="pt-0.5">
            <div className="h-3 flex items-end space-x-[1px] overflow-hidden">
              {[2,1,3,1,2,4,1,2,1,3,2,1,4,1,2,3,1,2,4,2,1,3,1,2].map((w, i) => (
                <div
                  key={i}
                  className="bg-gray-900 h-full"
                  style={{ width: `${w * 1.1}px` }}
                />
              ))}
            </div>
            <div className="text-[6.5px] font-mono text-gray-400 mt-0.5">SEQ {passenger.seq}</div>
          </div>

          {/* Vertical Edge Prompt */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[6px] tracking-[1.5px] text-gray-400 uppercase font-mono pointer-events-none whitespace-nowrap">
            SWIPE &gt; DO NOT FOLD v
          </div>
        </div>

      </div>
    </div>
  );
};
