import { Step } from "@/types/step";

export const mission1Step2: Step = {
  id: "mission-1-step-2",
  title: "Quiz 1",
  instruction: "Réponds à cette question",
  narrative: `Yandel se retrouve sur une magnifique plage. 
Le soleil brille et les vagues viennent caresser le sable doré. 
Il doit résoudre un quiz pour obtenir la deuxième pièce de son radeau.`,
  location: "Sur la plage",
  raftPiece: "piece-1-2",
  backgroundImage: "/missions/mission-1/step-2/fond_challenge.jpg",
  hint: {
    text: "Relis bien la question et élimine les réponses qui ne collent pas au texte.",
  },
  game: {
    type: "qcm",
    question:
      "«Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam»",
    options: [
      { id: "A", text: "A" },
      { id: "B", text: "B" },
      { id: "C", text: "C" },
      { id: "D", text: "D" },
    ],
    correctAnswers: [0], // A est correct pour l'instant
  },
};
