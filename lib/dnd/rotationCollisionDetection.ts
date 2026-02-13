"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";

/**
 * Détection de collision pour @dnd-kit
 * 
 * Approche simplifiée sans rotation CSS :
 * - L'utilisateur est maintenant forcé de tourner physiquement son appareil en mode paysage
 * - Plus besoin de transformer les coordonnées
 * - Le drag and drop fonctionne naturellement dans le bon référentiel
 */
export function createRotationCollisionDetection(
  isRotated: boolean
): CollisionDetection {
  // Plus de transformation nécessaire : l'utilisateur tourne physiquement son appareil
  return closestCenter;
}
