import { Step } from "@/types/step";

export const mission1Step2: Step = {
  id: "mission-1-step-2",
  title: "Synthétique",
  instruction: "Réponds à cette question",
  narrative: `Yandel se retrouve sur une magnifique plage. 
Le soleil brille et les vagues viennent caresser le sable doré. 
Il doit résoudre un quiz pour obtenir la deuxième pièce de son radeau.`,
  location: "Sur la plage",
  raftPiece: "piece-1-2",
  backgroundImage: "/missions/mission-1/step-2/M1_S2_background_quiz.webp",
  hint: {
    text: "Relis bien la question et élimine les réponses qui ne collent pas au texte.",
  },
  game: {
    type: "qcm",
    question: "Quel est le principal avantage d'un tissu synthétique pour résister aux conditions marines ?",
    options: [
      { id: "A", text: "Il est plus lourd et plus facile à coudre" },
      { id: "B", text: "Il résiste à l'eau et sèche plus vite" },
      { id: "C", text: "Il a une couleur visible pour les secours" },
      { id: "D", text: "Il est biodégradable océan" },
    ],
    correctAnswers: [1], // B est correct
  },
};
