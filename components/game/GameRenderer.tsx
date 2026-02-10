"use client";

import React from "react";
import { Step } from "@/types/step";
import { QCMGame } from "@/components/games/qcm/QCMGame";
import { DragSortGame } from "@/components/games/drag/DragSortGame";
import { DragSelectImageGame } from "@/components/games/drag/DragSelectImageGame";
import { DragOrderImagesGame } from "@/components/games/drag/DragOrderImagesGame";
import { BasketFillGame } from "@/components/games/drag/BasketFillGame";
import { BottleEmptyGame } from "@/components/games/drag/BottleEmptyGame";
import { ImageClickGame } from "@/components/games/image-click/ImageClickGame";
import { EnigmaGame } from "@/components/games/enigma/EnigmaGame";

interface GameRendererProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  /** Retour à la carte (ex. "j'essaie autre chose" dans le recap QCM) */
  onGoBackToMap?: () => void;
  /** Ne pas afficher la modal de victoire du jeu (la page affichera sa propre modal, ex. image objet radeau). */
  skipVictoryModal?: boolean;
}

export function GameRenderer({
  step,
  onComplete,
  onDefeat,
  onGoBackToMap,
  skipVictoryModal,
}: GameRendererProps) {
  switch (step.game.type) {
    case "qcm":
      return (
        <QCMGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
          onGoBackToMap={onGoBackToMap}
        />
      );
    case "drag-sort":
      return (
        <DragSortGame step={step} onComplete={onComplete} onDefeat={onDefeat} />
      );
    case "drag-select-image":
      return (
        <DragSelectImageGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
        />
      );
    case "drag-order-images":
      return (
        <DragOrderImagesGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
        />
      );
    case "basket-fill":
      return (
        <BasketFillGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
        />
      );
    case "bottle-empty":
      return (
        <BottleEmptyGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
        />
      );
    case "image-click":
      return (
        <ImageClickGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
        />
      );
    case "enigma":
      return (
        <EnigmaGame
          step={step}
          onComplete={onComplete}
          onDefeat={onDefeat}
          skipVictoryModal={skipVictoryModal}
        />
      );
    default:
      return (
        <div className="text-center text-red-600 p-8">
          <p>Type de mini-jeu non supporté: {(step.game as any).type}</p>
        </div>
      );
  }
}
