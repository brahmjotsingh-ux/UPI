import React, { useState } from 'react';
import { CONFIG } from '../constants';
import { AppStage } from '../types';

interface BirthdayCardProps {
  onOpen: () => void;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <div className="w-full h-full flex justify-center items-center perspective-1000 p-4">
      <div
        onClick={handleCardClick}
        className={`
          relative w-[300px] h-[400px] transition-transform duration-1000 transform-style-3d cursor-pointer
          ${isOpen ? 'rotate-y-negative-180' : ''}
        `}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] flex flex-col justify-center items-center text-white z-20">
          <h1 className="font-['Dancing_Script'] text-6xl mb-4">For You</h1>
          <p className="animate-pulse opacity-80 text-sm font-semibold tracking-wider">TAP TO OPEN</p>
        </div>

        {/* Inside (Back) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-2xl bg-white/95 p-8 flex flex-col justify-between items-center text-center z-10">
          <div>
            <h2 className="font-['Dancing_Script'] text-4xl text-[#FF6B6B] mb-6">
              Happy Birthday {CONFIG.FRIEND_NAME}!
            </h2>
            <p className="text-gray-600 font-['Poppins'] text-sm leading-relaxed">
              This is a humble effort to make this occasion meaningful.
              <br /><br />
              Kindly excuse any inadvertent errors on my part.
            </p>
          </div>
          <button
            onClick={handleStart}
            className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition active:scale-95"
          >
            Welcome Queen,
            <br />
            let's go!
          </button>
        </div>
      </div>
    </div>
  );
};
