import { Mission } from '@/types/mission';
import { Step } from '@/types/step';
import { mission1 } from './mission-1';
import { mission2 } from './mission-2';
import { mission3 } from './mission-3';
import { mission4 } from './mission-4';
import { mission5 } from './mission-5';
import { getStepById as getStepByIdFromSteps } from '@/data/steps';

export const MISSIONS: Mission[] = [
  mission1,
  mission2,
  mission3,
  mission4,
  mission5,
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((mission) => mission.id === id);
}

export function getStepById(missionId: string, stepId: string): Step | undefined {
  const mission = getMissionById(missionId);
  if (!mission) return undefined;
  
  if (!mission.steps.includes(stepId)) {
    return undefined;
  }
  
  return getStepByIdFromSteps(stepId);
}
