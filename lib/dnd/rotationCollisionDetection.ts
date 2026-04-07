"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import { pointerWithin } from "@dnd-kit/core";

/**
 * Détection de collision pour @dnd-kit : le pointeur doit être au-dessus d’une
 * zone droppable. Le jeu impose le paysage physique (pas de rotation CSS) ;
 * aucune transformation de coordonnées n’est nécessaire.
 */
export function createPointerWithinCollisionDetection(): CollisionDetection {
  return pointerWithin;
}
