import { useState, useCallback, useRef, useEffect } from "react";
import type { Piece, Coord, Board, Bag } from "../game/Types";
import { GameEngine } from "../game/GameEngine";
import { BagManager } from "../game/BagManager";
import { storage } from "../utils/storage";
import { soundEngine, SoundEffect } from "../game/SoundEngine";

export interface GameState {
  board: Board;
  bag: Bag;
  score: number;
  bestScore: number;
  draggedPiece: { piece: Piece; index: number } | null;
  ghostPosition: {
    coords: Coord[];
    valid: boolean;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } | null;
}

export const useGameState = () => {
  // Game engine instances - use lazy initialization to prevent recreation
  const gameEngineRef = useRef<GameEngine | null>(null);
  const bagManagerRef = useRef<BagManager | null>(null);
  const lastGhostPositionRef = useRef<string | null>(null);
  
  // Initialize refs only once
  gameEngineRef.current ??= new GameEngine();
  bagManagerRef.current ??= new BagManager();

  // Game state
  const [board, setBoard] = useState(() => gameEngineRef.current!.getBoard());
  const [bag, setBag] = useState(() => bagManagerRef.current!.getBag());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<{
    piece: Piece;
    index: number;
  } | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{
    coords: Coord[];
    valid: boolean;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } | null>(null);

  // Load best score on component mount
  useEffect(() => {
    const loadBestScore = async () => {
      const savedBestScore = await storage.getBestScore();
      setBestScore(savedBestScore);
    };
    loadBestScore();
  }, []);

  // Update best score when current score changes
  useEffect(() => {
    const updateBest = async () => {
      if (score > bestScore) {
        setBestScore(score);
        await storage.setBestScore(score);
      }
    };
    updateBest();
  }, [score, bestScore]);

  const handleNewGame = useCallback(() => {
    // Reset game engine and bag manager
    gameEngineRef.current!.reset();
    bagManagerRef.current = new BagManager();

    // Reset all state
    setBoard(gameEngineRef.current!.getBoard());
    setBag(bagManagerRef.current.getBag());
    setDraggedPiece(null);
    setGhostPosition(null);
    setScore(0);
    setIsGameOver(false);
    lastGhostPositionRef.current = null;
  }, []);

  const placePiece = useCallback(
    (piece: Piece, boardX: number, boardY: number) => {
      // Use GameEngine's placePiece method to ensure internal state is updated
      const placed = gameEngineRef.current!.placePiece(piece, boardX, boardY);

      if (placed && draggedPiece) {
        // Play piece placement sound
        soundEngine.play(SoundEffect.PIECE_PLACE);

        // Remove piece from bag
        bagManagerRef.current!.removePiece(draggedPiece.index);

        // Update board state from GameEngine
        setBoard(gameEngineRef.current!.getBoard());
        const newBag = bagManagerRef.current!.getBag();
        setBag(newBag);

        // Clear lines and update score
        const clearResult = gameEngineRef.current!.clearLines();
        if (
          clearResult.clearedRows.length > 0 ||
          clearResult.clearedCols.length > 0
        ) {
          // Play line clear sound for successful clears
          soundEngine.play(SoundEffect.LINE_CLEAR);

          const newScore = score + clearResult.score;
          setScore(newScore);

          // Update best score if needed
          if (newScore > bestScore) {
            setBestScore(newScore);
            storage.setBestScore(newScore);
          }

          setBoard(gameEngineRef.current!.getBoard());
        }

        // Check if all pieces in bag are used (bag complete bonus)
        const allPiecesUsed = newBag.every((piece) => piece === null);
        if (allPiecesUsed) {
          soundEngine.play(SoundEffect.BAG_COMPLETE);
        }

        // Check for game over condition
        const isGameOverNow = gameEngineRef.current!.isGameOver(newBag);
        if (isGameOverNow) {
          soundEngine.play(SoundEffect.GAME_OVER);
        }
        setIsGameOver(isGameOverNow);

        return true;
      }

      return false;
    },
    [draggedPiece, score, bestScore]
  );

  const updateGhostPosition = useCallback(
    (piece: Piece, targetCells: Array<{ row: number; col: number }>) => {
      if (!draggedPiece) {
        setGhostPosition(null);
        lastGhostPositionRef.current = null;
        return;
      }

      // Convert target cells to ghost coordinates and check validity
      const coords = targetCells.map((cell) => ({ x: cell.col, y: cell.row }));
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

      // Check what lines would be completed
      const boardX = Math.min(...coords.map((c) => c.x));
      const boardY = Math.min(...coords.map((c) => c.y));

      const lineCompletion = valid
        ? gameEngineRef.current!.checkPotentialLineCompletion(
            piece,
            boardX,
            boardY
          )
        : { wouldCompleteRows: [], wouldCompleteCols: [] };

      // Create a string representation of the ghost position to compare
      const ghostKey =
        coords.map((c) => c.x + "," + c.y).join("|") +
        "-" +
        valid +
        "-" +
        lineCompletion.wouldCompleteRows.join(",") +
        "-" +
        lineCompletion.wouldCompleteCols.join(",");

      // Only update if the ghost position actually changed
      if (lastGhostPositionRef.current !== ghostKey) {
        lastGhostPositionRef.current = ghostKey;
        setGhostPosition({
          coords,
          valid,
          wouldCompleteRows: lineCompletion.wouldCompleteRows,
          wouldCompleteCols: lineCompletion.wouldCompleteCols,
        });
      }
    },
    [draggedPiece, board]
  );

  return {
    // State
    board,
    bag,
    score,
    bestScore,
    draggedPiece,
    ghostPosition,
    isGameOver,

    // Actions
    setDraggedPiece,
    setGhostPosition,
    handleNewGame,
    placePiece,
    updateGhostPosition,
  };
};
