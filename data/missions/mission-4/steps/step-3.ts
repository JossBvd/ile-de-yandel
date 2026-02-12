import { Step } from "@/types/step";

export const mission4Step3: Step = {
  id: "mission-4-step-3",
  title: "Mission 4 - Step 3",
  instruction: "Sélectionnez la bonne réponse",
  narrative: "À définir avec le client",
  raftPiece: "piece-4-3",
  backgroundImage: "/backgrounds/paper_texture.webp",
  game: {
    type: "qcm",
    question: "Question placeholder pour Mission 4 - Step 3",
    options: [
      { id: "1", text: "Réponse A" },
      { id: "2", text: "Réponse B" },
      { id: "3", text: "Réponse C" },
    ],
    correctAnswers: [0],
  },
};
