import { Step } from "@/types/step";

export const mission1Step3: Step = {
  id: "mission-1-step-3",
  title: "Énigme",
  instruction: "Glisse les 3 bonnes images dans l'ordre",
  narrative: `Yandel découvre une grotte mystérieuse. 
Les parois sont couvertes de dessins anciens. 
Il doit trouver la troisième pièce de son radeau.`,
  location: "Dans la grotte",
  raftPiece: "piece-1-3",
  backgroundImage: "/missions/mission-1/step-3/fond_challenge.jpg",
  game: {
    type: "drag-order-images",
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam",
    sourceImages: [
      {
        id: "img-1",
        src: "/missions/mission-1/step-3/image-1.jpg",
        alt: "Image 1",
        info: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
      },
      {
        id: "img-2",
        src: "/missions/mission-1/step-3/image-2.jpg",
        alt: "Image 2",
        info: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      },
      {
        id: "img-3",
        src: "/missions/mission-1/step-3/image-3.jpg",
        alt: "Image 3",
        info: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.",
      },
      {
        id: "img-4",
        src: "/missions/mission-1/step-3/image-4.jpg",
        alt: "Image 4",
        info: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      },
      {
        id: "img-5",
        src: "/missions/mission-1/step-3/image-5.jpg",
        alt: "Image 5",
        info: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.",
      },
    ],
    correctOrder: ["img-1", "img-3", "img-5"],
    slotsCount: 3,
  },
};
