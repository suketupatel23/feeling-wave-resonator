import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";

interface BoxBreathingProps {
  emotionColor: string;
  onClose: () => void;
}

const BoxBreathing = ({ emotionColor, onClose }: BoxBreathingProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSide, setCurrentSide] = useState(0); // 0: top, 1: right, 2: bottom, 3: left
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 400); // 4 seconds = 400 steps (10ms intervals)
        
        if (newProgress >= 100) {
          setCurrentSide((prevSide) => (prevSide + 1) % 4);
          return 0;
        }
        
        return newProgress;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getSunPosition = () => {
    const squareSize = 120;
    const centerX = 60;
    const centerY = 60;
    
    switch (currentSide) {
      case 0: // Top side (left to right)
        return {
          x: (progress / 100) * squareSize,
          y: 0
        };
      case 1: // Right side (top to bottom)
        return {
          x: squareSize,
          y: (progress / 100) * squareSize
        };
      case 2: // Bottom side (right to left)
        return {
          x: squareSize - (progress / 100) * squareSize,
          y: squareSize
        };
      case 3: // Left side (bottom to top)
        return {
          x: 0,
          y: squareSize - (progress / 100) * squareSize
        };
      default:
        return { x: 0, y: 0 };
    }
  };

  const sunPosition = getSunPosition();
  
  const getBreathingText = () => {
    switch (currentSide) {
      case 0:
        return "Breathe In";
      case 1:
        return "Hold";
      case 2:
        return "Breathe Out";
      case 3:
        return "Hold";
      default:
        return "Ready";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Box Breathing</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            Follow the yellow sun around the square. Each side takes 4 seconds.
          </p>
          <p className="text-lg font-medium text-gray-800">
            {getBreathingText()}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="160" height="160" className="drop-shadow-md">
              {/* Square outline */}
              <rect
                x="20"
                y="20"
                width="120"
                height="120"
                fill="none"
                stroke={emotionColor}
                strokeWidth="3"
                rx="4"
              />
              
              {/* Yellow sun */}
              <g transform={`translate(${20 + sunPosition.x}, ${20 + sunPosition.y})`}>
                {/* Blurred glow effect */}
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#fbbf24"
                  opacity="0.3"
                  filter="blur(8px)"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#fbbf24"
                  opacity="0.6"
                  filter="blur(4px)"
                />
                {/* Main sun */}
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#f59e0b"
                  className="drop-shadow-sm"
                />
              </g>
            </svg>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2"
            size="lg"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? "Pause" : "Start"} Breathing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxBreathing;