"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, GameProgress } from "@/types/game";
import { StepId } from "@/types/step";
import { MissionId } from "@/types/mission";
import { STORAGE_KEY_GAME_PROGRESS } from "@/lib/constants";

interface GameStore extends GameState {
  setCurrentMissionId: (missionId: MissionId | null) => void;
  setCurrentStepId: (stepId: StepId | null) => void;
  completeStep: (stepId: StepId) => void;
  completeMission: (missionId: MissionId) => void;
  /** Réinitialise uniquement les steps complétés d'une mission (pour rejouer la mission). N'affecte pas l'inventaire ni completedMissions. */
  resetMissionSteps: (missionStepIds: StepId[]) => void;
  reset: () => void;
}

const initialState: GameProgress = {
  currentMissionId: null,
  currentStepId: null,
  completedSteps: [],
  completedMissions: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      isInitialized: false,

      setCurrentMissionId: (missionId) => set({ currentMissionId: missionId }),

      setCurrentStepId: (stepId) => set({ currentStepId: stepId }),

      completeStep: (stepId) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(stepId)
            ? state.completedSteps
            : [...state.completedSteps, stepId],
        })),

      completeMission: (missionId) =>
        set((state) => ({
          completedMissions: state.completedMissions.includes(missionId)
            ? state.completedMissions
            : [...state.completedMissions, missionId],
        })),

      resetMissionSteps: (missionStepIds) =>
        set((state) => ({
          completedSteps: state.completedSteps.filter(
            (id) => !missionStepIds.includes(id),
          ),
        })),

      reset: () => set({ ...initialState, isInitialized: true }),
    }),
    {
      name: STORAGE_KEY_GAME_PROGRESS,
      partialize: (state) => ({
        currentMissionId: state.currentMissionId,
        currentStepId: state.currentStepId,
        completedSteps: state.completedSteps,
        completedMissions: state.completedMissions,
      }),
    },
  ),
);
