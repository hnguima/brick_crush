import React, { useRef } from "react";
import { Paper, Box } from "@mui/material";
import { CellConfetti } from "./CellConfetti";

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
  isClearing?: boolean;
  shouldShowConfetti?: boolean; // New prop for confetti trigger
  animationDelay?: number; // Delay in milliseconds for sequential animation
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
  isClearing,
  shouldShowConfetti,
  animationDelay = 0,
  onClick,
  onHover,
  onDrop,
  tileSize,
  row,
  col,
}) => {
  const cellRef = useRef<HTMLDivElement>(null);

  // Calculate screen coordinates for confetti
  const getCellScreenCoordinates = () => {
    if (!cellRef.current) return { x: 0, y: 0 };

    const rect = cellRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2, // Center X
      y: rect.top + rect.height / 2, // Center Y
    };
  };

  const { x, y } = getCellScreenCoordinates();
  let bgColor = "transparent"; // Make all cells transparent by default
  let borderColor = "transparent";
  let borderWidth = 0;
  let boxShadow = "none";

  if (isClearing) {
    // Clearing animation - pulse with bright color
    bgColor = "rgba(255, 255, 255, 0.9)"; // Bright white for flash effect
  } else if (isGhost) {
    // Use slightly darker background instead of border
    bgColor = ghostValid ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"; // Green or red with transparency
  } else if (isCompletingLine) {
    // Use a glowing border instead of background for line completion preview
    borderColor = "#FFD700"; // Bright gold color
    borderWidth = 2;
    boxShadow =
      "0 0 8px rgba(255, 215, 0, 0.8), inset 0 0 8px rgba(255, 215, 0, 0.3)"; // Outer and inner glow
  }
  // Remove the occupied cell background color - keep all cells transparent

  // Confetti state and effect must be at the top level of the component
  const [confettiTriggered, setConfettiTriggered] = React.useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (shouldShowConfetti && !confettiTriggered) {
      timeout = setTimeout(() => {
        setConfettiTriggered(true);
      }, animationDelay);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [shouldShowConfetti, animationDelay, confettiTriggered]);

  // Reset confetti state when shouldShowConfetti becomes false
  React.useEffect(() => {
    if (!shouldShowConfetti) {
      setConfettiTriggered(false);
    }
  }, [shouldShowConfetti]);

  return (
    <Box ref={cellRef} sx={{ position: "relative" }}>
      <Paper
      elevation={0} // Remove elevation/shadow
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
        borderRadius: 0.5, // Completely square, no rounded corners
        cursor: "default",
        bgcolor: bgColor,
        opacity: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box", // Include border in dimensions
        flexShrink: 0, // Prevent shrinking
        flexGrow: 0, // Prevent growing
        margin: 0, // No margin
        padding: 0, // No internal padding
        overflow: "hidden", // Ensure image doesn't overflow
        border: `${borderWidth}px solid ${borderColor}`, // Dynamic border for line completion
        outline: "none", // Remove focus outline
        boxShadow: boxShadow, // Dynamic box shadow for line completion glow
        // Clearing animation
        ...(isClearing && {
        animation: `line-clearing 0.6s ease-out ${animationDelay}ms forwards`,
        "@keyframes line-clearing": {
          "0%": {
          transform: "scale(1)",
          opacity: 1,
          bgcolor: bgColor,
          },
          "50%": {
          transform: "scale(1.1)",
          opacity: 0.7,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          },
          "100%": {
          transform: "scale(0)",
          opacity: 0,
          bgcolor: "transparent",
          },
        },
        }),
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
            width: "100%", // Increased from 90% to fill the cell completely
            height: "100%", // Increased from 90% to fill the cell completely
            objectFit: "cover",
            borderRadius: 0, // Remove rounded corners to match cell style
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

      {/* Confetti overlay for this specific cell */}
      <CellConfetti 
        shouldTrigger={confettiTriggered} 
        x={x} 
        y={y} 
      />
    </Box>
  );
};
