import { Step } from "@/types/step";

export const mission5Step2: Step = {
  id: "mission-5-step-2",
  title: "Aide moi à découvrir sur quelle île je me trouve",
  instruction: "Résous l'énigme pour continuer.",
  narrative: "À définir avec le client",
  raftPiece: "piece-5-2",
  raftObject: {
    image: "/missions/mission-5/step-2/M5_S2_popup-pompe.webp",
    readAloudText: "Étape 2 accomplie. Tu as collecté : pompe",
  },
  ui: {
    backgroundHintDisplay: "inline",
  },
  backgroundImage: "/missions/mission-5/step-2/M5_S2_background_island-02.webp",
  backgroundHintZones: [
    {
      x: 54,
      y: 30,
      radius: 3,
      title: "Indice 1",
      hint: "",
      image: "/missions/mission-5/step-2/M5_S2_popup-indice-01.webp",
      icon: "/missions/mission-5/step-2/M5_S2_icon_paw.webp",
      readAloudText: "Indice 1.",
    },
    {
      x: 30,
      y: 39,
      radius: 3,
      title: "Indice 2",
      hint: "",
      image: "/missions/mission-5/step-2/M5_S2_popup-indice-02.webp",
      icon: "/missions/mission-5/step-2/M5_S2_icon_paw.webp",
      readAloudText: "Indice 2.",
    },
    {
      x: 22,
      y: 64,
      radius: 3,
      title: "Indice 3",
      hint: "",
      image: "/missions/mission-5/step-2/M5_S2_popup-indice-03.webp",
      icon: "/missions/mission-5/step-2/M5_S2_icon_paw.webp",
      readAloudText: "Indice 3.",
    },
    {
      x: 82,
      y: 52,
      radius: 3,
      title: "Indice 4",
      hint: "",
      image: "/missions/mission-5/step-2/M5_S2_popup-indice-04.webp",
      icon: "/missions/mission-5/step-2/M5_S2_icon_paw.webp",
      readAloudText: "Indice 4.",
    },
  ],
  game: {
    type: "enigma",
    text: `Aide moi à découvrir sur quelle île je me trouve

Interroge les animaux
et devine où s’est écrasé l’avion`,
    correctAnswer: "madagascar",
  },
};
