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
  const shakeAnimation = shakeIntensity > 0 
    ? `board-shake-${Math.min(shakeIntensity, 3)} 0.6s ease-out` 
    : 'none';

  return (
    <Paper
      elevation={1}
      data-testid="board-container"
      sx={{
        display: "inline-block", // Don't stretch to full width
        p: { xs: 1, sm: 1.5 }, // Responsive padding
        borderRadius: 2,
        bgcolor: "background.paper",
        // Add shake animation based on intensity
        animation: shakeAnimation,
        // Define shake keyframes with increasing intensity
        '@keyframes board-shake-1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1px, -1px)' },
          '20%': { transform: 'translate(1px, -1px)' },
          '30%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(1px, 1px)' },
          '50%': { transform: 'translate(-1px, -1px)' },
          '60%': { transform: 'translate(1px, -1px)' },
          '70%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
          '90%': { transform: 'translate(-1px, -1px)' },
        },
        '@keyframes board-shake-2': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2px, -2px)' },
          '20%': { transform: 'translate(2px, -2px)' },
          '30%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, 2px)' },
          '50%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, -2px)' },
          '70%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
          '90%': { transform: 'translate(-2px, -2px)' },
        },
        '@keyframes board-shake-3': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '10%': { transform: 'translate(-3px, -3px) rotate(-0.5deg)' },
          '20%': { transform: 'translate(3px, -3px) rotate(0.5deg)' },
          '30%': { transform: 'translate(-3px, 3px) rotate(-0.5deg)' },
          '40%': { transform: 'translate(3px, 3px) rotate(0.5deg)' },
          '50%': { transform: 'translate(-3px, -3px) rotate(-0.5deg)' },
          '60%': { transform: 'translate(3px, -3px) rotate(0.5deg)' },
          '70%': { transform: 'translate(-3px, 3px) rotate(-0.5deg)' },
          '80%': { transform: 'translate(3px, 3px) rotate(0.5deg)' },
          '90%': { transform: 'translate(-3px, -3px) rotate(-0.5deg)' },
        },
      }}
    >
      <BoardRenderer boardState={boardState} />
    </Paper>
  );
};
