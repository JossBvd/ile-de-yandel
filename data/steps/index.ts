import { Step } from '@/types/step';
import { step1 } from './step-1';
import { step2 } from './step-2';
import { step3 } from './step-3';
import { step4 } from './step-4';
import { step5 } from './step-5';
import { getMissionById as getMissionByIdFromMissions } from '@/data/missions';

export const STEPS: Step[] = [
  step1,
  step2,
  step3,
  step4,
  step5,
];

export function getStepById(id: string): Step | undefined {
  return STEPS.find((step) => step.id === id);
}

export function getMissionById(stepId: string, missionId: string) {
  const step = getStepById(stepId);
  if (!step) return undefined;
  
  if (!step.missions.includes(missionId)) {
    return undefined;
  }
  
  return getMissionByIdFromMissions(missionId);
}
