import { GameEngine } from "../game/GameEngine";
import type { Piece, Bag } from "../game/Types";

/**
 * Test scenario to reproduce the game over bug:
 * - 2 pieces left in bag
 * - One piece is opaque (doesn't fit current board)
 * - But placing the other piece clears lines, making space for the opaque piece
 * - Player should NOT lose in this case
 */
export function createGameOverBugTestScenario(): {
  gameEngine: GameEngine;
  testBag: Bag;
  setupDescription: string;
} {
  const gameEngine = new GameEngine();

  // Create a specific board state that demonstrates the bug
  // We'll fill most of the board but leave strategic gaps
  const board = gameEngine.getBoard();

  // Fill the board to create a near-game-over state
  // Leave row 0 and row 7 with just one missing cell each (for line clearing)
  // Leave a small area in the middle-right for the "opaque" piece after clearing

  // Row 0: missing one cell at position 7
  for (let x = 0; x < 7; x++) {
    board[0][x] = 1;
  }

  // Row 7: missing one cell at position 7
  for (let x = 0; x < 7; x++) {
    board[7][x] = 1;
  }

  // Fill most other rows, but leave strategic gaps
  // Rows 1-6: fill columns 0-5, leave 6-7 mostly empty for the opaque piece
  for (let y = 1; y < 7; y++) {
    for (let x = 0; x < 6; x++) {
      board[y][x] = 1;
    }
  }

  // Add a few strategic blocks in columns 6-7 to make it tight
  board[1][6] = 1;
  board[2][6] = 1;
  board[5][6] = 1;
  board[6][6] = 1;

  // Update the game engine with our test board
  gameEngine.board = board;

  // Create a test bag with exactly 2 pieces:
  // 1. A piece that can complete both row 0 and row 7 (1x1 mono piece)
  // 2. A piece that currently can't fit but will fit after line clearing (L-shape)

  const monoPiece: Piece = {
    id: "MONO",
    cells: [{ x: 0, y: 0 }],
    size: { w: 1, h: 1 },
    image: "/images/brick_red.png",
  };

  const lPiece: Piece = {
    id: "L",
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 0 },
    ],
    size: { w: 2, h: 3 },
    image: "/images/brick_blue.png",
  };

  const testBag: Bag = [monoPiece, lPiece, null];

  const setupDescription = `
Test Scenario: Game Over Bug Reproduction
========================================

Board Setup:
- Row 0: Filled except position (7,0) 
- Row 7: Filled except position (7,7)
- Rows 1-6: Columns 0-5 filled, columns 6-7 mostly empty
- Strategic blocks in column 6 to make it tight

Bag Setup:
- Piece 1: MONO (1x1) - can be placed at (7,0) or (7,7)
- Piece 2: L-piece (4 cells) - currently can't fit anywhere
- Piece 3: null (empty)

Bug Reproduction Steps:
1. Initially, L-piece should appear opaque (can't fit)
2. Place MONO piece at (7,0) - this completes row 0
3. Row 0 clears, making more space
4. L-piece should now be able to fit in the cleared space
5. Game should NOT be over at this point

Expected Behavior (FIXED):
- Game over check happens AFTER line clearing
- L-piece opacity updates after line clearing
- Player can continue playing

Bug Behavior (BEFORE FIX):
- Game over check happened BEFORE line clearing  
- Game would end even though L-piece could fit after clearing
`;

  return {
    gameEngine,
    testBag,
    setupDescription,
  };
}

/**
 * Apply the test scenario directly to the game state
 * Call this from the browser console to test the scenario
 */
export function applyTestScenario(): void {
  const scenario = createGameOverBugTestScenario();

  console.log(scenario.setupDescription);
  console.log("Test scenario created!");
  console.log("Current board state:");
  printBoardState(scenario.gameEngine.getBoard());
  console.log("Current bag:");
  scenario.testBag.forEach((piece, index) => {
    if (piece) {
      console.log(`  ${index}: ${piece.id} (${piece.cells.length} cells)`);
    } else {
      console.log(`  ${index}: empty`);
    }
  });

  // Make the scenario available globally for testing
  (window as any).testScenario = scenario;
  console.log("Scenario available as window.testScenario");
}

