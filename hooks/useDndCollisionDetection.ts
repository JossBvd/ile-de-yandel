"use client";

import { useMemo } from "react";
import { useOrientationContext } from "@/components/game/OrientationGuard";
import { createRotationCollisionDetection } from "@/lib/dnd/rotationCollisionDetection";

/**
 * Hook qui retourne la fonction de détection de collision appropriée
 * selon l'état de rotation de l'écran
 *
 * Prend en compte la rotation CSS de 90° appliquée par OrientationGuard
 * sur les écrans en mode portrait
 */
export function useDndCollisionDetection() {
  const { isRotated } = useOrientationContext();

  return useMemo(
    () => createRotationCollisionDetection(isRotated),
    [isRotated]
  );
}
