
import { useEffect, useRef } from "react";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

// Helper: basic pseudo-random function for extra harmonic/phasing
function fractalSin(x: number, y: number, t: number) {
  // 3 sine layers, all loop, all offset each other
  return (
    Math.sin(x * 0.13 + y * 0.17 + t * 1.0) * 0.5 +
    Math.sin(x * 0.09 - y * 0.11 + t * 1.4) * 0.35 +
    Math.sin(
      Math.sqrt(x * x + y * y) * 0.19 + t * 0.7 + Math.cos(x * 0.03 + y * 0.05)
    ) *
      0.2
  );
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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawHalftoneFractal = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20;
      const rows = Math.ceil(canvas.height / gridSize)+2;
      const cols = Math.ceil(canvas.width / gridSize)+2;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Place in a staggered hex pattern
          const px =
            x * gridSize +
            ((y % 2) * gridSize) / 2 -
            gridSize;
          const py = y * gridSize - gridSize;

          // Distance and angle from center
          const dx = px - centerX;
          const dy = py - centerY;
          const distNorm = Math.sqrt(dx * dx + dy * dy) / maxDistance;

          // Fractal-like multiwave modulations
          const wave =
            0.5 +
            0.5 *
              fractalSin(
                dx / 40 + 0.2 * Math.sin(time * 0.13),
                dy / 38 + 0.16 * Math.cos(time * 0.09),
                time
              );
          // subtle orbiting phase to avoid visible cycling
          const orbit =
            Math.sin(
              0.4 * time +
                (dx * Math.sin(time * 0.17) + dy * Math.cos(time * 0.11)) * 0.005
            ) *
            0.3;

          // Use both for mesmerizing, unpredictable effect
          const dot =
            0.15 +
            0.75 *
              Math.abs(
                Math.sin(
                  wave * Math.PI * 2 +
                    orbit +
                    distNorm * Math.PI * 2 +
                    time * 0.5
                )
              );

          const finalSize = gridSize * dot * (1.08 - distNorm * 0.7);

          ctx.beginPath();
          ctx.arc(px, py, finalSize / 2.7, 0, Math.PI * 2);

          // Soft color per dot, add a moving hue modulator for shimmer
          const hueShift =
            30 * Math.sin(time * 0.7 + dx * 0.014 + dy * 0.013);
          const r = Math.min(
            255,
            Math.max(
              0,
              rgbColor.r +
                hueShift +
                12 * Math.sin(px * 0.018 + time * 0.26 - py * 0.008)
            )
          );
          const g = Math.min(
            255,
            Math.max(
              0,
              rgbColor.g +
                hueShift +
                8 * Math.cos(py * 0.019 + time * 0.13 + px * 0.0012)
            )
          );
          const b = Math.min(
            255,
            Math.max(
              0,
              rgbColor.b +
                hueShift +
                4 * Math.cos(px * 0.012 - time * 0.18 + py * 0.003)
            )
          );
          // More alpha in the center for pyramid fade out effect
          ctx.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(
            0
          )},${b.toFixed(0)},${0.15 +
            0.34 * wave +
            0.08 * (1.0 - distNorm)})`;
          ctx.shadowBlur = 9 + 16 * (1 - dot);
          ctx.shadowColor = `rgba(${r.toFixed(0)},${g.toFixed(
            0
          )},${b.toFixed(0)},0.5)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    const animate = () => {
      drawHalftoneFractal();
      time += 0.04;
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
