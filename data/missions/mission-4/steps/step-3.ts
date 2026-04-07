import { Step } from "@/types/step";

export const mission4Step3: Step = {
  id: "mission-4-step-3",
  title: "La meilleure liane",
  instruction:
    "Explore la zone pour retrouver le nom de la meilleure plante pour faire des lianes",
  raftPiece: "piece-4-3",
  raftObject: {
    image: "/missions/mission-4/step-3/M4_S3_popup-grappin.webp",
    readAloudText:
      "Étape 3 accomplie. Tu as collecté : le grappin pour ton radeau",
  },
  completion: { showMissionModalAfterStep: true },
  backgroundImage:
    "/missions/mission-4/step-3/M4_background_pointclic-02.webp",
  game: {
    type: "point-click-multi-enigma",
    question:
      "Explore la zone pour retrouver le nom\nde la meilleure plante pour faire des lianes",
    correctAnswers: ["RO", "T", "IN"],
    targetIconSrc: "/missions/mission-4/step-3/M4_S3_target-icon.webp",
    targets: [
      {
        x: 5,
        y: 40,
        image: "/missions/mission-4/step-3/M4_S3_popup-indice-01.webp",
        readAloudText: "Indice 1 : ro -",
      },
      {
        x: 80,
        y: 53,
        image: "/missions/mission-4/step-3/M4_S3_popup-indice-02.webp",
        readAloudText: "Indice 2 : - t -",
      },
      {
        x: 65,
        y: 90,
        image: "/missions/mission-4/step-3/M4_S3_popup-indice-03.webp",
        readAloudText: "Indice 3 : - in",
      },
    ],
  },
};
