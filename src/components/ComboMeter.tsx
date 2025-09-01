// ComboMeter component: Animated combo multiplier display
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";

// Inject global keyframes for
// Combo meter style variations - easily extensible
const COMBO_STYLES = {
  // Base styles shared by all combo states
  base: {
    aspectRatio: "1 / 1",
    position: "absolute",
    bottom: -10,
    right: -10,
    display: "flex",
    alignItems: "center",
    px: 0.6,
    py: 0.6,
    borderRadius: 100,
    minWidth: "40px",
    justifyContent: "center",
    overflow: "hidden",
    fontSize: "0.75rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },

  // Default combo meter (combo 2-9)
  default: {
    border: "5px solid #35e1ffff",
    bgcolor: "#1db0ffff",
    color: "white",
  },

  // Hot combo meter (combo 10-19)
  hot: {
    border: "5px solid #ff7535ff",
    bgcolor: "#f44336",
    color: "white",
    boxShadow: "0 0 6px rgba(244, 67, 54, 0.8), 0 2px 6px rgba(0,0,0,0.2)",
    animation: "pulse 0.5s ease-in-out infinite alternate",
    "@keyframes pulse": {
      from: { transform: "scale(1)" },
      to: { transform: "scale(1.1)" },
    },
  },

  // Fire combo meter (combo 20-24)
  fire: {
    border: "5px solid transparent",
    background:
      "repeating-linear-gradient(to right, #a2682a 0%, #be8c3c 8%, #be8c3c 18%, #d3b15f 27%, #faf0a0 35%, #ffffc2 40%, #faf0a0 50%, #d3b15f 58%, #be8c3c 67%, #b17b32 77%, #bb8332 83%, #d4a245 88%, #e1b453 93%, #a4692a 100%)",
    backgroundSize: "300% 300%",
    color: "white",
    overflow: "hidden",
    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
    animation:
      "golden-glow 1.5s ease-in-out infinite alternate, golden-shift 6s linear infinite, heartbeat 1s infinite",
    "@keyframes golden-glow": {
      from: {
        boxShadow:
          "0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 140, 0, 0.4), 0 2px 6px rgba(0,0,0,0.2)",
      },
      to: {
        boxShadow:
          "0 0 25px rgba(255, 215, 0, 1), 0 0 50px rgba(255, 140, 0, 0.6), 0 0 70px rgba(255, 215, 0, 0.3), 0 2px 6px rgba(0,0,0,0.2)",
      },
    },
    "@keyframes heartbeat": {
      "0%": { transform: "scale(1)" },
      "10%": { transform: "scale(1.1)" },
      "20%": { transform: "scale(1)" },
      "30%": { transform: "scale(1.15)" },
      "40%": { transform: "scale(1)" },
      "100%": { transform: "scale(1)" },
    },
    "@keyframes golden-shift": {
      "0%": { backgroundPosition: "-150% 0%" },
      "100%": { backgroundPosition: "150% 0%" },
    },
    // Diagonal shine effect for max combo
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
      // backgroundRepeat: "no-repeat",
      backgroundSize: "200% 200%",
      animation: "rainbow-shine 4s ease-in-out infinite",
      zIndex: 1,
      pointerEvents: "none",
    },
    "@keyframes rainbow-shine": {
      "0%": { backgroundPosition: "50% -50%" },
      "20%": { backgroundPosition: "-50% 50%" },
      "100%": { backgroundPosition: "-50% 50%" },
    },
  },

  // Max combo meter (combo 25)
  max: {
    border: "5px solid transparent",
    background:
      "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)",
    backgroundSize: "400% 400%",
    color: "white",
    overflow: "hidden",
    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
    animation: "rainbow-shift 10s linear infinite, heartbeat 0.5s infinite",
    "@keyframes heartbeat": {
      "0%": { transform: "scale(1)" },
      "20%": { transform: "scale(1.1)" },
      "40%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.15)" },
      "70%": { transform: "scale(1)" },
      "100%": { transform: "scale(1)" },
    },
    "@keyframes rainbow-shift": {
      "0%": { backgroundPosition: "-200% 200%" },
      // "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "200% 200%" },
    }, // Add shine effect directly in the style
    // Diagonal shine effect for max combo
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
      // backgroundRepeat: "no-repeat",
      backgroundSize: "200% 200%",
      animation: "rainbow-shine 3s ease-in-out infinite",
      zIndex: 1,
      pointerEvents: "none",
    },
    "@keyframes rainbow-shine": {
      "0%": { backgroundPosition: "50% -50%" },
      "20%": { backgroundPosition: "-50% 50%" },
      "100%": { backgroundPosition: "-50% 50%" },
    },
  },

  // Cooling combo meter (when combo decreases - future use)
  cooling: {
    border: "5px solid #2196f3",
    bgcolor: "#2196f3",
    color: "white",
    opacity: 0.8,
    animation: "fade 2s ease-in-out infinite alternate",
    "@keyframes fade": {
      from: { opacity: 0.8 },
      to: { opacity: 0.6 },
    },
  },
} as const;

