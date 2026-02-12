import { StepId } from "@/types/step";
import { MissionId } from "@/types/mission";

/**
 * Extrait le slug du step depuis l'ID complet.
 * Ex: "mission-1-step-1" → "step-1"
 */
export function getStepSlug(missionId: MissionId, stepId: StepId): string {
  const prefix = `${missionId}-`;
  return stepId.startsWith(prefix) ? stepId.slice(prefix.length) : stepId;
}

/**
 * Reconstitue l'ID complet du step depuis le missionId et le slug.
 * Ex: ("mission-1", "step-1") → "mission-1-step-1"
 */
export function getStepIdFromSlug(
  missionId: MissionId,
  stepSlug: string,
): StepId {
  return `${missionId}-${stepSlug}`;
}

/**
 * Chemin vers un step (mini-jeu).
 * Format: /mission-X/step-Y
 *
 * @param missionId - ID de la mission (ex: "mission-1")
 * @param stepId - ID complet du step (ex: "mission-1-step-1")
 * @returns Le chemin URL vers le step
 */
export function getStepPath(missionId: MissionId, stepId: StepId): string {
  const stepSlug = getStepSlug(missionId, stepId);
  return `/${missionId}/${stepSlug}`;
}

/**
 * Chemin vers le menu principal de l'île
 */
export function getIlePath(): string {
  return "/carte-de-l-ile";
}

/**
 * Chemin vers la page d'accueil
 */
export function getHomePath(): string {
  return "/";
}
