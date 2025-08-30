// HUD component: Score display and controls
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { soundEngine, SoundEffect } from "../game/SoundEngine";

interface HudProps {
  score?: number;
  bestScore?: number;
  onNewGame?: () => void;
}

export const Hud: React.FC<HudProps> = ({
  score = 0,
  bestScore = 0,
  onNewGame,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        pt: 1, // Add some top padding for better spacing with safe area
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Typography variant="body1">
            Score: <strong>{score}</strong>
          </Typography>
          <Typography variant="body1">
            Best: <strong>{bestScore}</strong>
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            soundEngine.play(SoundEffect.UI_BUTTON);
            onNewGame?.();
          }}
        >
          New Game
        </Button>
      </Toolbar>
    </AppBar>
  );
};
