import { Step } from "@/types/step";

export const mission1Step1: Step = {
  id: "mission-1-step-1",
  title: "Etape 1",
  instruction: "Résous l'énigme pour trouver la première pièce du radeau.",
  narrative: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.`,
  location: "Etape 1",
  raftPiece: "piece-1-1",
  backgroundImage: "/missions/mission-1/step-1/mission1_step1_valises.png",
  backgroundHintZones: [
    {
      x: 40,
      y: 50,
      radius: 3,
      title: "objet",
      hint: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      // image: "/missions/mission-1/step-1/objet-indice.webp", // optionnel
    },
  ],
  hint: {
    text: "Indice optionnel pour aider à trouver les objets",
  },
  game: {
    type: "enigma",
    text: "Explore la zone à la recherche d'indices, et complète la phrase en accordant correctement le participe passé du verbe « déchirer ».\n\n« Les vêtements retrouvés dans l'épave de l'avion sont tous ( déchirer ) »",
    correctAnswer: "déchirés",
  },
};
