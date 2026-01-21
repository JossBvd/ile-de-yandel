import { Step, StepId, MissionId } from '@/types/step';

export function isStepCompleted(
  step: Step,
  completedMissions: MissionId[]
): boolean {
  return step.missions.every(missionId => completedMissions.includes(missionId));
}

export function getNextMission(
  step: Step,
  completedMissions: MissionId[]
): MissionId | null {
  return step.missions.find(missionId => !completedMissions.includes(missionId)) || null;
}

export function getCurrentMissionIndex(
  step: Step,
  currentMission: MissionId
): number {
  return step.missions.indexOf(currentMission);
}

export function getStepProgress(
  step: Step,
  completedMissions: MissionId[]
): number {
  const completed = step.missions.filter(missionId => 
    completedMissions.includes(missionId)
  ).length;
  return (completed / step.missions.length) * 100;
}
