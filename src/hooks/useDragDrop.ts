import { useRef, useEffect } from "react";

export interface DragDropOptions {
  onDragStart?: (event: PointerEvent) => void;
  onDragMove?: (event: PointerEvent, offset: { x: number; y: number }) => void;
  onDragEnd?: (event: PointerEvent) => void;
  onDragCancel?: () => void;
}

interface DragState {
  isDragging: boolean;
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
}

export function useDragDrop(options: DragDropOptions = {}) {
  const dragRef = useRef<HTMLElement>(null);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
  });

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragStateRef.current = {
        isDragging: true,
        startPos: { x: event.clientX, y: event.clientY },
        currentPos: { x: event.clientX, y: event.clientY },
      };

      // Capture pointer to ensure we get move/up events even outside the element
      element.setPointerCapture(event.pointerId);

      options.onDragStart?.(event);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current.isDragging) return;

      event.preventDefault();
      event.stopPropagation();

      dragStateRef.current.currentPos = { x: event.clientX, y: event.clientY };

      const offset = {
        x: event.clientX - dragStateRef.current.startPos.x,
        y: event.clientY - dragStateRef.current.startPos.y,
      };

      options.onDragMove?.(event, offset);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!dragStateRef.current.isDragging) return;

      event.preventDefault();
      event.stopPropagation();

      dragStateRef.current.isDragging = false;

      // Release pointer capture
      element.releasePointerCapture(event.pointerId);

      options.onDragEnd?.(event);
    };

    const handlePointerCancel = (event: PointerEvent) => {
      if (!dragStateRef.current.isDragging) return;

      dragStateRef.current.isDragging = false;

      // Release pointer capture
      element.releasePointerCapture(event.pointerId);

      options.onDragCancel?.();
    };

    // Add event listeners
    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerCancel);

    // Cleanup
    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [options]);

  const dragProps = {
    style: {
      touchAction: "none" as const, // Prevent default touch behaviors
    },
  };

  return {
    dragRef,
    dragProps,
    isDragging: dragStateRef.current.isDragging,
  };
}
