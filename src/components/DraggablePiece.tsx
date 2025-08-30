import React, { useState, useRef } from "react";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";
import { createPortal } from "react-dom";
import type { Piece } from "../game/Types";
import { useDragDrop } from "../hooks/useDragDrop";
import { getCurrentBoardMetrics } from "../ui/BoardRenderer";

interface DraggablePieceProps {
  piece: Piece;
  index: number;
  onDragStart: (piece: Piece, index: number) => void;
  onDragEnd: () => void;
}

const PieceRenderer: React.FC<{
  piece: Piece;
  tileSize: number;
  gap: number;
  isDragging?: boolean;
}> = ({ piece, tileSize, gap, isDragging = false }) => {
  const pieceWidth = piece.size.w * tileSize + (piece.size.w - 1) * gap;
  const pieceHeight = piece.size.h * tileSize + (piece.size.h - 1) * gap;

  return (
    <Box
      sx={{
        width: pieceWidth,
        height: pieceHeight,
        position: "relative",
        backgroundColor: "transparent", // Transparent background
        display: "flex",
        pointerEvents: "none", // Prevent interference during drag
      }}
    >
      {/* Render individual cells of the piece */}
      {piece.cells.map((cell) => (
        <Paper
          key={`${cell.x}-${cell.y}`}
          elevation={isDragging ? 4 : 2}
          sx={{
            position: "absolute",
            left: cell.x * (tileSize + gap),
            top: cell.y * (tileSize + gap),
            width: tileSize,
            height: tileSize,
            backgroundColor: piece.color || "primary.main",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            transition: isDragging ? "none" : "elevation 0.2s ease",
          }}
        />
      ))}
    </Box>
  );
};

