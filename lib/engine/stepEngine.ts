import {
  Step,
  QCMGameData,
  DragSortGameData,
  DragSelectImageGameData,
  BasketFillGameData,
  BottleEmptyGameData,
  ImageClickGameData,
} from "@/types/step";

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateStepAnswer(
  step: Step,
  userAnswer: unknown,
): ValidationResult {
  switch (step.game.type) {
    case "qcm":
      return validateQCM(step.game, userAnswer as number | number[]);
    case "drag-sort":
      return validateDragSort(step.game, userAnswer as string[]);
    case "drag-select-image":
      return validateDragSelectImage(step.game, userAnswer as string[]);
    case "basket-fill":
      return validateBasketFill(step.game, userAnswer as string[]);
    case "bottle-empty":
      return validateBottleEmpty(step.game, userAnswer as string[]);
    case "image-click":
      return validateImageClick(
        step.game,
        userAnswer as { x: number; y: number }[],
      );
    default:
      return { isValid: false, message: "Type de mini-jeu non reconnu" };
  }
}

function validateQCM(
  game: QCMGameData,
  userAnswer: number | number[],
): ValidationResult {
  const selectedIndices = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

  if (selectedIndices.length !== game.correctAnswers.length) {
    return {
      isValid: false,
      message:
        game.correctAnswers.length > 1
          ? `Vous devez sélectionner ${game.correctAnswers.length} réponse(s). Réessayez !`
          : "Mauvaise réponse. Réessayez !",
    };
  }

  const isCorrect =
    selectedIndices.every((index) => game.correctAnswers.includes(index)) &&
    game.correctAnswers.every((correctIndex) =>
      selectedIndices.includes(correctIndex),
    );

  return {
    isValid: isCorrect,
    message: isCorrect
      ? game.correctAnswers.length > 1
        ? "Bravo ! Toutes les réponses sont correctes !"
        : "Bravo ! Bonne réponse !"
      : "Mauvaise réponse. Réessayez !",
  };
}

function validateDragSort(
  game: DragSortGameData,
  order: string[],
): ValidationResult {
  if (order.length !== game.correctOrder.length) {
    return {
      isValid: false,
      message: "L'ordre n'est pas complet. Réessayez !",
    };
  }

  const isCorrect = order.every((id, index) => id === game.correctOrder[index]);
  return {
    isValid: isCorrect,
    message: isCorrect
      ? "Bravo ! Ordre correct !"
      : "L'ordre n'est pas bon. Réessayez !",
  };
}

function validateDragSelectImage(
  game: DragSelectImageGameData,
  selectedIds: string[],
): ValidationResult {
  if (selectedIds.length !== game.correctImages.length) {
    return { isValid: false, message: "Sélection incomplète. Réessayez !" };
  }

  const isCorrect =
    game.correctImages.every((id) => selectedIds.includes(id)) &&
    selectedIds.every((id) => game.correctImages.includes(id));

  return {
    isValid: isCorrect,
    message: isCorrect
      ? "Bravo ! Toutes les images sont correctes !"
      : "Certaines images sont incorrectes. Réessayez !",
  };
}

function validateBasketFill(
  game: BasketFillGameData,
  selectedIds: string[],
): ValidationResult {
  if (selectedIds.length !== game.correctItems.length) {
    return {
      isValid: false,
      message: "Le panier n'est pas complet. Réessayez !",
    };
  }

  const isCorrect =
    game.correctItems.every((id) => selectedIds.includes(id)) &&
    selectedIds.every((id) => game.correctItems.includes(id));

  return {
    isValid: isCorrect,
    message: isCorrect
      ? "Bravo ! Le panier est correct !"
      : "Certains items sont incorrects. Réessayez !",
  };
}

function validateBottleEmpty(
  game: BottleEmptyGameData,
  order: string[],
): ValidationResult {
  if (order.length !== game.correctOrder.length) {
    return {
      isValid: false,
      message: "L'ordre de vidage n'est pas complet. Réessayez !",
    };
  }

  const isCorrect = order.every((id, index) => id === game.correctOrder[index]);
  return {
    isValid: isCorrect,
    message: isCorrect
      ? "Bravo ! Ordre de vidage correct !"
      : "L'ordre de vidage n'est pas bon. Réessayez !",
  };
}

function validateImageClick(
  game: ImageClickGameData,
  clicks: { x: number; y: number }[],
): ValidationResult {
  if (clicks.length !== game.clickableZones.length) {
    return {
      isValid: false,
      message: `Vous devez trouver ${game.clickableZones.length} objet(s). Vous en avez trouvé ${clicks.length}. Réessayez !`,
    };
  }

  const foundZones = new Set<number>();

  for (const click of clicks) {
    let found = false;
    for (let i = 0; i < game.clickableZones.length; i++) {
      if (foundZones.has(i)) continue;

      const zone = game.clickableZones[i];

      if (zone.type === "circle") {
        const distance = Math.sqrt(
          Math.pow(click.x - zone.x, 2) + Math.pow(click.y - zone.y, 2),
        );
        if (distance <= (zone.radius || 0)) {
          foundZones.add(i);
          found = true;
          break;
        }
      } else if (zone.type === "rectangle") {
        if (
          click.x >= zone.x &&
          click.x <= zone.x + (zone.width || 0) &&
          click.y >= zone.y &&
          click.y <= zone.y + (zone.height || 0)
        ) {
          foundZones.add(i);
          found = true;
          break;
        }
      }
    }
    if (!found) {
      return {
        isValid: false,
        message: "Certains objets ne sont pas corrects. Réessayez !",
      };
    }
  }

  if (foundZones.size === game.clickableZones.length) {
    return {
      isValid: true,
      message: "Bravo ! Tous les objets ont été trouvés !",
    };
  }

  return { isValid: false, message: "Certains objets manquent. Réessayez !" };
}
