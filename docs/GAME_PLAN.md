# Brick Crush — Game Design & Delivery Plan

A compact blueprint to ship an 8×8 block‑breaker with Tetris‑like pieces, line clears, ## Rendering strategy

- Material-UI components for board + pieces; reactive state-driven rendering instead of canvas.
- Event bus for decoupling game logic from UI.
- Board cells as individual Material Paper components with hover/click interactions.ece bags, scoring, and a clean end‑game.

---

## Product vision

Relaxing, tactile puzzle you can play in short sessions. Strategy comes from smart placement, line/column clears, and set completion bonuses.

---

## Core rules (requirements)

- Board is 8×8.
- Pieces are Tetris‑like polyominoes (see piece set below).
- Player receives 3 pieces at a time (a “bag”).
- Player places pieces anywhere they fit; pieces cannot overlap existing tiles.
- When a full row or column is completed, it clears.
- When the 3 pieces in a bag are all placed, score is awarded and a new bag of 3 appears.
- Bonuses for completing rows/columns and for completing a 3‑piece bag.
- Game ends when none of the current pieces can be placed anywhere on the board.

Success criteria

- Smooth on desktop and mobile at 60 FPS.
- No ambiguous placements; clear visual feedback.
- Session persistence (resume + high score) across refresh.

---

## Status Update

### Completed ✅

- **Core Logic**: `Types.ts`, `Random.ts`, `PieceSet.ts` with 12 Tetris-like pieces
- **Game Engine**: `GameEngine.ts` and `BagManager.ts` for game state management
- **UI Components**: `Tray.tsx` with 3 draggable pieces
- **Drag & Drop**: Full pointer-based drag system with performance optimizations
- **Ghost Preview**: Real-time piece placement preview on board hover
- **Board Interaction**: Drop detection and piece placement validation
- **Sound Engine**: Native audio integration with Capacitor for low-latency sound effects
- **Visual Feedback**: Tray pieces become opaque (0.3 opacity) when they cannot fit anywhere on the board
- **Invalid Placement Feedback**: Dragged pieces become opaque when positioned over invalid locations

### Recent Critical Fixes ⚡

- **FIXED - Weight System**: Corrected piece generation to respect 0 weights (MONO pieces no longer generate inappropriately)
- **FIXED - Performance Crisis**: Resolved excessive bag regeneration during drag operations via lazy ref initialization
- **FIXED - Android Touch**: Restored touch dragging on mobile with hardware acceleration and proper pointer handling
- **FIXED - Drag Granularity**: Implemented pixel-level drag optimization with DRAG_GRANULARITY_PX constant
- **FIXED - Emotion Objects**: Eliminated repeated CSS-in-JS object creation by replacing with static div styling

### Performance Optimizations ⚡

- Aggressive throttling: 200ms hover events (5fps), 100ms visual updates (~10fps)
- Board position change detection: Only trigger events when crossing cell boundaries
- Ghost position deduplication: Prevent redundant state updates
- Optimized re-renders: Smart memoization and ref usage

### In Progress 🔧

- Sound engine troubleshooting (file path resolution for native audio)

### Recently Completed ✅

- ✅ Confetti effects system with tsparticles - Added celebratory confetti animations that trigger whenever lines are cleared, with enhanced effects for multi-line clears
- ✅ Line/column clearing logic integration
- ✅ Line completion ghost preview with highlighting
- ✅ Functional New Game button
- ✅ Score calculation and best score persistence
- ✅ Game over detection and dialog

## Roadmap (milestones)

MVP (playable) - 98% Complete

- ✅ Static 8×8 board, drag to place, simple fit check.
- ✅ 3‑piece bag spawn with weighted random generation.
- ✅ Line and column clear integration with ghost preview.
- ✅ New Game functionality to reset board and state.
- ✅ Complete scoring system with best score persistence.
- ✅ Game over detection when no pieces can be placed.

Polish

- ✅ Animations for place/clear - Sequential line clear animation with wave effect.
- ✅ Sound effects and haptics - Native audio engine with Capacitor Community Native Audio plugin.
- Undo last move, piece rotation toggle (optional rules).
- Session save, best score, simple menus.

Live‑ops (stretch)

- Daily challenge, missions, streaks.
- Power‑ups, skins/themes, unlocks.
- Leaderboard (local/online), shareable results image.

---

## Game system design

Board

