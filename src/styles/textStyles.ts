// Centralized text style definitions
import type { SxProps, Theme } from "@mui/material/styles";

export const bgShiftAnimation: SxProps<Theme> = {
  "@keyframes bg-shift": {
    "0%": { backgroundPosition: "-100% 50%" },
    "100%": { backgroundPosition: "100% 50%" },
  },
};
export const trembleTextAnimation: SxProps<Theme> = {
  "@keyframes tremble": {
    "0%": { transform: "translate(0px, 0px)" },
    "20%": { transform: "translate(-1px, 1px)" },
    "40%": { transform: "translate(-1px, -1px)" },
    "60%": { transform: "translate(1px, 1px)" },
    "80%": { transform: "translate(1px, -1px)" },
    "100%": { transform: "translate(0px, 0px)" },
  },
};

export const heartbeatTextAnimation: SxProps<Theme> = {
  "@keyframes heartbeat": {
    "0%": { transform: "scale(1)" },
    "7%": { transform: "scale(1.03)" },
    "14%": { transform: "scale(1)" },
    "21%": { transform: "scale(1.03)" },
    "28%": { transform: "scale(1)" },
    "100%": { transform: "scale(1)" },
  },
};
// Base style for all game text
const baseTextSx: SxProps<Theme> = {
  fontFamily: "'Bungee', 'Arial Black', sans-serif",
  fontWeight: "normal", // Bungee is already bold by design
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
};

// Simple colored text styles
export const simpleTextSx: SxProps<Theme> = {
  ...baseTextSx,
  color: "#6bdfffff",
};

export const subtleTextSx: SxProps<Theme> = {
  ...baseTextSx,
  color: "#e0e0e0",
  WebkitTextStroke: "2px rgba(255,255,255,0.8)",
};

export const basicTextSx: SxProps<Theme> = {
  ...baseTextSx,
  color: "#4fc3f7", // Light blue
  WebkitTextStroke: "2px white",
};

// Gradient text styles
export const greenGradientTextSx: SxProps<Theme> = {
  ...baseTextSx,
  background:
    "linear-gradient(90deg, #4caf50 0%, #81c784 25%, #a5d6a7 50%, #66bb6a 75%, #388e3c 100%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "2px white",
  textShadow: "0 0 12px #66bb6a",
};

export const fireGradientTextSx: SxProps<Theme> = {
  ...baseTextSx,
  background:
    "linear-gradient(90deg, #bf360c 0%, #ff7043 20%, #fff091ff 40%, #ff8a65 60%, #d84315 80%, #bf360c 100%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextStroke: "2px white",
  textShadow: "0 0 18px #ff7043",
  animation: "bg-shift 1.2s linear infinite",
  ...bgShiftAnimation,
};

export const redGradientTextSx: SxProps<Theme> = {
  ...baseTextSx,
  background:
    "linear-gradient(90deg, #d32f2f 0%, #f44336 25%, #ff5722 50%, #e53935 75%, #c62828 100%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "2px white",
  textShadow: "0 0 20px #f44336",
  animation:
    "bg-shift 1.5s linear infinite, heartbeat 1.5s ease-in-out infinite",
  ...bgShiftAnimation,
  ...heartbeatTextAnimation,
};

// Animated rainbow gradient text
export const rainbowGradientTextSx: SxProps<Theme> = {
  ...baseTextSx,
  background:
    "linear-gradient(90deg, #ff1744, #ff9100, #fff700, #00e676, #00b0ff, #8c4dff, #f500a3, #ff1744)",
  backgroundClip: "text",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  WebkitTextStroke: "2px white",
  textShadow: "0 0 30px #fff",
  animation: "bg-shift 1.2s linear infinite, tremble 0.18s infinite linear",
  ...bgShiftAnimation,
  ...trembleTextAnimation,
};

// Helper function to get text style based on score/context
export const getTextStyleByScore = (points: number): SxProps<Theme> => {
  if (points >= 1000) return rainbowGradientTextSx;
  if (points >= 500) return fireGradientTextSx;
  if (points >= 250) return greenGradientTextSx;
  if (points >= 100) return basicTextSx;
  return subtleTextSx;
};

// Helper function to get text style by category name
export const getTextStyleByCategory = (
  category: "simple" | "subtle" | "basic" | "green" | "fire" | "red" | "rainbow"
): SxProps<Theme> => {
  switch (category) {
    case "simple":
      return simpleTextSx;
    case "subtle":
      return subtleTextSx;
    case "basic":
      return basicTextSx;
    case "green":
      return greenGradientTextSx;
    case "fire":
      return fireGradientTextSx;
    case "red":
      return redGradientTextSx;
    case "rainbow":
      return rainbowGradientTextSx;
    default:
      return simpleTextSx;
  }
};

// Helper function to get text style based on combo value
export const getTextStyleByCombo = (combo: number): SxProps<Theme> => {
  if (combo >= 25) return rainbowGradientTextSx; // Max combo - rainbow
  if (combo >= 20) return fireGradientTextSx; // Fire combo 20-24
  if (combo >= 10) return greenGradientTextSx; // Green combo 10-19
  return basicTextSx; // Simple combo 1-9
};
