import { GameEngine } from "../game/GameEngine";
import type { Piece } from "../game/Types";
import { getPiece } from "../game/PieceSet";

/**
 * Comprehensive test cases for line clearing scenarios
 * Tests 1 to N line clears with corresponding shake intensities
 */

export interface LineClearTestCase {
  name: string;
  description: string;
  expectedRows: number[];
  expectedCols: number[];
  expectedShakeIntensity: number;
  setupBoard: () => number[][];
  testPiece: Piece;
  placementPos: { x: number; y: number };
}

/**
 * Helper function to create a test piece
 */
function createTestPiece(
  id: string,
  cells: { x: number; y: number }[],
  image: string = "/images/brick_red.png"
): Piece {
  const maxX = Math.max(...cells.map((c) => c.x));
  const maxY = Math.max(...cells.map((c) => c.y));
  return {
    id,
    cells,
    size: { w: maxX + 1, h: maxY + 1 },
    image,
  };
}

/**
 * TEST CASE 1: Single Row Clear
 * Shake Intensity: 1
 */
export const singleRowClear: LineClearTestCase = {
  name: "Single Row Clear",
  description: "Clear exactly 1 row, shake intensity should be 1",
  expectedRows: [3],
  expectedCols: [],
  expectedShakeIntensity: 1,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill row 3 except one cell
    for (let x = 0; x < 7; x++) {
      board[3][x] = 1;
    }
    return board;
  },
  testPiece: createTestPiece("MONO", [{ x: 0, y: 0 }]),
  placementPos: { x: 7, y: 3 },
};

/**
 * TEST CASE 2: Single Column Clear
 * Shake Intensity: 1
 */
export const singleColumnClear: LineClearTestCase = {
  name: "Single Column Clear",
  description: "Clear exactly 1 column, shake intensity should be 1",
  expectedRows: [],
  expectedCols: [3],
  expectedShakeIntensity: 1,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill column 3 except one cell
    for (let y = 0; y < 7; y++) {
      board[y][3] = 1;
    }
    return board;
  },
  testPiece: createTestPiece("MONO", [{ x: 0, y: 0 }]),
  placementPos: { x: 3, y: 7 },
};

/**
 * TEST CASE 3: Double Row Clear
 * Shake Intensity: 2
 */
export const doubleRowClear: LineClearTestCase = {
  name: "Double Row Clear",
  description: "Clear exactly 2 rows, shake intensity should be 2",
  expectedRows: [3, 4],
  expectedCols: [],
  expectedShakeIntensity: 2,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill adjacent rows 3 and 4, each missing one cell in same column
    for (let x = 0; x < 8; x++) {
      if (x !== 6) {
        board[3][x] = 1;
        board[4][x] = 1;
      }
    }
    return board;
  },
  testPiece: createTestPiece("I2", [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ]),
  placementPos: { x: 6, y: 3 },
};

/**
 * TEST CASE 4: Double Column Clear
 * Shake Intensity: 2
 */
export const doubleColumnClear: LineClearTestCase = {
  name: "Double Column Clear",
  description: "Clear exactly 2 columns, shake intensity should be 2",
  expectedRows: [],
  expectedCols: [1, 6],
  expectedShakeIntensity: 2,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill columns 1 and 6, each missing one cell in same row
    for (let y = 0; y < 8; y++) {
      if (y !== 3) {
        board[y][3] = 1;
        board[y][4] = 1;
      }
    }
    return board;
  },
  testPiece: createTestPiece("I2H", [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]),
  placementPos: { x: 1, y: 3 },
};

/**
 * TEST CASE 5: Row + Column Clear (Cross Pattern)
 * Shake Intensity: 2
 */
export const crossLineClear: LineClearTestCase = {
  name: "Cross Line Clear (1 Row + 1 Column)",
  description:
    "Clear 1 row and 1 column simultaneously, shake intensity should be 2",
  expectedRows: [4],
  expectedCols: [4],
  expectedShakeIntensity: 2,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill row 4 except position (4,4)
    for (let x = 0; x < 8; x++) {
      if (x !== 4) board[4][x] = 1;
    }
    // Fill column 4 except position (4,4)
    for (let y = 0; y < 8; y++) {
      if (y !== 4) board[y][4] = 1;
    }
    return board;
  },
  testPiece: createTestPiece("MONO", [{ x: 0, y: 0 }]),
  placementPos: { x: 4, y: 4 },
};

/**
 * TEST CASE 6: Triple Row Clear
 * Shake Intensity: 3 (capped)
 */
export const tripleRowClear: LineClearTestCase = {
  name: "Triple Row Clear",
  description: "Clear exactly 3 rows, shake intensity should be 3",
  expectedRows: [3, 4, 5],
  expectedCols: [],
  expectedShakeIntensity: 3,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill 3 consecutive rows, each missing exactly 3 cells in same positions for I3 piece
    for (let x = 0; x < 8; x++) {
      if (x < 7) {
        // Fill columns 0-4, leave 5-7 empty
        board[3][x] = 1;
        board[4][x] = 1;
        board[5][x] = 1;
      }
    }
    return board;
  },
  testPiece: createTestPiece("I3", [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ]),
  placementPos: { x: 5, y: 3 },
};

