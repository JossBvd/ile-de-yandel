import { Step } from "@/types/step";

export const mission3Step1: Step = {
  id: "mission-3-step-1",
  title: "Mission 3 - Step 1",
  narrative: "À définir avec le client",
  raftPiece: "piece-3-1",
  backgroundImage: "/backgrounds/paper_texture.webp",
  game: {
    type: "qcm",
    question: "Question placeholder pour Mission 3 - Step 1",
    options: [
      { id: "1", text: "Réponse A", isCorrect: true },
      { id: "2", text: "Réponse B", isCorrect: false },
      { id: "3", text: "Réponse C", isCorrect: false },
    ],
  },
};
