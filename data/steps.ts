import { Step } from "@/types/step";

// Exemple de step pour la mission 1 (QCM simple - une seule réponse)
export const step1: Step = {
  id: "mission-1-step-1",
  type: "qcm",
  title: "Question de français",
  instruction: "Choisis la bonne réponse",
  question: 'Quel est le déterminant dans la phrase : "Le chat dort" ?',
  options: [
    { id: "opt-1", text: "Le" },
    { id: "opt-2", text: "chat" },
    { id: "opt-3", text: "dort" },
  ],
  correctAnswers: [0], // Une seule réponse correcte
};

// Exemple de QCM à réponses multiples
export const step1Multiple: Step = {
  id: "mission-1-step-1-multiple",
  type: "qcm",
  title: "Question à réponses multiples",
  instruction: "Sélectionne toutes les bonnes réponses",
  question:
    'Quels sont les déterminants dans la phrase : "Le chat et la souris" ?',
  options: [
    { id: "opt-1", text: "Le" },
    { id: "opt-2", text: "chat" },
    { id: "opt-3", text: "et" },
    { id: "opt-4", text: "la" },
    { id: "opt-5", text: "souris" },
  ],
  correctAnswers: [0, 3], // Deux réponses correctes : "Le" et "la"
};

// Tous les steps du jeu
export const ALL_STEPS: Step[] = [
  step1,
  // Ajouter les autres steps ici au fur et à mesure
];

export function getStepById(stepId: string): Step | undefined {
  return ALL_STEPS.find((step) => step.id === stepId);
}

export function getStepsByIds(stepIds: string[]): Step[] {
  return stepIds
    .map((id) => getStepById(id))
    .filter((step): step is Step => step !== undefined);
}
