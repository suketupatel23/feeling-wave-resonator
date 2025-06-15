
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAudioContext } from "../hooks/useAudioContext";

interface EmotionWheelProps {
  selectedQuestion: string;
  onEmotionSelect: (emotion: string) => void;
  onReset: () => void;
}

const EmotionWheel = ({ selectedQuestion, onEmotionSelect, onReset }: EmotionWheelProps) => {
  const [hoveredEmotion, setHoveredEmotion] = useState<string>("");
  const { playFrequency, stopFrequency } = useAudioContext();

  // Emotion data with frequencies and colors
  const emotions = {
    // Anger category (red) - 396 Hz
    anger: { color: "#ff6b6b", frequency: 396, category: "anger" },
    enraged: { color: "#ff5252", frequency: 396, category: "anger" },
    livid: { color: "#f44336", frequency: 396, category: "anger" },
    furious: { color: "#e53935", frequency: 396, category: "anger" },
    irate: { color: "#d32f2f", frequency: 396, category: "anger" },
    
    // Fear category (green) - 417 Hz
    fear: { color: "#4ecdc4", frequency: 417, category: "fear" },
    terrified: { color: "#26a69a", frequency: 417, category: "fear" },
    scared: { color: "#00796b", frequency: 417, category: "fear" },
    anxious: { color: "#004d40", frequency: 417, category: "fear" },
    worried: { color: "#00695c", frequency: 417, category: "fear" },
    
    // Surprise category (cyan) - 528 Hz
    surprise: { color: "#45b7d1", frequency: 528, category: "surprise" },
    amazed: { color: "#42a5f5", frequency: 528, category: "surprise" },
    confused: { color: "#1e88e5", frequency: 528, category: "surprise" },
    startled: { color: "#1565c0", frequency: 528, category: "surprise" },
    
    // Happy category (yellow) - 639 Hz
    happy: { color: "#f9ca24", frequency: 639, category: "happy" },
    joyful: { color: "#f0932b", frequency: 639, category: "happy" },
    ecstatic: { color: "#eb4d4b", frequency: 639, category: "happy" },
    optimistic: { color: "#6c5ce7", frequency: 639, category: "happy" },
    
    // Sad category (blue) - 741 Hz
    sad: { color: "#74b9ff", frequency: 741, category: "sad" },
    depressed: { color: "#0984e3", frequency: 741, category: "sad" },
    lonely: { color: "#2d3436", frequency: 741, category: "sad" },
    despair: { color: "#636e72", frequency: 741, category: "sad" },
    
    // Disgust category (purple) - 852 Hz
    disgust: { color: "#a29bfe", frequency: 852, category: "disgust" },
    revolted: { color: "#6c5ce7", frequency: 852, category: "disgust" },
    loathing: { color: "#5f3dc4", frequency: 852, category: "disgust" },
    repugnant: { color: "#7048e8", frequency: 852, category: "disgust" }
  };

  const handleEmotionHover = (emotionKey: string) => {
    setHoveredEmotion(emotionKey);
    const emotion = emotions[emotionKey as keyof typeof emotions];
    if (emotion) {
      playFrequency(emotion.frequency);
    }
  };

  const handleEmotionLeave = () => {
    setHoveredEmotion("");
    stopFrequency();
  };

  const handleEmotionClick = (emotionKey: string) => {
    stopFrequency();
    onEmotionSelect(emotionKey);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2 hover:bg-purple-50"
        >
          <ArrowLeft size={20} />
          Back to Questions
        </Button>
        
        <div className="text-center">
          <p className="text-lg text-gray-700 font-medium">
            {selectedQuestion}...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Hover over emotions to hear healing frequencies
          </p>
        </div>
        
        <div className="w-32"></div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto aspect-square">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Create the emotion wheel segments */}
          {Object.entries(emotions).map(([key, emotion], index) => {
            const totalEmotions = Object.keys(emotions).length;
            const angle = (360 / totalEmotions) * index;
            const angleRad = (angle * Math.PI) / 180;
            const nextAngleRad = ((angle + 360 / totalEmotions) * Math.PI) / 180;
            
            const innerRadius = 60;
            const outerRadius = 180;
            
            const x1 = 200 + Math.cos(angleRad) * innerRadius;
            const y1 = 200 + Math.sin(angleRad) * innerRadius;
            const x2 = 200 + Math.cos(angleRad) * outerRadius;
            const y2 = 200 + Math.sin(angleRad) * outerRadius;
            const x3 = 200 + Math.cos(nextAngleRad) * outerRadius;
            const y3 = 200 + Math.sin(nextAngleRad) * outerRadius;
            const x4 = 200 + Math.cos(nextAngleRad) * innerRadius;
            const y4 = 200 + Math.sin(nextAngleRad) * innerRadius;
            
            const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
            
            const isHovered = hoveredEmotion === key;
            
            return (
              <g key={key}>
                <path
                  d={pathData}
                  fill={emotion.color}
                  stroke="white"
                  strokeWidth="2"
                  className={`
                    cursor-pointer transition-all duration-200
                    ${isHovered ? 'filter brightness-110 drop-shadow-lg' : 'hover:brightness-105'}
                  `}
                  onMouseEnter={() => handleEmotionHover(key)}
                  onMouseLeave={handleEmotionLeave}
                  onClick={() => handleEmotionClick(key)}
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: '200px 200px'
                  }}
                />
                
                {/* Emotion label */}
                <text
                  x={200 + Math.cos(angleRad + (nextAngleRad - angleRad) / 2) * (innerRadius + outerRadius) / 2}
                  y={200 + Math.sin(angleRad + (nextAngleRad - angleRad) / 2) * (innerRadius + outerRadius) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`
                    text-xs font-semibold pointer-events-none select-none
                    ${isHovered ? 'text-white' : 'text-gray-800'}
                  `}
                  style={{
                    textShadow: isHovered ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
                  }}
                >
                  {key.toUpperCase()}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx="200"
            cy="200"
            r="60"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="3"
            className="drop-shadow-md"
          />
          
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold text-gray-700"
          >
            EMOTIONS
          </text>
        </svg>
        
        {/* Current frequency display */}
        {hoveredEmotion && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-gray-700">
              {hoveredEmotion.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              {emotions[hoveredEmotion as keyof typeof emotions].frequency} Hz
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionWheel;
