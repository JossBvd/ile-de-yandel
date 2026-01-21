'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { OrientationGuard, useOrientationContext } from '@/components/game/OrientationGuard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { STEPS } from '@/data/steps';

function JournalContent() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { isRotated, width, height } = useOrientationContext();
  
  const [selectedStepId, setSelectedStepId] = useState<string>('step-1');
  const selectedStep = STEPS.find(step => step.id === selectedStepId);

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width: isRotated ? `${width}px` : '100vw',
        height: isRotated ? `${height}px` : '100vh',
        backgroundImage: 'url(/backgrounds/paper_texture.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Banner "Mon journal de bord" en haut */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-8 md:left-8 z-10">
        <div 
          className="px-3 py-2 sm:px-6 sm:py-3 rounded-lg"
          style={{ backgroundColor: '#E6D5B8' }}
        >
          <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
            Mon journal de bord
          </h1>
        </div>
      </div>

      {/* Contenu principal : liste des steps à gauche et vue détaillée à droite */}
      <div className="absolute top-12 sm:top-16 md:top-20 left-0 right-0 bottom-0 flex flex-row gap-2 sm:gap-4 md:gap-8 p-2 sm:p-4 md:p-8">
        {/* Liste des steps à gauche */}
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-1/3 items-center">
          {STEPS.map((step, index) => {
            const stepNumber = step.id.split('-')[1];
            const isSelected = step.id === selectedStepId;
            const isStep1 = step.id === 'step-1';
            
            return (
              <div key={step.id} className="flex flex-col items-center w-full">
                {/* Icône d'île uniquement pour Step 1 */}
                {isStep1 && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mb-1 sm:mb-2">
                    <Image
                      src="/ui/picto_ile.webp"
                      alt={`Step ${stepNumber}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                
                {/* Banner Step */}
                <button
                  onClick={() => setSelectedStepId(step.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-8 md:py-2 rounded-lg transition-all w-full max-w-xs cursor-pointer ${
                    isSelected ? 'scale-105' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: '#E6D5B8' }}
                >
                  <span className={`text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                    isSelected ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    Step {stepNumber}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Vue détaillée à droite */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-4 md:gap-6 min-w-0">
          {selectedStep && (
            <>
              {/* Banner Step sélectionné */}
              <div 
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg"
                style={{ backgroundColor: '#E6D5B8' }}
              >
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                  Step {selectedStep.id.split('-')[1]}
                </span>
              </div>

              {/* Cartes ressources orange */}
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="bg-orange-500 rounded-lg p-3 sm:p-4 md:p-6 shadow-md"
                  >
                    <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                      Ressource
                    </p>
                  </div>
                ))}
              </div>

              {/* Texte ressources externes */}
              <div className="mt-2 sm:mt-4 md:mt-6">
                <p className="text-gray-800 text-xs sm:text-sm md:text-base lg:text-lg">
                  ressource
                </p>
              </div>
            </>
          )}
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

export default function JournalPage() {
  return (
    <OrientationGuard>
      <JournalContent />
    </OrientationGuard>
  );
}
