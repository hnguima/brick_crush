import React from "react";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";
import type { Piece, Bag, Coord, Board } from "../game/Types";
import { DraggablePiece } from "./DraggablePiece";
import { getCurrentBoardMetrics } from "../ui/BoardRenderer";

interface TrayProps {
  bag: Bag;
  board: Board;
  onPieceDragStart: (piece: Piece, index: number) => void;
  onPieceDragEnd: () => void;
  ghostPosition?: {
    coords: Coord[];
    valid: boolean;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } | null;
  draggedPieceIndex?: number | null;
}

export const Tray: React.FC<TrayProps> = ({
  bag,
  board,
  onPieceDragStart,
  onPieceDragEnd,
  ghostPosition,
  draggedPieceIndex,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Changed from "md" to "sm"
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "xl"));

  // Function to check if a piece can fit anywhere on the board
  const canPieceFitAnywhere = (piece: Piece): boolean => {
    if (!piece) return false;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Check if piece can be placed at this position
        let canPlace = true;
        for (const cell of piece.cells) {
          const boardX = x + cell.x;
          const boardY = y + cell.y;

          // Check bounds and if cell is occupied
          if (
            boardX < 0 ||
            boardX >= 8 ||
            boardY < 0 ||
            boardY >= 8 ||
            board[boardY][boardX] !== 0
          ) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          return true;
        }
      }
    }

    return false;
  };

  // Get actual board metrics to match width exactly
  const { tile, gap, padding } = getCurrentBoardMetrics();
  const boardWidth = 8 * tile + 7 * gap + 2 * padding;

  // Responsive tray metrics
  let trayHeight;
  if (isMobile) {
    trayHeight = 150;
  } else if (isTablet) {
    trayHeight = 180;
  } else {
    trayHeight = 200;
  }

  const trayMetrics = {
    height: trayHeight,
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
          width: `calc(${boardWidth}px + 25px)`,
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
                  isValidPlacement={
                    draggedPieceIndex === index
                      ? ghostPosition?.valid
                      : undefined
                  }
                  canFitOnBoard={canPieceFitAnywhere(piece)}
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