/**
 * Helper function to print board state for debugging
 */
function printBoardState(board: number[][]): void {
  console.log("  01234567");
  board.forEach((row, y) => {
    console.log(`${y} ${row.map((cell) => (cell ? "█" : "·")).join("")}`);
  });
}

/**
 * Test the specific bug scenario step by step
 */
export function testGameOverBugScenario(): void {
  console.log("🧪 Testing Game Over Bug Scenario");
  console.log("=".repeat(50));

  const { gameEngine, testBag, setupDescription } =
    createGameOverBugTestScenario();

  console.log(setupDescription);

  // Step 1: Check initial state
  console.log("\n📋 Step 1: Initial State Check");
  console.log("Current board:");
  printBoardState(gameEngine.getBoard());

  const initialGameOver = gameEngine.isGameOver(testBag);
  console.log(`Initial game over status: ${initialGameOver}`);

  // Check if L-piece can fit initially
  const lPiece = testBag[1]!;
  let canLPieceFit = checkPieceFit(gameEngine, lPiece);
  console.log(`L-piece can initially fit: ${canLPieceFit} (should be false)`);

  // Step 2: Place the MONO piece to trigger line clearing
  console.log("\n📋 Step 2: Place MONO piece at (7,0)");
  const monoPiece = testBag[0]!;
  const placed = gameEngine.placePiece(monoPiece, 7, 0);
  console.log(`MONO piece placed successfully: ${placed}`);

  // Check for line completion
  const lineResult = gameEngine.detectCompletedLines();
  console.log(
    `Lines to clear: rows=${lineResult.clearedRows}, cols=${lineResult.clearedCols}`
  );

  // Step 3: Simulate line clearing
  if (lineResult.clearedRows.length > 0 || lineResult.clearedCols.length > 0) {
    console.log("\n📋 Step 3: Clear completed lines");
    gameEngine.clearSpecificLines(
      lineResult.clearedRows,
      lineResult.clearedCols
    );
    console.log("Board after line clearing:");
    printBoardState(gameEngine.getBoard());

    // Step 4: Check if L-piece can now fit
    console.log("\n📋 Step 4: Check L-piece fitting after clearing");
    const fitPosition = findFitPosition(gameEngine, lPiece);
    canLPieceFit = fitPosition !== null;
    console.log(
      `L-piece can fit after clearing: ${canLPieceFit} at position ${JSON.stringify(
        fitPosition
      )}`
    );

    // Step 5: Final game over check
    const newBag: Bag = [null, lPiece, null]; // MONO piece is used
    const finalGameOver = gameEngine.isGameOver(newBag);
    console.log(
      `Final game over status: ${finalGameOver} (should be false if bug is fixed)`
    );

    // Result summary
    logTestResults(canLPieceFit, lineResult, finalGameOver);
  } else {
    console.log("\n❌ No lines cleared - test setup may be incorrect");
  }
}

/**
 * Helper functions to reduce complexity
 */
function checkPieceFit(gameEngine: GameEngine, piece: Piece): boolean {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (gameEngine.canPlacePiece(piece, x, y)) {
        return true;
      }
    }
  }
  return false;
}

function findFitPosition(
  gameEngine: GameEngine,
  piece: Piece
): { x: number; y: number } | null {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (gameEngine.canPlacePiece(piece, x, y)) {
        return { x, y };
      }
    }
  }
  return null;
}

function logTestResults(
  canLPieceFit: boolean,
  lineResult: any,
  finalGameOver: boolean
): void {
  console.log("\n🎯 Test Results Summary:");
  console.log(
    `- Line clearing triggered: ${
      lineResult.clearedRows.length > 0 || lineResult.clearedCols.length > 0
        ? "✅ Yes"
        : "❌ No"
    }`
  );
  console.log(
    `- L-piece fit after clearing: ${canLPieceFit ? "✅ Yes" : "❌ No"}`
  );
  console.log(
    `- Game over (should be false): ${!finalGameOver ? "✅ Pass" : "❌ Fail"}`
  );

  if (!finalGameOver && canLPieceFit) {
    console.log("\n🎉 Bug fix SUCCESS: Game continues as expected!");
  } else {
    console.log("\n❌ Bug still present: Game over incorrectly triggered!");
  }
}
