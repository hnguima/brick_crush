// FloatingScore component: Shows animated score numbers floating up from board
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export interface FloatingScoreItem {
  id: string;
  points: number;
  x: number; // Position relative to board container (0-100%)
  y: number; // Position relative to board container (0-100%)
  timestamp: number;
}

interface FloatingScoreProps {
  scores: FloatingScoreItem[];
  onScoreComplete?: (id: string) => void;
}

// Defined sx objects for each score category
const baseScoreSx = {
  fontFamily: "'Bungee', 'Arial Black', sans-serif", // Use Bungee font with fallbacks
  fontWeight: "normal", // Bungee is already bold by design
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)", // Strong shadow for visibility
};

// Subtle score: <100 points - simple white/gray
const subtleScoreSx = {
  ...baseScoreSx,
  color: "#e0e0e0",
  WebkitTextStroke: "1px rgba(255,255,255,0.8)",
  fontSize: "1.6rem",
};

// Basic score: 100-249 points - simple colored
const basicScoreSx = {
  ...baseScoreSx,
  color: "#4fc3f7", // Light blue
  WebkitTextStroke: "1px white",
  fontSize: "2rem",
};

// Good score: 250-499 points - green gradient
const goodScoreSx = {
  ...baseScoreSx,
  background:
    "linear-gradient(90deg, #4caf50 0%, #81c784 25%, #a5d6a7 50%, #66bb6a 75%, #388e3c 100%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1px white",
  textShadow: "0 0 12px #66bb6a",
  fontSize: "2.4rem",
};

// Great score: 500-999 points - orange/red gradient with glow
const greatScoreSx = {
  ...baseScoreSx,
  background:
    "linear-gradient(90deg, #ff5722 0%, #ff7043 20%, #fff091ff 40%, #ff8a65 60%, #d84315 80%, #bf360c 100%)",
  backgroundSize: "100% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  // WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1.5px white",
  textShadow: "0 0 18px #ff7043",
  fontSize: "2.8rem",
};

// Epic score: 1000+ points - rainbow gradient with strong glow
const epicScoreSx = {
  ...baseScoreSx,
  background:
    "linear-gradient(90deg, #ff1744, #ff9100, #fff700, #00e676, #00b0ff, #8c4dff, #f500a3, #ff1744)",
  backgroundClip: "text",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  WebkitTextStroke: "2px white",
  textShadow: "0 0 30px #fff",
  fontSize: "3.2rem",
  animation: "rainbow-shift 1.2s linear infinite",
  "@keyframes rainbow-shift": {
    "0%": { backgroundPosition: "-100% 50%" },
    "100%": { backgroundPosition: "100% 50%" },
  },
};

// Helper function to get appropriate sx object and animation based on score
const getScoreStyle = (points: number) => {
  if (points >= 1000) return { sx: epicScoreSx, animation: "epic" };
  if (points >= 500) return { sx: greatScoreSx, animation: "great" };
  if (points >= 250) return { sx: goodScoreSx, animation: "good" };
  if (points >= 100) return { sx: basicScoreSx, animation: "basic" };
  return { sx: subtleScoreSx, animation: "subtle" };
};

