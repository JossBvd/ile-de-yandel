import { Step } from "@/types/step";

export const mission3Step2: Step = {
  id: "mission-3-step-2",
  title: "Aide moi à trouver de quoi me nourrir",
  instruction:
    "Parmi ces baies, seulement quatre sont comestibles. Retrouve-les pour faire des réserves !",
  narrative: "Yondel doit identifier les baies comestibles pour survivre.",
  raftPiece: "piece-3-2",
  raftObject: {
    image: "/missions/mission-3/step-2/M3_S2_popup-baies.webp",
    readAloudText: "Étape 2 accomplie. Tu as collecté : des baies comestibles",
  },
  backgroundImage: "/missions/mission-3/step-1/M3_background_berries.webp",
  game: {
    type: "drag-order-images",
    layoutVariant: "grid-5-cols",
    text: "Parmi ces baies, seulement quatre sont comestibles. Retrouve-les pour faire des réserves !",
    sourceImages: [
      {
        id: "img-1",
        src: "/missions/mission-3/step-2/M3_S2_berries-01.webp",
        alt: "Laurier Cerise",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-01.webp",
        readAloudText: "Indice baie un.",
      },
      {
        id: "img-2",
        src: "/missions/mission-3/step-2/M3_S2_berries-02.webp",
        alt: "Gui",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-02.webp",
        readAloudText: "Indice baie deux.",
      },
      {
        id: "img-3",
        src: "/missions/mission-3/step-2/M3_S2_berries-03.webp",
        alt: "Sorbier",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-07.webp",
        readAloudText: "Indice baie sept.",
      },
      {
        id: "img-4",
        src: "/missions/mission-3/step-2/M3_S2_berries-04.webp",
        alt: "Belladone",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-10.webp",
        readAloudText: "Indice baie dix.",
      },
      {
        id: "img-5",
        src: "/missions/mission-3/step-2/M3_S2_berries-05.webp",
        alt: "Physalis",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-08.webp",
        readAloudText: "Indice baie huit.",
      },
      {
        id: "img-6",
        src: "/missions/mission-3/step-2/M3_S2_berries-06.webp",
        alt: "Douce Amère",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-03.webp",
        readAloudText: "Indice baie trois.",
      },
      {
        id: "img-7",
        src: "/missions/mission-3/step-2/M3_S2_berries-07.webp",
        alt: "Bryone Dioïque",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-05.webp",
        readAloudText: "Indice baie cinq.",
      },
      {
        id: "img-8",
        src: "/missions/mission-3/step-2/M3_S2_berries-08.webp",
        alt: "Baie d'Açaï",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-09.webp",
        readAloudText: "Indice baie neuf.",
      },
      {
        id: "img-9",
        src: "/missions/mission-3/step-2/M3_S2_berries-09.webp",
        alt: "Camu Camu",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-04.webp",
        readAloudText: "Indice baie quatre.",
      },
      {
        id: "img-10",
        src: "/missions/mission-3/step-2/M3_S2_berries-10.webp",
        alt: "Sureau",
        info: "",
        infoImage:
          "/missions/mission-3/step-2/M3_S2_popup-indice-baies-06.webp",
        readAloudText: "Indice baie six.",
      },
    ],
    correctOrder: ["img-5", "img-8", "img-9", "img-10"],
    slotsCount: 4,
    enforceOrder: false,
  },
};
