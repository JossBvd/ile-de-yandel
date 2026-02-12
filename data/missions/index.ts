import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission1, mission1Steps } from "./mission-1";
import { mission2, mission2Steps } from "./mission-2";
import { mission3, mission3Steps } from "./mission-3";
import { mission4, mission4Steps } from "./mission-4";
import { mission5, mission5Steps } from "./mission-5";

export const MISSIONS: Mission[] = [
  mission1,
  mission2,
  mission3,
  mission4,
  mission5,
];

export const ALL_STEPS: Step[] = [
  ...mission1Steps,
  ...mission2Steps,
  ...mission3Steps,
  ...mission4Steps,
  ...mission5Steps,
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function getStepById(id: string): Step | undefined {
  return ALL_STEPS.find((step) => step.id === id);
}

export function getMissionIdByStepId(stepId: string): string | undefined {
  return MISSIONS.find((m) => m.steps.includes(stepId))?.id;
}

export function isStepInMission(missionId: string, stepId: string): boolean {
  const mission = getMissionById(missionId);
  return mission?.steps.includes(stepId) ?? false;
}

export function getStepByIdInMission(
  missionId: string,
  stepId: string,
): Step | undefined {
  if (!isStepInMission(missionId, stepId)) return undefined;
  return getStepById(stepId);
}

export function getStepsByMissionId(missionId: string): Step[] {
  const mission = getMissionById(missionId);
  if (!mission) return [];
  return mission.steps
    .map((stepId) => getStepById(stepId))
    .filter((step): step is Step => step !== undefined);
}
