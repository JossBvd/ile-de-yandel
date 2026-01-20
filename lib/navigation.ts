import { MissionId, StepId } from '@/types/mission';

export function getMissionPath(missionId: MissionId): string {
  return `/game/mission/${missionId}`;
}

export function getStepPath(missionId: MissionId, stepId: StepId): string {
  return `/game/mission/${missionId}/step/${stepId}`;
}

export function getGamePath(): string {
  return '/game';
}

