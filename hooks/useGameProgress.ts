'use client';

import { useGameStore } from '@/store/gameStore';
import { StepId, MissionId } from '@/types/step';

export function useGameProgress() {
  const {
    currentStep,
    currentMission,
    completedMissions,
    completedSteps,
    setCurrentStep,
    setCurrentMission,
    completeMission,
    completeStep,
  } = useGameStore();

  const isMissionCompleted = (missionId: MissionId): boolean => {
    return completedMissions.includes(missionId);
  };

  const isStepCompleted = (stepId: StepId): boolean => {
    return completedSteps.includes(stepId);
  };

  return {
    currentStep,
    currentMission,
    completedMissions,
    completedSteps,
    setCurrentStep,
    setCurrentMission,
    completeMission,
    completeStep,
    isMissionCompleted,
    isStepCompleted,
  };
}
