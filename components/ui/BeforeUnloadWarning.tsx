"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

export function BeforeUnloadWarning() {
  const { currentMissionId, completedSteps } = useGameStore();

  const isGameInProgress =
    currentMissionId !== null || completedSteps.length > 0;

  useEffect(() => {
    if (!isGameInProgress) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGameInProgress]);

  return null;
}
