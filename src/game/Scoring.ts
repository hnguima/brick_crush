/**
 * Scoring.ts - Advanced scoring system with multi-line bonuses and combo multipliers
 *
 * Features:
 * - Progressive multi-line scoring: 50, 100, 200, 400, ... (2x multiplier per additional line)
 * - Combo system: Each line clear round increments combo, caps at 25x
 * - Combo reset: Goes back to 1x if bag completes without any line clears
 * - Final score = base score * combo multiplier
 */

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

export class ScoringEngine {
  private state: ScoringState;
  private readonly BASE_LINE_CLEAR_SCORE = 50;

  constructor(initialState?: Partial<ScoringState>) {
    this.state = {
      combo: 1,
      baseScore: 0,
      totalScore: 0,
      lastClearScore: 0,
      totalLinesCleared: 0,
      ...initialState,
    };
  }

  /**
   * Calculate score for a line clear round with progressive multipliers
   * Formula: 1st line = 50, 2nd line = 100, 3rd line = 200, 4th line = 400, etc.
   * Each additional line doubles the previous bonus
   */
  calculateLineClearScore(linesCleared: number): number {
    if (linesCleared === 0) return 0;

    let totalScore = 0;
    for (let i = 0; i < linesCleared; i++) {
      // First line: BASE_LINE_CLEAR_SCORE, then each subsequent line doubles: x2, x4, x8, x16...
      const lineScore = this.BASE_LINE_CLEAR_SCORE * Math.pow(2, i);
      totalScore += lineScore;
    }

    return totalScore;
  }

  /**
   * Process a line clear and update scoring state
   */
  processLineClear(
    clearedRows: number[],
    clearedCols: number[]
  ): LineClearResult {
    const linesCleared = clearedRows.length + clearedCols.length;

    if (linesCleared === 0) {
      return {
        baseScore: 0,
        finalScore: 0,
        comboMultiplier: this.state.combo,
        linesCleared: 0,
        isNewCombo: false,
      };
    }

    // Calculate base score with progressive multipliers
    const baseScore = this.calculateLineClearScore(linesCleared);

    // Apply combo multiplier
    const finalScore = baseScore * this.state.combo;

    // Increment combo (cap at 25x)
    const wasComboIncreased = this.state.combo < 25;
    if (wasComboIncreased) {
      this.state.combo = Math.min(this.state.combo + 1, 25);
    }

    // Update state
    this.state.baseScore += baseScore;
    this.state.totalScore += finalScore;
    this.state.lastClearScore = finalScore;
    this.state.totalLinesCleared += linesCleared;

    return {
      baseScore,
      finalScore,
      comboMultiplier: this.state.combo - (wasComboIncreased ? 1 : 0), // Return the multiplier that was actually used
      linesCleared,
      isNewCombo: wasComboIncreased,
    };
  }

  /**
   * Called when a bag is completed without any line clears
   * Resets combo back to 1x
   */
  processBagCompleteWithoutClears(): void {
    this.state.combo = 1;
  }

  /**
   * Get current scoring state (readonly copy)
   */
  getState(): Readonly<ScoringState> {
    return { ...this.state };
  }

  /**
   * Get current combo multiplier for UI display
   */
  getCurrentCombo(): number {
    return this.state.combo;
  }

  /**
   * Get total score for UI display
   */
  getTotalScore(): number {
    return this.state.totalScore;
  }

  /**
   * Get the score from the last line clear (useful for floating score animations)
   */
  getLastClearScore(): number {
    return this.state.lastClearScore;
  }

  /**
   * Reset scoring state (for new game)
   */
  reset(): void {
    this.state = {
      combo: 1,
      baseScore: 0,
      totalScore: 0,
      lastClearScore: 0,
      totalLinesCleared: 0,
    };
  }

  /**
   * Get combo display text for UI
   */
  getComboDisplayText(): string {
    if (this.state.combo === 1) {
      return "";
    }
    return `${this.state.combo}x COMBO!`;
  }

  /**
   * Check if current combo is at maximum
   */
  isMaxCombo(): boolean {
    return this.state.combo === 25;
  }

  /**
   * Get expected score for a potential line clear (for ghost preview)
   */
  calculatePotentialScore(linesCleared: number): {
    baseScore: number;
    finalScore: number;
    comboAfter: number;
  } {
    if (linesCleared === 0) {
      return {
        baseScore: 0,
        finalScore: 0,
        comboAfter: this.state.combo,
      };
    }

    const baseScore = this.calculateLineClearScore(linesCleared);
    const finalScore = baseScore * this.state.combo;
    const comboAfter = Math.min(this.state.combo + 1, 25);

    return {
      baseScore,
      finalScore,
      comboAfter,
    };
  }

  /**
   * Serialize state for persistence
   */
  serialize(): string {
    return JSON.stringify(this.state);
  }

  /**
   * Restore state from serialized data
   */
  deserialize(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.state = {
        combo: parsed.combo || 1,
        baseScore: parsed.baseScore || 0,
        totalScore: parsed.totalScore || 0,
        lastClearScore: parsed.lastClearScore || 0,
        totalLinesCleared: parsed.totalLinesCleared || 0,
      };
    } catch (error) {
      console.warn("Failed to deserialize scoring state, resetting:", error);
      this.reset();
    }
  }
}

// Export a default instance for easy use
export const scoringEngine = new ScoringEngine();

// Utility functions for UI components
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getScoreColor = (combo: number): string => {
  if (combo >= 25) return "#FFD700"; // Gold for max combo
  if (combo >= 10) return "#FF6B35"; // Orange for high combo
  if (combo >= 5) return "#F7931E"; // Light orange for medium combo
  if (combo > 1) return "#4CAF50"; // Green for active combo
  return "#666"; // Gray for no combo
};

export const getScoreAnimation = (combo: number): string => {
  if (combo >= 25) return "glow-gold";
  if (combo >= 10) return "pulse-orange";
  if (combo >= 5) return "bounce-light";
  if (combo > 1) return "fade-in";
  return "none";
};
