import { useEffect, useRef, useState } from "react";
import { emotions } from "../data/emotions";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useHalftoneAnimation } from "../hooks/useHalftoneAnimation";

interface HalftoneWaveProps {
  selectedQuestion: string;
  selectedEmotion: string;
  onExit: (meditationLength: number) => void;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const HalftoneWave = ({ selectedQuestion, selectedEmotion, onExit }: HalftoneWaveProps) => {
  const startTimeRef = useRef(Date.now());
  const [animationPhase, setAnimationPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const emotionData = emotions[selectedEmotion as keyof typeof emotions];
  const emotionColor = emotionData ? emotionData.color : "#ffffff";
  const rgbColor = hexToRgb(emotionColor);

  // Pass rgbColor to the hook!
  const canvasRef = useHalftoneAnimation(rgbColor);

  useEffect(() => {
    // To make the text animation less jarring and feel less like a "restart",
    // we increase the interval time. This makes the switch between texts slower.
    const interval = setInterval(() => {
      setAnimationPhase((prevPhase) => (prevPhase + 1) % 4);
    }, 2500); // Increased from 1000ms to 2500ms for a 10-second cycle

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      const meditationLength = Math.round((Date.now() - startTimeRef.current) / 1000);
      onExit(meditationLength);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, onExit]);

  const addTime = () => {
    // Add 60 seconds, max 20 minutes (1200 seconds)
    setTimeLeft((prevTime) => Math.min(prevTime + 60, 1200));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleManualExit = () => {
    const meditationLength = Math.round((Date.now() - startTimeRef.current) / 1000);
    onExit(meditationLength);
  };


  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <div className={`
            transition-all duration-1000 transform
            ${animationPhase < 2 ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}
          `}>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              {selectedQuestion}...
            </h2>
            <h3 className="text-6xl font-light uppercase tracking-wider drop-shadow-lg" style={{ color: emotionColor }}>
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
      
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className={`
              absolute top-1/2 left-1/2 border border-white/20 rounded-full
              animate-ping
            `}
            style={{
              width: `${ring * 300}px`,
              height: `${ring * 300}px`,
              marginLeft: `-${ring * 150}px`,
              marginTop: `-${ring * 150}px`,
              animationDelay: `${ring * 0.5}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white shadow-lg z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/20"
          onClick={addTime}
          aria-label="Add 60 seconds"
        >
          <Plus size={20} />
        </Button>
        <div className="text-2xl font-mono w-24 text-center" suppressHydrationWarning>
          {formatTime(timeLeft)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/20"
          onClick={handleManualExit}
          aria-label="Exit experience"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
};

export default HalftoneWave;
