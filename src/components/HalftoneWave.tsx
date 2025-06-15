
import { useEffect, useState } from "react";

interface HalftoneWaveProps {
  selectedQuestion: string;
  selectedEmotion: string;
}

const HalftoneWave = ({ selectedQuestion, selectedEmotion }: HalftoneWaveProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setAnimationPhase(currentPhase);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createDots = () => {
    const dots = [];
    const rows = 20;
    const cols = 30;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j / cols) * 100;
        const y = (i / rows) * 100;
        
        // Create wave effect
        const wave = Math.sin((x + animationPhase * 25) * 0.1) * Math.cos((y + animationPhase * 20) * 0.1);
        const size = Math.max(0.1, (wave + 1) * 0.5);
        const opacity = Math.max(0.1, size);
        
        dots.push(
          <div
            key={`${i}-${j}`}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size * 20}px`,
              height: `${size * 20}px`,
              opacity: opacity,
              transform: `translate(-50%, -50%) scale(${1 + wave * 0.5})`,
              transition: 'all 0.3s ease-out'
            }}
          />
        );
      }
    }
    
    return dots;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Halftone dots */}
      <div className="absolute inset-0">
        {createDots()}
      </div>
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className={`
            transition-all duration-1000 transform
            ${animationPhase < 2 ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}
          `}>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              {selectedQuestion}...
            </h2>
            <h3 className="text-6xl font-light uppercase tracking-wider drop-shadow-lg">
              {selectedEmotion}
            </h3>
          </div>
          
          <div className={`
            mt-8 transition-all duration-1000 transform delay-500
            ${animationPhase >= 2 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
          `}>
            <p className="text-xl text-purple-200 drop-shadow">
              Embrace this feeling with compassion
            </p>
          </div>
        </div>
      </div>
      
      {/* Resonant circles */}
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className={`
              absolute top-1/2 left-1/2 border border-white/20 rounded-full
              animate-ping
            `}
            style={{
              width: `${ring * 200}px`,
              height: `${ring * 200}px`,
              marginLeft: `-${ring * 100}px`,
              marginTop: `-${ring * 100}px`,
              animationDelay: `${ring * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HalftoneWave;
