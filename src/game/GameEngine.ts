import type { Piece, Board, Coord } from "./Types";
import { getCurrentBoardMetrics } from "../ui/BoardRenderer";

export class GameEngine {
  public board: Board;

  constructor() {
    this.board = this.createEmptyBoard();
  }

  private createEmptyBoard(): Board {
    return Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
  }

  getBoard(): Board {
    return this.board.map((row) => [...row]);
  }

  canPlacePiece(piece: Piece, boardX: number, boardY: number): boolean {
    if (!piece?.cells) {
      return false; // Invalid piece
    }

    for (const cell of piece.cells) {
      const x = boardX + cell.x;
      const y = boardY + cell.y;

      // Check bounds
      if (x < 0 || x >= 8 || y < 0 || y >= 8) {
        return false;
      }

      // Check if cell is already occupied
      if (this.board[y][x] !== 0) {
        return false;
      }
    }
    return true;
  }

  placePiece(piece: Piece, boardX: number, boardY: number): boolean {
    if (!this.canPlacePiece(piece, boardX, boardY)) {
      return false;
    }

    // Place piece on board
    for (const cell of piece.cells) {
      const x = boardX + cell.x;
      const y = boardY + cell.y;
      this.board[y][x] = 1;
    }

    return true;
  }

  calculateGhostPosition(
    piece: Piece,
    mouseX: number,
    mouseY: number,
    boardRect: DOMRect
  ): {
    coords: Coord[];
    valid: boolean;
    boardX: number;
    boardY: number;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } | null {
    const { tile: tileSize, gap, padding } = getCurrentBoardMetrics();

    const relativeX = mouseX - boardRect.left - padding;
    const relativeY = mouseY - boardRect.top - padding;

    // Calculate the board position where the piece origin would be placed
    const originBoardX = Math.floor(relativeX / (tileSize + gap));
    const originBoardY = Math.floor(relativeY / (tileSize + gap));

    // Calculate all cell positions for this piece
    const coords = piece.cells.map((cell) => ({
      x: originBoardX + cell.x,
      y: originBoardY + cell.y,
    }));

    // Check if ALL cells of the piece are within bounds (not just the origin)
    const allCellsInBounds = coords.every(
      (coord) => coord.x >= 0 && coord.x < 8 && coord.y >= 0 && coord.y < 8
    );

    if (!allCellsInBounds) {
      return null;
    }

    const valid = this.canPlacePiece(piece, originBoardX, originBoardY);
    const lineCompletion = this.checkPotentialLineCompletion(
      piece,
      originBoardX,
      originBoardY
    );

    return {
      coords,
      valid,
      boardX: originBoardX,
      boardY: originBoardY,
      wouldCompleteRows: lineCompletion.wouldCompleteRows,
      wouldCompleteCols: lineCompletion.wouldCompleteCols,
    };
  }

  clearLines(): {
    clearedRows: number[];
    clearedCols: number[];
    score: number;
  } {
    const clearedRows: number[] = [];
    const clearedCols: number[] = [];

    // First, identify all complete rows and columns WITHOUT clearing them yet
    // Check rows
    for (let y = 0; y < 8; y++) {
      if (this.board[y].every((cell) => cell === 1)) {
        clearedRows.push(y);
      }
    }

    // Check columns
    for (let x = 0; x < 8; x++) {
      if (this.board.every((row) => row[x] === 1)) {
        clearedCols.push(x);
      }
    }

    // Now clear all identified complete rows
    for (const y of clearedRows) {
      for (let x = 0; x < 8; x++) {
        this.board[y][x] = 0;
      }
    }

    // Now clear all identified complete columns
    for (const x of clearedCols) {
      for (let y = 0; y < 8; y++) {
        this.board[y][x] = 0;
      }
    }

    // Calculate score
    const linesCleared = clearedRows.length + clearedCols.length;
    const score = linesCleared * 100;

    return { clearedRows, clearedCols, score };
  }

  // Check what lines would be completed if piece was placed (for ghost preview)
  checkPotentialLineCompletion(
    piece: Piece,
    boardX: number,
    boardY: number
  ): {
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } {
    if (!this.canPlacePiece(piece, boardX, boardY)) {
      return { wouldCompleteRows: [], wouldCompleteCols: [] };
    }

    // Create a temporary board with the piece placed
    const tempBoard = this.board.map((row) => [...row]);
    for (const cell of piece.cells) {
      const x = boardX + cell.x;
      const y = boardY + cell.y;
      tempBoard[y][x] = 1;
    }

    const wouldCompleteRows: number[] = [];
    const wouldCompleteCols: number[] = [];

    // Check which rows would be completed
    for (let y = 0; y < 8; y++) {
      if (tempBoard[y].every((cell) => cell === 1)) {
        wouldCompleteRows.push(y);
      }
    }

    // Check which columns would be completed
    for (let x = 0; x < 8; x++) {
      if (tempBoard.every((row) => row[x] === 1)) {
        wouldCompleteCols.push(x);
      }
    }

    return { wouldCompleteRows, wouldCompleteCols };
  }

  reset(): void {
    this.board = this.createEmptyBoard();
  }

  // Check if any piece from the bag can fit anywhere on the board
  isGameOver(bag: (Piece | null)[]): boolean {
    // Filter out null pieces from the bag
    const validPieces = bag.filter((piece): piece is Piece => piece !== null);

    // If no valid pieces left, not technically game over (waiting for new bag)
    if (validPieces.length === 0) {
      return false;
    }

    for (const piece of validPieces) {
      // If any piece can fit somewhere, game is not over
      if (this.canPieceFitAnywhere(piece)) {
        return false;
      }
    }

    // No pieces can fit anywhere - game over
    return true;
  }

  // Check if a piece can fit anywhere on the current board
  private canPieceFitAnywhere(piece: Piece): boolean {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.canPlacePiece(piece, x, y)) {
          return true;
        }
      }
    }
    return false;
  }
}
