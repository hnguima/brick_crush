// HUD component: Score display and controls
import React from "react";
import { Box, Typography } from "@mui/material";
import { AnimatedNumber } from "./AnimatedNumber";
import { ComboMeter } from "./ComboMeter";

// Helper function to get score container width based on score value
const getScoreContainerWidth = (score: number) => {
  if (score < 1000) return "35vw"; // Up to 3 digits: 999
  if (score < 10000) return "52vw"; // Up to 4 digits: 9,999
  if (score < 100000) return "63vw"; // Up to 5 digits: 99,999
  if (score < 1000000) return "77vw"; // Up to 6 digits: 999,999
  return "90vw"; // 7+ digits: 1,000,000+
};

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
          alignItems: "flex-start",
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "text.secondary",
            margin: 0,
            lineHeight: 1,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          SCORE
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              lineHeight: 1,
              margin: 0,
              display: "flex",
              alignItems: "flex-start",
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
          width: getScoreContainerWidth(score),
          minHeight: "16vw", // Prevent vertical layout shifts
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <AnimatedNumber
          value={score}
          duration={800}
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: "16vw",
            textAlign: "left",
            color: "primary.main",
          }}
        />

        {/* Combo Overlay - Bottom Right of Score Number */}
        <ComboMeter combo={combo} isMaxCombo={isMaxCombo} />
      </Box>
    </Box>
  );
};
