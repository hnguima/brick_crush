/**
 * Storage utilities using Capacitor Preferences for cross-platform support
 */
import { Preferences } from "@capacitor/preferences";

const STORAGE_KEYS = {
  BEST_SCORE: "brick-crush-best-score",
  CURRENT_GAME: "brick-crush-current-game",
} as const;

export const storage = {
  async getBestScore(): Promise<number> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.BEST_SCORE });
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.warn("Failed to load best score from Preferences:", error);
      return 0;
    }
  },

  async setBestScore(score: number): Promise<void> {
    try {
      await Preferences.set({
        key: STORAGE_KEYS.BEST_SCORE,
        value: score.toString(),
      });
    } catch (error) {
      console.warn("Failed to save best score to Preferences:", error);
    }
  },

  async updateBestScore(currentScore: number): Promise<number> {
    const bestScore = await storage.getBestScore();
    if (currentScore > bestScore) {
      await storage.setBestScore(currentScore);
      return currentScore;
    }
    return bestScore;
  },

  // Future: Game state persistence
  async getCurrentGame(): Promise<any | null> {
    try {
      const { value } = await Preferences.get({
        key: STORAGE_KEYS.CURRENT_GAME,
      });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn("Failed to load game state from Preferences:", error);
      return null;
    }
  },

  async setCurrentGame(gameState: any): Promise<void> {
    try {
      await Preferences.set({
        key: STORAGE_KEYS.CURRENT_GAME,
        value: JSON.stringify(gameState),
      });
    } catch (error) {
      console.warn("Failed to save game state to Preferences:", error);
    }
  },

  async clearCurrentGame(): Promise<void> {
    try {
      await Preferences.remove({ key: STORAGE_KEYS.CURRENT_GAME });
    } catch (error) {
      console.warn("Failed to clear game state from Preferences:", error);
    }
  },
};
