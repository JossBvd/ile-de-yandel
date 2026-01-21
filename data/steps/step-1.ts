import { Step } from '@/types/step';
import { step1Mission1 } from '@/data/missions';

export const step1: Step = {
  id: 'step-1',
  title: 'La Plage',
  description: 'Première étape de votre aventure',
  location: 'Sur la plage',
  narrative: `Yandel s'est réveillé sur une plage de sable fin. 
Le soleil brille et la mer est calme. 
Il doit trouver la première pièce de son radeau.`,
  missions: [step1Mission1.id], // Missions du step 1
  raftPiece: 'piece-1',
};
