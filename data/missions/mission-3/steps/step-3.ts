import { Step } from "@/types/step";

export const mission3Step3: Step = {
  id: "mission-3-step-3",
  title: "Mission 3 - Step 3",
  instruction: "Sélectionnez la bonne réponse",
  narrative: "À définir avec le client",
  raftPiece: "piece-3-3",
  backgroundImage: "/backgrounds/paper_texture.webp",
  game: {
    type: "qcm",
    question: "Question placeholder pour Mission 3 - Step 3",
    options: [
      { id: "1", text: "Réponse A" },
      { id: "2", text: "Réponse B" },
      { id: "3", text: "Réponse C" },
    ],
    correctAnswers: [0],
  },
};
