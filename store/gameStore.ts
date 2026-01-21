'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameProgress } from '@/types/game';
import { StepId, MissionId } from '@/types/step';
import { STORAGE_KEY_GAME_PROGRESS } from '@/lib/constants';

interface GameStore extends GameState {
  setCurrentStep: (stepId: StepId | null) => void;
  setCurrentMission: (missionId: MissionId | null) => void;
  completeMission: (missionId: MissionId) => void;
  completeStep: (stepId: StepId) => void;
  reset: () => void;
}

const initialState: GameProgress = {
  currentStep: null,
  currentMission: null,
  completedMissions: [],
  completedSteps: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      isInitialized: false,
      
      setCurrentStep: (stepId) =>
        set({ currentStep: stepId }),
      
      setCurrentMission: (missionId) =>
        set({ currentMission: missionId }),
      
      completeMission: (missionId) =>
        set((state) => ({
          completedMissions: state.completedMissions.includes(missionId)
            ? state.completedMissions
            : [...state.completedMissions, missionId],
        })),
      
      completeStep: (stepId) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(stepId)
            ? state.completedSteps
            : [...state.completedSteps, stepId],
        })),
      
      reset: () =>
        set({ ...initialState, isInitialized: true }),
    }),
    {
      name: STORAGE_KEY_GAME_PROGRESS,
      partialize: (state) => ({
        currentStep: state.currentStep,
        currentMission: state.currentMission,
        completedMissions: state.completedMissions,
        completedSteps: state.completedSteps,
      }),
    }
  )
);
