import { ThemeProvider, CssBaseline, Box, Container } from "@mui/material";
import { getLightTheme } from "./theme";
import { Board } from "./components/Board";
import { Tray } from "./components/Tray";
import { Hud } from "./components/Hud";
import { GameOverDialog } from "./components/GameOverDialog";
import { FloatingScore } from "./components/FloatingScore";
import { ParticleBackground } from "./components/ParticleBackground";
import { useGameLogic } from "./hooks/useGameLogic";
import "./colors.css";

// Load combo meter preview in development
if (import.meta.env.DEV) {
  import("./test/comboMeterPreview");
}

// Import test helpers for development (only in dev mode)
if (import.meta.env.DEV) {
  import("./test/manualTestHelper");
  import("./test/gameOverBugTest").then((module) => {
    (window as any).testGameOverBug = module.testGameOverBugScenario;
  });
  import("./test/lineClearTestCases").then((module) => {
    (window as any).runLineClearTest = module.runLineClearTest;
    (window as any).runAllLineClearTests = module.runAllLineClearTests;
    (window as any).applyTestCaseToGame = module.applyTestCaseToGame;
    (window as any).allLineClearTestCases = module.allLineClearTestCases;
  });
  import("./test/hailMaryTests").then((module) => {
    (window as any).testHailMary = module.testHailMary;
    (window as any).testBagGeneration = module.testBagGeneration;
    (window as any).demonstrateHailMary = module.demonstrateHailMary;
    (window as any).triggerHailMaryScenario = module.triggerHailMaryScenario;
    (window as any).createNearlyFullBoard = module.createNearlyFullBoard;
    (window as any).createMonoOnlyBoard = module.createMonoOnlyBoard;
  });
  // Import dialog test utilities
  import("./test/dialogTest");
}

function App() {
  const theme = getLightTheme();

  const gameLogic = useGameLogic();
  const {
    board,
    imageBoard,
    bag,
    score,
    bestScore,
    ghostPosition,
    isGameOver,
    draggedPiece,
    animationState,
    combo,
    isMaxCombo,
    handleNewGame,
    handleFloatingScoreComplete,
    onPieceDragStart,
    onPieceDragEnd,
  } = gameLogic;

  // Expose game state for testing in development mode
  if (import.meta.env.DEV) {
    (window as any).gameStateSetters = {
      setBoard: (gameLogic as any).setBoard,
      setImageBoard: (gameLogic as any).setImageBoard,
      setBag: (gameLogic as any).setBag,
      setScore: (gameLogic as any).setScore,
      setBestScore: (gameLogic as any).setBestScore,
      setIsGameOver: (gameLogic as any).setIsGameOver,
    };
    (window as any).currentAnimationState = animationState;
    (window as any).gameEngineRef = (gameLogic as any).gameEngineRef;
    (window as any).bagManagerRef = (gameLogic as any).bagManagerRef;

    // Register dialog test helpers
    import("./test/dialogTest").then((module) => {
      module.registerTestDialogHelpers({
        setIsGameOver: (gameLogic as any).setIsGameOver,
        setScore: (gameLogic as any).setScore,
        setBestScore: (gameLogic as any).setBestScore,
      });
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticleBackground />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background:
            "radial-gradient(circle, #0d35b6ff 0%, #1b2445 70%, #10152b 100%)",
          bgcolor: "#1b2445f",
          // Safe area support using capacitor-community/safe-area CSS variables
          paddingTop: "var(--safe-area-inset-top)",
          paddingBottom: "var(--safe-area-inset-bottom)",
          paddingLeft: "var(--safe-area-inset-left)",
          paddingRight: "var(--safe-area-inset-right)",
        }}
      >
        {/* Particle Background - positioned below the board but above the background */}
        <ParticleBackground />

        {/* Flexible spacer to center content vertically */}
        <Box sx={{ flex: 0.5 }} />

        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 1, // Reduced padding for mobile
            width: "100%",
            position: "relative", // Needed for confetti positioning
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: {
                xs: "500px", // Mobile - increased
                sm: "600px", // Small tablets - increased
                md: "800px", // Medium tablets - increased
                lg: "950px", // Large screens - increased
                xl: "1000px", // Extra large screens - increased
              },
              minWidth: "300px", // Min board width
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative", // Position relative for floating scores
            }}
          >
            {/* Score HUD - Big box on top of board */}
            <Hud
              score={score}
              bestScore={bestScore}
              combo={combo}
              isMaxCombo={isMaxCombo}
            />

            <Board
              board={board}
              imageBoard={imageBoard}
              ghostPosition={ghostPosition}
              animationState={animationState}
            />
            <FloatingScore
              scores={animationState.floatingScores}
              onScoreComplete={handleFloatingScoreComplete}
            />
          </Box>
        </Container>

        {/* Tray section - no spacer, directly after board */}
        <Box sx={{ pt: 1 }}>
          {" "}
          {/* Small top padding between board and tray */}
          <Tray
            bag={bag}
            board={board}
            onPieceDragStart={onPieceDragStart}
            onPieceDragEnd={onPieceDragEnd}
            ghostPosition={ghostPosition}
            draggedPieceIndex={draggedPiece?.index ?? null}
          />
        </Box>

        {/* Flexible spacer to center content vertically and maintain safe area */}
        <Box sx={{ flex: 1, pb: 2 }} />
      </Box>

      {/* Game Over Dialog */}
      <GameOverDialog
        open={isGameOver}
        score={score}
        bestScore={bestScore}
        isNewBest={score > 0 && score === bestScore}
        onNewGame={handleNewGame}
      />
    </ThemeProvider>
  );
}

export default App;
