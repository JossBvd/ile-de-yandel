"use client";

import { useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

/**
 * Hook pour configurer les sensors @dnd-kit optimisés pour mobile et desktop
 * 
 * Utilise PointerSensor avec activationConstraint pour éviter les conflits
 * avec les clics sur mobile (démarre le drag après 8px de mouvement)
 */
export function useDndSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Démarre le drag après 8px de mouvement (évite les conflits avec les clics)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
}
