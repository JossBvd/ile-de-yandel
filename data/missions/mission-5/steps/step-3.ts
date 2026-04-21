import { Step } from "@/types/step";

export const mission5Step3: Step = {
  id: "mission-5-step-3",
  title: "La bonne quantité",
  instruction: "Ajoute les bonnes quantités d'eau à ta gourde.",
  narrative: "À définir avec le client",
  raftPiece: "piece-5-3",
  raftObject: {
    image: "/missions/mission-5/step-3/M5_S3_popup-tuyaux.webp",
    readAloudText: "Étape 3 accomplie. Tu as collecté : tuyaux",
  },
  completion: {
    showMissionModalAfterStep: true,
  },
  backgroundImage: "/missions/mission-5/step-2/M5_S2_background_island-02.webp",
  game: {
    type: "basket-weight",
    text: `Ajoute les bonnes quantités d'eau à ta gourde.
Attention, si tu en mets trop, tu vas
gâcher de l'eau !`,
    basketImages: [
      "/missions/mission-5/step-3/M5_S3_gourde-01.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-02.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-03.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-04.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-05.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-06.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-07.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-08.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-09.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-10.webp",
      "/missions/mission-5/step-3/M5_S3_gourde-11.webp",
    ],
    overflowImage: "/missions/mission-5/step-3/M5_S3_gourde-12.webp",
    initialWeightGrams: 0,
    targetWeightGrams: 100,
    measurementUnit: "centiliters",
    resetButtonLabel: "Remonter le temps",
    items: [
      {
        id: "conteneur-02",
        src: "/missions/mission-5/step-3/M5_S3_photo-contenants-01.webp",
        alt: "Contenant d'eau de 0,2 litre",
        weightGrams: 20,
        maxUses: 4,
      },
      {
        id: "conteneur-03",
        src: "/missions/mission-5/step-3/M5_S3_photo-contenants-02.webp",
        alt: "Contenant d'eau de 0,3 litre",
        weightGrams: 30,
        maxUses: 1,
      },
      {
        id: "conteneur-01",
        src: "/missions/mission-5/step-3/M5_S3_photo-contenants-03.webp",
        alt: "Contenant d'eau de 0,1 litre",
        weightGrams: 10,
        maxUses: 2,
      },
    ],
  },
};
