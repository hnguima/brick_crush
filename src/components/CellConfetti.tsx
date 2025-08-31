import React, { useEffect, useRef } from "react";
import { confetti } from "@tsparticles/confetti";

interface CellConfettiProps {
  shouldTrigger: boolean;
  x: number; // Screen x coordinate of the cell center
  y: number; // Screen y coordinate of the cell center
  onComplete?: () => void;
}

export const CellConfetti: React.FC<CellConfettiProps> = ({
  shouldTrigger,
  x,
  y,
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

          // Configure confetti to appear at this cell's screen position with reduced bounce
          await confetti({
            particleCount: 20, // Reduced from 10 to 8 for less clutter
            spread: 360, // Reduced from 360 to 200 for tighter spread
            scalar: 0.8, // Smaller particles
            gravity: 1, // Increased gravity for quicker settle
            startVelocity: 10, // Reduced initial velocity for less bouncing
            ticks: 1000, // Reduced for shorter duration
            origin: { x: viewportX, y: viewportY }, // Use calculated screen position
            colors: ["#FFD700", "#FFEA00", "#FFF700", "#FFFF00"], // Bright celebration colors
            disableForReducedMotion: false,
            shapes: ["circle"], // Changed from "star" to "circle" for simpler animation
            flat: true,
          });

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
  }, [shouldTrigger, onComplete, x, y]);

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
