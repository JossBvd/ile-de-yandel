"use client";

import { useRef, useCallback } from "react";

let globalDragId: string | null = null;
let globalDragStartX: number = 0;
let globalDragStartY: number = 0;
const TOUCH_MOVE_THRESHOLD = 5;

export function useDragAndDrop(
  id: string,
  canDrag: boolean,
  dataKey: string = "id"
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (!canDrag) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(dataKey, id);
      globalDragId = id;
    },
    [id, canDrag, dataKey]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!canDrag) return;
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      globalDragId = id;
      globalDragStartX = touch.clientX;
      globalDragStartY = touch.clientY;
    },
    [id, canDrag]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !globalDragId) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
    globalDragId = null;
  }, []);

  return {
    draggable: canDrag,
    onDragStart: handleDragStart,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

export function useDropZone(
  onDrop: (id: string) => void,
  canDrop: boolean = true,
  dataKey: string = "id"
) {
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!canDrop) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [canDrop]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canDrop) return;
      const id = e.dataTransfer.getData(dataKey);
      if (id) {
        onDrop(id);
      }
    },
    [canDrop, onDrop, dataKey]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canDrop || !globalDragId) return;
      const touch = e.touches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

      if (
        elementBelow &&
        (elementBelow === e.currentTarget || e.currentTarget.contains(elementBelow))
      ) {
        e.preventDefault();
      }
    },
    [canDrop]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!canDrop || !globalDragId) return;
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

      if (
        elementBelow &&
        (elementBelow === e.currentTarget || e.currentTarget.contains(elementBelow))
      ) {
        const deltaX = Math.abs(touch.clientX - globalDragStartX);
        const deltaY = Math.abs(touch.clientY - globalDragStartY);

        if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
          onDrop(globalDragId);
          globalDragId = null;
        }
      }
    },
    [canDrop, onDrop]
  );

  return {
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
