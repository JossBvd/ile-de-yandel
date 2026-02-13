"use client";

import type { CollisionDetection, ClientRect } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";

/**
 * Transforme les coordonnées d'un rectangle après une rotation de 90° horaire
 * 
 * Quand l'écran est en portrait (physiquement) mais qu'on applique une rotation CSS de 90°,
 * les événements tactiles arrivent dans le référentiel physique (non pivoté),
 * mais l'interface visuelle est pivotée. On doit transformer les coordonnées
 * du référentiel physique vers le référentiel visuel.
 * 
 * Pour une rotation de 90° horaire (ce que fait le CSS) :
 * - Le point (x, y) physique devient (height - y, x) visuellement
 * - La largeur et hauteur sont inversées
 */
function transformRectForRotation(
  rect: ClientRect,
  viewportWidth: number,
  viewportHeight: number
): ClientRect {
  const { top, left, width, height } = rect;
  
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  
  const newCenterX = viewportHeight - centerY;
  const newCenterY = centerX;
  
  return {
    top: newCenterY - height / 2,
    left: newCenterX - width / 2,
    bottom: newCenterY + height / 2,
    right: newCenterX + width / 2,
    width: height,
    height: width,
  };
}

/**
 * Détection de collision pour @dnd-kit qui gère la rotation CSS de 90°
 * 
 * Quand isRotated = true :
 * - Transforme les coordonnées des droppables et de l'élément actif
 * - Applique la transformation inverse de la rotation CSS (90° horaire)
 * - Permet aux mouvements tactiles de correspondre à l'interface visuelle pivotée
 */
export function createRotationCollisionDetection(
  isRotated: boolean
): CollisionDetection {
  if (!isRotated) {
    return closestCenter;
  }

  return (args) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const transformedArgs = {
      ...args,
      collisionRect: transformRectForRotation(
        args.collisionRect,
        viewportWidth,
        viewportHeight
      ),
      droppableContainers: args.droppableContainers.map((container) => {
        const rect = container.rect.current;
        if (!rect) return container;

        return {
          ...container,
          rect: {
            ...container.rect,
            current: transformRectForRotation(rect, viewportWidth, viewportHeight),
          },
        };
      }),
    };

    return closestCenter(transformedArgs);
  };
}
