import React, { useState, useEffect } from "react";
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
import { getTextStyleByCategory } from "../styles/textStyles";
import { AnimatedNumber } from "./AnimatedNumber";

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
  const [animationStarted, setAnimationStarted] = useState(false);

  // Trigger animation when dialog opens
  useEffect(() => {
    if (open && !animationStarted) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => setAnimationStarted(true), 100);
      return () => clearTimeout(timer);
    } else if (!open) {
      setAnimationStarted(false);
    }
  }, [open, animationStarted]);

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
          overflow: "hidden",
          borderRadius: 0.5,
          bgcolor: "white",
          p: 1,
          boxShadow: isNewBest
            ? "0 0 32px 8px rgba(23, 116, 230, 0.5), 0 0 64px 16px rgba(26, 41, 94, 0.3)"
            : "0 0 32px 8px rgba(244, 67, 54, 0.7), 0 0 64px 16px rgba(198, 40, 40, 0.4)",
          position: "relative",
          "&::before": isNewBest
            ? {
                content: '""',
                position: "absolute",
                inset: 0,
                zIndex: 0,
                background:
                  "conic-gradient(from 0deg, red, orange, yellow, green, cyan, blue, violet, red)",
                animation: "spinConic 6s linear infinite",
                transformOrigin: "center center",
                transform: "scale(2)",
                "@keyframes spinConic": {
                  "0%": { transform: "scale(2) rotate(0deg)" },
                  "100%": { transform: "scale(2) rotate(360deg)" },
                  opacity: 0.6,
                },
              }
            : {
                content: '""',
                position: "absolute",
                inset: 0,
                zIndex: 0,
                background:
                  "radial-gradient(circle, rgba(244, 67, 54, 0.8) 0%, rgba(198, 40, 40, 0.4) 100%)",
                animation: "redGlow 2s ease-in-out infinite alternate",
                "@keyframes redGlow": {
                  "0%": { opacity: 0.6, transform: "scale(1)" },
                  "100%": { opacity: 0.9, transform: "scale(1.02)" },
                },
              },
        },
      }}
    >
      <Box
        sx={{
          py: 1,
          position: "relative",
          overflow: "hidden",
          borderRadius: 0.5,
          background: isNewBest
            ? "radial-gradient(circle, #1774e6ff 0%, #1a295eff 70%, #0a112fff 100%)"
            : "radial-gradient(circle, #2c1810 0%, #1a0d0a 70%, #0f0605 100%)",
          zIndex: 1,
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", pb: 2, position: "relative", zIndex: 2 }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              ...(isNewBest
                ? getTextStyleByCategory("rainbow")
                : getTextStyleByCategory("red")),
              fontSize: "10vw",
              textAlign: "center",
            }}
          >
            Game Over
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            textAlign: "center",
            py: 2,
            position: "relative",
            zIndex: 2,
            overflow: "hidden",
          }}
        >
          <Paper
            sx={{
              py: 3,
              bgcolor: "transparent",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              color="white"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              {isNewBest ? "New Best Score!" : "Score"}
            </Typography>

            <AnimatedNumber
              duration={1200}
              value={animationStarted ? score : 0}
              sx={{
                ...(isNewBest
                  ? getTextStyleByCategory("fire")
                  : getTextStyleByCategory("red")),
                fontSize: "2.5rem",
                textAlign: "center",
                mb: 3,
              }}
            />

            {!isNewBest && (
              <>
                <Typography variant="body2" color="white" sx={{ mb: 1 }}>
                  Best Score
                </Typography>
                <AnimatedNumber
                  value={bestScore}
                  sx={{
                    fontSize: "1.2rem",
                    textAlign: "center",
                    color: "secondary.main",
                  }}
                />
              </>
            )}
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 3,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleNewGame}
            size="large"
            sx={{
              minWidth: 160,
              height: 56,
              borderRadius: 2,
              background:
                "linear-gradient(45deg, #ff6b6b 0%, #ff8e8e 50%, #ffb3b3 100%)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              boxShadow:
                "0 4px 15px rgba(255, 107, 107, 0.4), 0 2px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                background:
                  "linear-gradient(45deg, #ff5252 0%, #ff7676 50%, #ff9999 100%)",
                transform: "translateY(-2px) scale(1.05)",
                boxShadow:
                  "0 6px 20px rgba(255, 107, 107, 0.6), 0 4px 12px rgba(0,0,0,0.3)",
              },
              "&:active": {
                transform: "translateY(0px) scale(0.98)",
              },
            }}
          >
            🎮 Play Again
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
