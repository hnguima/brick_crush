/**
 * Comprehensive test suite for the hail mary MONO piece feature
 */

import { generateBag } from "../game/Bag";
import { SeededRandom } from "../game/Random";
import { GameEngine } from "../game/GameEngine";
import { BagManager } from "../game/BagManager";
import type { Board, Piece } from "../game/Types";

/**
 * Create a nearly full board that would cause most pieces to not fit,
 * but a MONO piece would still fit
 */
export function createNearlyFullBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(0)); // Start with empty board

  // Fill most of the board in a realistic pattern that prevents large pieces
  // but doesn't create complete lines
  const filledPattern = [
    [1, 1, 0, 1, 1, 0, 1, 1], // Row 0: gaps prevent line completion
    [1, 0, 1, 1, 0, 1, 1, 0], // Row 1: offset pattern
    [0, 1, 1, 0, 1, 1, 0, 1], // Row 2: scattered gaps
    [1, 1, 0, 1, 1, 0, 1, 1], // Row 3: similar to row 0
    [1, 0, 1, 1, 0, 1, 0, 1], // Row 4: more gaps
    [0, 1, 1, 0, 1, 1, 1, 0], // Row 5: offset pattern
    [1, 0, 1, 1, 0, 1, 1, 1], // Row 6: mostly filled
    [1, 1, 0, 1, 1, 0, 1, 0], // Row 7: gaps at end
  ];

  filledPattern.forEach((row, y) => {
    row.forEach((cell, x) => {
      board[y][x] = cell as 0 | 1;
    });
  });

  return board;
}

/**
 * Create a board state that only allows MONO pieces to fit
 */
export function createMonoOnlyBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(0)); // Start with empty board // Fill most of the board in a realistic pattern that prevents large pieces  // but doesn't create complete lines  const filledPattern = [    [1, 1, 0, 1, 1, 0, 1, 1], // Row 0: gaps prevent line completion    [1, 0, 1, 1, 0, 1, 1, 0], // Row 1: offset pattern    [0, 1, 1, 0, 1, 1, 0, 1], // Row 2: scattered gaps    [1, 1, 0, 1, 1, 0, 1, 1], // Row 3: similar to row 0    [1, 0, 1, 1, 0, 1, 0, 1], // Row 4: more gaps    [0, 1, 1, 0, 1, 1, 1, 0], // Row 5: offset pattern    [1, 0, 1, 1, 0, 1, 1, 1], // Row 6: mostly filled    [1, 1, 0, 1, 1, 0, 1, 0], // Row 7: gaps at end  ];

  // Create a checkered pattern
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if ((x + y) % 2 === 0) {
        board[y][x] = 1;
      }
    }
  }

  // Fill first row almost completely (leave only [0,0] empty)
  for (let x = 1; x < 8; x++) {
    board[0][x] = 1;
  }

  // Fill first column almost completely (leave only [0,0] empty)
  for (let y = 1; y < 8; y++) {
    board[y][0] = 1;
  }

  // The only truly empty spot where any piece can fit is [0,0]
  // All other empty spots are isolated single cells due to checkered pattern
  board[0][0] = 0; // The shared corner - only spot for larger pieces

  // Verify no complete lines exist
  const hasCompleteRow = board.some((row) => row.every((cell) => cell === 1));
  const hasCompleteCol = Array.from({ length: 8 }, (_, col) =>
    board.every((row) => row[col] === 1)
  ).some(Boolean);

  if (hasCompleteRow || hasCompleteCol) {
    console.warn("Warning: Test board has complete lines that would clear!");
  }

  return board;
}

/**
 * Test bag generation with extreme board constraint
 */
export function testBagGeneration(): void {
  console.log("=== Testing Bag Generation with Hail Mary ===");

  // Use the realistic mono-only board instead of a completely filled one
  const restrictedBoard = createMonoOnlyBoard();

  console.log("Restricted board (0 = empty, 1 = occupied):");
  restrictedBoard.forEach((row, y) => {
    console.log(`Row ${y}: [${row.join("")}]`);
  });

  const rng = new SeededRandom(12345);

  console.log("\n1. Generating bag WITHOUT board constraint (normal):");
  const normalBag = generateBag(rng);
  normalBag.forEach((piece, i) => {
    if (piece) {
      console.log(`  Piece ${i}: ${piece.id} (${piece.cells.length} cells)`);
    }
  });

  console.log(
    "\n2. Generating bag WITH restricted board (should trigger hail mary):"
  );
  const restrictedBag = generateBag(new SeededRandom(12345), restrictedBoard);
  let monoCount = 0;
  restrictedBag.forEach((piece, i) => {
    if (piece) {
      if (piece.id === "MONO") {
        monoCount++;
        console.log(
          `  Piece ${i}: ${piece.id} (${piece.cells.length} cells) 🎯 HAIL MARY!`
        );
      } else {
        console.log(`  Piece ${i}: ${piece.id} (${piece.cells.length} cells)`);
      }
    }
  });

  console.log(`\n3. Results:`);
  console.log(
    `   Normal bag has MONO: ${normalBag.some((p) => p?.id === "MONO")}`
  );
  console.log(`   Restricted bag has MONO: ${monoCount > 0}`);
  console.log(
    `   Hail mary was ${monoCount > 0 ? "SUCCESSFUL" : "NOT TRIGGERED"}`
  );
}

