import type { Piece } from "./Types";

/**
 * Standard piece set for the game - curated Tetris-like polyominoes
 * Each piece is defined by its relative coordinates from origin (0,0)
 * Images are assigned based on piece size for consistent theming
 */

// Helper function to assign image based on piece size (cell count)
function getImageForPieceSize(cellCount: number): string {
  switch (cellCount) {
    case 1:
      return "/images/brick_red.png"; // Monomino - red
    case 2:
      return "/images/brick_blue.png"; // Domino - blue
    case 3:
      return "/images/brick_green.png"; // Tromino - green
    case 4:
      return "/images/brick_yellow.png"; // Tetromino - yellow
    case 5:
      return "/images/brick_purple.png"; // Pentomino - purple
    default:
      return "/images/brick_red.png"; // Fallback - red
  }
}

// Monomino
const MONO: Piece = {
  id: "MONO",
  cells: [{ x: 0, y: 0 }],
  size: { w: 1, h: 1 },
  image: "/images/brick_red.png",
};

// Dominos
const DOMINO_H: Piece = {
  id: "DOMINO_H",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ],
  size: { w: 2, h: 1 },
  image: "/images/brick_yellow.png",
};

const DOMINO_V: Piece = {
  id: "DOMINO_V",
  cells: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ],
  size: { w: 1, h: 2 },
  image: "/images/brick_yellow.png",
};

// Trominoes
const TROMINO_I: Piece = {
  id: "TROMINO_I",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],
  size: { w: 3, h: 1 },
  image: getImageForPieceSize(3),
};

const TROMINO_L: Piece = {
  id: "TROMINO_L",
  cells: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  size: { w: 2, h: 2 },
  image: getImageForPieceSize(3),
};

// Tetrominoes
const TETROMINO_I: Piece = {
  id: "TETROMINO_I",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  size: { w: 4, h: 1 },
  image: "/images/brick_red.png",
};

const TETROMINO_O: Piece = {
  id: "TETROMINO_O",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  size: { w: 2, h: 2 },
  image: "/images/brick_red.png",
};

const TETROMINO_T: Piece = {
  id: "TETROMINO_T",
  cells: [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  size: { w: 3, h: 2 },
  image: "/images/brick_red.png",
};

const TETROMINO_L: Piece = {
  id: "TETROMINO_L",
  cells: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  size: { w: 2, h: 3 },
  image: "/images/brick_blue.png",
};

const TETROMINO_J: Piece = {
  id: "TETROMINO_J",
  cells: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 0, y: 2 },
  ],
  size: { w: 2, h: 3 },
  image: getImageForPieceSize(4),
};

const TETROMINO_S: Piece = {
  id: "TETROMINO_S",
  cells: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  size: { w: 3, h: 2 },
  image: getImageForPieceSize(4),
};

const TETROMINO_Z: Piece = {
  id: "TETROMINO_Z",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  size: { w: 3, h: 2 },
  image: "/images/brick_blue.png",
};

// Pentominoes
const PENTOMINO_I: Piece = {
  id: "PENTOMINO_I",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
  ],
  size: { w: 5, h: 1 },
  image: getImageForPieceSize(5),
};

// Hexominoes
const HEXOMINO_3X2: Piece = {
  id: "HEXOMINO_3X2",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  size: { w: 3, h: 2 },
  image: "/images/brick_green.png",
};

// Large pieces
const BIG_L_3X3: Piece = {
  id: "BIG_L_3X3",
  cells: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  size: { w: 3, h: 3 },
  image: getImageForPieceSize(1),
};

const BIG_BLOCK_3X3: Piece = {
  id: "BIG_BLOCK_3X3",
  cells: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  size: { w: 3, h: 3 },
  image: getImageForPieceSize(2),
};

// All available pieces
export const PIECE_LIBRARY: Piece[] = [
  MONO,
  DOMINO_H,
  DOMINO_V,
  TROMINO_I,
  TROMINO_L,
  TETROMINO_I,
  TETROMINO_O,
  TETROMINO_T,
  TETROMINO_L,
  TETROMINO_J,
  TETROMINO_S,
  TETROMINO_Z,
  PENTOMINO_I,
  HEXOMINO_3X2,
  BIG_L_3X3,
  BIG_BLOCK_3X3,
];

