'use client';

import React from 'react';
import { Mission } from '@/types/mission';
import { QCMGame } from '@/components/games/qcm/QCMGame';
import { DragSortGame } from '@/components/games/drag/DragSortGame';
import { DragSelectImageGame } from '@/components/games/drag/DragSelectImageGame';
import { BasketFillGame } from '@/components/games/drag/BasketFillGame';
import { BottleEmptyGame } from '@/components/games/drag/BottleEmptyGame';
import { ImageClickGame } from '@/components/games/image-click/ImageClickGame';

interface MissionRendererProps {
  mission: Mission;
  onComplete: (answer: unknown) => void;
}

export function MissionRenderer({ mission, onComplete }: MissionRendererProps) {
  switch (mission.type) {
    case 'qcm':
      return <QCMGame mission={mission} onComplete={onComplete} />;
    
    case 'drag-sort':
      return <DragSortGame mission={mission} onComplete={onComplete} />;
    
    case 'drag-select-image':
      return <DragSelectImageGame mission={mission} onComplete={onComplete} />;
    
    case 'basket-fill':
      return <BasketFillGame mission={mission} onComplete={onComplete} />;
    
    case 'bottle-empty':
      return <BottleEmptyGame mission={mission} onComplete={onComplete} />;
    
    case 'image-click':
      return <ImageClickGame mission={mission} onComplete={onComplete} />;
    
    default:
      return (
        <div className="text-red-600">
          Type de mini-jeu non supporté: {(mission as Mission).type}
        </div>
      );
  }
}
