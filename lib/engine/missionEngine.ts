import { Mission, QCMMission, DragSortMission, DragSelectImageMission, BasketFillMission, BottleEmptyMission, ImageClickMission } from '@/types/mission';

export interface MissionValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateMissionAnswer(
  mission: Mission,
  userAnswer: unknown
): MissionValidationResult {
  switch (mission.type) {
    case 'qcm':
      return validateQCM(mission, userAnswer as number | number[]);
    
    case 'drag-sort':
      return validateDragSort(mission, userAnswer as string[]);
    
    case 'drag-select-image':
      return validateDragSelectImage(mission, userAnswer as string[]);
    
    case 'basket-fill':
      return validateBasketFill(mission, userAnswer as string[]);
    
    case 'bottle-empty':
      return validateBottleEmpty(mission, userAnswer as string[]);
    
    case 'image-click':
      return validateImageClick(mission, userAnswer as { x: number; y: number }[]);
    
    default:
      return { isValid: false, message: 'Type de mission non reconnu' };
  }
}

function validateQCM(mission: QCMMission, userAnswer: number | number[]): MissionValidationResult {
  // Normaliser la réponse utilisateur en tableau
  const selectedIndices = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
  
  // Vérifier que le nombre de réponses sélectionnées correspond
  if (selectedIndices.length !== mission.correctAnswers.length) {
    return { 
      isValid: false, 
      message: mission.correctAnswers.length > 1 
        ? `Vous devez sélectionner ${mission.correctAnswers.length} réponse(s). Réessayez !`
        : 'Réponse incorrecte. Réessayez !'
    };
  }
  
  // Vérifier que toutes les réponses sélectionnées sont correctes
  const allCorrect = selectedIndices.every(index => 
    mission.correctAnswers.includes(index)
  ) && mission.correctAnswers.every(correctIndex =>
    selectedIndices.includes(correctIndex)
  );
  
  if (allCorrect) {
    return { isValid: true };
  }
  
  return { 
    isValid: false, 
    message: mission.correctAnswers.length > 1
      ? 'Certaines réponses sont incorrectes. Réessayez !'
      : 'Réponse incorrecte. Réessayez !'
  };
}

function validateDragSort(mission: DragSortMission, order: string[]): MissionValidationResult {
  if (order.length !== mission.correctOrder.length) {
    return { isValid: false, message: 'Ordre incomplet. Réessayez !' };
  }
  
  const isCorrect = order.every((id, index) => id === mission.correctOrder[index]);
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Ordre incorrect. Réessayez !' };
}

function validateDragSelectImage(mission: DragSelectImageMission, selectedIds: string[]): MissionValidationResult {
  if (selectedIds.length !== mission.correctImages.length) {
    return { isValid: false, message: 'Sélection incomplète. Réessayez !' };
  }
  
  const isCorrect = mission.correctImages.every(id => selectedIds.includes(id)) &&
                    selectedIds.every(id => mission.correctImages.includes(id));
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Sélection incorrecte. Réessayez !' };
}

function validateBasketFill(mission: BasketFillMission, selectedIds: string[]): MissionValidationResult {
  if (selectedIds.length !== mission.correctItems.length) {
    return { isValid: false, message: 'Panier incomplet. Réessayez !' };
  }
  
  const isCorrect = mission.correctItems.every(id => selectedIds.includes(id)) &&
                    selectedIds.every(id => mission.correctItems.includes(id));
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Contenu du panier incorrect. Réessayez !' };
}

function validateBottleEmpty(mission: BottleEmptyMission, order: string[]): MissionValidationResult {
  if (order.length !== mission.correctOrder.length) {
    return { isValid: false, message: 'Ordre incomplet. Réessayez !' };
  }
  
  const isCorrect = order.every((id, index) => id === mission.correctOrder[index]);
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Ordre de vidage incorrect. Réessayez !' };
}

function validateImageClick(mission: ImageClickMission, clicks: { x: number; y: number }[]): MissionValidationResult {
  // Vérifier qu'on a cliqué sur toutes les zones
  if (clicks.length !== mission.clickableZones.length) {
    return { 
      isValid: false, 
      message: `Vous devez trouver ${mission.clickableZones.length} objet(s). Vous en avez trouvé ${clicks.length}. Réessayez !` 
    };
  }

  // Vérifier que chaque clic correspond à une zone
  const foundZones = new Set<number>();
  
  for (const click of clicks) {
    let found = false;
    for (let i = 0; i < mission.clickableZones.length; i++) {
      if (foundZones.has(i)) continue; // Zone déjà trouvée
      
      const zone = mission.clickableZones[i];
      let isInZone = false;
      
      if (zone.type === 'circle' && zone.radius) {
        const distance = Math.sqrt(
          Math.pow(click.x - zone.x, 2) + Math.pow(click.y - zone.y, 2)
        );
        isInZone = distance <= zone.radius;
      } else if (zone.type === 'rectangle' && zone.width && zone.height) {
        const inX = click.x >= zone.x && click.x <= zone.x + zone.width;
        const inY = click.y >= zone.y && click.y <= zone.y + zone.height;
        isInZone = inX && inY;
      }
      
      if (isInZone) {
        foundZones.add(i);
        found = true;
        break;
      }
    }
    
    if (!found) {
      return { isValid: false, message: 'Certains objets ne sont pas corrects. Réessayez !' };
    }
  }
  
  // Vérifier que toutes les zones ont été trouvées
  if (foundZones.size === mission.clickableZones.length) {
    return { isValid: true };
  }
  
  return { isValid: false, message: 'Tous les objets doivent être trouvés. Réessayez !' };
}
