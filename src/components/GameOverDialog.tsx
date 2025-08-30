import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";

interface GameOverDialogProps {
  open: boolean;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onNewGame: () => void;
  onClose?: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  open,
  score,
  bestScore,
  isNewBest,
  onNewGame,
  onClose,
}) => {
  const handleNewGame = () => {
    onNewGame();
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          m: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>Game Over</DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No more moves available!
          </Typography>
        </Box>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: isNewBest ? "success.light" : "background.paper",
            border: isNewBest ? "2px solid" : "none",
            borderColor: isNewBest ? "success.main" : "transparent",
          }}
        >
          {isNewBest && (
            <Typography
              variant="h6"
              color="success.dark"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              🎉 New Best Score!
            </Typography>
          )}

          <Typography variant="h5" color="text.primary" gutterBottom>
            Final Score: <strong>{score}</strong>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Best Score: <strong>{bestScore}</strong>
          </Typography>
        </Paper>

        <Typography variant="body2" color="text.secondary">
          Try to clear more lines and complete piece sets for higher scores!
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewGame}
          size="large"
          sx={{ minWidth: 120 }}
        >
          New Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};
