import { Mission } from "@/types/mission";
import { StepId } from "@/types/step";

export function isMissionCompleted(
  mission: Mission,
  completedSteps: StepId[],
): boolean {
  return mission.steps.every((stepId) => completedSteps.includes(stepId));
}

export function getNextStep(
  mission: Mission,
  completedSteps: StepId[],
): StepId | null {
  return (
    mission.steps.find((stepId) => !completedSteps.includes(stepId)) ?? null
  );
}

export function getCurrentStepIndex(
  mission: Mission,
  currentStepId: StepId,
): number {
  return mission.steps.indexOf(currentStepId);
}

export function getMissionProgress(
  mission: Mission,
  completedSteps: StepId[],
): number {
  const completed = mission.steps.filter((stepId) =>
    completedSteps.includes(stepId),
  ).length;
  return mission.steps.length > 0
    ? (completed / mission.steps.length) * 100
    : 0;
}
