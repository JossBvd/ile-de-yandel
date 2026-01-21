'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { OrientationGuard, useOrientationContext } from '@/components/game/OrientationGuard';
import { getStepById } from '@/data/steps';
import { getMissionPath } from '@/lib/navigation';
import { getNextMission } from '@/lib/engine/stepEngine';
import { useGameProgress } from '@/hooks/useGameProgress';
import { StepIntro } from '@/components/game/StepIntro';
import { ContinueButton } from '@/components/ui/ContinueButton';

function StepPageContent() {
  const params = useParams();
  const router = useRouter();
  const stepId = params.stepId as string;
  const { completedMissions, setCurrentStep } = useGameProgress();
  const { isRotated, width, height } = useOrientationContext();
  
  const [showNarrative, setShowNarrative] = useState(true);

  const step = getStepById(stepId);

  React.useEffect(() => {
    if (step) {
      setCurrentStep(step.id);
    }
  }, [step, setCurrentStep]);

  if (!step) {
    return (
      <div className="text-center text-red-600">
        <p>Step non trouvé</p>
      </div>
    );
  }

  const nextMission = getNextMission(step, completedMissions);

  const handleContinue = () => {
    if (nextMission) {
      // Rediriger directement vers la mission
      router.push(getMissionPath(step.id, nextMission));
    } else {
      // Pas de mission disponible, rester sur la narration ou afficher un message
      // Pour l'instant, on reste sur la narration
      console.warn('Aucune mission disponible pour ce step');
    }
  };

  // Afficher la page de narration
  if (showNarrative) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden"
        style={{
          width: isRotated ? `${width}px` : '100vw',
          height: isRotated ? `${height}px` : '100vh',
          backgroundImage: 'url(/backgrounds/paper_texture.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Encadré avec texte */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl">
          <div 
            className="rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl"
            style={{ backgroundColor: '#F5F1E8' }}
          >
            {/* Titre */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              {step.title || 'Step 1'}
            </h2>
            
            {/* Texte de narration */}
            <div className="mb-6 sm:mb-8">
              <p className="text-gray-800 text-sm sm:text-base md:text-lg italic leading-relaxed">
                «Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.»
              </p>
            </div>
            
            {/* Bouton Continuer */}
            <div className="flex justify-center">
              <ContinueButton onClick={handleContinue}>
                Continuer
              </ContinueButton>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-10">
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Retour"
          >
            <Image
              src="/ui/icon_back.webp"
              alt="Retour"
              width={40}
              height={40}
              className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 object-contain"
            />
          </button>
        </div>
      </div>
    );
  }

  // Si pas de narration, ne rien afficher (la redirection devrait avoir eu lieu)
  // Si aucune mission n'est disponible, on reste sur la narration
  return null;
}

export default function StepPage() {
  return (
    <OrientationGuard>
      <StepPageContent />
    </OrientationGuard>
  );
}
