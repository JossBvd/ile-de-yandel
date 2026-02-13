"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";

/**
 * Détection de collision pour @dnd-kit
 * 
 * Approche simplifiée : pas de transformation des coordonnées
 * - En mode paysage : les mouvements fonctionnent naturellement
 * - En mode portrait : les mouvements correspondent aux gestes physiques de l'utilisateur
 *   (glissement vers le bas = mouvement vers le bas, peu importe la rotation CSS)
 */
export function createRotationCollisionDetection(
  isRotated: boolean
): CollisionDetection {
  // Pas de transformation, on utilise simplement la détection standard
  // Les mouvements correspondent aux gestes physiques de l'utilisateur
  return closestCenter;
}
