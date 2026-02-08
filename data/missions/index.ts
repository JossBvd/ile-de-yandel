import { Mission } from "@/types/mission";
import { Step } from "@/types/step";
import { mission1, mission1Steps } from "./mission-1";
import { mission2, mission2Steps } from "./mission-2";
import { mission3, mission3Steps } from "./mission-3";
import { mission4, mission4Steps } from "./mission-4";
import { mission5, mission5Steps } from "./mission-5";

/** Toutes les missions du jeu */
export const MISSIONS: Mission[] = [
  mission1,
  mission2,
  mission3,
  mission4,
  mission5,
];

/** Tous les steps de toutes les missions */
export const ALL_STEPS: Step[] = [
  ...mission1Steps,
  ...mission2Steps,
  ...mission3Steps,
  ...mission4Steps,
  ...mission5Steps,
];

/** Récupérer une mission par ID */
export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

/** Récupérer un step par ID (dans toutes les missions) */
export function getStepById(id: string): Step | undefined {
  return ALL_STEPS.find((step) => step.id === id);
}

/** Récupérer l'ID de la mission contenant un step */
export function getMissionIdByStepId(stepId: string): string | undefined {
  return MISSIONS.find((m) => m.steps.includes(stepId))?.id;
}

/** Vérifier si un step appartient à une mission */
export function isStepInMission(missionId: string, stepId: string): boolean {
  const mission = getMissionById(missionId);
  return mission?.steps.includes(stepId) ?? false;
}

/** Récupérer un step dans une mission spécifique */
export function getStepByIdInMission(
  missionId: string,
  stepId: string,
): Step | undefined {
  if (!isStepInMission(missionId, stepId)) return undefined;
  return getStepById(stepId);
}

/** Récupérer tous les steps d'une mission */
export function getStepsByMissionId(missionId: string): Step[] {
  const mission = getMissionById(missionId);
  if (!mission) return [];
  return mission.steps
    .map((stepId) => getStepById(stepId))
    .filter((step): step is Step => step !== undefined);
}
