import { Step } from "@/types/step";

export const mission3Step3: Step = {
  id: "mission-3-step-3",
  title: "Décodage",
  instruction:
    "Quel est le synonyme de tropical, dans le contexte d’un climat chaud et humide ? Pour le savoir, trouve la solution à cette énigme.",
  narrative: "Yondel doit décoder les lettres pour trouver le mot juste.",
  raftPiece: "piece-3-3",
  raftObject: {
    image: "/missions/mission-3/step-3/M3_S2_popup-fruits.webp",
    readAloudText: "Étape 3 accomplie. Tu as collecté : des fruits",
  },
  completion: { showMissionModalAfterStep: true },
  backgroundImage: "/missions/mission-3/step-1/M3_background_berries.webp",
  hint: {
    image: "/missions/mission-3/step-3/M3_S3_indice_décodage.webp",
    readAloudText: "Indice visuel pour l'énigme de décodage.",
  },
  game: {
    type: "enigma",
    text: "Quel est le synonyme de tropical,\ndans le contexte d’un climat chaud et humide ?\nPour le savoir, trouve la solution à cette énigme.",
    correctAnswer: "équatorial",
    layout: "letter-decode",
    decodeLetterImages: [
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-01.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-02.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-03.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-04.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-05.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-06.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-07.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-08.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-09.webp",
      "/missions/mission-3/step-3/M3_S3_lettres-decodage-10.webp",
    ],
  },
};
