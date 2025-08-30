import { useEffect } from "react";
import type { Piece } from "../game/Types";

interface DragDropHandlers {
  onPieceDragStart: (piece: Piece, index: number) => void;
  onPieceDragEnd: () => void;
  onBoardHover: (
    targetCells: Array<{ row: number; col: number }>,
    piece: Piece
  ) => void;
  onBoardDrop: (
    targetCells: Array<{ row: number; col: number }>,
    piece: Piece
  ) => void;
}

export const useDragDropEvents = (handlers: DragDropHandlers) => {
  const { onBoardHover, onBoardDrop } = handlers;

  // Set up custom event listeners for piece drag/drop
  useEffect(() => {
    const handlePieceHover = (event: CustomEvent) => {
      const { targetCells, piece } = event.detail;
      onBoardHover(targetCells, piece);
    };

    const handlePieceDrop = (event: CustomEvent) => {
      const { targetCells, piece } = event.detail;
      onBoardDrop(targetCells, piece);
    };

    window.addEventListener("pieceHover", handlePieceHover as EventListener);
    window.addEventListener("pieceDrop", handlePieceDrop as EventListener);

    return () => {
      window.removeEventListener(
        "pieceHover",
        handlePieceHover as EventListener
      );
      window.removeEventListener("pieceDrop", handlePieceDrop as EventListener);
    };
  }, [onBoardHover, onBoardDrop]);

  return {
    onPieceDragStart: handlers.onPieceDragStart,
    onPieceDragEnd: handlers.onPieceDragEnd,
  };
};
