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

  return (
    <Paper
      elevation={1}
      sx={{
        display: "inline-block", // Don't stretch to full width
        p: { xs: 1, sm: 1.5 }, // Responsive padding
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <BoardRenderer boardState={boardState} />
    </Paper>
  );
};