- Grid: 8 rows × 8 cols.
- Cell state: empty | occupied(color/id).
- Clearing: evaluate after each placement; collect complete rows/columns; remove with animation; compacting is not needed (no gravity).

Piece set

- Use a curated set for balance and fun. Start set:
  - Monomino: 1
  - Dominos: 2‑line
  - Trominoes: I‑3 line, L‑3
  - Tetrominoes: I, L, J, O(2×2), T, S, Z
  - Pentominoes (optional later): I‑5, L‑5, T‑5, plus 1–2 others
- Representation: list of relative coordinates with a canonical origin.
- Rotation: initially off (simpler UX). Add as a toggle later.

Piece generation (bag)

- Each bag contains 3 random pieces with soft constraints so at least one piece fits an empty board early and mid‑game:
  - Avoid all three being very large.
  - Ensure variety (don’t duplicate the same shape thrice unless allowed).
- PRNG seeded for reproducibility when needed (e.g., daily).

Placement rules

- Drag a piece; ghost previews valid/invalid cells.
- Drop only if every cell maps to empty board cells; otherwise snap back.

Scoring (baseline)

- +1 point per tile placed.
- +10 per line cleared (row or column).
- Combo: +5 extra per additional line cleared in the same placement (e.g., double line = +15 each total).
- Bag bonus: +15 when all 3 pieces in the current bag are placed.
- Streak bonus (optional): successive placements that cause clears add +5 per streak level.

Game over

- If no piece in the current bag can fit anywhere on the board, show game over and final score.

Persistence

- Local storage: best score, current board + bag + score, settings.

---

## UX / UI design

Layout

- Top: score + best.
- Center: 8×8 grid.
- Bottom: 3 pieces tray.

Interactions

- Drag & drop with snapping; keyboard fallback (arrows to move ghost, space to place) is optional.
- Visual states: hover/drag ghost (green = valid, red = invalid), place pop, clear burst.

Accessibility

- High‑contrast theme option.
- Color‑blind friendly palette; non‑color cues.
- Reduced motion setting.

Feedback

- Subtle screen shake for multi‑line clears (toggleable).
- SFX: place, invalid, clear, bag complete.

---

## Architecture (TypeScript + Vite + React + Material-UI)

Rendering strategy

- React components for UI; Canvas 2D for board + pieces; Material-UI for theming and components.
- Event bus for decoupling game logic from UI.

State flow

- GameState (board, score, bag, rngSeed, settings) → reducers for deterministic updates.
- UI subscribes to state changes; Renderer draws from state.

Error handling

- Guard invalid drops, out‑of‑bounds, and stale drag states.

---

## File organization (proposed)

src/

- main.tsx — bootstrap React app, mount to root
- App.tsx — main app component with MUI ThemeProvider
- styles/
  - app.css — layout + themes (deprecated, MUI handles theming)
- assets/
  - sfx/ … (future)
  - fonts/ … (future)
- components/
  - Board.tsx — React component hosting the canvas
  - Tray.tsx — React component for piece selection with MUI chips
  - Hud.tsx — React component for score/controls with MUI AppBar
- game/
  - Board.ts — board grid, read/write, clear detection
  - Piece.ts — piece definition, rotation, footprint
  - PieceSet.ts — library of shapes
  - Bag.ts — 3‑piece bag generation with constraints
  - Fit.ts — fit checks, legal moves, game‑over check
  - Scoring.ts — score calculation and combo logic
  - Game.ts — orchestrates turns, placements, clearing, bag lifecycle
  - Random.ts — seeded RNG utilities
  - Storage.ts — load/save snapshot + best score
  - Types.ts — shared types/interfaces
- ui/
  - Renderer.ts — CanvasRenderer for board/pieces
  - DragDrop.ts — pointer events, ghost preview
  - Theme.ts — colors, sizing, metrics (used by canvas renderer)
  - Audio.ts — SFX manager with Capacitor Native Audio plugin integration
- state/
  - GameState.ts — immutable state shape and reducer helpers
  - Events.ts — pub/sub event bus
- utils/
  - Rect.ts, Point.ts, Easing.ts — small math/helpers
- tests/ (optional now, add with Vitest)

public/

- index.html — root shell

docs/

- GAME_PLAN.md — this document

---

## Data model (types)

