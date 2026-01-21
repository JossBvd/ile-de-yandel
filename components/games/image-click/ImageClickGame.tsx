'use client';

import React, { useState, useRef } from 'react';
import { ImageClickMission } from '@/types/mission';
import { Button } from '@/components/ui/Button';

interface ImageClickGameProps {
  mission: ImageClickMission;
  onComplete: (clicks: { x: number; y: number }[]) => void;
}

export function ImageClickGame({ mission, onComplete }: ImageClickGameProps) {
  const [clickPositions, setClickPositions] = useState<{ x: number; y: number }[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const totalObjects = mission.clickableZones.length;

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convertir en pourcentage
    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    // Ajouter le clic à la liste (limiter au nombre d'objets à trouver)
    setClickPositions(prev => {
      if (prev.length >= totalObjects) {
        return prev; // Ne pas ajouter si on a déjà trouvé tous les objets
      }
      return [...prev, { x: relativeX, y: relativeY }];
    });
  };

  const handleSubmit = () => {
    if (clickPositions.length === totalObjects) {
      onComplete(clickPositions);
    }
  };

  const handleReset = () => {
    setClickPositions([]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800">
            Objets trouvés : {clickPositions.length} / {totalObjects}
          </p>
        </div>
        <div className="relative inline-block w-full">
          <img
            ref={imageRef}
            src={mission.image}
            alt="Image à cliquer"
            onClick={handleImageClick}
            className="w-full h-auto cursor-crosshair border-2 border-gray-300 rounded-lg"
          />
          {clickPositions.map((click, index) => (
            <div
              key={index}
              className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
              style={{
                left: `${click.x}%`,
                top: `${click.y}%`,
              }}
            >
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
          ))}
        </div>
        {clickPositions.length > 0 && (
          <div className="mt-4 flex gap-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              Réinitialiser
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit} 
          disabled={clickPositions.length !== totalObjects}
        >
          Valider ({clickPositions.length}/{totalObjects})
        </Button>
      </div>
    </div>
  );
}
