import { ThemeProvider, CssBaseline, Box, Container } from "@mui/material";
import { getLightTheme } from "./theme";
import { Board } from "./components/Board";
import { Tray } from "./components/Tray";
import { Hud } from "./components/Hud";
import { GameOverDialog } from "./components/GameOverDialog";
import { useGameLogic } from "./hooks/useGameLogic";
import "./colors.css";

function App() {
  const theme = getLightTheme();

  const {
    board,
    bag,
    score,
    bestScore,
    ghostPosition,
    isGameOver,
    draggedPiece,
    handleNewGame,
    onPieceDragStart,
    onPieceDragEnd,
  } = useGameLogic();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
          // Safe area support using capacitor-community/safe-area CSS variables
          paddingTop: "var(--safe-area-inset-top)",
          paddingBottom: "var(--safe-area-inset-bottom)",
          paddingLeft: "var(--safe-area-inset-left)",
          paddingRight: "var(--safe-area-inset-right)",
        }}
      >
        <Hud score={score} bestScore={bestScore} onNewGame={handleNewGame} />

        {/* Flexible spacer to center content vertically */}
        <Box sx={{ flex: 1 }} />

        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 1, // Reduced padding for mobile
            width: "100%",
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
              justifyContent: "center", // Center the board within the box
            }}
          >
            <Board board={board} ghostPosition={ghostPosition} />
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
