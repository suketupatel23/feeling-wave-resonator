
import { useEffect, useRef, useState } from "react";
import { emotions } from "../data/emotions";

interface HalftoneWaveProps {
  selectedQuestion: string;
  selectedEmotion: string;
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

const HalftoneWave = ({ selectedQuestion, selectedEmotion }: HalftoneWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  const emotionData = emotions[selectedEmotion as keyof typeof emotions];
  const emotionColor = emotionData ? emotionData.color : "#ffffff";
  const rgbColor = hexToRgb(emotionColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rgbColor) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawHalftoneWave = () => {
      const gridSize = 20;
      const rows = Math.ceil(canvas.height / gridSize);
      const cols = Math.ceil(canvas.width / gridSize);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize + gridSize / 2;
          const centerY = y * gridSize + gridSize / 2;
          const dx = centerX - canvas.width / 2;
          const dy = centerY - canvas.height / 2;
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
          const normalizedDistance = distanceFromCenter / maxDistance;

          const waveOffset = Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5;
          const size = gridSize * waveOffset * 0.8;

          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${waveOffset * 0.7})`;
          ctx.fill();
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHalftoneWave();

      time += 0.05;
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [rgbColor]);

  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setAnimationPhase(currentPhase);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    </div>
  );
};

export default HalftoneWave;
