import { Step } from "@/types/step";

export const mission1Step3: Step = {
  id: "mission-1-step-3",
  title: "Fais glisser les bonnes images dans les cases",
  instruction: "Fais glisser les bonnes images dans les cases",
  narrative: `Yandel découvre une grotte mystérieuse. 
Les parois sont couvertes de dessins anciens. 
Il doit trouver la troisième pièce de son radeau.`,
  location: "Dans la grotte",
  raftPiece: "piece-1-3",
  backgroundImage: "/missions/mission-1/step-2/M1_S2_background_quiz.webp",
  game: {
    type: "drag-order-images",
    text: "Quelles sont les caractéristiques principales d'un climat tropical ?",
    sourceImages: [
      {
        id: "img-1",
        src: "/missions/mission-1/step-3/M1_S3_photo-01.webp",
        alt: "Photo 1",
        info: "",
        infoImage: "/missions/mission-1/step-3/m1_S3_popup_indice_photos-04.webp",
      },
      {
        id: "img-2",
        src: "/missions/mission-1/step-3/M1_S3_photo-02.webp",
        alt: "Photo 2",
        info: "",
        infoImage: "/missions/mission-1/step-3/m1_S3_popup_indice_photos-05.webp",
      },
      {
        id: "img-3",
        src: "/missions/mission-1/step-3/M1_S3_photo-03.webp",
        alt: "Photo 3",
        info: "",
        infoImage: "/missions/mission-1/step-3/m1_S3_popup_indice_photos-03.webp",
      },
      {
        id: "img-4",
        src: "/missions/mission-1/step-3/M1_S3_photo-04.webp",
        alt: "Photo 4",
        info: "",
        infoImage: "/missions/mission-1/step-3/m1_S3_popup_indice_photos-02.webp",
      },
      {
        id: "img-5",
        src: "/missions/mission-1/step-3/M1_S3_photo-05.webp",
        alt: "Photo 5",
        info: "",
        infoImage: "/missions/mission-1/step-3/m1_S3_popup_indice_photos-01.webp",
      },
    ],
    correctOrder: ["img-1", "img-5"],
    slotsCount: 2,
  },
};
