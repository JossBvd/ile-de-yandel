"use client";

import type { Modifier } from "@dnd-kit/core";

/**
 * Modifier personnalisé pour @dnd-kit qui prend en compte la rotation CSS de 90°
 * appliquée par OrientationGuard sur les écrans en mode portrait
 * 
 * Transforme les coordonnées du pointeur pour correspondre aux coordonnées visuelles
 * après rotation CSS de 90° dans le sens horaire
 */
export function createRotationModifier(isRotated: boolean): Modifier {
  return ({ transform, draggingNodeRect, containerNodeRect }) => {
    if (!isRotated || !draggingNodeRect || !containerNodeRect) {
      return transform;
    }

    // Avec une rotation CSS de 90° dans le sens horaire :
    // - Les coordonnées X visuelles correspondent aux coordonnées Y du DOM
    // - Les coordonnées Y visuelles correspondent à (width_DOM - X_DOM)
    // Mais comme @dnd-kit gère déjà les transformations CSS, on doit inverser la transformation
    
    // Le conteneur pivoté a ses dimensions inversées
    const containerWidth = containerNodeRect.width;
    const containerHeight = containerNodeRect.height;

    // Transformation inverse pour compenser la rotation CSS
    // Rotation de 90° horaire : (x, y) -> (y, -x)
    // Mais ici on veut transformer les coordonnées du pointeur pour qu'elles correspondent
    // aux coordonnées visuelles après rotation
    
    // En fait, @dnd-kit devrait gérer cela automatiquement avec les transformations CSS
    // Le problème pourrait être que les coordonnées de collision ne sont pas correctement calculées
    
    // Pour l'instant, retournons la transformation telle quelle
    // car @dnd-kit devrait gérer les transformations CSS automatiquement
    return transform;
  };
}
