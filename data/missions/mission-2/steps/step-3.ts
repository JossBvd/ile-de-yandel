import { Step } from "@/types/step";

export const mission2Step3: Step = {
  id: "mission-2-step-3",
  title: "Mission 2 - Step 3",
  instruction:
    "Fusionne les bons atomes pour obtenir les éléments nécessaires à la photosynthèse.",
  narrative: "À définir avec le client",
  raftPiece: "piece-2-3",
  raftObject: {
    image: "/missions/mission-2/step-3/M2_S3_popup-silex.webp",
    readAloudText: "Étape 3 accomplie. Tu as collecté : silex",
  },
  completion: { showMissionModalAfterStep: true },
  ui: {
    instructionInspectToggle: true,
    inspectLoupeIcon: "/missions/mission-2/step-3/m2_S3_loupe_icon.webp",
  },
  backgroundImage: "/missions/mission-2/step-3/M2_S3_background_plantes-02.webp",
  game: {
    type: "photosynthesis-atoms",
    text:
      "Fusionne les bons atomes pour obtenir l’eau, le dioxyde de carbone et la lumière nécessaires à la photosynthèse.",
    atoms: [
      {
        id: "atom-1",
        src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-01.webp",
        alt: "Atome gris",
      },
      {
        id: "atom-2",
        src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-02.webp",
        alt: "Atome noir",
      },
      {
        id: "atom-3",
        src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-03.webp",
        alt: "Atome bleu",
      },
      {
        id: "atom-4",
        src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-04.webp",
        alt: "Atome jaune",
      },
      {
        id: "atom-5",
        src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-05.webp",
        alt: "Atome rouge",
      },
      {
        id: "atom-6",
        src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-06.webp",
        alt: "Atome violet",
      },
    ],
    recipes: [
      {
        key: "water",
        label: "Eau (H₂O)",
        speech: "Eau, H 2 O",
        atomCounts: { "atom-3": 2, "atom-2": 1 },
      },
      {
        key: "co2",
        label: "Dioxyde de carbone (CO₂)",
        speech: "Dioxyde de carbone, C O 2",
        atomCounts: { "atom-1": 1, "atom-2": 2 },
      },
      {
        key: "light",
        label: "Lumière (photons)",
        speech: "Lumière, photons",
        atomCounts: { "atom-5": 2, "atom-6": 1 },
      },
    ],
    inspectTargets: [
      {
        top: "25%",
        left: "78%",
        image: "/missions/mission-2/step-3/M2_S3_popup-indice-01.webp",
        readAloudText: "Cette plante a besoin d'eau",
      },
      {
        top: "63%",
        left: "17%",
        image: "/missions/mission-2/step-3/M2_S3_popup-indice-02.webp",
        readAloudText: "Cette plante utilise du dioxyde de carbone",
      },
      {
        top: "68%",
        left: "80%",
        image: "/missions/mission-2/step-3/M2_S3_popup-indice-03.webp",
        readAloudText:
          "La croissance se fait grâce aux photons lumineux",
      },
    ],
    ui: {
      targetIconSrc: "/missions/mission-2/step-3/M2_S3_target-icon.webp",
    },
    bar: {
      fusion:
        "Fusionne les bons atomes pour obtenir les éléments nécessaires à la PHOTOSYNTHÈSE",
      fusionSpeech:
        "Fusionne les bons atomes pour obtenir les éléments nécessaires à la photosynthèse.",
      inspect: "Explore la zone à la recherche d'indices",
      inspectSpeech: "Explore la zone à la recherche d'indices.",
    },
  },
};
