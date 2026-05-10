import { Step } from "@/types/step";

export const mission3Step1: Step = {
  id: "mission-3-step-1",
  title: "Exploration",
  instruction:
    "Sélectionne les explorateurs qui appartiennent à la Renaissance",
  narrative: `« Avant de pouvoir rentrer chez moi, j'ai besoin de rassembler des vivres !

Aide moi à explorer les environs pour trouver de la nourriture ! »`,
  raftPiece: "piece-3-1",
  raftObject: {
    image: "/missions/mission-3/step-1/M3_S1_popup-noix.webp",
    readAloudText: "Étape 1 accomplie. Tu as collecté : noix",
  },
  backgroundImage: "/missions/mission-3/step-1/M3_background_berries.webp",
  game: {
    type: "drag-select-image",
    text: "Sélectionne les explorateurs qui appartiennent à la Renaissance",
    images: [
      {
        id: "img-1",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-02.webp",
        alt: "Vascos de gama",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-02.webp",
        readAloudText: "Indice de l'image deux.",
      },
      {
        id: "img-2",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-01.webp",
        alt: "Roald Amundsen",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-01.webp",
        readAloudText: "Indice de l'image un.",
      },
      {
        id: "img-3",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-03.webp",
        alt: "Fernand de Magellan",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-03.webp",
        readAloudText: "Indice de l'image trois.",
      },
      {
        id: "img-4",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-06.webp",
        alt: "David Livingstone",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-06.webp",
        readAloudText: "Indice de l'image six.",
      },
      {
        id: "img-5",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-04.webp",
        alt: "James Cook",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-04.webp",
        readAloudText: "Indice de l'image quatre.",
      },
      {
        id: "img-6",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-05.webp",
        alt: "Christophe Colomb",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-05.webp",
        readAloudText: "Indice de l'image cinq.",
      },
      {
        id: "img-7",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-07.webp",
        alt: "Marco Polo",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-07.webp",
        readAloudText: "Indice de l'image sept.",
      },
      {
        id: "img-8",
        src: "/missions/mission-3/step-1/M3_S1_popup_photos_explorateurs-08.webp",
        alt: "Amerigo Vespucci",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-08.webp",
        readAloudText: "Indice de l'image huit.",
      },
    ],
    correctImages: ["img-1", "img-3", "img-6", "img-7"],
    maxSelections: 4,
  },
};
