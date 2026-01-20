'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MissionIntro } from '@/components/game/MissionIntro';
import { getMissionById } from '@/data/missions';
import { getStepPath } from '@/lib/navigation';
import { getNextStep } from '@/lib/engine/missionEngine';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;
  const { completedSteps, setCurrentMission } = useGameProgress();

  const mission = getMissionById(missionId);

  React.useEffect(() => {
    if (mission) {
      setCurrentMission(mission.id);
    }
  }, [mission, setCurrentMission]);

  if (!mission) {
    return (
      <div className="text-center text-red-600">
        <p>Mission non trouvée</p>
      </div>
    );
  }

  const nextStep = getNextStep(mission, completedSteps);

  // Si un step est disponible, rediriger automatiquement
  React.useEffect(() => {
    if (nextStep) {
      router.push(getStepPath(mission.id, nextStep));
    }
  }, [nextStep, mission.id, router]);

  return <MissionIntro mission={mission} />;
}
