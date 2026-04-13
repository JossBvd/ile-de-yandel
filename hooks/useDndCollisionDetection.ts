"use client";

import { useMemo } from "react";
import { createPointerWithinCollisionDetection } from "@/lib/dnd/rotationCollisionDetection";

/**
 * Retourne la détection de collision @dnd-kit (pointerWithin), stable entre les rendus.
 */
export function useDndCollisionDetection() {
  return useMemo(() => createPointerWithinCollisionDetection(), []);
}
