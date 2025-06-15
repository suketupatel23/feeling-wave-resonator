import { useEffect, useRef } from "react";

type RGBColor = { r: number; g: number; b: number } | null;

export const useHalftoneAnimation = (color?: RGBColor) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store current color in a ref for smooth updates
  const colorRef = useRef<RGBColor | undefined>(color);

  // Always keep colorRef updated
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
          const centerX = x * gridSize;
          const centerY = y * gridSize;
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - canvas.width / 2, 2) +
              Math.pow(centerY - canvas.height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2)
          );
          const normalizedDistance = distanceFromCenter / maxDistance;

          const waveOffset =
            Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5;
          const size = gridSize * waveOffset * 0.8;

          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);

          // Use the latest color from the ref (for smooth updates)
          let fillColor = "rgba(255, 255, 255, " + waveOffset * 0.5 + ")";
          if (colorRef.current) {
            const { r, g, b } = colorRef.current;
            fillColor = `rgba(${r}, ${g}, ${b}, ${waveOffset * 0.5})`;
          }
          ctx.fillStyle = fillColor;
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
    // Only run once on mount
  }, []);

  return canvasRef;
};
