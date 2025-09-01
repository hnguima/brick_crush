// Test functions for triggering game over and new best score dialogs
// Only available in development mode for testing purposes

export interface TestDialogConfig {
  score?: number;
  bestScore?: number;
  isNewBest?: boolean;
}

// Global reference to game state setters (populated by App.tsx in dev mode)
let testGameStateSetters: {
  setIsGameOver?: (isGameOver: boolean) => void;
  setScore?: (score: number) => void;
  setBestScore?: (bestScore: number) => void;
} = {};

/**
 * Register game state setters for testing (called by App.tsx in dev mode)
 */
export const registerTestDialogHelpers = (
  setters: typeof testGameStateSetters
) => {
  testGameStateSetters = setters;
};

/**
 * Test function to show game over dialog
 * Usage in browser console: showTestGameOverDialog({ score: 1500, bestScore: 1000, isNewBest: true })
 */
export const showTestGameOverDialog = (config: TestDialogConfig = {}) => {
  const {
    score = 1200,
    bestScore = 1000,
    isNewBest = score > bestScore,
  } = config;

  console.log("🎮 Showing test game over dialog:", {
    score,
    bestScore,
    isNewBest,
  });

  // Update score and best score
  if (testGameStateSetters.setScore) {
    testGameStateSetters.setScore(score);
  }

  if (testGameStateSetters.setBestScore && isNewBest) {
    testGameStateSetters.setBestScore(score);
  } else if (testGameStateSetters.setBestScore) {
    testGameStateSetters.setBestScore(bestScore);
  }

  // Show game over dialog
  if (testGameStateSetters.setIsGameOver) {
    testGameStateSetters.setIsGameOver(true);
  }
};

/**
 * Test function to show new personal best dialog
 * Usage in browser console: showTestNewBestDialog({ score: 2500, previousBest: 1800 })
 */
export const showTestNewBestDialog = (
  config: { score?: number; previousBest?: number } = {}
) => {
  const { score = 2500, previousBest = 1800 } = config;

  console.log("🏆 Showing test new best score dialog:", {
    score,
    previousBest,
  });

  showTestGameOverDialog({
    score,
    bestScore: score, // Best score becomes the new score
    isNewBest: true,
  });
};

/**
 * Test function to show regular game over (no new best)
 * Usage in browser console: showTestRegularGameOver({ score: 800, bestScore: 1500 })
 */
export const showTestRegularGameOver = (
  config: { score?: number; bestScore?: number } = {}
) => {
  const { score = 800, bestScore = 1500 } = config;

  console.log("😢 Showing test regular game over:", { score, bestScore });

  showTestGameOverDialog({
    score,
    bestScore,
    isNewBest: false,
  });
};

// Export test functions to window in development mode
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as any).showTestGameOverDialog = showTestGameOverDialog;
  (window as any).showTestNewBestDialog = showTestNewBestDialog;
  (window as any).showTestRegularGameOver = showTestRegularGameOver;

  console.log("📱 Dialog test functions available:");
  console.log(
    "• showTestGameOverDialog({ score: 1500, bestScore: 1000, isNewBest: true })"
  );
  console.log("• showTestNewBestDialog({ score: 2500, previousBest: 1800 })");
  console.log("• showTestRegularGameOver({ score: 800, bestScore: 1500 })");
}
