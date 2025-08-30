// Reactive board renderer using Material-UI components
import React from "react";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";

// Responsive board metrics based on a base width (usually viewport width)
const getBoardMetrics = (
  baseWidth: number,
  isMobile: boolean,
  isTablet: boolean
) => {
  // Calculate tile size based on provided width (viewport or container)
  const width = Math.max(320, baseWidth || 400);

  // More generous sizing for different screen sizes
  let maxBoardWidth;
  if (isMobile) {
    maxBoardWidth = Math.min(width * 0.9, 500); // Increased from 450
  } else if (isTablet) {
    maxBoardWidth = Math.min(width * 0.75, 750); // Increased from 0.7, 600
  } else {
    maxBoardWidth = Math.min(width * 0.65, 900); // Increased from 0.6, 700
  }

  // Account for padding and gaps
  let padding, gapSize;
  if (isMobile) {
    padding = 16;
    gapSize = 2;
  } else if (isTablet) {
    padding = 28;
    gapSize = 4;
  } else {
    padding = 32;
    gapSize = 5;
  }
  const availableWidth = maxBoardWidth - padding * 2;
  const totalGaps = 7 * gapSize; // 7 gaps between 8 tiles

  const calculatedTileSize = Math.floor((availableWidth - totalGaps) / 8);

  // Clamp tile size to reasonable bounds with better scaling
  let minTileSize, maxTileSize;
  if (isMobile) {
    minTileSize = 28;
    maxTileSize = 65; // Increased from 60
  } else if (isTablet) {
    minTileSize = 45;
    maxTileSize = 95; // Increased from 80
  } else {
    minTileSize = 55;
    maxTileSize = 110; // Increased from 90
  }

  const tileSize = Math.max(
    minTileSize,
    Math.min(calculatedTileSize, maxTileSize)
  );

  // Ensure perfect square: calculate the actual board dimensions
  const actualBoardWidth = 8 * tileSize + 7 * gapSize + 2 * padding;
  const actualBoardHeight = 8 * tileSize + 7 * gapSize + 2 * padding;

  return {
    cols: 8,
    rows: 8,
    tile: tileSize,
    gap: gapSize,
    padding: padding,
    boardWidth: actualBoardWidth,
    boardHeight: actualBoardHeight,
  };
};

// Export function to get current board metrics from DOM
export const getCurrentBoardMetrics = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600; // Changed from 768 to 600
  const isTablet =
    typeof window !== "undefined" &&
    window.innerWidth >= 600 &&
    window.innerWidth < 1200; // Changed from 768 to 600
  const width = typeof window !== "undefined" ? window.innerWidth : 400;
  // Prefer viewport width for consistency between UI and game logic
  const { tile, gap, padding } = getBoardMetrics(width, !!isMobile, !!isTablet);
  return { tile, gap, padding };
};

export interface BoardCell {
  occupied: boolean;
  color?: string;
  pieceId?: string;
}

export interface BoardState {
  cells: BoardCell[][];
  ghost?: {
    coords: Array<{ x: number; y: number }>;
    valid: boolean;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  };
}

interface BoardRendererProps {
  boardState: BoardState;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  onCellDrop?: (row: number, col: number) => void;
}

const CellComponent: React.FC<{
  cell: BoardCell;
  isGhost?: boolean;
  ghostValid?: boolean;
  isCompletingLine?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onDrop?: () => void;
  tileSize: number; // Pass tile size as prop
  row: number;
  col: number;
}> = ({
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
        borderRadius: 1,
        cursor: "default",
        bgcolor: bgColor,
        opacity: 1, // Remove ghost opacity
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box", // Include border in dimensions
        border: `2px solid white`,
        flexShrink: 0, // Prevent shrinking
        flexGrow: 0, // Prevent growing
        margin: 0, // No margin
        padding: 0, // No internal padding
      }}
    >
      {cell.occupied && (
        <Box
          sx={{
            width: "80%",
            height: "80%",
            borderRadius: 0.5,
            bgcolor: "primary.dark",
            opacity: 0.3,
          }}
        />
      )}
    </Paper>
  );
};

export const BoardRenderer: React.FC<BoardRendererProps> = ({
  boardState,
  onCellClick,
  onCellHover,
  onCellDrop,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Changed from "md" to "sm" (600px)
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg")); // Changed from "md", "xl" to "sm", "lg"
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 400
  );

  // Track viewport width for responsive sizing
  React.useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(
        typeof window !== "undefined" ? window.innerWidth : 400
      );
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const boardMetrics = getBoardMetrics(containerWidth, isMobile, isTablet);
  const { tile, gap, padding } = boardMetrics;
  const { cells, ghost } = boardState;

  const isGhostCell = (row: number, col: number): boolean => {
    return (
      ghost?.coords.some((coord) => coord.x === col && coord.y === row) || false
    );
  };

  const isCompletingLineCell = (row: number, col: number): boolean => {
    if (!ghost?.valid) return false;

    // Check if this cell is in a row that would be completed
    const isInCompletingRow = ghost.wouldCompleteRows?.includes(row) || false;

    // Check if this cell is in a column that would be completed
    const isInCompletingCol = ghost.wouldCompleteCols?.includes(col) || false;

    return isInCompletingRow || isInCompletingCol;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "inline-block", // Use inline-block to contain the grid
        padding: 0, // No extra padding
        margin: 0, // No extra margin
      }}
    >
      <Box
        data-board-renderer
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(8, ${tile}px)`,
          gridTemplateRows: `repeat(8, ${tile}px)`,
          gap: `${gap}px`,
          padding: `${padding}px`,
          boxSizing: "border-box",
        }}
      >
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CellComponent
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              isGhost={isGhostCell(rowIndex, colIndex)}
              ghostValid={ghost?.valid}
              isCompletingLine={isCompletingLineCell(rowIndex, colIndex)}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
              onHover={() => onCellHover?.(colIndex, rowIndex)}
              onDrop={() => onCellDrop?.(colIndex, rowIndex)}
              tileSize={tile}
              row={rowIndex}
              col={colIndex}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

// Hook for managing board state
export const useBoardState = (
  customBoard?: number[][],
  ghostPosition?: {
    coords: { x: number; y: number }[];
    valid: boolean;
    wouldCompleteRows: number[];
    wouldCompleteCols: number[];
  } | null
): [BoardState, React.Dispatch<React.SetStateAction<BoardState>>] => {
  const { cols, rows } = { cols: 8, rows: 8 }; // Fixed board dimensions

  const createBoardFromData = (boardData?: number[][]): BoardCell[][] => {
    if (boardData) {
      return boardData.map((row) =>
        row.map((cell) => ({ occupied: cell === 1 }))
      );
    }
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({ occupied: false }))
      );
  };

  const [boardState, setBoardState] = React.useState<BoardState>(() => ({
    cells: createBoardFromData(customBoard),
    ghost: ghostPosition || undefined,
  }));

  // Update board state when props change
  React.useEffect(() => {
    setBoardState({
      cells: createBoardFromData(customBoard),
      ghost: ghostPosition || undefined,
    });
  }, [customBoard, ghostPosition]);

  return [boardState, setBoardState];
};
