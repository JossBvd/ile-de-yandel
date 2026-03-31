import { Step } from "@/types/step";

export const mission4Step1: Step = {
  id: "mission-4-step-1",
  title: "La bonne liane",
  instruction: "Réponds à cette question",
  narrative: `« Mon radeau n'est pas assez résistant !
Cette fois-ci il me faut des lianes, mais elles
sont trop hautes.
Aide-moi à fabriquer le lance-grappin
et je pourrais aller chercher les plus solides ! »`,
  location: "Sur la plage",
  raftPiece: "piece-4-1",
  backgroundImage: "/missions/mission-4/step-1/M4_background_playa-02.webp",
  game: {
    type: "qcm",
    question:
      "À ton avis, quelles lianes seront les plus utiles pour tenir les\nrondins du radeau ensemble ?",
    options: [
      { id: "A", text: "Celles qui sont\nrigides" },
      { id: "B", text: "Celles qui sont\ntransparentes" },
      { id: "C", text: "Celles qui sont\nsouples" },
      { id: "D", text: "Celles qui sont\nlourdes" },
    ],
    correctAnswers: [2],
  },
};
