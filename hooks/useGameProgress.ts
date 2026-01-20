'use client';

import { useGameStore } from '@/store/gameStore';
import { MissionId, StepId } from '@/types/mission';

export function useGameProgress() {
  const {
    currentMission,
    currentStep,
    completedSteps,
    completedMissions,
    setCurrentMission,
    setCurrentStep,
    completeStep,
    completeMission,
  } = useGameStore();

  const isStepCompleted = (stepId: StepId): boolean => {
    return completedSteps.includes(stepId);
  };

  const isMissionCompleted = (missionId: MissionId): boolean => {
    return completedMissions.includes(missionId);
  };

  return {
    currentMission,
    currentStep,
    completedSteps,
    completedMissions,
    setCurrentMission,
    setCurrentStep,
    completeStep,
    completeMission,
    isStepCompleted,
    isMissionCompleted,
  };
}
