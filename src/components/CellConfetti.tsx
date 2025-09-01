import React, { useEffect, useRef } from "react";
import { confetti } from "@tsparticles/confetti";

interface CellConfettiProps {
  shouldTrigger: boolean;
  x: number; // Screen x coordinate of the cell center
  y: number; // Screen y coordinate of the cell center
  linesCleared?: number; // Number of lines cleared to determine confetti intensity
  onComplete?: () => void;
}

const baseConfetti = {
  particleCount: 10,
  spread: 360,
  scalar: 0.8,
  gravity: -1,
  startVelocity: 10,
  ticks: 1000,
  colors: ["#FFD700"],
  disableForReducedMotion: false,
  shapes: ["square"],
};

const basicConfetti = (viewportX: number, viewportY: number) => {
  return {
    ...baseConfetti,
    ticks: 1000,
    colors: ["#FFD700"],
    origin: { x: viewportX, y: viewportY },
  };
};

const goodConfetti = (viewportX: number, viewportY: number) => {
  return {
    ...baseConfetti,
    ticks: 800,
    particleCount: 15,
    scalar: 1,
    gravity: -1,
    startVelocity: 15,
    colors: ["#FFD700", "#00FFB3", "#FFFACD"],
    shapes: ["square", "circle"],
    origin: { x: viewportX, y: viewportY },
  };
};

const greatConfetti = (viewportX: number, viewportY: number) => {
  return {
    ...baseConfetti,
    ticks: 600,
    particleCount: 20,
    scalar: 1.2,
    gravity: -1.2,
    startVelocity: 18,
    colors: ["#FFD700", "#00FFB3", "#FFFACD", "#FF69B4", "#1E90FF"],
    shapes: ["square", "circle", "triangle"],
    origin: { x: viewportX, y: viewportY },
  };
};

const epicConfetti = (viewportX: number, viewportY: number) => {
  return {
    ...baseConfetti,
    ticks: 500,
    particleCount: 25,
    scalar: 1.5,
    gravity: -1.5,
    startVelocity: 20,
    colors: [
      "#FFD700",
      "#00FFB3",
      "#FFFACD",
      "#FF69B4",
      "#1E90FF",
      "#FF4500",
      "#9400D3",
    ],
    shapes: ["square", "circle", "triangle", "star"],
    origin: { x: viewportX, y: viewportY },
  };
};

// Helper function to get confetti configuration based on lines cleared
const getConfettiConfig = (
  linesCleared: number,
  viewportX: number,
  viewportY: number
) => {
  if (linesCleared >= 4) {
    return epicConfetti(viewportX, viewportY); // 4+ lines
  }
  if (linesCleared === 3) {
    return greatConfetti(viewportX, viewportY); // 3 lines
  }
  if (linesCleared === 2) {
    return goodConfetti(viewportX, viewportY); // 2 lines
  }
  return basicConfetti(viewportX, viewportY); // 1 line
};

export const CellConfetti: React.FC<CellConfettiProps> = ({
  shouldTrigger,
  x,
  y,
  linesCleared = 1,
  onComplete,
}) => {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (shouldTrigger && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;

      const triggerCellConfetti = async () => {
        try {
          // Calculate the position as a fraction of the viewport
          const viewportX = x / window.innerWidth;
          const viewportY = y / window.innerHeight;

          // Get appropriate confetti configuration based on lines cleared
          const confettiConfig = getConfettiConfig(
            linesCleared,
            viewportX,
            viewportY
          );

          await confetti(confettiConfig);

          // Clean up after animation (shorter timeout for reduced animation)
          setTimeout(() => {
            onComplete?.();
          }, 500); // Reduced from 600ms to match faster animation
        } catch (error) {
          console.error("Cell confetti error:", error);
          onComplete?.();
        }
      };

      triggerCellConfetti();
    }
  }, [shouldTrigger, onComplete, x, y, linesCleared]);

  // Reset trigger state when shouldTrigger becomes false
  useEffect(() => {
    if (!shouldTrigger) {
      hasTriggeredRef.current = false;
    }
  }, [shouldTrigger]);

  if (!shouldTrigger) {
    return null;
  }

  // We don't need to render anything - confetti appears on the global canvas
  // at the calculated screen coordinates
  return null;
};
