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

          // Configure confetti to appear at this cell's screen position
          await confetti({
            particleCount: 10, // Small burst per cell
            spread: 360, // Radial burst in all directions
            scalar: 1, // Small particles
            gravity: 0, // Light gravity so particles float a bit
            startVelocity: 5, // Moderate initial velocity
            ticks: 1000, // Higher value = faster fade out = shorter duration
            origin: { x: viewportX, y: viewportY }, // Use calculated screen position
            colors: ["#FFD700", "#FFEA00", "#FFF700", "#FFFF00"], // Bright celebration colors
            disableForReducedMotion: false,
            shapes: ["star"],
            flat: true,
          });

          // Clean up after animation (shorter timeout since particles fade faster)
          setTimeout(() => {
            onComplete?.();
          }, 600); // Reduced from 1000ms to match faster fade
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
