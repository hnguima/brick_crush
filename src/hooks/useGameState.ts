import { useState, useCallback, useRef, useEffect } from "react";
import type { Piece, Coord, Board, Bag } from "../game/Types";
import { GameEngine } from "../game/GameEngine";
import { BagManager } from "../game/BagManager";
import { storage } from "../utils/storage";
import { soundEngine, SoundEffect } from "../game/SoundEngine";

export interface AnimationState {
  clearingRows: number[];
  clearingCols: number[];
  isAnimating: boolean;
  cellDelays?: Map<string, number>; // Map from "row-col" to delay in milliseconds
  confettiCells: Set<string>; // Set of "row-col" strings for cells that should show confetti
}

export interface GameState {
  board: Board;
  imageBoard: (string | null)[][];
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
  animationState: AnimationState;
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
  const [imageBoard, setImageBoard] = useState(() =>
    gameEngineRef.current!.getImageBoard()
  );
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
  const [animationState, setAnimationState] = useState<AnimationState>({
    clearingRows: [],
    clearingCols: [],
    isAnimating: false,
    confettiCells: new Set<string>(),
  });

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

  // Re-evaluate game over condition whenever board or bag changes (but not during animations)
  useEffect(() => {
    if (!animationState.isAnimating) {
      const isGameOverNow = gameEngineRef.current!.isGameOver(bag);
      setIsGameOver(isGameOverNow);
    }
  }, [board, bag, animationState.isAnimating]);

  const handleNewGame = useCallback(() => {
    // Reset game engine and bag manager
    gameEngineRef.current!.reset();
    bagManagerRef.current = new BagManager();

    // Reset all state
    setBoard(gameEngineRef.current!.getBoard());
    setImageBoard(gameEngineRef.current!.getImageBoard());
    setBag(bagManagerRef.current.getBag());
    setDraggedPiece(null);
    setGhostPosition(null);
    setScore(0);
    setIsGameOver(false);
    setAnimationState({
      clearingRows: [],
      clearingCols: [],
      isAnimating: false,
      confettiCells: new Set<string>(),
    });
    lastGhostPositionRef.current = null;
  }, []);

  // Function to calculate sequential animation delays
  const calculateCellDelays = useCallback(
    (clearingRows: number[], clearingCols: number[]) => {
      const cellDelays = new Map<string, number>();
      const baseDelay = 50; // 50ms between each cell

      // Process rows (animate from left to right)
      clearingRows.forEach((row) => {
        for (let col = 0; col < 8; col++) {
          const cellKey = `${row}-${col}`;
          const delay = col * baseDelay;
          cellDelays.set(cellKey, delay);
        }
      });

      // Process columns (animate from top to bottom)
      clearingCols.forEach((col) => {
        for (let row = 0; row < 8; row++) {
          const cellKey = `${row}-${col}`;
          const delay = row * baseDelay;
          // If cell is already in a clearing row, use the maximum delay
          const existingDelay = cellDelays.get(cellKey);
          if (existingDelay !== undefined) {
            cellDelays.set(cellKey, Math.max(existingDelay, delay));
          } else {
            cellDelays.set(cellKey, delay);
          }
        }
      });

      return cellDelays;
    },
    []
  );

