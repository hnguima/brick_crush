// Board component: React component that hosts the reactive board renderer
import React from "react";
import { Paper } from "@mui/material";
import { BoardRenderer, useBoardState } from "../ui/BoardRenderer";
import type { Board as BoardType, Coord } from "../game/Types";
import type { AnimationState } from "../hooks/useGameState";

interface BoardProps {
  board?: BoardType;
  imageBoard?: (string | null)[][];
  ghostPosition?: {
    coords: Coord[];
    valid: boolean;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } | null;
  animationState?: AnimationState;
}

export const Board: React.FC<BoardProps> = ({
  board,
  imageBoard,
  ghostPosition,
  animationState,
}) => {
  const [boardState] = useBoardState(
    board,
    imageBoard,
    ghostPosition,
    animationState
  );

  // Calculate shake animation based on intensity
  const shakeIntensity = animationState?.shakeIntensity || 0;
  const shakeAnimation =
    shakeIntensity > 0
      ? `board-shake-${Math.min(
          shakeIntensity,
          3
        )} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
      : "none";

  return (
    <Paper
      elevation={1}
      data-testid="board-container"
      sx={{
        display: "inline-block", // Don't stretch to full width
        p: { xs: 1, sm: 1.5 }, // Responsive padding
        borderRadius: 2,
        bgcolor: "transparent",
        boxShadow: "none",
        border: "none",
        zIndex: 100, 
        // Add shake animation based on intensity
        animation: shakeAnimation,
        // Define KAPOW shake keyframes - differentiated intensities with maintained snappiness
        "@keyframes board-shake-1": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "45%": { transform: "translate(-2px, 1px) scale(1.01)" }, // Gentle ascent
          "55%": { transform: "translate(-2px, 2px) scale(1.02)" }, // Subtle peak
          "70%": { transform: "translate(1px, -1px) scale(0.99)" }, // Minimal descent
          "80%": { transform: "translate(-1px, 0px) scale(1.005)" }, // Tiny bounce
          "90%": { transform: "translate(0, 0) scale(1)" }, // Quick snap back
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "@keyframes board-shake-2": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "35%": { transform: "translate(-6px, 4px) scale(1.04)" }, // Medium ascent
          "45%": { transform: "translate(-8px, 5px) scale(1.06)" }, // Peak
          "60%": { transform: "translate(4px, -3px) scale(0.96)" }, // Quick descent
          "70%": { transform: "translate(-2px, 2px) scale(1.03)" }, // Fast bounce
          "80%": { transform: "translate(0, 0) scale(1)" }, // Snap to position
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "@keyframes board-shake-3": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-12px, 8px) scale(1.08)" }, // Explosive ascent
          "35%": { transform: "translate(-16px, 12px) scale(1.12)" }, // Dramatic peak
          "50%": { transform: "translate(10px, -8px) scale(0.92)" }, // Violent descent
          "60%": { transform: "translate(-6px, 4px) scale(1.06)" }, // Strong bounce
          "70%": { transform: "translate(2px, -2px) scale(0.98)" }, // Secondary bounce
          "80%": { transform: "translate(0, 0) scale(1)" }, // Snap to position
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      }}
    >
      <BoardRenderer boardState={boardState} />
    </Paper>
  );
};