// Animation variants for different score categories
const getAnimationKeyframes = (animationType: string) => {
  const baseKeyframes = {
    "0%": {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(0)",
    },
    "100%": {
      opacity: 0,
    },
  };

  switch (animationType) {
    case "subtle":
      return {
        ...baseKeyframes,
        "15%": { opacity: 1, transform: "translate(-50%, -55%) scale(1.2)" },
        "30%": { opacity: 1, transform: "translate(-50%, -60%) scale(1)" },
        "70%": { opacity: 1, transform: "translate(-50%, -75%) scale(1)" },
        "100%": { opacity: 0, transform: "translate(-50%, -85%) scale(0.8)" },
      };

    case "basic":
      return {
        ...baseKeyframes,
        "15%": { opacity: 1, transform: "translate(-50%, -55%) scale(1.4)" },
        "30%": { opacity: 1, transform: "translate(-50%, -60%) scale(1.1)" },
        "70%": { opacity: 1, transform: "translate(-50%, -80%) scale(1.1)" },
        "100%": { opacity: 0, transform: "translate(-50%, -90%) scale(0.7)" },
      };

    case "good":
      return {
        ...baseKeyframes,
        "10%": {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(0.5) rotate(-5deg)",
        },
        "20%": {
          opacity: 1,
          transform: "translate(-50%, -55%) scale(1.6) rotate(5deg)",
        },
        "35%": {
          opacity: 1,
          transform: "translate(-50%, -60%) scale(1.2) rotate(0deg)",
        },
        "70%": {
          opacity: 1,
          transform: "translate(-50%, -85%) scale(1.2) rotate(0deg)",
        },
        "100%": {
          opacity: 0,
          transform: "translate(-50%, -100%) scale(0.6) rotate(0deg)",
        },
      };

    case "great":
      return {
        ...baseKeyframes,
        "8%": {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(0.3) rotate(-10deg)",
        },
        "18%": {
          opacity: 1,
          transform: "translate(-50%, -52%) scale(1.8) rotate(10deg)",
        },
        "28%": {
          opacity: 1,
          transform: "translate(-50%, -58%) scale(1.3) rotate(-5deg)",
        },
        "40%": {
          opacity: 1,
          transform: "translate(-50%, -65%) scale(1.4) rotate(0deg)",
        },
        "70%": {
          opacity: 1,
          transform: "translate(-50%, -90%) scale(1.4) rotate(0deg)",
        },
        "100%": {
          opacity: 0,
          transform: "translate(-50%, -110%) scale(0.4) rotate(0deg)",
        },
      };

    case "epic":
      return {
        ...baseKeyframes,
        "5%": {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(0.2) rotate(-15deg)",
        },
        "12%": {
          opacity: 1,
          transform: "translate(-50%, -45%) scale(2.2) rotate(15deg)",
        },
        "20%": {
          opacity: 1,
          transform: "translate(-50%, -52%) scale(1.6) rotate(-8deg)",
        },
        "30%": {
          opacity: 1,
          transform: "translate(-50%, -58%) scale(1.8) rotate(8deg)",
        },
        "45%": {
          opacity: 1,
          transform: "translate(-50%, -70%) scale(1.5) rotate(0deg)",
        },
        "70%": {
          opacity: 1,
          transform: "translate(-50%, -95%) scale(1.5) rotate(0deg)",
        },
        "85%": {
          opacity: 0.8,
          transform: "translate(-50%, -105%) scale(1.2) rotate(0deg)",
        },
        "100%": {
          opacity: 0,
          transform: "translate(-50%, -120%) scale(0.3) rotate(0deg)",
        },
      };

    default:
      return baseKeyframes;
  }
};

export const FloatingScore: React.FC<FloatingScoreProps> = ({
  scores,
  onScoreComplete,
}) => {
  const [activeScores, setActiveScores] = useState<FloatingScoreItem[]>([]);

  // Helper function to remove score by id
  const removeScoreById = (scoreId: string) => {
    setActiveScores((prev) => prev.filter((s) => s.id !== scoreId));
    onScoreComplete?.(scoreId);
  };

  // Update active scores when new scores are added
  useEffect(() => {
    const existingIds = new Set(activeScores.map((s) => s.id));
    const newScores = scores.filter((score) => !existingIds.has(score.id));
    if (newScores.length > 0) {
      setActiveScores((prev) => [...prev, ...newScores]);
    }
  }, [scores, activeScores]);

  // Remove scores after animation completes
  useEffect(() => {
    if (activeScores.length === 0) return;

    const timers: NodeJS.Timeout[] = [];

    activeScores.forEach((score) => {
      const timer = setTimeout(() => removeScoreById(score.id), 1500);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [activeScores]);

  if (activeScores.length === 0) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Don't interfere with board interactions
        zIndex: 1000, // Above board but below dialogs
      }}
    >
      {activeScores.map((score) => {
        const { sx, animation } = getScoreStyle(score.points);
        const keyframes = getAnimationKeyframes(animation);

        return (
          <Box
            key={score.id}
            sx={{
              position: "absolute",
              left: `${score.x}%`,
              top: `${score.y}%`,
              // Transform to center the text on the position
              transform: "translate(-50%, -50%)",
              // Dynamic animation based on score category
              animation: `float-score-${animation} 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              [`@keyframes float-score-${animation}`]: keyframes,
            }}
          >
            <Typography variant="h6" sx={sx}>
              +{score.points}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

// Utility function to generate random positions on the board
export const generateRandomBoardPosition = () => ({
  x: 20 + Math.random() * 60, // 20%-80% to avoid edges
  y: 30 + Math.random() * 40, // 30%-70% to stay in visible board area
});

// Utility function to create a new floating score item
export const createFloatingScore = (
  points: number,
  position?: { x: number; y: number }
): FloatingScoreItem => ({
  id: `score-${Date.now()}-${Math.random()}`,
  points,
  ...(position || generateRandomBoardPosition()),
  timestamp: Date.now(),
});