  const placePiece = useCallback(
    (piece: Piece, boardX: number, boardY: number) => {
      // Don't allow piece placement during animations
      if (animationState.isAnimating) {
        return false;
      }

      // Use GameEngine's placePiece method to ensure internal state is updated
      const placed = gameEngineRef.current!.placePiece(piece, boardX, boardY);

      if (placed && draggedPiece) {
        // Play piece placement sound
        soundEngine.play(SoundEffect.PIECE_PLACE);

        // Remove piece from bag
        bagManagerRef.current!.removePiece(draggedPiece.index);

        // Update board state from GameEngine
        setBoard(gameEngineRef.current!.getBoard());
        setImageBoard(gameEngineRef.current!.getImageBoard());
        const newBag = bagManagerRef.current!.getBag();
        setBag(newBag);

        // Check for lines to clear, but don't clear them yet
        const clearResult = gameEngineRef.current!.detectCompletedLines();
        if (
          clearResult.clearedRows.length > 0 ||
          clearResult.clearedCols.length > 0
        ) {
          // Calculate sequential animation delays
          const cellDelays = calculateCellDelays(
            clearResult.clearedRows,
            clearResult.clearedCols
          );

          // Build confetti cells set
          const confettiCells = new Set<string>();
          clearResult.clearedRows.forEach((row) => {
            for (let col = 0; col < 8; col++) {
              confettiCells.add(`${row}-${col}`);
            }
          });
          clearResult.clearedCols.forEach((col) => {
            for (let row = 0; row < 8; row++) {
              confettiCells.add(`${row}-${col}`);
            }
          });

          // Start line clearing animation with sequential delays
          setAnimationState({
            clearingRows: clearResult.clearedRows,
            clearingCols: clearResult.clearedCols,
            isAnimating: true,
            cellDelays: cellDelays,
            confettiCells: confettiCells,
          });

          // Play line clear sound for successful clears
          soundEngine.play(SoundEffect.LINE_CLEAR);

          // Note: Confetti is now handled per-cell via the confettiCells in animationState

          // Calculate maximum animation duration (longest delay + animation duration)
          const maxDelay = Math.max(...Array.from(cellDelays.values()));
          const animationDuration = 600; // 0.6s animation duration
          const totalDuration = maxDelay + animationDuration;

          // After total animation duration, actually clear the lines
          setTimeout(() => {
            gameEngineRef.current!.clearSpecificLines(
              clearResult.clearedRows,
              clearResult.clearedCols
            );

            // Update score
            const newScore = score + clearResult.score;
            setScore(newScore);

            // Update best score if needed
            if (newScore > bestScore) {
              setBestScore(newScore);
              storage.setBestScore(newScore);
            }

            // Update board state after clearing
            setBoard(gameEngineRef.current!.getBoard());
            setImageBoard(gameEngineRef.current!.getImageBoard());

            // End animation
            setAnimationState({
              clearingRows: [],
              clearingCols: [],
              isAnimating: false,
              cellDelays: new Map(),
              confettiCells: new Set<string>(),
            });

            // Check for game over condition AFTER line clearing is complete
            // This ensures pieces that become placeable after clearing are considered
            const isGameOverNow = gameEngineRef.current!.isGameOver(newBag);
            if (isGameOverNow) {
              soundEngine.play(SoundEffect.GAME_OVER);
            }
            setIsGameOver(isGameOverNow);
          }, totalDuration); // Use calculated total duration
        }

        // Check if all pieces in bag are used (bag complete bonus)
        const allPiecesUsed = newBag.every((piece) => piece === null);
        if (allPiecesUsed) {
          soundEngine.play(SoundEffect.BAG_COMPLETE);
        }

        // Only check for game over if no lines will be cleared
        // If lines will be cleared, delay the check until after clearing completes
        if (
          clearResult.clearedRows.length === 0 &&
          clearResult.clearedCols.length === 0
        ) {
          const isGameOverNow = gameEngineRef.current!.isGameOver(newBag);
          if (isGameOverNow) {
            soundEngine.play(SoundEffect.GAME_OVER);
          }
          setIsGameOver(isGameOverNow);
        }

        return true;
      }

      return false;
    },
    [draggedPiece, score, bestScore, animationState.isAnimating]
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
    imageBoard,
    bag,
    score,
    bestScore,
    draggedPiece,
    ghostPosition,
    isGameOver,
    animationState,

    // Actions
    setDraggedPiece,
    setGhostPosition,
    handleNewGame,
    placePiece,
    updateGhostPosition,

    // Internal refs and setters for testing (dev only)
    ...(import.meta.env.DEV && {
      gameEngineRef,
      bagManagerRef,
      setBoard,
      setImageBoard,
      setBag,
      setScore,
      setIsGameOver,
    }),
  };
};
