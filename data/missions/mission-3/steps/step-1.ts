import { Step } from "@/types/step";

export const mission3Step1: Step = {
  id: "mission-3-step-1",
  title: "Exploration",
  instruction: "Sélectionne les explorateurs qui appartiennent à la Renaissance",
  narrative:
    "« Avant de pouvoir rentrer chez moi,\nj’ai besoin de rassembler des vivres !\nAide moi à explorer les environs pour\ntrouver de la nourriture ! »",
  raftPiece: "piece-3-1",
  backgroundImage: "/missions/mission-3/step-1/M3_background_berries.webp",
  game: {
    type: "drag-select-image",
    text: "Sélectionne les explorateurs qui appartiennent à la Renaissance",
    images: [
      {
        id: "img-1",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-02.webp",
        alt: "Vascos de gama",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-02.webp",
      },
      {
        id: "img-2",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-01.webp",
        alt: "Roald Amundsen",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-01.webp",
      },
      {
        id: "img-3",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-03.webp",
        alt: "Fernand de Magellan",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-03.webp",
      },
      {
        id: "img-4",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-06.webp",
        alt: "David Livingstone",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-06.webp",
      },
      {
        id: "img-5",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-04.webp",
        alt: "James Cook",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-04.webp",
      },
      {
        id: "img-6",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-05.webp",
        alt: "Christophe Colomb",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-05.webp",
      },
      {
        id: "img-7",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-07.webp",
        alt: "Marco Polo",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-07.webp",
      },
      {
        id: "img-8",
        src: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-08.webp",
        alt: "Amerigo Vespucci",
        info: "",
        infoImage: "/missions/mission-3/step-1/m3_S1_popup_indice_photos-08.webp",
      },
    ],
    correctImages: ["img-1", "img-3", "img-6", "img-7"],
    maxSelections: 4,
  },
};
