'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useInventory } from '@/hooks/useInventory';

export default function VictoryPage() {
  const router = useRouter();
  const { raftComplete } = useInventory();

  if (!raftComplete) {
    return (
      <div className="text-center">
        <p className="text-red-600">Vous devez terminer toutes les missions d'abord.</p>
        <Button onClick={() => router.push('/game')} className="mt-4">
          Retour au jeu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Félicitations !
        </h1>
        <div className="prose max-w-none text-gray-700 mb-6">
          <p className="text-lg">
            Yandel a réussi à collecter toutes les pièces de son radeau !
          </p>
          <p className="text-lg mt-4">
            Le radeau est maintenant complet et prêt à prendre la mer.
          </p>
          <p className="text-lg mt-4">
            Yandel peut enfin quitter l'île et retourner chez lui.
          </p>
        </div>
        
        <div className="mt-8">
          <Button size="lg" onClick={() => router.push('/game')}>
            Rejouer
          </Button>
        </div>
      </div>
    </div>
  );
}
