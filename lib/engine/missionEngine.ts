import { MISSIONS, getMissionById } from "@/data/missions";
import { Mission, MissionId } from "@/types/mission";
import { StepId } from "@/types/step";

function isPrerequisiteSatisfied(
  prerequisiteMissionId: string,
  completedMissions: MissionId[],
  completedSteps: StepId[],
): boolean {
  if (completedMissions.includes(prerequisiteMissionId)) return true;
  const mission = getMissionById(prerequisiteMissionId);
  return mission ? isMissionCompleted(mission, completedSteps) : false;
}

/** Même règle que la carte des missions (débloquée si la précédente est finie). */
export function isMissionAccessible(
  targetMissionId: string,
  completedMissions: MissionId[],
  completedSteps: StepId[],
): boolean {
  if (targetMissionId === "mission-1") return true;
  const index = MISSIONS.findIndex((m) => m.id === targetMissionId);
  if (index <= 0) return false;
  return isPrerequisiteSatisfied(
    MISSIONS[index - 1].id,
    completedMissions,
    completedSteps,
  );
}

/** Step courant, replay des steps déjà faits, ou mission entièrement finie (rejouabilité depuis l’URL). */
export function canAccessMissionStep(
  mission: Mission,
  stepId: StepId,
  completedMissions: MissionId[],
  completedSteps: StepId[],
): boolean {
  if (!mission.steps.includes(stepId)) return false;
  if (!isMissionAccessible(mission.id, completedMissions, completedSteps)) {
    return false;
  }
  const nextId = getNextStep(mission, completedSteps);
  if (completedSteps.includes(stepId)) return true;
  if (nextId === null) return true;
  return stepId === nextId;
}

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
