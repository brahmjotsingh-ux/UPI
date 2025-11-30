import React, { useState, useEffect } from 'react';
import { BirthdayCard } from './components/BirthdayCard';
import { Decorations } from './components/Decorations';
import { StageTimer } from './components/StageTimer';
import { StageCake } from './components/StageCake';
import { AppStage, DecorType, CakeFlavor } from './types';
import { CONFIG, CAKE_FLAVORS } from './constants';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.CARD);
  const [selectedDecors, setSelectedDecors] = useState<Set<DecorType>>(new Set());
  const [selectedCake, setSelectedCake] = useState<CakeFlavor | null>(null);
  const [countdownNum, setCountdownNum] = useState(5);

  const toggleDecor = (type: DecorType) => {
    const next = new Set(selectedDecors);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedDecors(next);
  };

  // Big countdown logic
  useEffect(() => {
    if (stage === AppStage.BIG_COUNTDOWN) {
      let count = 5;
      setCountdownNum(count);
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdownNum(count);
        } else {
          clearInterval(interval);
          setStage(AppStage.CAKE_SELECTION);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <main className="relative w-full h-screen bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center overflow-hidden flex flex-col items-center justify-center">
      {/* Overlay to soften background */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />

      {/* Persistent Decorations Layer */}
      <Decorations activeTypes={selectedDecors} />

      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        
        {stage === AppStage.CARD && (
          <BirthdayCard onOpen={() => setStage(AppStage.TIMER)} />
        )}

        {stage === AppStage.TIMER && (
          <StageTimer 
            setStage={setStage} 
            toggleDecor={toggleDecor}
            selectedDecors={selectedDecors}
          />
        )}

        {stage === AppStage.BIG_COUNTDOWN && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <h1 key={countdownNum} className="text-[12rem] font-bold text-[#FF6B6B] animate-ping-once drop-shadow-xl">
                {countdownNum}
            </h1>
            <p className="text-2xl font-['Dancing_Script'] mt-4">Get Ready! ✨</p>
          </div>
        )}

        {stage === AppStage.CAKE_SELECTION && (
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-4xl w-[90%] animate-fade-in text-center h-[80vh] flex flex-col">
                <h2 className="text-3xl font-['Dancing_Script'] mb-6 text-gray-800 shrink-0">Choose Your Flavor 🍰</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pb-4">
                    {CAKE_FLAVORS.map(flavor => (
                        <div 
                            key={flavor.id}
                            onClick={() => {
                                setSelectedCake(flavor);
                                setStage(AppStage.CAKE_STAGE);
                            }}
                            className="bg-white rounded-xl shadow-md p-2 cursor-pointer hover:scale-105 transition-transform border-2 border-transparent hover:border-[#FF6B6B]"
                        >
                            <img src={flavor.image} alt={flavor.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                            <p className="font-semibold text-gray-700">{flavor.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {stage === AppStage.CAKE_STAGE && selectedCake && (
            <StageCake flavor={selectedCake} onFinish={() => setStage(AppStage.FINAL_MESSAGE)} />
        )}

        {stage === AppStage.FINAL_MESSAGE && (
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-[90%] text-center animate-fade-in border-4 border-[#FF6B6B]/20">
                 <h2 className="text-3xl font-['Dancing_Script'] text-[#FF6B6B] mb-6">
                    Happy Birthday, {CONFIG.FRIEND_NAME}!
                 </h2>
                 <div className="bg-[#fffdf0] p-6 rounded-lg shadow-inner mb-6 transform -rotate-1">
                    <p className="font-['Dancing_Script'] text-2xl text-gray-800 leading-relaxed">
                        "{CONFIG.FINAL_WISH_TEXT}"
                    </p>
                 </div>
                 <p className="text-gray-500 font-semibold">From your friend ❤️</p>
                 
                 <button 
                    onClick={() => window.location.reload()}
                    className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline"
                 >
                    Replay Experience
                 </button>
            </div>
        )}

      </div>
      <style>{`
        .animate-ping-once {
            animation: ping 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        @keyframes ping {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
};

export default App;