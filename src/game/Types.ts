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
  image?: string; // Image path for the piece (e.g., "/images/brick_blue.png")
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

// Enhanced scoring interfaces for the new scoring system
export interface ScoringState {
  combo: number; // Current combo multiplier (1x to 25x)
  baseScore: number; // Score before combo multiplier
  totalScore: number; // Final score after combo multiplier
  lastClearScore: number; // Points from the most recent line clear (for animations)
  totalLinesCleared: number; // Lifetime line clear count
}

export interface LineClearResult {
  baseScore: number; // Raw score before combo
  finalScore: number; // Score after combo multiplier applied
  comboMultiplier: number; // The multiplier used (1x to 25x)
  linesCleared: number; // Number of lines cleared this round
  isNewCombo: boolean; // True if combo increased this round
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
