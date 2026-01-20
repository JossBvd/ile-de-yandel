'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameProgress } from '@/types/game';
import { MissionId, StepId } from '@/types/mission';
import { STORAGE_KEY_GAME_PROGRESS } from '@/lib/constants';

interface GameStore extends GameState {
  setCurrentMission: (missionId: MissionId | null) => void;
  setCurrentStep: (stepId: StepId | null) => void;
  completeStep: (stepId: StepId) => void;
  completeMission: (missionId: MissionId) => void;
  reset: () => void;
}

const initialState: GameProgress = {
  currentMission: null,
  currentStep: null,
  completedSteps: [],
  completedMissions: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      isInitialized: false,
      
      setCurrentMission: (missionId) =>
        set({ currentMission: missionId }),
      
      setCurrentStep: (stepId) =>
        set({ currentStep: stepId }),
      
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
      
      reset: () =>
        set({ ...initialState, isInitialized: true }),
    }),
    {
      name: STORAGE_KEY_GAME_PROGRESS,
      partialize: (state) => ({
        currentMission: state.currentMission,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        completedMissions: state.completedMissions,
      }),
    }
  )
);
