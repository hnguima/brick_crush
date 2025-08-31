import type { Piece, Bag, Board } from "./Types";
import { PIECE_LIBRARY, PIECE_WEIGHTS, randomlyRotatePiece } from "./PieceSet";
import { SeededRandom } from "./Random";

/**
 * Generate a new bag of 3 pieces with constraints
 * - Avoid all three being very large (4+ cells)
 * - Ensure variety (avoid duplicates when possible)
 * - Apply hail mary mono piece if no pieces would fit on the board
 */
export function generateBag(rng: SeededRandom, board?: Board): Bag {
  const pieces: Piece[] = [];
  const usedIds = new Set<string>();

  // First pass: try to get 3 different pieces with size constraints
  for (let i = 0; i < 3; i++) {
    const availablePieces = PIECE_LIBRARY.filter((piece) => {
      // Skip pieces with 0 weight - be explicit about the check
      const weight = PIECE_WEIGHTS[piece.id];
      if (weight === undefined || weight === 0 || weight === 0.0) return false;

      // Skip if already used (prefer variety)
      if (usedIds.has(piece.id)) return false;

      // Count pieces by size category
      const largePieceCount = pieces.filter(
        (p) => p.cells.length >= 4 && p.cells.length < 7
      ).length;
      const hugePieceCount = pieces.filter((p) => p.cells.length >= 7).length;

      // If we already have 2 large pieces (4-6 cells), avoid another large one
      if (
        largePieceCount >= 2 &&
        piece.cells.length >= 4 &&
        piece.cells.length < 7
      )
        return false;

      // If we already have 1 huge piece (7+ cells), avoid another huge one
      if (hugePieceCount >= 1 && piece.cells.length >= 7) return false;

      // Never allow more than 1 piece with 6+ cells total
      const bigPieceCount = pieces.filter((p) => p.cells.length >= 6).length;
      if (bigPieceCount >= 1 && piece.cells.length >= 6) return false;

      return true;
    });

    if (availablePieces.length === 0) {
      // Fallback: allow any piece with weight > 0 if no valid options
      const fallbackPieces = PIECE_LIBRARY.filter((piece) => {
        const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
        return weight > 0;
      });
      const piece = weightedRandomPiece(
        rng,
        fallbackPieces.length > 0 ? fallbackPieces : PIECE_LIBRARY
      );
      pieces.push(clonePieceWithRandomRotation(piece, rng));
    } else {
      const piece = weightedRandomPiece(rng, availablePieces);
      pieces.push(clonePieceWithRandomRotation(piece, rng));
      usedIds.add(piece.id);
    }
  }

  // Ensure we have exactly 3 pieces
  while (pieces.length < 3) {
    const validPieces = PIECE_LIBRARY.filter((piece) => {
      const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
      return weight > 0;
    });
    const piece = weightedRandomPiece(rng, validPieces);
    pieces.push(clonePieceWithRandomRotation(piece, rng));
  }

  const finalBag: Bag = [pieces[0], pieces[1], pieces[2]];

  // Apply hail mary logic if board is provided and no pieces would fit
  if (board && wouldCauseGameOver(finalBag, board)) {
    console.log("🎯 HAIL MARY TRIGGERED! Applying MONO piece to prevent game over");
    applyHailMaryMono(finalBag);
  }

  return finalBag;
}

/**
 * Select a piece using weighted random selection
 */
function weightedRandomPiece(rng: SeededRandom, pieces: Piece[]): Piece {
  // Filter out pieces with 0 weight first
  const validPieces = pieces.filter((piece) => {
    const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
    return weight > 0;
  });

  // NEVER fallback to original pieces that might include 0-weight pieces
  if (validPieces.length === 0) {
    throw new Error("No valid pieces available for generation");
  }

  const totalWeight = validPieces.reduce(
    (sum, piece) => sum + (PIECE_WEIGHTS[piece.id] ?? 1.0),
    0
  );

  let randomValue = rng.next() * totalWeight;

  for (const piece of validPieces) {
    const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
    randomValue -= weight;
    if (randomValue <= 0) {
      return piece;
    }
  }

  // Fallback: return the last valid piece (never MONO since it's filtered out)
  return validPieces[validPieces.length - 1];
}

/**
 * Create a deep clone of a piece with random rotation applied
 */
function clonePieceWithRandomRotation(piece: Piece, rng: SeededRandom): Piece {
  const cloned = clonePiece(piece);
  return randomlyRotatePiece(cloned, rng);
}

/**
 * Create a deep clone of a piece
 */
function clonePiece(piece: Piece): Piece {
  return {
    id: piece.id,
    cells: piece.cells.map((cell) => ({ x: cell.x, y: cell.y })),
    size: { w: piece.size.w, h: piece.size.h },
    color: piece.color,
    image: piece.image, // Copy the image property
  };
}

/**
 * Check if a bag contains at least one small piece that can fit on an empty board
 */
export function bagHasSmallPiece(bag: Bag): boolean {
  return bag.some((piece) => piece !== null && piece.cells.length <= 2);
}

/**
 * Get the total number of cells in a bag
 */
export function getBagSize(bag: Bag): number {
  return bag.reduce(
    (total, piece) => total + (piece ? piece.cells.length : 0),
    0
  );
}

/**
 * Check if a bag would cause game over on the given board
 */
function wouldCauseGameOver(bag: Bag, board: Board): boolean {
  // Simple check: try each piece at every board position
  for (const piece of bag) {
    if (!piece) continue;
    
    if (canPieceFitAnywhereOnBoard(piece, board)) {
      return false; // At least one piece fits, not game over
    }
  }
  
  return true; // No pieces can fit anywhere
}

/**
 * Check if a piece can fit anywhere on the board
 */
function canPieceFitAnywhereOnBoard(piece: Piece, board: Board): boolean {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (canPlacePieceOnBoard(piece, x, y, board)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if a piece can be placed at a specific position on the board
 */
function canPlacePieceOnBoard(piece: Piece, boardX: number, boardY: number, board: Board): boolean {
  if (!piece?.cells) {
    return false;
  }

  for (const cell of piece.cells) {
    const x = boardX + cell.x;
    const y = boardY + cell.y;

    // Check bounds
    if (x < 0 || x >= 8 || y < 0 || y >= 8) {
      return false;
    }

    // Check if cell is already occupied
    if (board[y][x] !== 0) {
      return false;
    }
  }

  return true;
}

/**
 * Apply hail mary logic: replace the largest piece with a MONO piece
 */
function applyHailMaryMono(bag: Bag): void {
  // Find the piece with the most cells to replace
  let largestIndex = 0;
  let largestSize = 0;
  
  for (let i = 0; i < bag.length; i++) {
    const piece = bag[i];
    if (piece && piece.cells.length > largestSize) {
      largestSize = piece.cells.length;
      largestIndex = i;
    }
  }

  // Get the MONO piece from the library
  const monoPiece = PIECE_LIBRARY.find(piece => piece.id === "MONO");
  if (monoPiece) {
    // Replace the largest piece with a cloned MONO piece (no rotation needed for 1x1)
    bag[largestIndex] = clonePiece(monoPiece);
  }
}
