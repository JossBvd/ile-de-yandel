"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";

/**
 * Détection de collision personnalisée qui prend en compte la rotation CSS de 90°
 * appliquée par OrientationGuard sur les écrans en mode portrait
 *
 * Transforme les coordonnées du pointeur pour correspondre aux coordonnées visuelles
 * après rotation CSS de 90° dans le sens horaire
 */
export function createRotationCollisionDetection(
  isRotated: boolean
): CollisionDetection {
  if (!isRotated) {
    return closestCenter;
  }

  return (args) => {
    const { pointerCoordinates } = args;

    if (!pointerCoordinates) {
      return closestCenter(args);
    }

    // Avec une rotation CSS de 90° dans le sens horaire appliquée au conteneur :
    // Le conteneur est pivoté autour du centre de l'écran
    // Les coordonnées du pointeur sont dans le système du viewport (non pivoté)
    // On doit les transformer pour qu'elles correspondent au système du conteneur pivoté

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Centre du viewport (point de rotation)
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    // Coordonnées du pointeur relatives au centre du viewport
    const relativeX = pointerCoordinates.x - centerX;
    const relativeY = pointerCoordinates.y - centerY;

    // Le conteneur après rotation a ses dimensions inversées
    const rotatedWidth = viewportHeight;
    const rotatedHeight = viewportWidth;
    const rotatedCenterX = rotatedWidth / 2;
    const rotatedCenterY = rotatedHeight / 2;

    // Transformation inverse de la rotation CSS de 90° horaire
    // Rotation horaire de 90° autour du centre : (x, y) -> (y, -x)
    // Transformation inverse (anti-horaire de 90°) : (x, y) -> (-y, x)
    const transformedX = rotatedCenterX - relativeY;
    const transformedY = rotatedCenterY + relativeX;

    const transformedPointerCoordinates = {
      x: transformedX,
      y: transformedY,
    };

    // Utiliser la détection de collision standard avec les coordonnées transformées
    return closestCenter({
      ...args,
      pointerCoordinates: transformedPointerCoordinates,
    });
  };
}
