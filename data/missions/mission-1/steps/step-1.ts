import { Step } from "@/types/step";

export const mission1Step1: Step = {
  id: "mission-1-step-1",
  title: "L'épave de l'avion",
  instruction: "Résous l'énigme pour trouver la première pièce du radeau.",
  narrative: `« Pour mon radeau, je vais avoir besoin d'une
voile. Aide-moi à fouiller près de l'épave de l'avion
pour trouver les matériaux nécessaires à la
fabrication ! Bonne chance ! »`,
  location: "Etape 1",
  raftPiece: "piece-1-1",
  backgroundImage: "/missions/mission-1/step-1/mission1_step1_valises.png",
  backgroundHintZones: [
    {
      x: 10.33,
      y: 38.4,
      radius: 2,
      title: "Indice 1",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-01.webp",
    },
    {
      x: 11.38,
      y: 33.46,
      radius: 1,
      title: "Indice 2",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-02.webp",
    },
    {
      x: 24.06,
      y: 64.92,
      radius: 2,
      title: "Indice 3",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-02.webp",
    },
    {
      x: 23.41,
      y: 60.1,
      radius: 1,
      title: "Indice 2",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-02.webp",
    },
    {
      x: 67.02,
      y: 63.77,
      radius: 2,
      title: "Indice 3",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-03.webp",
    },
    {
      x: 65.35,
      y: 58.55,
      radius: 2,
      title: "Indice 3",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-03.webp",
    },
    {
      x: 75.51,
      y: 86.34,
      radius: 2,
      title: "Indice 4",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-04.webp",
    },
    {
      x: 77.96,
      y: 84.61,
      radius: 1,
      title: "Indice 4",
      hint: "",
      image: "/missions/mission-1/step-1/M1_S1_popup-indice-04.webp",
    },
  ],
  game: {
    type: "enigma",
    text: "Explore la zone à la recherche d'indices, et complète la phrase en accordant correctement le participe passé du verbe « déchirer ».\n\n« Les vêtements retrouvés dans l'épave de l'avion sont tous ( déchirer ) »",
    correctAnswer: "déchirés",
  },
};
