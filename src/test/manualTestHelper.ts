import type { Piece, Bag } from "../game/Types";

/**
 * Manual test helper - creates a board state that reproduces the game over bug
 * This function will automatically apply the test scenario to the running game
 */
export function setupGameOverBugTest() {
  console.log("🔧 Setting up Game Over Bug Test...");

  // Create test pieces
  const monoPiece: Piece = {
    id: "TEST_MONO",
    cells: [{ x: 0, y: 0 }],
    size: { w: 1, h: 1 },
    image: "/images/brick_red.png",
  };

  const lPiece: Piece = {
    id: "TEST_L",
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 0 },
    ],
    size: { w: 2, h: 3 },
    image: "/images/brick_blue.png",
  };

  // Create a PROPER test board state that triggers the bug
  const testBoard = Array(8)
    .fill(null)
    .map(() => Array(8).fill(0));

  // Fill most of the board, but leave strategic gaps
  // The key is to create a situation where:
  // 1. L-piece can't fit anywhere initially
  // 2. MONO piece can complete exactly one line
  // 3. That line clearing makes just enough space for L-piece

  // Fill rows 0-6 almost completely, leaving only small gaps
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 8; x++) {
      testBoard[y][x] = 1;
    }
  }

  // Row 0: leave one gap at (7,0) for MONO to complete it
  testBoard[0][7] = 0;

  // Create minimal space that's too small for L-piece initially
  // L-piece needs a 2x3 area, so create gaps that are too small/wrong shape
  testBoard[1][6] = 0; // Single gap - too small for L
  testBoard[1][7] = 0; // Single gap - too small for L
  testBoard[2][7] = 0; // Single gap - too small for L
  testBoard[3][7] = 0; // Single gap - too small for L

  // Row 7: Fill it completely EXCEPT make it part of column 7 clearing
  for (let x = 0; x < 7; x++) {
    testBoard[7][x] = 1;
  }
  testBoard[7][7] = 0; // This makes column 7 incomplete

  // After MONO is placed at (7,0), it will complete row 0
  // Row 0 clearing will create a 1x8 horizontal space
  // But that's still not enough for L-piece alone...

  // Actually, let's create a more realistic scenario:
  // Fill the board tightly but leave a specific pattern

  // Reset and try again with a better approach
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      testBoard[y][x] = 0; // Start empty
    }
  }

  // Fill most cells strategically
  // Leave row 0 with one missing cell (for MONO to complete)
  for (let x = 0; x < 7; x++) {
    testBoard[0][x] = 1;
  }

  // Fill other rows tightly, leaving scattered single cells
  // but no 2x3 area for L-piece
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0], // Row 0: missing (7,0)
    [1, 1, 1, 1, 1, 1, 0, 1], // Row 1: missing (6,1)
    [1, 1, 1, 1, 1, 0, 1, 1], // Row 2: missing (5,2)
    [1, 1, 1, 1, 0, 1, 1, 1], // Row 3: missing (4,3)
    [1, 1, 1, 0, 1, 1, 1, 1], // Row 4: missing (3,4)
    [1, 1, 0, 1, 1, 1, 1, 1], // Row 5: missing (2,5)
    [1, 0, 1, 1, 1, 1, 1, 1], // Row 6: missing (1,6)
    [0, 1, 1, 1, 1, 1, 1, 1], // Row 7: missing (0,7)
  ];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      testBoard[y][x] = pattern[y][x];
    }
  }

  // This creates a diagonal pattern of single empty cells
  // L-piece can't fit in any of these single cells
  // But when row 0 clears, it creates a whole row of empty space
  // Combined with existing gaps, L-piece should then be able to fit

  const testBag: Bag = [monoPiece, lPiece, null];

  // Try to apply this to the actual running game
  try {
    // Access the React app's state setter functions
    const gameStateSetters = (window as any).gameStateSetters;
    const gameEngineRef = (window as any).gameEngineRef;
    const bagManagerRef = (window as any).bagManagerRef;

    if (gameStateSetters && gameEngineRef && bagManagerRef) {
      console.log("✅ Found game state access - applying test scenario...");

      // Update the game engine board directly
      gameEngineRef.current.board = testBoard;

      // Create corresponding image board
      const testImageBoard = testBoard.map((row) =>
        row.map((cell) => (cell ? "/images/brick_red.png" : null))
      );
      gameEngineRef.current.imageBoard = testImageBoard;

      // IMPORTANT: Set the BagManager's internal bag directly to prevent auto-regeneration
      if (bagManagerRef.current) {
        bagManagerRef.current.bag = [...testBag];
      }

      // Update React state
      gameStateSetters.setBoard(testBoard.map((row) => [...row]));
      gameStateSetters.setImageBoard(testImageBoard.map((row) => [...row]));

      // IMPORTANT: Set the bag directly without going through BagManager
      // to prevent automatic bag regeneration
      gameStateSetters.setBag([...testBag]);
      gameStateSetters.setIsGameOver(false);
      gameStateSetters.setScore(0);

      console.log("✅ Test scenario applied successfully!");
      console.log("🎯 Place MONO piece at (7,0) to test the bug fix");
    } else {
      console.log("❌ Could not access game state setters");

      // Fall back to storing scenario for manual application
      const scenario = {
        board: testBoard,
        bag: testBag,
      };

      (window as any).gameOverBugTest = scenario;
    }
  } catch (error) {
    console.error("❌ Error applying test scenario:", error);
  }

  return { testBoard, testBag };
}

