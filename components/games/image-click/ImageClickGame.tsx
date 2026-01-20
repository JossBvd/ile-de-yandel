'use client';

import React, { useState, useRef } from 'react';
import { ImageClickStep } from '@/types/step';
import { Button } from '@/components/ui/Button';

interface ImageClickGameProps {
  step: ImageClickStep;
  onComplete: (click: { x: number; y: number }) => void;
}

export function ImageClickGame({ step, onComplete }: ImageClickGameProps) {
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convertir en pourcentage si nécessaire (ou garder en px selon la config)
    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    setClickPosition({ x: relativeX, y: relativeY });
  };

  const handleSubmit = () => {
    if (clickPosition) {
      onComplete(clickPosition);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative inline-block w-full">
          <img
            ref={imageRef}
            src={step.image}
            alt="Image à cliquer"
            onClick={handleImageClick}
            className="w-full h-auto cursor-crosshair border-2 border-gray-300 rounded-lg"
          />
          {clickPosition && (
            <div
              className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${clickPosition.x}%`,
                top: `${clickPosition.y}%`,
              }}
            />
          )}
        </div>
        {clickPosition && (
          <p className="mt-2 text-sm text-gray-600">
            Position cliquée: ({Math.round(clickPosition.x)}%, {Math.round(clickPosition.y)}%)
          </p>
        )}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={!clickPosition}>
          Valider la position
        </Button>
      </div>
    </div>
  );
}
