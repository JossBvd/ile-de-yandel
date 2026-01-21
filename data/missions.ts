import { Mission } from "@/types/mission";

// Mission temporaire pour le step 1 - À compléter avec le client
// Les zones cliquables sont des exemples, à remplacer par les vraies coordonnées
export const step1Mission1: Mission = {
  id: "step-1-mission-1",
  type: "image-click",
  title: "Trouve les 5 objets cachés",
  instruction: "Clique sur les 5 objets cachés dans la jungle",
  image: "/backgrounds/jungle.webp",
  clickableZones: [
    // Zone 1 - Objet 1 (exemple, à remplacer)
    {
      type: "circle",
      x: 20, // Coordonnée X en pourcentage (0-100)
      y: 30, // Coordonnée Y en pourcentage (0-100)
      radius: 3, // Rayon en pourcentage
    },
    // Zone 2 - Objet 2 (exemple, à remplacer)
    {
      type: "circle",
      x: 50,
      y: 40,
      radius: 3,
    },
    // Zone 3 - Objet 3 (exemple, à remplacer)
    {
      type: "circle",
      x: 70,
      y: 50,
      radius: 3,
    },
    // Zone 4 - Objet 4 (exemple, à remplacer)
    {
      type: "circle",
      x: 30,
      y: 60,
      radius: 3,
    },
    // Zone 5 - Objet 5 (exemple, à remplacer)
    {
      type: "circle",
      x: 80,
      y: 70,
      radius: 3,
    },
  ],
  hint: {
    text: "Indice optionnel pour aider à trouver les objets",
  },
};

// Toutes les missions du jeu
export const ALL_MISSIONS: Mission[] = [
  step1Mission1,
  // Les autres missions seront ajoutées ici au fur et à mesure
];

export function getMissionById(missionId: string): Mission | undefined {
  return ALL_MISSIONS.find((mission) => mission.id === missionId);
}

export function getMissionsByIds(missionIds: string[]): Mission[] {
  return missionIds
    .map((id) => getMissionById(id))
    .filter((mission): mission is Mission => mission !== undefined);
}
