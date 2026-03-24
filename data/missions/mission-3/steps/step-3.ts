import { Step } from "@/types/step";

export const mission3Step3: Step = {
  id: "mission-3-step-3",
  title: "Décodage",
  instruction:
    "Quel est le synonyme de tropical, dans le contexte d’un climat chaud et humide ? Pour le savoir, trouve la solution à cette énigme.",
  narrative: "Yandel doit décoder les lettres pour trouver le mot juste.",
  raftPiece: "piece-3-3",
  backgroundImage: "/missions/mission-3/step-1/M3_background_berries.webp",
  game: {
    type: "enigma",
    text: "Quel est le synonyme de tropical,\ndans le contexte d’un climat chaud et humide ?\nPour le savoir, trouve la solution à cette énigme.",
    correctAnswer: "équatorial",
  },
};
