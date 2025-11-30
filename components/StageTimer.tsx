import React, { useState, useEffect } from 'react';
import { CONFIG } from '../constants';
import { AppStage, DecorType } from '../types';

interface StageTimerProps {
  setStage: (stage: AppStage) => void;
  toggleDecor: (type: DecorType) => void;
  selectedDecors: Set<DecorType>;
}

export const StageTimer: React.FC<StageTimerProps> = ({ setStage, toggleDecor, selectedDecors }) => {
  const [timeText, setTimeText] = useState("Syncing...");
  const [showDecorControls, setShowDecorControls] = useState(false);
  const [showFinaleBtn, setShowFinaleBtn] = useState(false);
  const [mode, setMode] = useState<'SYNC' | 'TIMER' | 'DECORATE'>('SYNC');

  useEffect(() => {
    if (mode === 'TIMER') {
        const interval = setInterval(() => {
            const birth = new Date(CONFIG.BIRTH_DATE);
            const now = new Date();
            
            const diff = now.getTime() - birth.getTime();
            
            // Calculate absolute difference components
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeText(`${years} Years\n${days}d ${hours}h ${mins}m ${secs}s`);
        }, 1000);

        // Show decor button after a few seconds
        const timer = setTimeout(() => setShowDecorControls(true), 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }
  }, [mode]);

  const handleSync = () => {
    setMode('TIMER');
  };

  const handleApplyDecor = () => {
    setMode('TIMER');
    setShowDecorControls(false); // Hide the button to go back
    setShowFinaleBtn(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8 text-center animate-fade-in">
      
      {/* SYNC MODE */}
      {mode === 'SYNC' && (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl">
          <p className="text-gray-600 mb-6 font-medium">To sync the magic, let's check the time.</p>
          <button 
            onClick={handleSync}
            className="bg-[#4ECDC4] hover:bg-[#3dbdb4] text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform active:scale-95"
          >
            Sync with Device Time ⏱️
          </button>
        </div>
      )}

      {/* TIMER MODE */}
      {mode === 'TIMER' && (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="text-lg text-gray-700 leading-relaxed font-['Poppins']">
            The universe was blessed the day you arrived—your presence has been filling the world with joy ever since ✨
          </h3>
          <div className="bg-[#FF6B6B]/10 p-6 rounded-2xl border-2 border-[#FF6B6B]/20">
            <pre className="text-2xl md:text-3xl font-bold text-[#FF6B6B] font-['Poppins'] whitespace-pre-wrap leading-relaxed">
              {timeText}
            </pre>
          </div>
          
          {showDecorControls && !showFinaleBtn && (
            <button 
                onClick={() => setMode('DECORATE')}
                className="bg-[#FF6B6B] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-[#ff5252] transition"
            >
                Customize the Vibe 🎨
            </button>
          )}

          {showFinaleBtn && (
             <button 
                onClick={() => setStage(AppStage.BIG_COUNTDOWN)}
                className="bg-gray-800 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-black transition animate-pulse"
            >
                Ready for the Big Moment? 🚀
            </button>
          )}
        </div>
      )}

      {/* DECORATE MODE */}
      {mode === 'DECORATE' && (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-['Dancing_Script'] mb-2">Pick your decorations 🎨</h3>
            <p className="text-gray-500 text-sm mb-6">Select multiple items to combine effects!</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
                {(['balloons', 'lights', 'confetti', 'bubbles', 'flowers'] as DecorType[]).map(type => (
                    <button
                        key={type}
                        onClick={() => toggleDecor(type)}
                        className={`
                            p-3 rounded-xl border-2 font-medium capitalize transition-all transform
                            ${selectedDecors.has(type) 
                                ? 'bg-[#FF6B6B]/20 border-[#FF6B6B] text-[#FF6B6B] scale-105 shadow-inner' 
                                : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'}
                        `}
                    >
                        {selectedDecors.has(type) && <span className="mr-2">✓</span>}
                        {type}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleApplyDecor}
                className="w-full bg-[#FF6B6B] text-white py-3 rounded-xl font-bold shadow-md"
            >
                ✨ Apply & Continue
            </button>
        </div>
      )}

    </div>
  );
};