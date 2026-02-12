import { Step } from "@/types/step";

export const mission2Step1: Step = {
  id: "mission-2-step-1",
  title: "Mission 2 - Step 1",
  instruction: "Sélectionnez la bonne réponse",
  narrative: "À définir avec le client",
  raftPiece: "piece-2-1",
  backgroundImage: "/backgrounds/paper_texture.webp",
  game: {
    type: "qcm",
    question: "Question placeholder pour Mission 2 - Step 1",
    options: [
      { id: "1", text: "Réponse A" },
      { id: "2", text: "Réponse B" },
      { id: "3", text: "Réponse C" },
    ],
    correctAnswers: [0],
  },
};
