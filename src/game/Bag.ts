import type { Piece, Bag } from "./Types";
import { PIECE_LIBRARY, PIECE_WEIGHTS, randomlyRotatePiece } from "./PieceSet";
import { SeededRandom } from "./Random";

/**
 * Generate a new bag of 3 pieces with constraints
 * - Avoid all three being very large (4+ cells)
 * - Ensure variety (avoid duplicates when possible)
 */
export function generateBag(rng: SeededRandom): Bag {
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
      const fallbackPieces = PIECE_LIBRARY.filter(piece => {
        const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
        return weight > 0;
      });
      const piece = weightedRandomPiece(rng, fallbackPieces.length > 0 ? fallbackPieces : PIECE_LIBRARY);
      pieces.push(clonePieceWithRandomRotation(piece, rng));
    } else {
      const piece = weightedRandomPiece(rng, availablePieces);
      pieces.push(clonePieceWithRandomRotation(piece, rng));
      usedIds.add(piece.id);
    }
  }

  // Ensure we have exactly 3 pieces
  while (pieces.length < 3) {
    const validPieces = PIECE_LIBRARY.filter(piece => {
      const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
      return weight > 0;
    });
    const piece = weightedRandomPiece(rng, validPieces);
    pieces.push(clonePieceWithRandomRotation(piece, rng));
  }

  return [pieces[0], pieces[1], pieces[2]];
}

/**
 * Select a piece using weighted random selection
 */
function weightedRandomPiece(rng: SeededRandom, pieces: Piece[]): Piece {
  // Filter out pieces with 0 weight first
  const validPieces = pieces.filter(piece => {
    const weight = PIECE_WEIGHTS[piece.id] ?? 1.0;
    return weight > 0;
  });

  // NEVER fallback to original pieces that might include 0-weight pieces
  if (validPieces.length === 0) {
    throw new Error('No valid pieces available for generation');
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
