/**
 * Core type definitions for Brick Crush game
 */

export interface Coord {
  x: number;
  y: number;
}

export type Cell = 0 | 1;

export type Board = Cell[][];

export interface Piece {
  id: string;
  cells: Coord[];
  size: { w: number; h: number };
  color?: string;
}

export type Bag = [Piece | null, Piece | null, Piece | null];

export interface Placement {
  pieceId: string;
  origin: Coord;
}

export interface ClearResult {
  clearedRows: number[];
  clearedCols: number[];
}

export interface ScoreState {
  score: number;
  best: number;
  combo: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  rotationEnabled: boolean;
}

export interface GameState {
  board: Board;
  bag: Bag;
  holdingPiece?: Piece;
  score: ScoreState;
  rngSeed: number;
  settings: GameSettings;
}

export interface DragState {
  piece: Piece | null;
  isDragging: boolean;
  startPosition: Coord | null;
  currentPosition: Coord | null;
  ghostPosition: Coord | null;
  isValidPlacement: boolean;
}
