import { Step } from "@/types/step";

export const mission4Step2: Step = {
  id: "mission-4-step-2",
  title: "Mission 4 - Step 2",
  narrative: "À définir avec le client",
  raftPiece: "piece-4-2",
  backgroundImage: "/backgrounds/paper_texture.webp",
  game: {
    type: "qcm",
    question: "Question placeholder pour Mission 4 - Step 2",
    options: [
      { id: "1", text: "Réponse A", isCorrect: true },
      { id: "2", text: "Réponse B", isCorrect: false },
      { id: "3", text: "Réponse C", isCorrect: false },
    ],
  },
};
