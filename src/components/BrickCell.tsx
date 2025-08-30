import React from "react";
import { Paper, Box } from "@mui/material";

export interface BoardCell {
  occupied: boolean;
  image?: string; // Direct image path for the cell
  pieceId?: string;
}

interface BrickCellProps {
  cell: BoardCell;
  isGhost?: boolean;
  ghostValid?: boolean;
  isCompletingLine?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onDrop?: () => void;
  tileSize: number;
  row: number;
  col: number;
}

export const BrickCell: React.FC<BrickCellProps> = ({
  cell,
  isGhost,
  ghostValid,
  isCompletingLine,
  onClick,
  onHover,
  onDrop,
  tileSize,
  row,
  col,
}) => {
  let bgColor = "rgba(201, 197, 197, 0.3)";
  if (isGhost) {
    // Use slightly darker background instead of border
    bgColor = ghostValid ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"; // Green or red with transparency
  } else if (isCompletingLine) {
    // Highlight cells that would be part of completed lines
    bgColor = "rgba(255, 193, 7, 0.4)"; // Orange/yellow highlight for line completion
  } else if (cell.occupied) {
    bgColor = "primary.main";
  }

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      onMouseEnter={onHover}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
      onDragOver={(e) => {
        e.preventDefault(); // Allow drop
      }}
      data-cell={`${row}-${col}`}
      sx={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        minWidth: `${tileSize}px`, // Force minimum dimensions
        minHeight: `${tileSize}px`,
        maxWidth: `${tileSize}px`, // Force maximum dimensions
        maxHeight: `${tileSize}px`,
        borderRadius: 0.25, // Less rounded
        cursor: "default",
        bgcolor: bgColor,
        opacity: 1, // Remove ghost opacity
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box", // Include border in dimensions
        flexShrink: 0, // Prevent shrinking
        flexGrow: 0, // Prevent growing
        margin: 0, // No margin
        padding: 0, // No internal padding
        overflow: "hidden", // Ensure image doesn't overflow
        border: "none", // Remove any default border
        outline: "none", // Remove focus outline
      }}
    >
      {cell.occupied && (
        <>
          {cell.image ? (
            // Use direct image for brick
            <Box
              component="img"
              src={cell.image}
              alt="Brick"
              sx={{
                width: "90%",
                height: "90%",
                objectFit: "cover",
                borderRadius: 0.25, // Less rounded
                imageRendering: "pixelated", // For crisp pixel art if needed
              }}
            />
          ) : (
            // Fallback to colored box (red brick default)
            <Box
              sx={{
                width: "80%",
                height: "80%",
                borderRadius: 0.25, // Less rounded
                bgcolor: "#B71C1C", // Red color as fallback
                opacity: 0.8,
              }}
            />
          )}
        </>
      )}
    </Paper>
  );
};
