import React, { useState, useEffect, useRef } from 'react';
import { CakeFlavor } from '../types';
import { useBlowDetection } from '../hooks/useBlowDetection';
import { CONFIG, AUDIO_URLS } from '../constants';

interface StageCakeProps {
  flavor: CakeFlavor;
  onFinish: () => void;
}

export const StageCake: React.FC<StageCakeProps> = ({ flavor, onFinish }) => {
  // We now use two specific candles representing "2" and "5"
  const [candles, setCandles] = useState<{two: boolean, five: boolean}>({ two: false, five: false }); // false = lit, true = out
  const [micActive, setMicActive] = useState(false);
  const [showWishInput, setShowWishInput] = useState(false);
  const [wish, setWish] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCutBtn, setShowCutBtn] = useState(false);
  const [cakeState, setCakeState] = useState<'WHOLE' | 'CUT' | 'SLICE'>('WHOLE');
  
  // Audio refs
  const cheerAudio = useRef<HTMLAudioElement | null>(null);
  const pianoAudio = useRef<HTMLAudioElement | null>(null);

  // Microphone hook
  const isBlowing = useBlowDetection(micActive);

  useEffect(() => {
    // Preload audio
    cheerAudio.current = new Audio(AUDIO_URLS.CHEER);
    pianoAudio.current = new Audio(AUDIO_URLS.PIANO);

    return () => {
        if(cheerAudio.current) { cheerAudio.current.pause(); cheerAudio.current = null; }
        if(pianoAudio.current) { pianoAudio.current.pause(); pianoAudio.current = null; }
    }
  }, []);

  // Handle Blowing logic
  useEffect(() => {
    if (isBlowing) {
      setCandles(prev => {
        // If both are out, nothing to do
        if (prev.two && prev.five) return prev;

        // If one is lit, maybe blow it out
        // Randomly decide which one goes out if both are lit, or finish the last one
        const newState = { ...prev };
        
        // Blow out logic (chance based to simulate effort)
        if (!newState.two && Math.random() > 0.3) newState.two = true;
        if (!newState.five && Math.random() > 0.3) newState.five = true;
        
        // If we just blew out the last one, trigger wish immediately? 
        // Request says: "store wish...". Usually wish happens BEFORE blowing out candles in tradition, 
        // but the UI flow here has a text input.
        // Let's assume we blow them out, THEN we make a wish text input? 
        // Or we interrupt the last candle?
        // Let's stick to the previous logic: Interrupt last candle for wish.
        
        // Revert to prev logic: if we are about to blow the LAST one out, stop and show wish.
        const currentlyLitCount = (prev.two ? 0 : 1) + (prev.five ? 0 : 1);
        const nextLitCount = (newState.two ? 0 : 1) + (newState.five ? 0 : 1);
        
        if (currentlyLitCount > 0 && nextLitCount === 0) {
            // We are blowing out the last one.
            setMicActive(false); // Stop mic
            setShowWishInput(true);
            return prev; // Don't update state yet, keep one lit
        }

        return newState;
      });
    }
  }, [isBlowing]);

  const handleMakeWish = () => {
    // Save Wish
    if (wish.trim()) {
        localStorage.setItem('birthday_wish', wish);
        console.log("Wish saved:", wish);
    }

    // Extinguish all
    setCandles({ two: true, five: true });
    setShowWishInput(false);
    
    // Celebration!
    playCelebration();
  };

  const playCelebration = () => {
    if(cheerAudio.current) cheerAudio.current.play();
    if(pianoAudio.current) {
        pianoAudio.current.play();
        setShowLyrics(true);
        // Enable cut button after song plays a bit (approx 12s)
        setTimeout(() => setShowCutBtn(true), 12000);
    }
  };
  
  const handleCutCake = () => {
      setCakeState('CUT');
      setShowCutBtn(false);
      
      // Short delay then show slice
      setTimeout(() => {
          setCakeState('SLICE');
          setTimeout(onFinish, 4000);
      }, 1000);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center">
        <h3 className="text-2xl font-['Dancing_Script'] mb-4 bg-white/80 px-4 py-2 rounded-full shadow-sm">
            Make a wish & blow! 🕯️
        </h3>

        <div className={`relative w-full aspect-square max-w-[400px] mb-8 transition-all duration-700 ${cakeState === 'CUT' ? 'scale-95' : ''}`}>
            
            {/* Main Cake Image */}
            {cakeState !== 'SLICE' && (
                <img 
                    src={flavor.image} 
                    alt={flavor.name} 
                    className="w-full h-full object-cover rounded-xl shadow-2xl transition-opacity duration-500"
                />
            )}

            {/* Slice Image */}
            {cakeState === 'SLICE' && (
                <div className="w-full h-full flex flex-col items-center animate-fade-in">
                    <img 
                        src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80" 
                        alt="Cake Slice" 
                        className="w-3/4 h-3/4 object-cover rounded-xl shadow-2xl mb-4"
                    />
                    <p className="text-xl font-['Dancing_Script'] bg-white/90 px-4 py-2 rounded-lg">Here is a slice for you! 🍰</p>
                </div>
            )}
            
            {/* Number Candles - Only show if not sliced */}
            {cakeState !== 'SLICE' && (
                <div className="absolute top-[20%] left-0 right-0 flex justify-center gap-6 z-10">
                    <NumberCandle number="2" isOut={candles.two} isBlowing={isBlowing && !candles.two} />
                    <NumberCandle number="5" isOut={candles.five} isBlowing={isBlowing && !candles.five} />
                </div>
            )}
            
             {/* Cut Effect Overlay */}
             {cakeState === 'CUT' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-1 bg-white h-0 animate-[growHeight_0.5s_forwards] shadow-[0_0_10px_white]"></div>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-sm space-y-4">
            {!micActive && !showWishInput && (!candles.two || !candles.five) && cakeState === 'WHOLE' && (
                <button 
                    onClick={() => setMicActive(true)}
                    className="w-full bg-[#FF6B6B] text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#ff5252] transition"
                >
                    Enable Mic to Blow 🎙️
                </button>
            )}

            {micActive && !showWishInput && (
                <div className="bg-white/90 p-3 rounded-xl text-center shadow-md animate-pulse text-[#FF6B6B] font-bold">
                    Blow into your microphone! 🌬️
                </div>
            )}

            {showWishInput && (
                <div className="bg-white/95 p-6 rounded-2xl shadow-xl space-y-4 animate-bounce-in">
                    <p className="text-gray-700 font-medium">Almost there... Make a wish! ✨</p>
                    <input 
                        type="text" 
                        value={wish}
                        onChange={(e) => setWish(e.target.value)}
                        placeholder="Type your wish..."
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] outline-none"
                    />
                    <button 
                        onClick={handleMakeWish}
                        className="w-full bg-[#4ECDC4] text-white font-bold py-2 rounded-lg shadow-md"
                    >
                        Save Wish & Blow
                    </button>
                </div>
            )}
            
            {showLyrics && (
                <div className="text-center font-['Dancing_Script'] text-2xl text-[#FF6B6B] space-y-2 h-40 flex flex-col justify-center">
                   <p className="animate-fade-in [animation-delay:0.5s] [animation-fill-mode:forwards] opacity-0">Happy Birthday to You 🎵</p>
                   <p className="animate-fade-in [animation-delay:3.5s] [animation-fill-mode:forwards] opacity-0">Happy Birthday to You 🎵</p>
                   <p className="animate-fade-in [animation-delay:6.5s] [animation-fill-mode:forwards] opacity-0">Happy Birthday Dear {CONFIG.FRIEND_NAME} 🎵</p>
                   <p className="animate-fade-in [animation-delay:9.5s] [animation-fill-mode:forwards] opacity-0">Happy Birthday to You! 🎉</p>
                </div>
            )}

            {showCutBtn && (
                 <button 
                    onClick={handleCutCake}
                    className="w-full bg-gray-800 text-white font-bold py-3 rounded-full shadow-lg hover:bg-black transition animate-bounce"
                >
                    🔪 Cut the Cake
                </button>
            )}
        </div>
        <style>{`
            @keyframes growHeight { from { height: 0; } to { height: 80%; } }
            @keyframes windFlicker { 
                0% { transform: skewX(0deg) scaleY(1); } 
                25% { transform: skewX(-10deg) scaleY(0.9); } 
                75% { transform: skewX(10deg) scaleY(1.1); } 
                100% { transform: skewX(0deg) scaleY(1); }
            }
            .animate-wind { animation: windFlicker 0.2s infinite; }
        `}</style>
    </div>
  );
};

// Component for a big Number Candle
const NumberCandle: React.FC<{ number: string, isOut: boolean, isBlowing: boolean }> = ({ number, isOut, isBlowing }) => {
    return (
        <div className="relative">
            {/* Flame */}
            <div 
                className={`
                    absolute left-1/2 -translate-x-1/2 -top-8 w-6 h-8 
                    bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 
                    rounded-[50%] rounded-t-[0%] shadow-[0_0_20px_orange]
                    transition-all duration-300
                    ${isOut ? 'opacity-0 scale-50' : 'opacity-100 scale-100 animate-flicker'}
                    ${isBlowing ? 'animate-wind origin-bottom' : ''}
                `}
            />
            
            {/* The Number Body */}
            <div className="text-8xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" 
                 style={{ 
                     textShadow: '0px 0px 5px #ff7675, 2px 2px 0px #d63031',
                     fontFamily: 'sans-serif'
                 }}>
                {number}
            </div>
            
            {/* Candle Base Texture (Stripes) */}
            <div className="absolute inset-0 bg-white/20 mask-text pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}