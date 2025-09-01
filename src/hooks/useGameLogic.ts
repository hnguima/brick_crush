import { useCallback } from "react";
import type { Piece } from "../game/Types";
import { useGameState } from "./useGameState";
import { useDragDropEvents } from "./useDragDropEvents";
import { soundEngine, SoundEffect } from "../game/SoundEngine";

export const useGameLogic = () => {
  const gameState = useGameState();
  const {
    board,
    imageBoard,
    bag,
    score,
    bestScore,
    draggedPiece,
    ghostPosition,
    isGameOver,
    animationState,
    combo,
    isMaxCombo,
    scoringState,
    setDraggedPiece,
    setGhostPosition,
    handleNewGame,
    placePiece,
    updateGhostPosition,
    handleFloatingScoreComplete,
  } = gameState;

  // Drag and drop handlers
  const handlePieceDragStart = useCallback(
    (piece: Piece, index: number) => {
      setDraggedPiece({ piece, index });
    },
    [setDraggedPiece]
  );

  const handlePieceDragEnd = useCallback(() => {
    setDraggedPiece(null);
    setGhostPosition(null);
  }, [setDraggedPiece, setGhostPosition]);

  const handleBoardHover = useCallback(
    (targetCells: Array<{ row: number; col: number }>, piece: Piece) => {
      updateGhostPosition(piece, targetCells);
    },
    [updateGhostPosition]
  );

  const handleBoardDrop = useCallback(
    (targetCells: Array<{ row: number; col: number }>, piece: Piece) => {
      if (!draggedPiece) return;

      // Check if all target cells are valid and available
      const valid =
        targetCells.length === piece.cells.length &&
        targetCells.every(
          (cell) =>
            cell.row >= 0 &&
            cell.row < 8 &&
            cell.col >= 0 &&
            cell.col < 8 &&
            board[cell.row][cell.col] === 0
        );

      if (valid) {
        // Calculate the piece origin position
        const coords = targetCells.map((cell) => ({
          x: cell.col,
          y: cell.row,
        }));
        const boardX = Math.min(...coords.map((c) => c.x));
        const boardY = Math.min(...coords.map((c) => c.y));

        placePiece(piece, boardX, boardY);
      } else {
        // Play invalid placement sound
        soundEngine.play(SoundEffect.PIECE_INVALID);
      }
    },
    [draggedPiece, board, placePiece]
  );

  // Set up drag and drop event listeners
  const dragDropHandlers = useDragDropEvents({
    onPieceDragStart: handlePieceDragStart,
    onPieceDragEnd: handlePieceDragEnd,
    onBoardHover: handleBoardHover,
    onBoardDrop: handleBoardDrop,
  });

  return {
    // Game state
    board,
    imageBoard,
    bag,
    score,
    bestScore,
    ghostPosition,
    isGameOver,
    draggedPiece,
    animationState,

    // Scoring information
    combo,
    isMaxCombo,
    scoringState,

    // Game actions
    handleNewGame,
    handleFloatingScoreComplete,

    // Drag and drop handlers
    ...dragDropHandlers,

    // Pass through internal state for testing (dev only)
    ...(import.meta.env.DEV && {
      gameEngineRef: (gameState as any).gameEngineRef,
      bagManagerRef: (gameState as any).bagManagerRef,
      setBoard: (gameState as any).setBoard,
      setImageBoard: (gameState as any).setImageBoard,
      setBag: (gameState as any).setBag,
      setScore: (gameState as any).setScore,
      setIsGameOver: (gameState as any).setIsGameOver,
    }),
  };
};