/**
 * Console helper to print current game state for comparison
 */
export function debugCurrentGameState() {
  console.log("🔍 Current Game State Debug");
  console.log("=".repeat(30));

  // Try to access the game state from the React app
  const gameEngineRef = (window as any).gameEngineRef;

  if (gameEngineRef?.current) {
    const board = gameEngineRef.current.getBoard();
    console.log("📋 Current Board:");
    console.log("     01234567");
    board.forEach((row: any, y: number) => {
      console.log(
        `  ${y}  ${row.map((cell: number) => (cell ? "█" : "·")).join("")}`
      );
    });
  } else {
    console.log("❌ Game engine not accessible");
  }
}

/**
 * Reset game to clean state for testing
 */
export function resetGameForTesting() {
  console.log("🔄 Resetting game for testing...");

  try {
    const gameStateSetters = (window as any).gameStateSetters;
    const gameEngineRef = (window as any).gameEngineRef;

    if (gameStateSetters && gameEngineRef) {
      // Reset game engine
      gameEngineRef.current.reset();

      // Reset React state
      gameStateSetters.setBoard(gameEngineRef.current.getBoard());
      gameStateSetters.setImageBoard(gameEngineRef.current.getImageBoard());
      gameStateSetters.setScore(0);
      gameStateSetters.setIsGameOver(false);

      console.log("✅ Game reset successfully");
    } else {
      console.log("❌ Could not access game state setters");
    }
  } catch (error) {
    console.error("❌ Error resetting game:", error);
  }
}

/**
 * Simple manual setup instructions when automatic setup fails
 */
export function manualSetupInstructions() {
  console.log("📋 Manual Bug Test Setup");
  console.log("=".repeat(40));
  console.log("Since automatic setup failed, follow these steps:");
  console.log("");
  console.log("1. Play the game normally until you have exactly 2 pieces left");
  console.log("2. Look for this scenario:");
  console.log("   - One piece appears OPAQUE (can't fit anywhere)");
  console.log("   - The other piece can complete a line/row");
  console.log(
    "   - That completed line would create space for the opaque piece"
  );
  console.log("");
  console.log("3. Place the piece that completes the line");
  console.log("4. Watch what happens:");
  console.log("   ✅ FIXED: Game continues, opaque piece becomes placeable");
  console.log("   ❌ BUG: Game ends immediately before line clears");
  console.log("");
  console.log("💡 Alternative: Use 'New Game' button multiple times until");
  console.log("   you get a scenario that matches the bug description");
}

// Make functions available globally for console testing
(window as any).setupGameOverBugTest = setupGameOverBugTest;
(window as any).debugCurrentGameState = debugCurrentGameState;
(window as any).resetGameForTesting = resetGameForTesting;
(window as any).manualSetupInstructions = manualSetupInstructions;
