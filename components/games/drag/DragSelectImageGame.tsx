'use client';

import React, { useState } from 'react';
import { DragSelectImageStep } from '@/types/step';
import { Button } from '@/components/ui/Button';

interface DragSelectImageGameProps {
  step: DragSelectImageStep;
  onComplete: (selectedIds: string[]) => void;
}

export function DragSelectImageGame({ step, onComplete }: DragSelectImageGameProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (imageId: string) => {
    setSelectedIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = () => {
    onComplete(selectedIds);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {step.images.map((image) => {
            const isSelected = selectedIds.includes(image.id);
            return (
              <button
                key={image.id}
                onClick={() => toggleSelection(image.id)}
                className={`relative rounded-lg overflow-hidden border-4 transition-all ${
                  isSelected
                    ? 'border-blue-600 ring-4 ring-blue-300'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleSubmit}>Valider la sélection</Button>
      </div>
    </div>
  );
}
