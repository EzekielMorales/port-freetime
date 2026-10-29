import React from 'react';
import { BoardingPass } from './BoardingPass';
import { BoardingPassBack } from './BoardingPassBack';
import { PassengerData } from '../types';

interface DoubleSidedCardProps {
  passenger: PassengerData;
  isDragging?: boolean;
  className?: string;
}

export const DoubleSidedCard: React.FC<DoubleSidedCardProps> = ({
  passenger,
  isDragging = false,
  className = '',
}) => {
  return (
    <div
      className={`relative w-[620px] max-w-[94vw] h-[230px] select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front Face: Northern Air Boarding Pass (White) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)',
        }}
      >
        <BoardingPass passenger={passenger} isDragging={isDragging} />
      </div>

      {/* Back Face: Northern Air Royal Blue with White Map Contours (Matches Image 3) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <BoardingPassBack />
      </div>
    </div>
  );
};
