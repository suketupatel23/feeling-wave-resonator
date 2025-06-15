
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
  const { playEmotionSound, stopSound } = useAudioContext();

  // Emotion data with frequencies, colors, and audio types
  const emotions = {
    // Anger category (red) - Aggressive healing tones
    anger: { color: "#ff6b6b", audioType: "anger", category: "anger" },
    enraged: { color: "#ff5252", audioType: "anger", category: "anger" },
    livid: { color: "#f44336", audioType: "anger", category: "anger" },
    furious: { color: "#e53935", audioType: "anger", category: "anger" },
    irate: { color: "#d32f2f", audioType: "anger", category: "anger" },
    
    // Fear category (green) - Calming healing tones
    fear: { color: "#4ecdc4", audioType: "fear", category: "fear" },
    terrified: { color: "#26a69a", audioType: "fear", category: "fear" },
    scared: { color: "#00796b", audioType: "fear", category: "fear" },
    anxious: { color: "#004d40", audioType: "fear", category: "fear" },
    worried: { color: "#00695c", audioType: "fear", category: "fear" },
    
    // Surprise category (cyan) - Energizing healing tones
    surprise: { color: "#45b7d1", audioType: "surprise", category: "surprise" },
    amazed: { color: "#42a5f5", audioType: "surprise", category: "surprise" },
    confused: { color: "#1e88e5", audioType: "surprise", category: "surprise" },
    startled: { color: "#1565c0", audioType: "surprise", category: "surprise" },
    
    // Happy category (yellow) - Uplifting healing tones
    happy: { color: "#f9ca24", audioType: "happy", category: "happy" },
    joyful: { color: "#f0932b", audioType: "happy", category: "happy" },
    ecstatic: { color: "#eb4d4b", audioType: "happy", category: "happy" },
    optimistic: { color: "#6c5ce7", audioType: "happy", category: "happy" },
    
    // Sad category (blue) - Comforting healing tones
    sad: { color: "#74b9ff", audioType: "sad", category: "sad" },
    depressed: { color: "#0984e3", audioType: "sad", category: "sad" },
    lonely: { color: "#2d3436", audioType: "sad", category: "sad" },
    despair: { color: "#636e72", audioType: "sad", category: "sad" },
    
    // Disgust category (purple) - Cleansing healing tones
    disgust: { color: "#a29bfe", audioType: "disgust", category: "disgust" },
    revolted: { color: "#6c5ce7", audioType: "disgust", category: "disgust" },
    loathing: { color: "#5f3dc4", audioType: "disgust", category: "disgust" },
    repugnant: { color: "#7048e8", audioType: "disgust", category: "disgust" }
  };

  const handleEmotionHover = (emotionKey: string) => {
    setHoveredEmotion(emotionKey);
    const emotion = emotions[emotionKey as keyof typeof emotions];
    if (emotion) {
      playEmotionSound(emotion.audioType);
    }
  };

  const handleEmotionLeave = () => {
    setHoveredEmotion("");
    stopSound();
  };

  const handleEmotionClick = (emotionKey: string) => {
    stopSound();
    onEmotionSelect(emotionKey);
  };

  // Stop sound when hovering over the center circle or outside the wheel
  const handleCenterHover = () => {
    if (hoveredEmotion) {
      setHoveredEmotion("");
      stopSound();
    }
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
            Hover over emotions to hear healing sounds
          </p>
        </div>
        
        <div className="w-32"></div>
      </div>

      <div 
        className="relative w-full max-w-2xl mx-auto aspect-square"
        onMouseLeave={handleEmotionLeave}
      >
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
            
            // Calculate label position - positioned closer to the middle of the segment
            const labelRadius = (innerRadius + outerRadius) / 2;
            const labelAngle = angleRad + (nextAngleRad - angleRad) / 2;
            const labelX = 200 + Math.cos(labelAngle) * labelRadius;
            const labelY = 200 + Math.sin(labelAngle) * labelRadius;
            
            // Calculate rotation for text to follow the arc
            const textRotation = (angle + 360 / totalEmotions / 2) % 360;
            const shouldFlipText = textRotation > 90 && textRotation < 270;
            const finalRotation = shouldFlipText ? textRotation + 180 : textRotation;
            
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
                  onClick={() => handleEmotionClick(key)}
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: '200px 200px'
                  }}
                />
                
                {/* Emotion label with improved positioning */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`
                    text-xs font-bold pointer-events-none select-none uppercase
                    ${isHovered ? 'text-white' : 'text-gray-800'}
                  `}
                  style={{
                    textShadow: isHovered ? '2px 2px 4px rgba(0,0,0,0.7)' : '1px 1px 2px rgba(255,255,255,0.8)',
                    transform: `rotate(${finalRotation}deg)`,
                    transformOrigin: `${labelX}px ${labelY}px`
                  }}
                >
                  {key}
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
            onMouseEnter={handleCenterHover}
          />
          
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold text-gray-700 pointer-events-none"
          >
            EMOTIONS
          </text>
        </svg>
        
        {/* Current emotion display */}
        {hoveredEmotion && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-gray-700 capitalize">
              {hoveredEmotion}
            </p>
            <p className="text-xs text-gray-500">
              {emotions[hoveredEmotion as keyof typeof emotions].category} healing sound
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionWheel;
