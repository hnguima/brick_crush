// HUD component: Score display and controls
import React from "react";
import { Box, Typography } from "@mui/material";
import { AnimatedNumber } from "./AnimatedNumber";
import { ComboMeter } from "./ComboMeter";
import { getTextStyleByCombo } from "../styles/textStyles";

interface HudProps {
  score?: number;
  bestScore?: number;
  combo?: number;
  isMaxCombo?: boolean;
}

export const Hud: React.FC<HudProps> = ({
  score = 0,
  bestScore = 0,
  combo = 1,
  isMaxCombo = false,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
        px: 2,
        position: "relative",
      }}
    >
      {/* Labels Row - SCORE and BEST [number] */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 1,
        }}
      >
        {/* SCORE label with combo meter */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#aaecffff",
              margin: 0,
              lineHeight: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            SCORE
          </Typography>

          {/* Combo meter container with fixed height to prevent layout shifts */}
          <Box
            sx={{
              width: "40px", // Min width from ComboMeter base styles
              height: "40px", // Fixed height to prevent layout shifts
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <ComboMeter
              combo={combo}
              isMaxCombo={isMaxCombo}
              sx={{
                position: "relative",
                bottom: "unset",
                right: "unset",
                alignSelf: "center",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#aaecffff",
              margin: 0,
              alignItems: "baseline",
            }}
          >
            BEST
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "secondary.main",
              fontSize: "1.1rem",
              margin: 0,
              lineHeight: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {bestScore.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Score Number Row - Below the labels */}
      <Box
        sx={{
          position: "relative",
          minHeight: "16vw", // Prevent vertical layout shifts
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <AnimatedNumber
          value={score}
          duration={800}
          sx={{
            ...getTextStyleByCombo(combo),
            fontSize: "16vw",
            textAlign: "left",
          }}
        />
      </Box>
    </Box>
  );
};
