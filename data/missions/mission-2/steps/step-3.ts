import { Step } from "@/types/step";

export const mission2Step3: Step = {
  id: "mission-2-step-3",
  title: "Mission 2 - Step 3",
  instruction: "Sélectionnez la bonne réponse",
  narrative: "À définir avec le client",
  raftPiece: "piece-2-3",
  backgroundImage: "/backgrounds/paper_texture.webp",
  game: {
    type: "qcm",
    question: "Question placeholder pour Mission 2 - Step 3",
    options: [
      { id: "1", text: "Réponse A" },
      { id: "2", text: "Réponse B" },
      { id: "3", text: "Réponse C" },
    ],
    correctAnswers: [0],
  },
};
