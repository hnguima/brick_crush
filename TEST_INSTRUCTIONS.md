# Game Over Bug Test Instructions

## 🚀 Quick Test Setup

1. **Start the game**: Navigate to http://localhost:5174/
2. **Open browser console**: Press F12, go to Console tab
3. **Run the VISUAL test setup**: Type `setupGameOverBugTest()` and press Enter
   - ⚠️ **NOT** `testGameOverBug()` - that's just a text simulation!
   - ✅ **USE** `setupGameOverBugTest()` - this changes the actual game board

**If automatic setup fails**: Type `manualSetupInstructions()` for manual testing steps

The test will automatically:

- ✅ Set up a board state that reproduces the bug
- ✅ Add a MONO piece that can complete row 0
- ✅ Add an L-piece that can't fit initially but will fit after row 0 clears
- ✅ Apply this state directly to the running game

## 🧪 Testing the Bug Fix

After running `setupGameOverBugTest()`:

1. **Observe initial state**:

   - Board should be mostly filled with strategic gaps
   - L-piece (blue) should appear **opaque** (can't fit anywhere)
   - MONO piece (red) should be normal opacity

2. **Reproduce the bug scenario**:

   - Drag the MONO piece to position (7,0) - the empty cell in the top row
   - This should complete row 0 and trigger line clearing
   - Watch the animation as row 0 clears

3. **Verify the fix**:
   - ✅ **AFTER** line clearing: L-piece should become **normal opacity** (can now fit)
   - ✅ **Game should continue** - no game over dialog
   - ✅ You should be able to place the L-piece in the newly available space

## 🐛 Expected Bug Behavior (Before Fix)

- Game would end immediately after placing MONO piece
- Game over dialog would appear before line clearing completed
- Player would lose even though L-piece could fit after clearing

## ✅ Expected Fixed Behavior (After Fix)

- Game continues after line clearing
- L-piece becomes placeable (normal opacity)
- No premature game over

## 🔧 Additional Console Commands

- `setupGameOverBugTest()` - **🎯 USE THIS ONE** - Applies test scenario to the actual game board
- `manualSetupInstructions()` - **📋 BACKUP PLAN** - Manual testing steps if automatic fails
- `debugCurrentGameState()` - View current board state
- `resetGameForTesting()` - Reset to clean game state
- `testGameOverBug()` - Run text-only simulation (doesn't change visual game)

## 🎯 Manual Testing Alternative

If the automatic setup doesn't work:

1. Play until you have exactly 2 pieces left in the bag
2. Fill the board so one piece can't fit anywhere (appears opaque)
3. Make sure the other piece can complete a line that would create space for the opaque piece
4. Place the fitting piece and observe if game ends prematurely

The bug is fixed if the game continues and the previously opaque piece becomes placeable after line clearing.
