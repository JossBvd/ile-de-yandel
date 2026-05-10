import { Step } from "@/types/step";

export const mission2Step1: Step = {
  id: "mission-2-step-1",
  title: "Dans la forêt",
  instruction: "Réponds à la question pour trouver de quoi fabriquer la hache.",
  narrative: `« Pour mon radeau, je vais avoir besoin d'une hache pour couper des rondins.

Aide-moi à explorer la forêt pour trouver de quoi la fabriquer ! »`,
  location: "Etape 1",
  raftPiece: "piece-2-1",
  raftObject: {
    image: "/missions/mission-2/step-1/M2_S1_popup_baton.webp",
    readAloudText: "Étape 1 accomplie. Tu as collecté : bâton",
  },
  backgroundImage: "/missions/mission-2/step-1/M2_background_jungle1.webp",
  game: {
    type: "enigma",
    text: "Aide-moi à trouver la bonne quantité de rondins !\n\nPour construire un radeau solide, j'ai besoin de 14 rondins de bois, chacun mesurant 2,5 mètres de long.\n\nQuelle longueur totale de bois dois-je couper\npour avoir tous mes rondins ?",
    correctAnswer: "35",
    layout: "stacked",
  },
};
