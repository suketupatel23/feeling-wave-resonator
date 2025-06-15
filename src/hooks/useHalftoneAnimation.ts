
import { useEffect, useRef } from "react";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export const useHalftoneAnimation = (rgbColor: RgbColor | null) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rgbColor) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const gridSize = 20;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawHalftoneWave = () => {
      const rows = Math.ceil(canvas.height / gridSize);
      const cols = Math.ceil(canvas.width / gridSize);
      const maxDistance = Math.sqrt(
        Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2)
      );

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize + gridSize / 2;
          const centerY = y * gridSize + gridSize / 2;
          const dx = centerX - canvas.width / 2;
          const dy = centerY - canvas.height / 2;
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
          const normalizedDistance = distanceFromCenter / maxDistance;

          const waveOffset =
            Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5;
          const size = gridSize * waveOffset * 0.8;

          if (size > 0.1) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${
              waveOffset * 0.7
            })`;
            ctx.fill();
          }
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

  return canvasRef;
};