// Piece weights for balanced gameplay
// Smaller pieces are slightly more common
export const PIECE_WEIGHTS: Record<string, number> = {
  MONO: 0.0,
  DOMINO_H: 1.8,
  DOMINO_V: 1.8,
  TROMINO_I: 1.5,
  TROMINO_L: 1.5,
  TETROMINO_I: 1.0,
  TETROMINO_O: 1.2,
  TETROMINO_T: 1.2,
  TETROMINO_L: 1.0,
  TETROMINO_J: 1.0,
  TETROMINO_S: 1.0,
  TETROMINO_Z: 1.0,
  PENTOMINO_I: 0.8, // Rare, very large piece
  HEXOMINO_3X2: 0.8, // Uncommon, medium-large
  BIG_L_3X3: 0.8, // Very rare, very large
  BIG_BLOCK_3X3: 0.8, // Extremely rare, massive
};

/**
 * Get a piece by ID
 */
export function getPiece(id: string): Piece | undefined {
  return PIECE_LIBRARY.find((piece) => piece.id === id);
}

/**
 * Get all small pieces (1-2 cells) for constraint checking
 */
export function getSmallPieces(): Piece[] {
  return PIECE_LIBRARY.filter((piece) => piece.cells.length <= 2);
}

/**
 * Get all large pieces (4+ cells) for constraint checking
 */
export function getLargePieces(): Piece[] {
  return PIECE_LIBRARY.filter((piece) => piece.cells.length >= 4);
}

/**
 * Create a copy of a piece (deep clone)
 */
export function clonePiece(piece: Piece): Piece {
  return {
    id: piece.id,
    cells: piece.cells.map((cell) => ({ x: cell.x, y: cell.y })),
    size: { w: piece.size.w, h: piece.size.h },
    color: piece.color,
    image: piece.image, // Copy the image property
  };
}

/**
 * Rotate a piece 90 degrees clockwise
 */
export function rotatePiece90(piece: Piece): Piece {
  // Find the bounding box to normalize coordinates
  const minX = Math.min(...piece.cells.map((cell) => cell.x));
  const minY = Math.min(...piece.cells.map((cell) => cell.y));
  const maxX = Math.max(...piece.cells.map((cell) => cell.x));

  // Rotate each cell 90 degrees clockwise around the center
  const rotatedCells = piece.cells.map((cell) => {
    // Translate to origin-based coordinates
    const relX = cell.x - minX;
    const relY = cell.y - minY;

    // Apply 90-degree clockwise rotation: (x, y) -> (y, -x)
    const rotatedX = relY;
    const rotatedY = maxX - minX - relX;

    return { x: rotatedX, y: rotatedY };
  });

  // Normalize to ensure minimum coordinates are 0
  const newMinX = Math.min(...rotatedCells.map((cell) => cell.x));
  const newMinY = Math.min(...rotatedCells.map((cell) => cell.y));

  const normalizedCells = rotatedCells.map((cell) => ({
    x: cell.x - newMinX,
    y: cell.y - newMinY,
  }));

  // Calculate new size
  const newMaxX = Math.max(...normalizedCells.map((cell) => cell.x));
  const newMaxY = Math.max(...normalizedCells.map((cell) => cell.y));

  return {
    ...piece,
    cells: normalizedCells,
    size: { w: newMaxX + 1, h: newMaxY + 1 },
  };
}

/**
 * Rotate a piece by a random number of 90-degree increments (0, 1, 2, or 3)
 */
export function randomlyRotatePiece(
  piece: Piece,
  rng: { next(): number }
): Piece {
  const rotations = Math.floor(rng.next() * 4); // 0, 1, 2, or 3 rotations
  let rotatedPiece = clonePiece(piece);

  for (let i = 0; i < rotations; i++) {
    rotatedPiece = rotatePiece90(rotatedPiece);
  }

  return rotatedPiece;
}
