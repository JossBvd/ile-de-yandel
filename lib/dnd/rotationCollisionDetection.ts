"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";

/**
 * Détection de collision personnalisée qui prend en compte la rotation CSS de 90°
 * appliquée par OrientationGuard sur les écrans en mode portrait
 *
 * Transforme les coordonnées du pointeur pour correspondre aux coordonnées visuelles
 * après rotation CSS de 90° dans le sens horaire
 *
 * En mode portrait :
 * - Le viewport est en portrait (width < height)
 * - Le conteneur est pivoté de 90° horaire pour afficher en paysage
 * - Les coordonnées du pointeur sont dans le système portrait du viewport
 * - On doit les transformer vers le système paysage du conteneur pivoté
 */
export function createRotationCollisionDetection(
  isRotated: boolean
): CollisionDetection {
  if (!isRotated) {
    return closestCenter;
  }

  return (args) => {
    const { pointerCoordinates, droppableContainers } = args;

    if (!pointerCoordinates) {
      return closestCenter(args);
    }

    // En mode portrait, le viewport a width < height
    // Le conteneur est pivoté de 90° horaire autour du centre du viewport
    const viewportWidth = window.innerWidth; // Petit (ex: 375px)
    const viewportHeight = window.innerHeight; // Grand (ex: 667px)

    // Le conteneur pivoté a ses dimensions inversées :
    // - rotatedWidth = viewportHeight (ex: 667px)
    // - rotatedHeight = viewportWidth (ex: 375px)
    const rotatedWidth = viewportHeight;
    const rotatedHeight = viewportWidth;

    // Coordonnées du pointeur dans le système du viewport portrait
    const x_viewport = pointerCoordinates.x;
    const y_viewport = pointerCoordinates.y;

    // Transformation des coordonnées du pointeur du système viewport vers le système conteneur pivoté
    // 
    // Le conteneur est pivoté de 90° horaire autour du centre du viewport
    // Pour transformer les coordonnées du pointeur :
    // - L'axe X visuel du conteneur correspond à l'axe Y du viewport
    // - L'axe Y visuel du conteneur correspond à l'axe X inversé du viewport
    //
    // Transformation similaire à celle utilisée dans ClickableBackground :
    // relX = relY (l'ancien Y devient le nouveau X)
    // relY = containerRect.width - tempX (l'ancien X devient le nouveau Y, inversé)
    //
    // Mais ici, on transforme depuis le système du viewport vers le système du conteneur
    // Le conteneur est centré sur le viewport avec left: 50%, top: 50%
    // Le conteneur commence à (viewportCenterX - rotatedWidth/2, viewportCenterY - rotatedHeight/2)
    
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    
    // Coordonnées relatives au centre du viewport
    const relX_viewport = x_viewport - viewportCenterX;
    const relY_viewport = y_viewport - viewportCenterY;
    
    // Transformation vers le système du conteneur pivoté
    // 
    // Rotation de 90° horaire : un point (x, y) se transforme en (y, -x)
    // Donc l'inverse (rotation anti-horaire de 90°) : (x, y) se transforme en (-y, x)
    // 
    // Pour transformer du viewport vers le conteneur :
    // - Un mouvement vers la droite dans le viewport (relX augmente) 
    //   doit devenir un mouvement vers le bas dans le conteneur (Y augmente)
    // - Un mouvement vers le bas dans le viewport (relY augmente)
    //   doit devenir un mouvement vers la gauche dans le conteneur (X diminue)
    //
    // Donc : transformedX = -relY_viewport, transformedY = relX_viewport
    // Mais on doit aussi décaler pour recentrer dans le système du conteneur pivoté
    const transformedX = rotatedWidth / 2 - relY_viewport;
    const transformedY = rotatedHeight / 2 + relX_viewport;
    
    // Coordonnées transformées dans le système du conteneur pivoté
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
