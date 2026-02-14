"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import { pointerWithin, rectIntersection } from "@dnd-kit/core";

/**
 * Détection de collision pour @dnd-kit
 * 
 * Utilise pointerWithin pour nécessiter que le pointeur soit réellement
 * au-dessus d'un slot droppable pour déclencher le drop
 */
export function createRotationCollisionDetection(
  isRotated: boolean
): CollisionDetection {
  return pointerWithin;
}
