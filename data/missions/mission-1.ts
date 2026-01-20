import { Mission } from '@/types/mission';
import { step1 } from '@/data/steps';

export const mission1: Mission = {
  id: 'mission-1',
  title: 'Mission 1 : La Plage',
  description: 'Première étape de votre aventure',
  location: 'Sur la plage',
  narrative: `Yandel s'est réveillé sur une plage de sable fin. 
Le soleil brille et la mer est calme. 
Il doit trouver la première pièce de son radeau.`,
  steps: [step1.id],
  raftPiece: 'piece-1',
};
