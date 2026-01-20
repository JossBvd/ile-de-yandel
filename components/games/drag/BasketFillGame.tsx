'use client';

import React, { useState } from 'react';
import { BasketFillStep } from '@/types/step';
import { Button } from '@/components/ui/Button';

interface BasketFillGameProps {
  step: BasketFillStep;
  onComplete: (selectedIds: string[]) => void;
}

export function BasketFillGame({ step, onComplete }: BasketFillGameProps) {
  const [basketItems, setBasketItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setBasketItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = () => {
    onComplete(basketItems);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Items disponibles</h3>
          <div className="space-y-2">
            {step.items.map((item) => {
              const inBasket = basketItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  disabled={inBasket}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    inBasket
                      ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                      : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.label} className="w-12 h-12 object-cover rounded" />
                    )}
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Panier 🎒</h3>
          <div className="space-y-2 min-h-[200px]">
            {basketItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Le panier est vide</p>
            ) : (
              basketItems.map((itemId) => {
                const item = step.items.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.label} className="w-12 h-12 object-cover rounded" />
                      )}
                      <span className="text-gray-900">{item.label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleSubmit}>Valider le panier</Button>
      </div>
    </div>
  );
}
