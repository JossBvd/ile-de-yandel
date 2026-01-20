import { Step, QCMStep, DragSortStep, DragSelectImageStep, BasketFillStep, BottleEmptyStep, ImageClickStep } from '@/types/step';

export interface StepValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateStepAnswer(
  step: Step,
  userAnswer: unknown
): StepValidationResult {
  switch (step.type) {
    case 'qcm':
      return validateQCM(step, userAnswer as number | number[]);
    
    case 'drag-sort':
      return validateDragSort(step, userAnswer as string[]);
    
    case 'drag-select-image':
      return validateDragSelectImage(step, userAnswer as string[]);
    
    case 'basket-fill':
      return validateBasketFill(step, userAnswer as string[]);
    
    case 'bottle-empty':
      return validateBottleEmpty(step, userAnswer as string[]);
    
    case 'image-click':
      return validateImageClick(step, userAnswer as { x: number; y: number });
    
    default:
      return { isValid: false, message: 'Type de step non reconnu' };
  }
}

function validateQCM(step: QCMStep, userAnswer: number | number[]): StepValidationResult {
  // Normaliser la réponse utilisateur en tableau
  const selectedIndices = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
  
  // Vérifier que le nombre de réponses sélectionnées correspond
  if (selectedIndices.length !== step.correctAnswers.length) {
    return { 
      isValid: false, 
      message: step.correctAnswers.length > 1 
        ? `Vous devez sélectionner ${step.correctAnswers.length} réponse(s). Réessayez !`
        : 'Réponse incorrecte. Réessayez !'
    };
  }
  
  // Vérifier que toutes les réponses sélectionnées sont correctes
  const allCorrect = selectedIndices.every(index => 
    step.correctAnswers.includes(index)
  ) && step.correctAnswers.every(correctIndex =>
    selectedIndices.includes(correctIndex)
  );
  
  if (allCorrect) {
    return { isValid: true };
  }
  
  return { 
    isValid: false, 
    message: step.correctAnswers.length > 1
      ? 'Certaines réponses sont incorrectes. Réessayez !'
      : 'Réponse incorrecte. Réessayez !'
  };
}

function validateDragSort(step: DragSortStep, order: string[]): StepValidationResult {
  if (order.length !== step.correctOrder.length) {
    return { isValid: false, message: 'Ordre incomplet. Réessayez !' };
  }
  
  const isCorrect = order.every((id, index) => id === step.correctOrder[index]);
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Ordre incorrect. Réessayez !' };
}

function validateDragSelectImage(step: DragSelectImageStep, selectedIds: string[]): StepValidationResult {
  if (selectedIds.length !== step.correctImages.length) {
    return { isValid: false, message: 'Sélection incomplète. Réessayez !' };
  }
  
  const isCorrect = step.correctImages.every(id => selectedIds.includes(id)) &&
                    selectedIds.every(id => step.correctImages.includes(id));
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Sélection incorrecte. Réessayez !' };
}

function validateBasketFill(step: BasketFillStep, selectedIds: string[]): StepValidationResult {
  if (selectedIds.length !== step.correctItems.length) {
    return { isValid: false, message: 'Panier incomplet. Réessayez !' };
  }
  
  const isCorrect = step.correctItems.every(id => selectedIds.includes(id)) &&
                    selectedIds.every(id => step.correctItems.includes(id));
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Contenu du panier incorrect. Réessayez !' };
}

function validateBottleEmpty(step: BottleEmptyStep, order: string[]): StepValidationResult {
  if (order.length !== step.correctOrder.length) {
    return { isValid: false, message: 'Ordre incomplet. Réessayez !' };
  }
  
  const isCorrect = order.every((id, index) => id === step.correctOrder[index]);
  
  if (isCorrect) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Ordre de vidage incorrect. Réessayez !' };
}

function validateImageClick(step: ImageClickStep, click: { x: number; y: number }): StepValidationResult {
  const zone = step.clickableZone;
  
  if (zone.type === 'circle' && zone.radius) {
    const distance = Math.sqrt(
      Math.pow(click.x - zone.x, 2) + Math.pow(click.y - zone.y, 2)
    );
    if (distance <= zone.radius) {
      return { isValid: true };
    }
  } else if (zone.type === 'rectangle' && zone.width && zone.height) {
    const inX = click.x >= zone.x && click.x <= zone.x + zone.width;
    const inY = click.y >= zone.y && click.y <= zone.y + zone.height;
    if (inX && inY) {
      return { isValid: true };
    }
  }
  
  return { isValid: false, message: 'Zone incorrecte. Réessayez !' };
}
