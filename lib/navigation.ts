import { StepId, MissionId } from '@/types/step';

export function getStepPath(stepId: StepId): string {
  return `/game/step/${stepId}`;
}

export function getMissionPath(stepId: StepId, missionId: MissionId): string {
  return `/game/step/${stepId}/mission/${missionId}`;
}

export function getGamePath(): string {
  return '/game';
}
