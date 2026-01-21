'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getStepPath } from '@/lib/navigation';
import { STEPS } from '@/data/steps';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function GamePage() {
  const router = useRouter();
  const { completedSteps } = useGameProgress();

  const getNextStep = () => {
    return STEPS.find(
      (step) => !completedSteps.includes(step.id)
    );
  };

  const nextStep = getNextStep();

  const handleStart = () => {
    if (nextStep) {
      router.push(getStepPath(nextStep.id));
    } else {
      // Tous les steps sont terminés
      router.push('/game/victory');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          L'île de Yandel
        </h1>
        <div className="prose max-w-none text-gray-700 mb-6">
          <p className="text-lg">
            Yandel, un jeune adolescent, s'est écrasé sur une île déserte.
          </p>
          <p className="text-lg">
            Il est le seul survivant de l'avion.
          </p>
          <p className="text-lg mt-4">
            Pour en repartir, il devra franchir <strong>5 steps</strong>, correspondant à des <strong>lieux de l'île</strong>, afin de collecter les <strong>éléments nécessaires à la construction de son radeau</strong>.
          </p>
          <p className="text-lg mt-4">
            À chaque step, Yandel devra réussir plusieurs missions liées aux matières scolaires.
          </p>
        </div>
        
        {nextStep ? (
          <Button size="lg" onClick={handleStart}>
            Commencer l'aventure
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold text-xl">
              🎉 Tous les steps sont terminés !
            </p>
            <Button size="lg" onClick={() => router.push('/game/victory')}>
              Voir la victoire
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