// Animation definitions for combo state changes
const COMBO_ANIMATIONS = {
  entrance: {
    animation: "comboEntrance 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    "@keyframes comboEntrance": {
      from: {
        transform: "scale(0) rotate(180deg)",
        opacity: 0,
      },
      to: {
        transform: "scale(1) rotate(0deg)",
        opacity: 1,
      },
    },
  },
  exit: {
    animation: "comboExit 0.3s ease-in",
    "@keyframes comboExit": {
      from: {
        transform: "scale(1) rotate(0deg)",
        opacity: 1,
      },
      to: {
        transform: "scale(0) rotate(-180deg)",
        opacity: 0,
      },
    },
  },
  flip: {
    animation: "comboFlip 0.5s ease-in-out",
    "@keyframes comboFlip": {
      "0%": { transform: "rotateY(0deg)" },
      "50%": { transform: "rotateY(90deg) scale(1.1)" },
      "100%": { transform: "rotateY(0deg)" },
    },
  },
} as const;

// Helper function to get combo style based on combo value
const getComboStyle = (combo: number, isMaxCombo: boolean) => {
  if (isMaxCombo || combo >= 25) return COMBO_STYLES.max;
  if (combo >= 20) return COMBO_STYLES.fire;
  if (combo >= 10) return COMBO_STYLES.hot;
  return COMBO_STYLES.default;
};

interface ComboMeterProps {
  combo: number;
  isMaxCombo?: boolean;
  sx?: SxProps<Theme>;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  combo,
  isMaxCombo = false,
  sx,
}) => {
  const [comboAnimation, setComboAnimation] = useState<
    keyof typeof COMBO_ANIMATIONS | null
  >(null);
  const [showCombo, setShowCombo] = useState(combo > 1);
  const previousComboRef = useRef(combo);

  // Handle combo animation effects
  useEffect(() => {
    const previousCombo = previousComboRef.current;

    if (previousCombo <= 1 && combo > 1) {
      // Combo started - entrance animation
      setShowCombo(true);
      setComboAnimation("entrance");
    } else if (previousCombo > 1 && combo <= 1) {
      // Combo ended - exit animation (keep showing during exit)
      setComboAnimation("exit");
      // Hide after exit animation completes
      setTimeout(() => {
        setShowCombo(false);
        setComboAnimation(null);
      }, 300);
    } else if (previousCombo > 1 && combo > previousCombo) {
      // Combo increased - flip animation
      setComboAnimation("flip");
    }

    // Clear animation after it completes (but keep showing combo)
    if (
      combo > 1 &&
      (comboAnimation === "entrance" || comboAnimation === "flip")
    ) {
      setTimeout(
        () => {
          setComboAnimation(null);
        },
        comboAnimation === "entrance" ? 400 : 500
      );
    }

    previousComboRef.current = combo;
  }, [combo, comboAnimation]);

  if (!showCombo) {
    return null;
  }

  const displayCombo = combo > 1 ? combo : previousComboRef.current;

  return (
    <Box
      sx={{
        ...COMBO_STYLES.base,
        ...getComboStyle(displayCombo, isMaxCombo),
        // Add entrance/exit/flip animations based on state
        ...(comboAnimation === "entrance" && {
          ...COMBO_ANIMATIONS.entrance,
        }),
        ...(comboAnimation === "exit" && {
          ...COMBO_ANIMATIONS.exit,
        }),
        ...(comboAnimation === "flip" && {
          ...COMBO_ANIMATIONS.flip,
        }),
        // Apply any custom sx props
        ...sx,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: "bold",
          position: "relative",
          zIndex: 2, // Higher z-index to stay above shine effect
        }}
      >
        {displayCombo}x
      </Typography>
    </Box>
  );
};
