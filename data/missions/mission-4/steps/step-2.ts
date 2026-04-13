import { Step } from "@/types/step";

export const mission4Step2: Step = {
  id: "mission-4-step-2",
  title: "Le bon poids",
  instruction: "Remplis le panier avec les bonnes lianes",
  raftPiece: "piece-4-2",
  raftObject: {
    image: "/missions/mission-4/step-2/M4_S2_popup-propulsion.webp",
    readAloudText:
      "Étape 2 accomplie. Tu as collecté : les lianes pour ton radeau",
  },
  backgroundImage: "/missions/mission-4/step-1/M4_background_playa-02.webp",
  game: {
    type: "basket-weight",
    text: "Ajoute les bons morceaux de lianes au panier ! Attention, si c'est trop lourd, le panier va craquer !",
    basketImages: [
      "/missions/mission-4/step-2/panier1.png",
      "/missions/mission-4/step-2/panier2.png",
      "/missions/mission-4/step-2/panier3.png",
      "/missions/mission-4/step-2/panier4.png",
      "/missions/mission-4/step-2/panier5.png",
      "/missions/mission-4/step-2/panier6.png",
      "/missions/mission-4/step-2/panier7.png",
      "/missions/mission-4/step-2/panier8.png",
      "/missions/mission-4/step-2/panier9.png",
      "/missions/mission-4/step-2/panier10.png",
      "/missions/mission-4/step-2/panier11.png",
      "/missions/mission-4/step-2/panier12.png",
      "/missions/mission-4/step-2/panier13.png",
    ],
    initialWeightGrams: 1300,
    targetWeightGrams: 5000,
    items: [
      {
        id: "liane-1",
        src: "/missions/mission-4/step-2/M4_S2_lianes-01.webp",
        alt: "Morceau de liane fine",
        weightGrams: 100,
        maxUses: 5,
      },
      {
        id: "liane-2",
        src: "/missions/mission-4/step-2/M4_S2_lianes-02.webp",
        alt: "Morceau de liane grosse",
        weightGrams: 500,
        maxUses: 6,
      },
      {
        id: "liane-3",
        src: "/missions/mission-4/step-2/M4_S2_lianes-03.webp",
        alt: "Morceau de liane moyenne",
        weightGrams: 200,
        maxUses: 5,
      },
    ],
  },
};