- Coord: { x: number; y: number }
- Cell: 0 | 1 (or enum for color/owner)
- Board: Cell[8][8]
- PieceId: string (e.g., "T", "L3")
- Piece: { id: PieceId; cells: Coord[]; size: { w: number; h: number } }
- Bag: Piece[] (length 3)
- Placement: { pieceId; origin: Coord }
- ClearResult: { clearedRows: number[]; clearedCols: number[] }
- ScoreState: { score: number; best: number; combo: number }
- GameState: { board; bag; holdingPiece?: Piece; score; rngSeed; settings }

---

## Core algorithms

Fit check

- For each cell in piece.cells, translate to board with origin; ensure in‑bounds and empty.

Clear detection

- After placement, scan rows 0–7 and cols 0–7; if every cell occupied → mark for clear.
- Apply clears; return indices for scoring and animation.

Bag generation

- Randomly sample from PieceSet with weights (smaller shapes slightly more common).
- Constraint pass to avoid triple large pieces.

Game over

- For each piece in bag, scan all board origins until a legal fit is found. If none found for all three, end.

---

## Engineering delivery checklists

Project setup

- [x] Remove starter template code not used (e.g., `counter.ts`).
- [x] Add folders per structure above.
- [x] Decide Canvas metrics (tile size, padding, tray area).
- [x] Add basic theme variables.

Canvas metrics (baseline)

- Board: 8×8, tile 44 px, gap 2 px, padding 12 px.
- Tray: height 96 px, piece spacing 12 px.
- Canvas: width 480 px, height 576 px (board 480 + tray 96), DPR aware scaling.

Theme tokens (Material-inspired)

- Colors: background #F8F9FB, surface #FFFFFF, surfaceVariant #F1F3F5, primary #6750A4, secondary #03DAC6, outline #D0D5DD, onBackground/onSurface #1D2939; ghost valid rgba(99,102,241,.35), ghost invalid rgba(239,68,68,.35).
- Spacing: 4, 8, 12, 16, 24.
- Radius: 6, 10, 14.
- Elevation: card and pop shadows defined.
- Typography: Inter/system with sizes 12/14/18 and weights 400/500/700.

Implementation notes

- `src/ui/Theme.ts` exports `lightTheme`, `darkTheme`, and `metrics` (see above). Contrast improved for legibility.
- `src/ui/Renderer.ts` sizes canvas to the board area only (board + padding), centers in stage, and draws a higher‑contrast grid using `colors.outline`.
- Material UI: Using Material Web components via `<script type="module" src="@material/web/all.js">` in `index.html`; HUD includes an `md-filled-button` placeholder.

Core logic

- [ ] Implement `Types.ts`, `Random.ts`, `PieceSet.ts`.
- [ ] Implement `Board.ts` with get/set and clone.
- [ ] Implement `Fit.ts` (bounds + collision checks).
- [ ] Implement `Bag.ts` with constraints.
- [ ] Implement `Scoring.ts` (tile, clear, combo, bag bonuses).
- [ ] Implement `Game.ts` (state reducer style updates).
- [ ] Implement `Storage.ts` (snapshot + best score).

UI

- [ ] Implement `Renderer.ts` (board, ghost, pieces, clears).
- [ ] Implement `Tray.ts` (3 pieces, drag handles).
- [ ] Implement `Hud.ts` (score, best, new game button).
- 2025-08-29: UI components — introduced `src/components/Board.ts` and `src/components/Tray.ts` and wired Material Web components. Board/tray sized from metrics to stay aligned.
- 2025-08-29: React + MUI migration — restructured to React with Material-UI, created App.tsx, main.tsx, and reactive BoardRenderer using Material Paper components instead of canvas. Improved componentization and Material Design consistency.
- [ ] Implement `DragDrop.ts` (pointer events, snap, cancel).
- [ ] Wire `main.ts` to init state, subscribe to events, render on updates.

Polish

- [ ] Add animations (ease in/out, burst on clear).
- ✅ Add SFX (place, invalid, clear, bag complete), mute toggle - Implemented native audio engine.
- [ ] Add settings (rotation on/off, reduced motion, high contrast).
- [ ] Add undo (one‑step) if rules allow.

Persistence & resilience

- [ ] Auto‑save on every placement and bag refresh.
- [ ] Load snapshot on boot; clear if incompatible version.

Testing (lightweight)