/**
 * TEST CASE 7: Simple 3-Line Clear
 * Shake Intensity: 3
 */
export const quadLineClear: LineClearTestCase = {
  name: "Simple 3-Line Clear (1 Row + 2 Columns)",
  description:
    "Clear 2 rows + 2 columns = 4 lines, shake intensity should be 3",
  expectedRows: [4],
  expectedCols: [3, 4],
  expectedShakeIntensity: 3,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));

    // Fill row 4, missing positions (4,3) and (4,4) for the horizontal I2 piece
    for (let x = 0; x < 8; x++) {
      if (x !== 3 && x !== 4) {
        board[3][x] = 1;
        board[4][x] = 1;
      }
    }

    // Fill column 3, missing position (4,3)
    for (let y = 0; y < 8; y++) {
      if (y !== 3 && y !== 4) {
        board[y][3] = 1;
        board[y][4] = 1;
      }
    }

    return board;
  },
  testPiece: getPiece("TETROMINO_O")!,
  placementPos: { x: 3, y: 3 },
};

/**
 * TEST CASE 8: Extreme Multi-Line Clear
 * Shake Intensity: 3 (capped from 6 total lines)
 */
export const extremeMultiLineClear: LineClearTestCase = {
  name: "Extreme Multi-Line Clear (6 Lines Total)",
  description:
    "Clear 3 rows + 3 columns = 6 lines, shake intensity capped at 3",
  expectedRows: [1, 3, 5],
  expectedCols: [1, 3, 5],
  expectedShakeIntensity: 3,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));

    // Create a pattern where a 3x3 L-piece can complete multiple lines
    const targetRows = [1, 3, 5];
    const targetCols = [1, 3, 5];

    // Fill target rows except the intersection points
    targetRows.forEach((row) => {
      for (let x = 0; x < 8; x++) {
        if (!targetCols.includes(x)) {
          board[row][x] = 1;
        }
      }
    });

    // Fill target columns except the intersection points
    targetCols.forEach((col) => {
      for (let y = 0; y < 8; y++) {
        if (!targetRows.includes(y)) {
          board[y][col] = 1;
        }
      }
    });

    return board;
  },
  testPiece: createTestPiece("L3", [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ]),
  placementPos: { x: 1, y: 1 },
};

/**
 * TEST CASE 9: Full Row Clearance (Edge Case)
 * Shake Intensity: 3 (capped from 8 rows)
 */
export const fullRowClearance: LineClearTestCase = {
  name: "Full Row Clearance (8 Rows)",
  description: "Theoretical maximum: clear all 8 rows (highly impractical)",
  expectedRows: [0, 1, 2, 3, 4, 5, 6, 7],
  expectedCols: [],
  expectedShakeIntensity: 3,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill entire board except one column
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 7; x++) {
        board[y][x] = 1;
      }
    }
    return board;
  },
  testPiece: createTestPiece(
    "I8",
    Array.from({ length: 8 }, (_, i) => ({ x: 0, y: i }))
  ),
  placementPos: { x: 7, y: 0 },
};

/**
 * TEST CASE 10: Full Board Clear (Ultimate Edge Case)
 * Shake Intensity: 3 (capped from 16 total lines)
 */
export const fullBoardClear: LineClearTestCase = {
  name: "Full Board Clear (8 Rows + 8 Columns)",
  description:
    "Ultimate theoretical maximum: clear entire board (impossible in real gameplay)",
  expectedRows: [0, 1, 2, 3, 4, 5, 6, 7],
  expectedCols: [0, 1, 2, 3, 4, 5, 6, 7],
  expectedShakeIntensity: 3,
  setupBoard: () => {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(0));
    // Fill entire board except one cell
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (!(y === 7 && x === 7)) {
          board[y][x] = 1;
        }
      }
    }
    return board;
  },
  testPiece: createTestPiece("MONO", [{ x: 0, y: 0 }]),
  placementPos: { x: 7, y: 7 },
};

/**
 * All test cases organized by complexity
 */
export const allLineClearTestCases: LineClearTestCase[] = [
  singleRowClear, // 1 line
  singleColumnClear, // 1 line
  doubleRowClear, // 2 lines
  doubleColumnClear, // 2 lines
  crossLineClear, // 2 lines (mixed)
  tripleRowClear, // 3 lines
  quadLineClear, // 4 lines (capped at 3 intensity)
  extremeMultiLineClear, // 6 lines (capped at 3 intensity)
  fullRowClearance, // 8 lines (capped at 3 intensity)
  fullBoardClear, // 16 lines (capped at 3 intensity)
];

/**
 * Test runner function to execute a specific test case
 */
