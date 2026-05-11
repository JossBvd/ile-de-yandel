import { Step } from "@/types/step";

export const mission2Step2: Step = {
  id: "mission-2-step-2",
  title: "Aide moi à trouver de quoi assembler ma hache",
  instruction:
    "Classe ces matériaux par densité, du moins dense au plus dense.",
  narrative: `Yandel a trouvé un bâton. Il doit maintenant trouver de quoi assembler sa hache.`,
  location: "Dans la jungle",
  raftPiece: "piece-2-2",
  raftObject: {
    image: "/missions/mission-2/step-2/M2_S2_popup-liane.webp",
    readAloudText: "Étape 2 accomplie. Tu as collecté : liane",
  },
  backgroundImage: "/missions/mission-2/step-1/M2_background_jungle1.webp",
  game: {
    type: "drag-order-images",
    layoutVariant: "compact-source",
    text: "Classe ces matériaux par densité, du moins dense au plus dense.",
    sourceImages: [
      {
        id: "img-1",
        src: "/missions/mission-2/step-2/M2_S2_photo-01.webp",
        alt: "Lianes et feuillages",
        info: "",
        infoImage:
          "/missions/mission-2/step-2/m2_S2_popup_indice_photos-01.webp",
        readAloudText: "Indice: lianes et feuillages, peu denses",
      },
      {
        id: "img-2",
        src: "/missions/mission-2/step-2/M2_S2_photo-02.webp",
        alt: "Pierre couverte de mousse",
        info: "",
        infoImage:
          "/missions/mission-2/step-2/m2_S2_popup_indice_photos-02.webp",
        readAloudText: "Indice: pierre couverte de mousse",
      },
      {
        id: "img-3",
        src: "/missions/mission-2/step-2/M2_S2_photo-03.webp",
        alt: "Coquillages sur le sable",
        info: "",
        infoImage:
          "/missions/mission-2/step-2/m2_S2_popup_indice_photos-03.webp",
        readAloudText: "Indice: coquillages sur le sable",
      },
      {
        id: "img-4",
        src: "/missions/mission-2/step-2/M2_S2_photo-04.webp",
        alt: "Feuilles mortes et écorces",
        info: "",
        infoImage:
          "/missions/mission-2/step-2/m2_S2_popup_indice_photos-04.webp",
        readAloudText: "Indice: feuilles mortes et écorces",
      },
      {
        id: "img-5",
        src: "/missions/mission-2/step-2/M2_S2_photo-05.webp",
        alt: "Terre ou paille",
        info: "",
        infoImage:
          "/missions/mission-2/step-2/m2_S2_popup_indice_photos-05.webp",
        readAloudText: "Indice: terre ou paille, plus dense",
      },
    ],
    correctOrder: ["img-5", "img-4", "img-1", "img-3", "img-2"],
    slotsCount: 5,
  },
};
