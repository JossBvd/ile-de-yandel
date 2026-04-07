import { StepId } from "@/types/step";
import { MissionId } from "@/types/mission";
import { getMissionById } from "@/data/missions";

export function validateMissionId(id: string): id is MissionId {
  return getMissionById(id) !== undefined;
}

export function validateStepSlug(missionId: string, stepSlug: string): boolean {
  if (!validateMissionId(missionId)) return false;
  const mission = getMissionById(missionId)!;
  const stepId = getStepIdFromSlug(missionId, stepSlug);
  return mission.steps.includes(stepId);
}

export function validateStepIdFromSlug(
  missionId: string,
  stepSlug: string,
): StepId | null {
  if (!validateMissionId(missionId)) return null;
  const mission = getMissionById(missionId)!;
  const stepId = getStepIdFromSlug(missionId as MissionId, stepSlug);
  return mission.steps.includes(stepId) ? stepId : null;
}

export function getStepSlug(missionId: MissionId, stepId: StepId): string {
  const prefix = `${missionId}-`;
  return stepId.startsWith(prefix) ? stepId.slice(prefix.length) : stepId;
}

export function getStepIdFromSlug(
  missionId: MissionId,
  stepSlug: string,
): StepId {
  return `${missionId}-${stepSlug}`;
}

export function getStepPath(missionId: MissionId, stepId: StepId): string {
  const stepSlug = getStepSlug(missionId, stepId);
  return `/${missionId}/${stepSlug}`;
}

export function getIlePath(): string {
  return "/carte-de-l-ile";
}

export function getHomePath(): string {
  return "/";
}