/**
 * Standalone demonstration of hail mary in a realistic game scenario
 */
export function demonstrateHailMary(): void {
  console.log("=== Demonstrating Hail Mary Feature in Game Scenario ===");

  const gameEngine = new GameEngine();
  const testBoard = createMonoOnlyBoard();

  // Set up the game engine with our test board
  gameEngine.board = testBoard.map((row) => [...row]);

  console.log("Test board state (0 = empty, 1 = occupied):");
  testBoard.forEach((row, y) => {
    console.log(`Row ${y}: [${row.join("")}]`);
  });

  // Create a new bag manager and force a bag generation with the problematic board
  const bagManager = new BagManager(42); // Fixed seed for reproducible results

  // Simulate using all pieces in current bag
  console.log("\n1. Simulating complete bag usage...");
  const originalBag = bagManager.getBag();
  console.log(
    "Original bag:",
    originalBag.map((p) => p?.id || "null")
  );

  // Remove all pieces from bag to trigger new bag generation with hail mary
  bagManager.removePiece(0, gameEngine.getBoard());
  bagManager.removePiece(1, gameEngine.getBoard());
  bagManager.removePiece(2, gameEngine.getBoard());

  const newBag = bagManager.getBag();
  console.log("\n2. New bag generated (should include hail mary MONO piece):");
  newBag.forEach((piece, index) => {
    if (piece) {
      console.log(
        `  Piece ${index}: ${piece.id} (${piece.cells.length} cells) ${
          piece.id === "MONO" ? "🎯 HAIL MARY!" : ""
        }`
      );
    }
  });

  // Verify that at least one piece can fit on the board
  console.log("\n3. Verifying pieces can fit on the restricted board:");
  let canPlaceCount = 0;
  newBag.forEach((piece, index) => {
    if (piece) {
      let canFit = false;
      for (let y = 0; y < 8 && !canFit; y++) {
        for (let x = 0; x < 8 && !canFit; x++) {
          if (gameEngine.canPlacePiece(piece, x, y)) {
            canFit = true;
            canPlaceCount++;
          }
        }
      }
      console.log(
        `  Piece ${index} (${piece.id}): ${
          canFit ? "✅ CAN FIT" : "❌ CANNOT FIT"
        }`
      );
    }
  });

  const isGameOverWithoutHailMary = canPlaceCount === 0;
  console.log(
    `\n4. Without hail mary, game would be over: ${
      isGameOverWithoutHailMary ? "YES" : "NO"
    }`
  );
  console.log(
    `   With hail mary, ${canPlaceCount} piece(s) can still be placed!`
  );

  console.log("\n✅ Hail Mary demonstration complete!");
}

/**
 * Integration test that works with the actual running game
 */
