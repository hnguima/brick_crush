import React from "react";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";
import type { Piece, Bag } from "../game/Types";
import { DraggablePiece } from "./DraggablePiece";
import { getCurrentBoardMetrics } from "../ui/BoardRenderer";

interface TrayProps {
  bag: Bag;
  onPieceDragStart: (piece: Piece, index: number) => void;
  onPieceDragEnd: () => void;
}

export const Tray: React.FC<TrayProps> = ({
  bag,
  onPieceDragStart,
  onPieceDragEnd,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get actual board metrics to match width exactly
  const { tile, gap, padding } = getCurrentBoardMetrics();
  const boardWidth = 8 * tile + 7 * gap + 2 * padding;

  const trayMetrics = {
    height: isMobile ? 150 : 150, // Increased tray height
    spacing: isMobile ? 40 : 60, // Much larger spacing between pieces
  };

  // Fixed positions for 3 pieces - evenly distributed across board width
  const piecePositions = [
    boardWidth * 0.2, // 20% from left
    boardWidth * 0.5, // Center
    boardWidth * 0.8, // 80% from left
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", px: 2 }}>
      <Paper
        elevation={1}
        sx={{
          width: `calc(${boardWidth}px + 20px)`,
          height: `${trayMetrics.height}px`,
          position: "relative", // For absolute positioning of pieces
          borderRadius: 2,
        }}
      >
        {/* Render pieces in fixed positions */}
        {[0, 1, 2].map((index) => {
          const piece = bag[index];
          return (
            <Box
              key={`tray-slot-${index}`}
              sx={{
                position: "absolute",
                left: `${piecePositions[index]}px`,
                top: "50%",
                transform: "translate(-50%, -50%)", // Center on the position
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {piece ? (
                <DraggablePiece
                  piece={piece}
                  index={index}
                  onDragStart={onPieceDragStart}
                  onDragEnd={onPieceDragEnd}
                />
              ) : (
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.15, // Much more subtle
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Very light background instead of border
                    borderRadius: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};
