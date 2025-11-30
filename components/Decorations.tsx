import React, { useEffect, useState } from 'react';
import { DecorType } from '../types';

interface DecorationsProps {
  activeTypes: Set<DecorType>;
}

export const Decorations: React.FC<DecorationsProps> = ({ activeTypes }) => {
  const [items, setItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newItems: React.ReactNode[] = [];

    if (activeTypes.has('balloons')) {
      for (let i = 0; i < 8; i++) {
        newItems.push(
          <div
            key={`balloon-${i}`}
            className="absolute animate-float opacity-90"
            style={{
              left: `${Math.random() * 90}%`,
              animationDuration: `${8 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              bottom: '-120px'
            }}
          >
             <div 
               className="w-16 h-20 rounded-t-[50%] rounded-b-[60%]"
               style={{ backgroundColor: getRandomColor() }}
             />
             <div className="w-[1px] h-8 bg-gray-400 mx-auto mt-[-2px]" />
          </div>
        );
      }
    }

    if (activeTypes.has('confetti')) {
       // Simple CSS confetti
       for (let i = 0; i < 30; i++) {
        newItems.push(
          <div
             key={`confetti-${i}`}
             className="absolute w-3 h-4"
             style={{
               backgroundColor: getRandomColor(),
               left: `${Math.random() * 100}%`,
               top: '-20px',
               animation: `floatUp ${4 + Math.random() * 3}s linear infinite reverse`, // Fall down
               transform: `rotate(${Math.random() * 360}deg)`
             }}
          />
        );
       }
    }

    if (activeTypes.has('flowers')) {
        const flowers = ['🌸', '🌺', '🌻', '🌹', '🌷'];
        for (let i = 0; i < 12; i++) {
            newItems.push(
                <div
                    key={`flower-${i}`}
                    className="absolute text-4xl"
                    style={{
                        left: `${Math.random() * 90}%`,
                        top: '-50px',
                        animation: `floatUp ${8 + Math.random() * 5}s linear infinite reverse`, // Fall down
                        animationDelay: `${Math.random() * 5}s`
                    }}
                >
                    {flowers[Math.floor(Math.random() * flowers.length)]}
                </div>
            );
        }
    }
    
    if (activeTypes.has('bubbles')) {
        for(let i=0; i<15; i++) {
            const size = Math.random() * 40 + 20;
            newItems.push(
                <div 
                    key={`bubble-${i}`}
                    className="absolute rounded-full border border-white/40 bg-white/10 backdrop-blur-sm animate-float"
                    style={{
                        width: size,
                        height: size,
                        left: `${Math.random() * 95}%`,
                        animationDuration: `${Math.random() * 5 + 8}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        bottom: '-100px'
                    }}
                />
            )
        }
    }

    if (activeTypes.has('lights')) {
         newItems.push(
             <div key="lights" className="absolute top-0 w-full h-4 z-50 flex justify-around">
                 {Array.from({length: 20}).map((_, idx) => (
                     <div 
                        key={idx}
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ 
                            backgroundColor: idx % 2 === 0 ? '#FFE66D' : '#FF6B6B',
                            boxShadow: '0 0 10px currentColor',
                            animationDelay: `${idx * 0.1}s`
                        }} 
                     />
                 ))}
             </div>
         )
    }

    setItems(newItems);
  }, [activeTypes]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {items}
    </div>
  );
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#ff9f43', '#5f27cd', '#54a0ff', '#fab1a0'];
  return colors[Math.floor(Math.random() * colors.length)];
};