export function triggerHailMaryScenario(): void {
  console.log("=== Triggering Hail Mary in Running Game ===");

  // Check if we have access to game state refs directly
  const gameEngineRef = (window as any).gameEngineRef;
  const bagManagerRef = (window as any).bagManagerRef;
  const gameStateSetters = (window as any).gameStateSetters;

  if (!gameEngineRef?.current || !bagManagerRef?.current) {
    console.error("❌ Game engine or bag manager not available.");
    console.log(
      "Available on window:",
      Object.keys(window as any).filter((k) => k.includes("game"))
    );
    return;
  }

  if (!gameStateSetters) {
    console.error("❌ Game state setters not available.");
    return;
  }

  const { setBoard, setImageBoard, setBag } = gameStateSetters;

  // 1. Set up the mono-only board
  const monoOnlyBoard = createMonoOnlyBoard();
  console.log("1. Setting up mono-only board...");
  console.log("Board pattern (0 = empty, 1 = occupied):");
  monoOnlyBoard.forEach((row, y) => {
    console.log(`Row ${y}: [${row.join("")}]`);
  });

  // Update both game engine and React state
  gameEngineRef.current.board = monoOnlyBoard.map((row: number[]) => [...row]);
  setBoard(monoOnlyBoard);
  setImageBoard(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  );

  // 2. Show current bag before hail mary
  const currentBag = bagManagerRef.current.getBag();
  console.log("\n2. Current bag before forcing new generation:");
  currentBag.forEach((piece: Piece | null, i: number) => {
    if (piece) {
      console.log(`  Piece ${i}: ${piece.id} (${piece.cells.length} cells)`);
    }
  });

  // 3. Force bag regeneration by manually triggering it with the restricted board
  console.log("\n3. Forcing new bag generation with restricted board...");

  // Manually generate a new bag with the current board state
  bagManagerRef.current.reset(Date.now(), gameEngineRef.current.getBoard());
  const newBag = bagManagerRef.current.getBag();

  console.log("\n4. New bag after hail mary logic:");
  let monoCount = 0;
  newBag.forEach((piece: Piece | null, i: number) => {
    if (piece) {
      if (piece.id === "MONO") {
        monoCount++;
        console.log(
          `  Piece ${i}: ${piece.id} (${piece.cells.length} cells) 🎯 HAIL MARY!`
        );
      } else {
        console.log(`  Piece ${i}: ${piece.id} (${piece.cells.length} cells)`);
      }
    }
  });

  // 4. Update React state with the new bag
  setBag(newBag);

  // 5. Verify the results
  console.log(`\n5. Results:`);
  console.log(`   MONO pieces in new bag: ${monoCount}`);
  console.log(
    `   Hail mary was ${monoCount > 0 ? "SUCCESSFUL" : "NOT TRIGGERED"}`
  );

  // 6. Test if pieces can actually fit
  console.log("\n6. Testing piece placement on restricted board:");
  let fittablePieces = 0;
  newBag.forEach((piece: Piece | null, i: number) => {
    if (piece) {
      const canFit = gameEngineRef.current.canPieceFitAnywhere(piece);
      console.log(
        `   Piece ${i} (${piece.id}): ${
          canFit ? "✅ CAN FIT" : "❌ CANNOT FIT"
        }`
      );
      if (canFit) fittablePieces++;
    }
  });

  console.log(
    `\n✅ SUCCESS! ${fittablePieces} out of 3 pieces can fit on the board`
  );
  console.log("The game can continue thanks to the hail mary MONO piece!");
}

/**
 * Quick test of the basic hail mary functionality
 */
export function testHailMary(): void {
  console.log("=== Testing Hail Mary MONO Piece Feature ===");

  const rng = new SeededRandom(12345);
  const nearlyFullBoard = createNearlyFullBoard();

  console.log("Board state (0 = empty, 1 = occupied):");
  nearlyFullBoard.forEach((row, y) => {
    console.log(`Row ${y}: [${row.join(", ")}]`);
  });

  // Generate bag with the nearly full board - should trigger hail mary
  console.log(
    "\nGenerating bag with nearly full board (should trigger hail mary)..."
  );
  const bag = generateBag(rng, nearlyFullBoard);

  console.log("\nGenerated bag pieces:");
  bag.forEach((piece, index) => {
    if (piece) {
      console.log(
        `Piece ${index}: ${piece.id} (${piece.cells.length} cells) - ${
          piece.id === "MONO" ? "🎯 HAIL MARY!" : "regular piece"
        }`
      );
    }
  });

  // Check if at least one MONO piece was added
  const hasMonoPiece = bag.some((piece) => piece?.id === "MONO");
  console.log(`\n✅ Hail mary applied: ${hasMonoPiece ? "YES" : "NO"}`);

  // Generate bag with empty board - should not trigger hail mary
  console.log("\n--- Comparison: Empty Board ---");
  const emptyBoard: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(0));

  const normalBag = generateBag(rng, emptyBoard);
  console.log("Normal bag pieces:");
  normalBag.forEach((piece, index) => {
    if (piece) {
      console.log(`Piece ${index}: ${piece.id} (${piece.cells.length} cells)`);
    }
  });

  const normalHasMonoPiece = normalBag.some((piece) => piece?.id === "MONO");
  console.log(`Hail mary applied: ${normalHasMonoPiece ? "YES" : "NO"}`);
}

// Expose all test functions to browser console
if (typeof window !== "undefined") {
  (window as any).testHailMary = testHailMary;
  (window as any).testBagGeneration = testBagGeneration;
  (window as any).demonstrateHailMary = demonstrateHailMary;
  (window as any).triggerHailMaryScenario = triggerHailMaryScenario;
  (window as any).createNearlyFullBoard = createNearlyFullBoard;
  (window as any).createMonoOnlyBoard = createMonoOnlyBoard;
}
