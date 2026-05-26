"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import {
  installUnloadWarningGuards,
  shouldWarnBeforeUnload,
} from "@/lib/navigation/unloadWarning";

export function BeforeUnloadWarning() {
  const { currentMissionId, completedSteps } = useGameStore();

  const isGameInProgress =
    currentMissionId !== null || completedSteps.length > 0;

  useEffect(() => {
    installUnloadWarningGuards();
  }, []);

  useEffect(() => {
    if (!isGameInProgress) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldWarnBeforeUnload()) return;
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGameInProgress]);

  return null;
}
