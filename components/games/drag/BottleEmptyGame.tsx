'use client';

import React, { useState } from 'react';
import { BottleEmptyStep } from '@/types/step';
import { Button } from '@/components/ui/Button';

interface BottleEmptyGameProps {
  step: BottleEmptyStep;
  onComplete: (order: string[]) => void;
}

export function BottleEmptyGame({ step, onComplete }: BottleEmptyGameProps) {
  const [bottleItems, setBottleItems] = useState(step.items);
  const [emptiedItems, setEmptiedItems] = useState<string[]>([]);

  const emptyNext = () => {
    if (bottleItems.length > 0) {
      const nextItem = bottleItems[0];
      setBottleItems((prev) => prev.slice(1));
      setEmptiedItems((prev) => [...prev, nextItem.id]);
    }
  };

  const reset = () => {
    setBottleItems(step.items);
    setEmptiedItems([]);
  };

  const handleSubmit = () => {
    onComplete(emptiedItems);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Bouteille 🍾</h3>
          <div className="space-y-2 min-h-[200px] border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            {bottleItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">La bouteille est vide</p>
            ) : (
              bottleItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 bg-blue-100 border-2 border-blue-300 rounded-lg"
                  style={{ marginTop: index > 0 ? '-8px' : '0' }}
                >
                  {typeof item.content === 'string' ? (
                    <span className="text-gray-900">{item.content}</span>
                  ) : (
                    item.content
                  )}
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={emptyNext} disabled={bottleItems.length === 0} size="sm">
              Vider le prochain
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              Réinitialiser
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Éléments vidés</h3>
          <div className="space-y-2 min-h-[200px]">
            {emptiedItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucun élément vidé</p>
            ) : (
              emptiedItems.map((itemId) => {
                const item = step.items.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className="p-3 bg-green-50 border-2 border-green-200 rounded-lg"
                  >
                    {typeof item.content === 'string' ? (
                      <span className="text-gray-900">{item.content}</span>
                    ) : (
                      item.content
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={emptiedItems.length === 0}>
          Valider l'ordre
        </Button>
      </div>
    </div>
  );
}
