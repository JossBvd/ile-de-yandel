'use client';

import React from 'react';
import { Mission } from '@/types/mission';
import { Button } from '@/components/ui/Button';
import { getStepPath } from '@/lib/navigation';
import { useRouter } from 'next/navigation';
import { getNextStep } from '@/lib/engine/missionEngine';
import { useGameProgress } from '@/hooks/useGameProgress';

interface MissionIntroProps {
  mission: Mission;
}

export function MissionIntro({ mission }: MissionIntroProps) {
  const router = useRouter();
  const { completedSteps } = useGameProgress();
  const nextStep = getNextStep(mission, completedSteps);

  const handleStart = () => {
    if (nextStep) {
      router.push(getStepPath(mission.id, nextStep));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{mission.title}</h2>
        <p className="text-lg text-gray-700 mb-4">{mission.location}</p>
        <div className="prose max-w-none">
          <p className="text-gray-600 whitespace-pre-line">{mission.narrative}</p>
        </div>
      </div>
      
      {nextStep ? (
        <div className="flex justify-center">
          <Button size="lg" onClick={handleStart}>
            Commencer la mission
          </Button>
        </div>
      ) : (
        <div className="text-center text-green-600 font-semibold">
          ✅ Mission terminée !
        </div>
      )}
    </div>
  );
}