- [ ] Unit: fit checks (in‑bounds/out‑of‑bounds/overlap).
- [ ] Unit: clear detection with multi‑line cases.
- [ ] Unit: bag constraints (no triple large).
- [ ] Unit: scoring math and combo multiplier.
- [ ] Integration: game over detection on near‑full boards.

Performance

- [ ] Frame budget ≤ 16 ms on mid‑range devices.
- [ ] Avoid GC spikes: reuse arrays/objects where feasible.
- [ ] Batch canvas draws; avoid reflow.

Release

- [ ] Basic favicon/app icon.
- [ ] Mobile touch targets ≥ 44 px.
- [ ] PWA (optional): offline play + install prompt.

---

## QA scenarios (happy path + edge cases)

Happy path

- [ ] Place small piece; no clear; score increments by tiles.
- [ ] Place piece completing one row; row clears; bonus applied.
- [ ] Place piece that completes a row and a column; combo bonus applied once with multiplier.
- [ ] Place all 3 pieces; bag bonus applied and new bag arrives.

Edges

- [ ] Drag over edge: ghost shows invalid, drop snaps back.
- [ ] Overlap with existing tile: invalid.
- [ ] Multiple clears at once: correct rows/cols cleared and score adds once per line with combo bonus.
- [ ] Full board with no fits: game over banner.
- [ ] Refresh mid‑game: state restored.
- [x] Game over with line clearing: With 2 pieces left, one opaque (can't fit), placing the other clears lines making space for opaque piece - game should continue, not end prematurely.

Accessibility

- [ ] High‑contrast theme toggles colors of occupied/ghost cells.
- [ ] Reduced motion removes shake and lowers animation duration.

---

## Extra features (fun add‑ons)

- Daily challenge with shared seed and medal tiers.
- Missions: "Clear 3 columns in a row", "Place 5 L pieces".
- Power‑ups: swap a piece, destroy a 3×3 area, rotate once per bag.
- Combo meter visuals and fireworks for big clears.
- ✅ Confetti celebration effects - Implemented with tsparticles library for line clear celebrations
- Themes/skins: neon, pastel, retro; unlock via milestones.
- Achievements and shareable end‑card image.
- Local leaderboard; optional online leaderboard.
- Hints: highlight a random valid spot (with score penalty).
- Zen mode (no score, endless) and Hardcore (larger pieces, fewer singles).

---

## Definition of Done

- All MVP checklist items complete; QA scenarios passing.
- No console errors; performance within frame budget.
- Persist/resume works; scores feel fair; UX intuitive on mouse and touch.
- Documented rules and settings in README.

---

## Changelog

Keep a concise log of plan-impacting changes. Newest first.

- 2025-08-31: Enhanced confetti system with official bundle — replaced custom tsparticles configuration with official @tsparticles/confetti bundle for better visual effects and reliability. Confetti now uses realistic physics with proper shapes, colors, and multiple burst patterns for multi-line clears. Updated implementation to use the confetti() function directly instead of complex particle configurations. Files: `src/game/ConfettiEngine.ts`. Status: Confetti effects now working properly with attractive visual feedback for line clears.
- 2025-08-30: Critical game over bug fix — fixed premature game over when line clearing would make space for remaining pieces. The bug occurred when: (1) only 2 pieces left in bag, (2) one piece appears opaque (can't fit current board), (3) placing the other piece clears lines making space for the opaque piece. Previously, game over check happened immediately before line clearing, causing false game over. Now game over check is deferred until after line clearing completes, ensuring pieces that become placeable after clearing are properly considered. Added comprehensive test scenario in `src/test/gameOverBugTest.ts` and manual testing helpers in `src/test/manualTestHelper.ts`. Enhanced useGameState hook with effect to re-evaluate game over condition whenever board/bag changes (not during animations). Files: `src/hooks/useGameState.ts`, `src/test/gameOverBugTest.ts`, `src/test/manualTestHelper.ts`, `src/App.tsx`. Status: Game over logic now correctly handles line clearing scenarios.
- 2025-08-30: Sequential line clear animation implemented — added visually appealing wave-effect line clearing with sequential delays. Cells in clearing lines now animate from left-to-right (rows) or top-to-bottom (columns) with 50ms delays between each cell. Animation includes scale and fade effects with proper fill-mode to prevent visual glitches. Enhanced GameEngine with separated detection/clearing phases, updated animation state to include per-cell delays, and refined cell styling for transparent backgrounds with grey board container. Files: `src/game/GameEngine.ts`, `src/hooks/useGameState.ts`, `src/ui/BoardRenderer.tsx`, `src/components/BrickCell.tsx`. Status: Polished line clearing experience with smooth sequential animations.
- 2025-08-30: Brick image system implemented — replaced generic colored cells with configurable brick images. Created BrickCell component supporting both image-based bricks (like brick_red.png) and fallback colored bricks. Updated board rendering to use reduced gaps (1px mobile, 2px tablet, 3px desktop) and removed borders for cleaner appearance. Updated draggable pieces to use same BrickCell component for visual consistency. Flexible brick type system allows easy addition of new brick colors/images. Files: `src/components/BrickCell.tsx`, `src/ui/BoardRenderer.tsx`, `src/components/DraggablePiece.tsx`. Status: Visual enhancement complete, game now uses brick images instead of generic colors.
- 2025-01-01: Critical performance and compatibility fixes — resolved multiple critical issues discovered during testing: (1) Fixed piece weight system where MONO pieces generated despite 0.0 weight by replacing || with ?? nullish coalescing operator; (2) Eliminated severe performance regression where bag regeneration occurred on every drag movement by implementing lazy ref initialization in useGameState hook; (3) Restored Android touch dragging functionality with hardware acceleration (translateZ, willChange properties); (4) Implemented pixel-level drag granularity optimization with DRAG_GRANULARITY_PX constant; (5) Eliminated repeated emotion CSS object creation by replacing Material-UI Box/Paper with static div styling. All changes tested and committed with conventional commit messages. Files: `src/game/Bag.ts`, `src/hooks/useGameState.ts`, `src/components/DraggablePiece.tsx`. Status: All critical issues resolved, game performance restored.
- 2025-08-30: Enhanced responsive design for larger screens — significantly increased board size for tablets and desktop. Board now scales from 500px (mobile) to 950px+ (large screens) with proportionally larger tiles and gaps. Tablet screens (768px-1200px) get 45-95px tiles vs 28-65px on mobile, and desktop gets 55-110px tiles. Updated App.tsx container constraints to accommodate larger boards. Files: `src/ui/BoardRenderer.tsx`, `src/App.tsx`, `src/components/Tray.tsx`. Status: Much better iPad and desktop experience with appropriately sized game elements.
- 2025-08-30: Visual feedback for invalid pieces — implemented tray piece opacity feedback where pieces become 30% opaque when they cannot fit anywhere on the current board state. This provides immediate visual cues to help players identify which pieces are placeable without having to test drag each one. Enhanced DraggablePiece component to accept `canFitOnBoard` prop and updated Tray component with board validation logic using GameEngine's placement rules. Files: `src/components/DraggablePiece.tsx`, `src/components/Tray.tsx`, `src/App.tsx`. Status: Clear visual feedback system for piece placement viability.
- 2025-08-30: Critical line clearing bug fix — fixed issue where intersecting row/column clears would only clear one of them instead of both. The problem was that rows were cleared immediately after detection, which affected column detection for intersecting cells. Now all complete rows and columns are detected first, then cleared separately, ensuring both intersecting lines are properly cleared. Files: `src/game/GameEngine.ts`. Status: Line clearing now works correctly for all intersection cases.
- 2025-08-30: UI layout improvements — centered board and tray vertically on screen by replacing CSS Grid with flexbox layout and adding flexible spacers. The tray is now positioned close to the board with minimal spacing while maintaining proper safe area support. Files: `src/App.tsx`. Status: Improved visual layout with better spacing.
- 2025-08-30: Cross-platform sound engine fix — completely rewrote sound loading strategy to work on both web and Android. Removed complex dual-path configuration in favor of simple platform-detected asset path prefix: `/sounds/` for web, `public/sounds/` for Android. The system now uses a single sound configuration with relative filenames, dynamically prefixed based on platform detection. Uses `isUrl: false` for Android native bundled assets and `isUrl: true` for web URL-based loading. Files: `src/game/SoundEngine.ts`. Status: Cross-platform sound solution ready for testing.
- 2025-08-29: Sound engine with variations — enhanced Capacitor Native Audio integration to support multiple sound variations per effect. Piece placement now randomly selects from 3 different sound files (piece_place_1.wav, piece_place_2.wav, piece_place_3.wav) for dynamic audio variety. Updated SoundEngine.ts to handle both single sounds and sound arrays with automatic random selection. System easily extensible to add variations for other sound effects. Files: `src/game/SoundEngine.ts`, `src/assets/sounds/README.md`. Status: Advanced sound system with variation support, still troubleshooting asset loading.
- 2025-08-29: Code architecture refactoring — extracted business logic from App.tsx into dedicated custom hooks. Created `useGameState` for game state management, `useDragDropEvents` for event handling, and `useGameLogic` to coordinate between them. App.tsx is now much cleaner, focusing only on layout and component composition. Files: `src/hooks/useGameState.ts`, `src/hooks/useDragDropEvents.ts`, `src/hooks/useGameLogic.ts`, `src/App.tsx`. Status: Improved code organization and maintainability with separation of concerns.

## Changelog

Keep a concise log of plan-impacting changes. Newest first.

- 2025-08-29: Game over detection and dialog implemented — added complete deadlock detection when no pieces in the tray can fit anywhere on the board. Created polished GameOverDialog component with score display, new best score celebration, and New Game button. Enhanced GameEngine with `isGameOver()` and `canPieceFitAnywhere()` methods. Updated state management to use Capacitor Preferences for persistent best score storage. Files: `src/game/GameEngine.ts`, `src/components/GameOverDialog.tsx`, `src/hooks/useGameState.ts`, `src/hooks/useGameLogic.ts`, `src/App.tsx`, `src/utils/storage.ts`. Status: Complete game loop with proper end condition and restart functionality.
- 2025-08-29: Code refactoring for maintainability — extracted game logic from `src/App.tsx` into dedicated hooks: `useGameState` for state management, `useGameLogic` for coordinating game logic, and `useDragDropEvents` for event handling. Dramatically simplified App.tsx to focus only on layout and component composition. Enhanced separation of concerns with proper state flow. Files: `src/hooks/useGameState.ts`, `src/hooks/useGameLogic.ts`, `src/hooks/useDragDropEvents.ts`, `src/App.tsx`. Status: Clean, maintainable codebase with proper separation of concerns.

## Changelog

Keep a concise log of plan-impacting changes. Newest first.

- 2025-08-29: Expanded piece library with larger pieces — added Pentomino I (5 cells), Hexomino 3x2 (6 cells), Big L 3x3 (5 cells), and Big Block 3x3 (9 cells). Updated bag generation constraints to prevent multiple huge pieces in same bag. Piece orientation is NOT randomized - pieces spawn in fixed orientations for consistent gameplay. Files: `src/game/PieceSet.ts`, `src/game/Bag.ts`. Status: More challenging gameplay with larger strategic pieces.
- 2025-08-29: UI polish and bug fixes — fixed GameOverDialog HTML nesting error (h2 in h2), increased DraggablePiece hitboxes for better touch interaction, improved Board centering. Fixed TypeScript errors in Bag.ts for null piece handling. Files: `src/components/GameOverDialog.tsx`, `src/components/DraggablePiece.tsx`, `src/components/Board.tsx`, `src/game/Bag.ts`. Status: Better user experience with polished interactions.
- 2025-08-29: Game over functionality completed — implemented complete game over detection when no pieces can fit on board, added GameOverDialog component with score display and new game option, integrated Capacitor Preferences for best score persistence. Fixed critical null pointer bug in game over detection by updating Bag type to allow null values and adding proper null checks in GameEngine. Files: `src/game/GameEngine.ts`, `src/game/Types.ts`, `src/components/GameOverDialog.tsx`, `src/hooks/useGameState.ts`, `src/hooks/useGameLogic.ts`, `src/App.tsx`, `src/utils/storage.ts`. Status: Core game loop complete with proper game over handling.
- 2025-08-29: Code refactoring for maintainability — extracted game logic from App.tsx into dedicated hooks (useGameState, useGameLogic, useDragDropEvents) for better separation of concerns and testability. App.tsx now focuses only on layout and component composition. Files: `src/App.tsx`, `src/hooks/useGameState.ts`, `src/hooks/useGameLogic.ts`, `src/hooks/useDragDropEvents.ts`. Status: Cleaner, more maintainable codebase structure.
- 2025-08-30: Critical performance fix — resolved massive performance issue where BagManager was being recreated on every render/drag movement, causing hundreds of unnecessary bag generations. Fixed useGameState hook to use proper lazy initialization of refs with nullish coalescing operator to prevent recreation. Also completed MONO piece weight fix. Files: `src/hooks/useGameState.ts`, `src/game/Bag.ts`. Status: Game now performs correctly with bags only generated when actually needed (bag completion or new game).
- 2025-08-30: Touch drag fix — fixed Android and mobile touch dragging where pieces would disappear during drag operations. Added hardware acceleration with translateZ(0) and willChange transform properties, improved position update timing, and removed throttle blocking on touch events. Cleaned up debug overlays and logging. Files: `src/components/DraggablePiece.tsx`. Status: Touch dragging now works reliably on Android and web mobile.
- 2025-08-30: Drag performance optimization — added pixel-level drag granularity (1px minimum movement) to reduce unnecessary updates and replaced all Material-UI Box/Paper components with plain div elements and CSS objects to eliminate repeated emotion object generation. Added DRAG_GRANULARITY_PX constant for configurable granularity. Files: `src/components/DraggablePiece.tsx`. Status: Significantly reduced drag operation overhead and emotion re-renders.
- 2025-08-29: Line completion and clearing implemented — added full line/column clearing logic with ghost preview showing which lines would be completed (orange/yellow highlighting). Fixed critical bug where GameEngine's internal board state wasn't synced with UI state during piece placement. New Game button now fully functional and clears the board. Enhanced scoring system with +100 points per cleared line. Files: `src/game/GameEngine.ts`, `src/App.tsx`, `src/components/Board.tsx`, `src/ui/BoardRenderer.tsx`, `src/components/Hud.tsx`. Status: Core game mechanics complete with working line clearing and visual feedback.
- 2025-08-29: UI polish improvements — fixed piece selection border persistence by reducing drag opacity from 0.3 to 0.5, changed ghost appearance from dotted border to subtle colored background (green/red with 30% transparency), and made empty tray slots more subtle with light background instead of dashed border. Files: `src/components/DraggablePiece.tsx`, `src/ui/BoardRenderer.tsx`, `src/components/Tray.tsx`. Status: Cleaner visual feedback with less intrusive ghost preview and selection states.
- 2025-08-29: Edge-to-edge safe area success — implemented capacitor-community/safe-area plugin with transparent system bars and edge-to-edge display. Added configuration-based setup, native platform detection, and proper CSS variable usage. Removed debug displays and added HUD top padding. Files: `capacitor.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/components/Hud.tsx`, `index.html`. Status: Working edge-to-edge safe area implementation with transparent system bars.
- 2025-08-29: Safe area cleanup — reverted to default CSS env() safe area variables, removed plugin-based initialization from main.tsx and debug displays from Hud.tsx. Simplified approach for better compatibility. Files: `src/main.tsx`, `src/App.tsx`, `src/components/Hud.tsx`. Status: Clean safe area implementation with standard CSS env() variables.
- 2025-08-29: TypeScript fixes — corrected getBoardMetrics function calls in BoardRenderer.tsx, removed unused containerWidth state. Function signature simplified to only take isMobile parameter. Files: `src/ui/BoardRenderer.tsx`. Status: Build errors resolved.
- 2025-08-29: Major simplification — replaced complex coordinate math with direct cell detection. Ghost positioning now uses `elementFromPoint` to find board cells under piece centers, eliminating all responsive metric calculations. Added responsive board sizing and mobile safe areas. Files: `src/components/DraggablePiece.tsx`, `src/App.tsx`, `src/ui/BoardRenderer.tsx`. Status: Ghost positioning 100% accurate, fully responsive, much simpler codebase.
- 2025-08-29: Drag UX improvements — fixed visual drag offset (piece appears above touch point) and alignment between ghost preview and actual positioning. Updated hover/drop calculations to account for visual piece position rather than raw cursor position. Files: `src/components/DraggablePiece.tsx`. Status: Enhanced drag visibility and fixed ghost positioning accuracy.
- 2025-08-29: Repo setup — initial GAME_PLAN authored with rules, architecture, file org, checklists, QA, and extras.
- 2025-08-29: Project setup — removed Vite demo, added folders, theme tokens, and canvas metrics; stubbed renderer and app shell. Files: `src/ui/Theme.ts`, `src/ui/Renderer.ts`, updated `src/main.ts`, `src/style.css`, `index.html`. Checklist: Project setup items marked done.