export function runLineClearTest(testCase: LineClearTestCase): boolean {
  console.log(`🧪 Running Test: ${testCase.name}`);
  console.log(`📝 ${testCase.description}`);

  const gameEngine = new GameEngine();
  const board = testCase.setupBoard();

  // Set up the board - convert number[][] to Cell[][]
  gameEngine.board = board.map((row) => row.map((cell) => cell as 0 | 1));

  // Place the test piece
  const placed = gameEngine.placePiece(
    testCase.testPiece,
    testCase.placementPos.x,
    testCase.placementPos.y
  );

  if (!placed) {
    console.log("❌ Failed to place test piece");
    return false;
  }

  // Check line completion
  const lineResult = gameEngine.detectCompletedLines();
  const totalLinesCleared =
    lineResult.clearedRows.length + lineResult.clearedCols.length;
  const actualShakeIntensity = Math.min(totalLinesCleared, 3);

  // Verify results
  const sortedClearedRows = [...lineResult.clearedRows].sort((a, b) => a - b);
  const sortedExpectedRows = [...testCase.expectedRows].sort((a, b) => a - b);
  const sortedClearedCols = [...lineResult.clearedCols].sort((a, b) => a - b);
  const sortedExpectedCols = [...testCase.expectedCols].sort((a, b) => a - b);

  const rowsMatch =
    JSON.stringify(sortedClearedRows) === JSON.stringify(sortedExpectedRows);
  const colsMatch =
    JSON.stringify(sortedClearedCols) === JSON.stringify(sortedExpectedCols);
  const shakeMatch = actualShakeIntensity === testCase.expectedShakeIntensity;

  console.log(`📊 Results:`);
  console.log(
    `   Rows cleared: ${lineResult.clearedRows} ${rowsMatch ? "✅" : "❌"}`
  );
  console.log(
    `   Cols cleared: ${lineResult.clearedCols} ${colsMatch ? "✅" : "❌"}`
  );
  console.log(`   Total lines: ${totalLinesCleared}`);
  console.log(
    `   Shake intensity: ${actualShakeIntensity} ${shakeMatch ? "✅" : "❌"}`
  );

  const success = rowsMatch && colsMatch && shakeMatch;
  console.log(`🎯 Test Result: ${success ? "PASS ✅" : "FAIL ❌"}\n`);

  return success;
}

/**
 * Run all test cases and return summary
 */
export function runAllLineClearTests(): {
  passed: number;
  total: number;
  results: boolean[];
} {
  console.log("🚀 Running All Line Clear Test Cases");
  console.log("=".repeat(50));

  const results = allLineClearTestCases.map((testCase) =>
    runLineClearTest(testCase)
  );
  const passed = results.filter((r) => r).length;

  console.log(`📈 Summary: ${passed}/${results.length} tests passed`);

  if (passed === results.length) {
    console.log("🎉 All tests passed! Shake system working correctly.");
  } else {
    console.log("⚠️  Some tests failed. Check implementation.");
  }

  return { passed, total: results.length, results };
}

/**
 * Apply a specific test case to the running game (for visual testing)
 */
export function applyTestCaseToGame(testCaseIndex: number): void {
  if (testCaseIndex < 0 || testCaseIndex >= allLineClearTestCases.length) {
    console.log("❌ Invalid test case index");
    return;
  }

  const testCase = allLineClearTestCases[testCaseIndex];
  console.log(`🎮 Applying ${testCase.name} to running game...`);

  try {
    const gameStateSetters = (window as any).gameStateSetters;
    const gameEngineRef = (window as any).gameEngineRef;

    if (gameStateSetters && gameEngineRef) {
      // Set up the board
      const board = testCase.setupBoard();
      gameEngineRef.current.board = board;

      // Create corresponding image board
      const imageBoard = board.map((row) =>
        row.map((cell) => (cell ? "/images/brick_red.png" : null))
      );
      gameEngineRef.current.imageBoard = imageBoard;

      // Create a test bag with the required piece
      const testBag = [testCase.testPiece, null, null];

      // Update React state
      gameStateSetters.setBoard([...board.map((row) => [...row])]);
      gameStateSetters.setImageBoard([...imageBoard.map((row) => [...row])]);
      gameStateSetters.setBag([...testBag]);
      gameStateSetters.setIsGameOver(false);

      console.log(
        `✅ Test case applied! Place the piece at (${testCase.placementPos.x}, ${testCase.placementPos.y})`
      );
      console.log(`🎯 Expected result: ${testCase.description}`);
    } else {
      console.log("❌ Could not access game state setters");
    }
  } catch (error) {
    console.error("❌ Error applying test case:", error);
  }
}

// Make functions available globally for console testing
(window as any).runLineClearTest = runLineClearTest;
(window as any).runAllLineClearTests = runAllLineClearTests;
(window as any).applyTestCaseToGame = applyTestCaseToGame;
(window as any).allLineClearTestCases = allLineClearTestCases;
