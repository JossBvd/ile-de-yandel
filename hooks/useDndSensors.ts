"use client";

import { useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

/**
 * Hook pour configurer les sensors @dnd-kit optimisés pour mobile et desktop
 * 
 * Utilise PointerSensor avec activationConstraint pour éviter les conflits
 * avec les clics sur mobile (démarre le drag après 8px de mouvement)
 */
export function useDndSensors(activationDistance = 8) {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: activationDistance,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
}
