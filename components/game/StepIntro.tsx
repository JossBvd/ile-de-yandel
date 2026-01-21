'use client';

import React from 'react';
import { Step } from '@/types/step';
import { Button } from '@/components/ui/Button';
import { getMissionPath } from '@/lib/navigation';
import { useRouter } from 'next/navigation';
import { getNextMission } from '@/lib/engine/stepEngine';
import { useGameProgress } from '@/hooks/useGameProgress';

interface StepIntroProps {
  step: Step;
}

export function StepIntro({ step }: StepIntroProps) {
  const router = useRouter();
  const { completedMissions } = useGameProgress();
  const nextMission = getNextMission(step, completedMissions);

  const handleStart = () => {
    if (nextMission) {
      router.push(getMissionPath(step.id, nextMission));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h2>
        <p className="text-lg text-gray-700 mb-4">{step.location}</p>
        <div className="prose max-w-none">
          <p className="text-gray-600 whitespace-pre-line">{step.narrative}</p>
        </div>
      </div>
      
      {nextMission ? (
        <div className="flex justify-center">
          <Button size="lg" onClick={handleStart}>
            Commencer les missions
          </Button>
        </div>
      ) : (
        <div className="text-center text-green-600 font-semibold">
          ✅ Step terminé !
        </div>
      )}
    </div>
  );
}
