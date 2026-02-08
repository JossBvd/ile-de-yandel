import { useGameStore } from "@/store/gameStore";
import { StepId } from "@/types/step";
import { MissionId } from "@/types/mission";

export function useGameProgress() {
  const {
    currentMissionId,
    currentStepId,
    completedSteps,
    completedMissions,
    setCurrentMissionId,
    setCurrentStepId,
    completeStep,
    completeMission,
    resetMissionSteps,
    reset,
  } = useGameStore();

  const isStepCompleted = (stepId: StepId): boolean => {
    return completedSteps.includes(stepId);
  };

  const isMissionCompleted = (missionId: MissionId): boolean => {
    return completedMissions.includes(missionId);
  };

  return {
    currentMissionId,
    currentStepId,
    completedSteps,
    completedMissions,
    setCurrentMissionId,
    setCurrentStepId,
    completeStep,
    completeMission,
    resetMissionSteps,
    isStepCompleted,
    isMissionCompleted,
    reset,
  };
}
