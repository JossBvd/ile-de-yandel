'use client';

import React from 'react';
import { Step } from '@/types/step';
import { QCMGame } from '@/components/games/qcm/QCMGame';
import { DragSortGame } from '@/components/games/drag/DragSortGame';
import { DragSelectImageGame } from '@/components/games/drag/DragSelectImageGame';
import { BasketFillGame } from '@/components/games/drag/BasketFillGame';
import { BottleEmptyGame } from '@/components/games/drag/BottleEmptyGame';
import { ImageClickGame } from '@/components/games/image-click/ImageClickGame';

interface StepRendererProps {
  step: Step;
  onComplete: (answer: unknown) => void;
}

export function StepRenderer({ step, onComplete }: StepRendererProps) {
  switch (step.type) {
    case 'qcm':
      return <QCMGame step={step} onComplete={onComplete} />;
    
    case 'drag-sort':
      return <DragSortGame step={step} onComplete={onComplete} />;
    
    case 'drag-select-image':
      return <DragSelectImageGame step={step} onComplete={onComplete} />;
    
    case 'basket-fill':
      return <BasketFillGame step={step} onComplete={onComplete} />;
    
    case 'bottle-empty':
      return <BottleEmptyGame step={step} onComplete={onComplete} />;
    
    case 'image-click':
      return <ImageClickGame step={step} onComplete={onComplete} />;
    
    default:
      return (
        <div className="text-red-600">
          Type de mini-jeu non supporté: {(step as Step).type}
        </div>
      );
  }
}
