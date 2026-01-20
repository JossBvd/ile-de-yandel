'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { useInventory } from '@/hooks/useInventory';

export function InventoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { collectedPieces, totalPieces, progress } = useInventory();

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        🎒 Inventaire ({collectedPieces.length}/{totalPieces})
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Inventaire - Pièces du radeau"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Progression: {collectedPieces.length} / {totalPieces} pièces collectées
          </div>
          <div className="space-y-2">
            {Array.from({ length: totalPieces }, (_, i) => {
              const pieceId = `piece-${i + 1}`;
              const collected = collectedPieces.includes(pieceId);
              return (
                <div
                  key={pieceId}
                  className={`p-3 rounded border-2 ${
                    collected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{collected ? '✅' : '⭕'}</span>
                    <span className={collected ? 'text-green-700' : 'text-gray-500'}>
                      Pièce {i + 1} {collected ? '(Collectée)' : '(Manquante)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
