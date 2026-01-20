'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StepTitle } from '@/components/game/StepTitle';
import { StepRenderer } from '@/components/game/StepRenderer';
import { HintButton } from '@/components/ui/HintButton';
import { HintPanel } from '@/components/game/HintPanel';
import { ErrorFeedback } from '@/components/game/ErrorFeedback';
import { SuccessFeedback } from '@/components/game/SuccessFeedback';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useHint } from '@/hooks/useHint';
import { useInventory } from '@/hooks/useInventory';
import { validateStepAnswer } from '@/lib/engine/stepEngine';
import { getMissionById, getStepById } from '@/data/missions';
import { getStepPath, getMissionPath } from '@/lib/navigation';
import { getNextStep, isMissionCompleted } from '@/lib/engine/missionEngine';

export default function StepPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;
  const stepId = params.stepId as string;

  const { completeStep, setCurrentStep, completedSteps, completedMissions } = useGameProgress();
  const { markHintAsUsed, hintUsed } = useHint(stepId);
  const { addPiece } = useInventory();

  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const mission = getMissionById(missionId);
  const step = mission ? getStepById(missionId, stepId) : null;

  React.useEffect(() => {
    if (step) {
      setCurrentStep(step.id);
    }
  }, [step, setCurrentStep]);

  if (!mission || !step) {
    return (
      <div className="text-center text-red-600">
        <p>Step non trouvé</p>
      </div>
    );
  }

  const handleStepComplete = (answer: unknown) => {
    const validation = validateStepAnswer(step, answer);

    if (validation.isValid) {
      completeStep(step.id);
      setError(null);
      setShowSuccess(true);

      // Vérifier si la mission est complète
      const missionCompleted = isMissionCompleted(mission, [...completedSteps, step.id]);
      
      if (missionCompleted && !completedMissions.includes(mission.id)) {
        // Ajouter la pièce du radeau
        addPiece(mission.raftPiece);
      }

      // Rediriger après 2 secondes
      setTimeout(() => {
        setShowSuccess(false);
        const nextStep = getNextStep(mission, [...completedSteps, step.id]);
        
        if (nextStep) {
          router.push(getStepPath(mission.id, nextStep));
        } else if (missionCompleted) {
          // Mission terminée, retourner à la liste des missions
          router.push('/game');
        } else {
          router.push(getMissionPath(mission.id));
        }
      }, 2000);
    } else {
      setError(validation.message || 'Réponse incorrecte');
    }
  };

  const handleHintClick = () => {
    setShowHint(true);
    markHintAsUsed();
  };

  return (
    <div className="space-y-6">
      <StepTitle title={step.title} instruction={step.instruction} />
      
      {step.hint && (
        <div className="flex justify-center">
          <HintButton
            onClick={handleHintClick}
            used={hintUsed}
          />
        </div>
      )}

      {step.hint && showHint && (
        <HintPanel hint={step.hint} isVisible={showHint} />
      )}

      <StepRenderer step={step} onComplete={handleStepComplete} />

      {error && (
        <ErrorFeedback
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {showSuccess && <SuccessFeedback />}
    </div>
  );
}
