import { Step } from "@/types/step";

export const mission5Step1: Step = {
  id: "mission-5-step-1",
  title: "Trop salée",
  instruction: "Réponds à cette question",
  narrative: `Avant de pouvoir rentrer chez moi, j'ai besoin de rassembler des vivres !

Aide moi à explorer les environs pour trouver de la nourriture !`,
  raftPiece: "piece-5-1",
  raftObject: {
    image: "/missions/mission-5/step-1/M5_S1_popup-gourde.webp",
    readAloudText: "Étape 1 accomplie. Tu as collecté : gourde",
  },
  backgroundImage: "/missions/mission-5/step-1/M5_background_beach-02.webp",
  game: {
    type: "qcm",
    question: `Yandel suit la rivière qui descend de la montagne jusqu’à la mer.
Il veut remplir sa gourde près de la mer, mais l’eau y est légèrement salée.
alors que celle de la montagne ne l’était pas. Pourquoi ?`,
    options: [
      { id: "A", text: "L’eau douce s’évapore\nquand elle descend" },
      { id: "B", text: "Il y a beaucoup de sel\ndans la montagne" },
      { id: "C", text: "L’eau de la mer s’est\nmélangée à l’eau douce" },
      { id: "D", text: "L’eau de pluie a salé\nla rivière" },
    ],
    correctAnswers: [2],
    twoStepValidation: true,
  },
};