export const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  index,
  onDragStart,
  onDragEnd,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const lastHoverTime = useRef(0);
  const lastUpdateTime = useRef(0);
  const lastBoardPosition = useRef({ x: -1, y: -1 });
  const HOVER_THROTTLE = 100; // Much more aggressive throttling - 5fps for hover
  const UPDATE_THROTTLE = 10; // ~10fps for visual updates

  // Responsive sizing
  const trayTileSize = isMobile ? 16 : 20; // Smaller tiles for tray display
  const trayGap = isMobile ? 1 : 2;

  // Use actual board metrics for accurate dragging size
  const boardMetrics = getCurrentBoardMetrics();
  const dragTileSize = boardMetrics.tile; // Match exact board cell size
  const dragGap = boardMetrics.gap; // Match exact board gap
  const dragPadding = isMobile ? 60 : 40;

  const { dragRef, dragProps } = useDragDrop({
    onDragStart: (event: PointerEvent) => {
      setIsDragging(true);
      setDragPosition({ x: event.clientX, y: event.clientY });
      onDragStart(piece, index);
    },
    onDragMove: (event: PointerEvent) => {
      const now = Date.now();

      // Throttle position updates to reduce re-renders
      if (now - lastUpdateTime.current > UPDATE_THROTTLE) {
        lastUpdateTime.current = now;
        setDragPosition({ x: event.clientX, y: event.clientY });
      }

      // Throttle hover events to reduce performance impact
      if (now - lastHoverTime.current > HOVER_THROTTLE) {
        lastHoverTime.current = now;

        // Find board cells directly under the piece centers
        const boardElement = document.querySelector("[data-board-renderer]");
        if (boardElement) {
          // Calculate piece cell centers in screen coordinates
          const pieceCellCenters = piece.cells.map((cell) => ({
            x:
              dragPosition.x +
              (cell.x * dragTileSize + cell.x * dragGap) +
              dragTileSize / 2 -
              (piece.size.w * dragTileSize + (piece.size.w - 1) * dragGap) / 2,
            y:
              dragPosition.y +
              (cell.y * dragTileSize + cell.y * dragGap) +
              dragTileSize / 2 -
              (piece.size.h * dragTileSize + (piece.size.h - 1) * dragGap) -
              dragPadding,
            cellCoord: cell,
          }));

          // Find which board cells are under each piece cell center
          const targetCells: Array<{ row: number; col: number }> = [];

          pieceCellCenters.forEach((pieceCenter) => {
            // Use elementFromPoint to find the board cell under this piece center
            const elementUnder = document.elementFromPoint(
              pieceCenter.x,
              pieceCenter.y
            );
            const cellElement = elementUnder?.closest(
              "[data-cell]"
            ) as HTMLElement;

            if (cellElement) {
              const cellData = cellElement.getAttribute("data-cell");
              if (cellData) {
                const [row, col] = cellData.split("-").map(Number);
                if (!isNaN(row) && !isNaN(col)) {
                  targetCells.push({ row, col });
                }
              }
            }
          });

          // Only trigger if target cells changed
          const newTargetKey = targetCells
            .map((c) => `${c.row},${c.col}`)
            .sort((a, b) => a.localeCompare(b))
            .join("|");
          const currentTargetKey = `${lastBoardPosition.current.x},${lastBoardPosition.current.y}`;

          if (newTargetKey !== currentTargetKey) {
            lastBoardPosition.current = {
              x: targetCells.length,
              y: Date.now(),
            }; // Use length + timestamp as change indicator

            // Trigger board hover with target cells
            const hoverEvent = new CustomEvent("pieceHover", {
              detail: {
                targetCells: targetCells,
                piece: piece,
              },
            });
            window.dispatchEvent(hoverEvent);
          }
        }
      }
    },
    onDragEnd: (_event: PointerEvent) => {
      setIsDragging(false);

      // Find board cells directly under the piece centers (same logic as hover)
      const boardElement = document.querySelector("[data-board-renderer]");
      if (boardElement) {
        // Calculate piece cell centers in screen coordinates
        const pieceCellCenters = piece.cells.map((cell) => ({
          x:
            dragPosition.x +
            (cell.x * dragTileSize + cell.x * dragGap) +
            dragTileSize / 2 -
            (piece.size.w * dragTileSize + (piece.size.w - 1) * dragGap) / 2,
          y:
            dragPosition.y +
            (cell.y * dragTileSize + cell.y * dragGap) +
            dragTileSize / 2 -
            (piece.size.h * dragTileSize + (piece.size.h - 1) * dragGap) -
            dragPadding,
          cellCoord: cell,
        }));

        // Find which board cells are under each piece cell center
        const targetCells: Array<{ row: number; col: number }> = [];

        pieceCellCenters.forEach((pieceCenter) => {
          // Use elementFromPoint to find the board cell under this piece center
          const elementUnder = document.elementFromPoint(
            pieceCenter.x,
            pieceCenter.y
          );
          const cellElement = elementUnder?.closest(
            "[data-cell]"
          ) as HTMLElement;

          if (cellElement) {
            const cellData = cellElement.getAttribute("data-cell");
            if (cellData) {
              const [row, col] = cellData.split("-").map(Number);
              if (!isNaN(row) && !isNaN(col)) {
                targetCells.push({ row, col });
              }
            }
          }
        });

        // Trigger board drop with target cells
        const dropEvent = new CustomEvent("pieceDrop", {
          detail: {
            targetCells: targetCells,
            piece: piece,
          },
        });
        window.dispatchEvent(dropEvent);
      }

      onDragEnd();
    },
    onDragCancel: () => {
      setIsDragging(false);
      onDragEnd();
    },
  });

  return (
    <>
      {/* Original piece in tray */}
      <Box
        ref={dragRef}
        {...dragProps}
        sx={{
          cursor: isDragging ? "grabbing" : "grab",
          opacity: isDragging ? 0.5 : 1, // Less transparent during drag
          userSelect: "none",
          transition: "opacity 0.2s ease",
          padding: 2, // Add padding around pieces for bigger hitboxes
          margin: -2, // Negative margin to prevent layout shift
        }}
      >
        <PieceRenderer piece={piece} tileSize={trayTileSize} gap={trayGap} />
      </Box>

      {/* Dragging overlay - rendered at document level */}
      {isDragging &&
        createPortal(
          <Box
            sx={{
              position: "fixed",
              // Position piece above the touch point for better visibility
              // Center horizontally but offset upward by full piece height + extra margin
              left:
                dragPosition.x -
                (piece.size.w * dragTileSize + (piece.size.w - 1) * dragGap) /
                  2,
              top:
                dragPosition.y -
                (piece.size.h * dragTileSize + (piece.size.h - 1) * dragGap) -
                dragPadding, // dragPadding above the touch point for better visibility
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            <PieceRenderer
              piece={piece}
              tileSize={dragTileSize}
              gap={dragGap}
              isDragging
            />
          </Box>,
          document.body
        )}
    </>
  );
};
