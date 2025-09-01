/**
 * Quick test script to verify the new scoring system
 * Run this in the browser console to test scoring mechanics
 */

import { ScoringEngine } from "../game/Scoring";

// Test the scoring calculations
function testScoringSystem() {
  console.log("=== Scoring System Test ===");

  const scoring = new ScoringEngine();

  // Test 1: Single line clear
  console.log("Test 1: Single line clear");
  let result = scoring.processLineClear([0], []);
  console.log(
    `1 line: Base=${result.baseScore}, Final=${result.finalScore}, Combo=${result.comboMultiplier}x`
  );
  console.log(`Expected: Base=50, Final=50, Combo=1x`);

  // Test 2: Double line clear (should be 150 points with 2x combo)
  console.log("\nTest 2: Double line clear");
  result = scoring.processLineClear([1, 2], []);
  console.log(
    `2 lines: Base=${result.baseScore}, Final=${result.finalScore}, Combo=${result.comboMultiplier}x`
  );
  console.log(`Expected: Base=150 (50+100), Final=300 (150*2), Combo=2x`);

  // Test 3: Triple line clear (should be 350 points with 3x combo)
  console.log("\nTest 3: Triple line clear");
  result = scoring.processLineClear([3], [4, 5]);
  console.log(
    `3 lines: Base=${result.baseScore}, Final=${result.finalScore}, Combo=${result.comboMultiplier}x`
  );
  console.log(`Expected: Base=350 (50+100+200), Final=1050 (350*3), Combo=3x`);

  // Test 4: Bag complete without clears (should reset combo)
  console.log("\nTest 4: Bag complete without clears (combo reset)");
  scoring.processBagCompleteWithoutClears();
  console.log(`Combo after reset: ${scoring.getCurrentCombo()}x`);
  console.log(`Expected: 1x`);

  // Test 5: Single line after reset
  console.log("\nTest 5: Single line after reset");
  result = scoring.processLineClear([0], []);
  console.log(
    `1 line: Base=${result.baseScore}, Final=${result.finalScore}, Combo=${result.comboMultiplier}x`
  );
  console.log(`Expected: Base=50, Final=50, Combo=1x`);

  // Test 6: Check total score
  console.log("\nTest 6: Total score check");
  const state = scoring.getState();
  console.log(`Total Score: ${state.totalScore}`);
  console.log(`Expected: 1450 (50 + 300 + 1050 + 50)`);

  // Test 7: Combo cap at 25x
  console.log("\nTest 7: Combo cap test");
  const testScoring = new ScoringEngine();
  for (let i = 0; i < 30; i++) {
    testScoring.processLineClear([0], []);
  }
  console.log(`Combo after 30 clears: ${testScoring.getCurrentCombo()}x`);
  console.log(`Expected: 25x (capped)`);

  console.log("\n=== Test Complete ===");
}

// Export for browser console usage
if (typeof window !== "undefined") {
  (window as any).testScoringSystem = testScoringSystem;
  console.log("Use testScoringSystem() in console to run scoring tests");
}

export { testScoringSystem };
