import React, { useState, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { createPortal } from "react-dom";
import type { Piece } from "../game/Types";
import { useDragDrop } from "../hooks/useDragDrop";
import { getCurrentBoardMetrics } from "../ui/BoardRenderer";
import { BrickCell } from "./BrickCell";
import type { BoardCell } from "./BrickCell";

// INTERNAL: Drag granularity in pixels - minimum movement required to trigger updates
// Using 2px for better Android touch handling (was 1px)
const DRAG_GRANULARITY_PX = 2;

interface DraggablePieceProps {
  piece: Piece;
  index: number;
  onDragStart: (piece: Piece, index: number) => void;
  onDragEnd: () => void;
  isValidPlacement?: boolean;
  canFitOnBoard?: boolean;
}

const PieceRenderer: React.FC<{
  piece: Piece;
  tileSize: number;
  gap: number;
  isDragging?: boolean;
  isValidPlacement?: boolean;
}> = ({ piece, tileSize, gap, isDragging = false, isValidPlacement }) => {
  const pieceWidth = piece.size.w * tileSize + (piece.size.w - 1) * gap;
  const pieceHeight = piece.size.h * tileSize + (piece.size.h - 1) * gap;

  // Determine opacity based on drag state and validity
  let opacity = 1;
  if (isDragging) {
    opacity = isValidPlacement === false ? 0.3 : 1; // More opaque when invalid
  }

  // Optimized styles as plain CSS objects to avoid repeated emotion objects
  const containerStyle = {
    width: pieceWidth,
    height: pieceHeight,
    position: "relative" as const,
    backgroundColor: "transparent",
    display: "flex" as const,
    pointerEvents: "none" as const,
    opacity: opacity,
    transition: isDragging ? "opacity 0.1s ease" : "none",
  };

  return (
    <div style={containerStyle}>
      {/* Render individual cells of the piece using BrickCell */}
      {piece.cells.map((cell) => {
        const boardCell: BoardCell = {
          occupied: true,
          image: piece.image || "/images/brick_red.png", // Use the piece's assigned image
        };

        return (
          <div
            key={`${cell.x}-${cell.y}`}
            style={{
              position: "absolute",
              left: cell.x * (tileSize + gap),
              top: cell.y * (tileSize + gap),
            }}
          >
            <BrickCell
              cell={boardCell}
              tileSize={tileSize}
              row={cell.y}
              col={cell.x}
            />
          </div>
        );
      })}
    </div>
  );
};

export const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  index,
  onDragStart,
  onDragEnd,
  isValidPlacement,
  canFitOnBoard,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Changed from "md" to "sm"
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg")); // Added tablet detection

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const lastHoverTime = useRef(0);
  const lastUpdateTime = useRef(0);
  const lastBoardPosition = useRef({ x: -1, y: -1 });
  const lastPixelPosition = useRef({ x: -1, y: -1 }); // Track pixel-level position
  const HOVER_THROTTLE = 15; // Much more aggressive throttling - 5fps for hover
  const UPDATE_THROTTLE = 15; // ~10fps for visual updates

  // Responsive sizing for tray pieces
  let trayTileSize, trayGap;
  if (isMobile) {
    trayTileSize = 16;
    trayGap = 0.5; // Reduced gap
  } else if (isTablet) {
    trayTileSize = 24;
    trayGap = 1; // Reduced gap
  } else {
    trayTileSize = 28;
    trayGap = 1; // Reduced gap
  }

  // Use actual board metrics for accurate dragging size
  const boardMetrics = getCurrentBoardMetrics();
  const dragTileSize = boardMetrics.tile; // Match exact board cell size
  const dragGap = boardMetrics.gap; // Match exact board gap
  const dragPadding = isMobile ? 60 : 40;

  const { dragRef, dragProps } = useDragDrop({
    onDragStart: (event: PointerEvent) => {
      setIsDragging(true);
      // Initialize drag position immediately to prevent jumping to (0,0)
      const startPosition = { x: event.clientX, y: event.clientY };
      setDragPosition(startPosition);
      lastPixelPosition.current = {
        x: Math.floor(startPosition.x / DRAG_GRANULARITY_PX),
        y: Math.floor(startPosition.y / DRAG_GRANULARITY_PX),
      };
      onDragStart(piece, index);
    },
    onDragMove: (event: PointerEvent) => {
      const now = Date.now();

      // Always update position for smooth dragging on all pointer types
      if (now - lastUpdateTime.current > UPDATE_THROTTLE) {
        lastUpdateTime.current = now;
        setDragPosition({ x: event.clientX, y: event.clientY });
      }

      // Check if drag moved enough pixels to warrant board updates
      const currentPixelX = Math.floor(event.clientX / DRAG_GRANULARITY_PX);
      const currentPixelY = Math.floor(event.clientY / DRAG_GRANULARITY_PX);

      const pixelMoved =
        currentPixelX !== lastPixelPosition.current.x ||
        currentPixelY !== lastPixelPosition.current.y;

      // Only update board hover events if we moved enough pixels
      if (pixelMoved) {
        lastPixelPosition.current = { x: currentPixelX, y: currentPixelY };

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
                (piece.size.w * dragTileSize + (piece.size.w - 1) * dragGap) /
                  2,
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

  // Calculate tray piece opacity
  let trayOpacity = 1;
  if (isDragging) {
    trayOpacity = 0.5;
  } else if (canFitOnBoard === false) {
    trayOpacity = 0.3; // Make opaque if can't fit on board
  }

  // Optimized styles for tray piece container
  const trayContainerStyle = {
    cursor: isDragging ? "grabbing" : "grab",
    opacity: trayOpacity,
    userSelect: "none" as const,
    transition: "opacity 0.2s ease",
    padding: "16px", // Add padding around pieces for bigger hitboxes (equivalent to padding: 2)
    margin: "-16px", // Negative margin to prevent layout shift (equivalent to margin: -2)
    touchAction: "none", // Important: prevent default touch behaviors
  };

  // Optimized styles for dragging overlay
  const dragOverlayStyle = {
    position: "fixed" as const,
    left: Math.round(
      dragPosition.x -
        (piece.size.w * dragTileSize + (piece.size.w - 1) * dragGap) / 2
    ),
    top: Math.round(
      dragPosition.y -
        (piece.size.h * dragTileSize + (piece.size.h - 1) * dragGap) -
        dragPadding
    ),
    pointerEvents: "none" as const,
    zIndex: 9999,
    // Ensure visibility on Android with explicit transform for hardware acceleration
    transform: "translateZ(0)",
    willChange: "transform",
  };

  return (
    <>
      {/* Original piece in tray */}
      <div ref={dragRef as any} {...dragProps} style={trayContainerStyle}>
        <PieceRenderer piece={piece} tileSize={trayTileSize} gap={trayGap} />
      </div>

      {/* Dragging overlay - rendered at document level */}
      {isDragging &&
        createPortal(
          <div style={dragOverlayStyle}>
            <PieceRenderer
              piece={piece}
              tileSize={dragTileSize}
              gap={dragGap}
              isDragging
              isValidPlacement={isValidPlacement}
            />
          </div>,
          document.body
        )}
    </>
  );
};
