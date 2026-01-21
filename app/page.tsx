'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { OrientationGuard, useOrientationContext } from '@/components/game/OrientationGuard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { getStepById } from '@/data/steps';
import { getStepPath } from '@/lib/navigation';

function HomeContent() {
  const router = useRouter();
  // Détection si on est sur mobile (< 768px)
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { isRotated, width, height } = useOrientationContext();
  
  // État pour gérer la modal
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  
  const selectedStep = selectedStepId ? getStepById(selectedStepId) : null;

  // Configuration des steps avec positions adaptatives selon l'écran
  const steps = [
    { 
      id: 'step-1', 
      available: true, 
      // Mobile paysage : centre gauche, Desktop : centre gauche
      positionMobile: { top: '50%', left: '1rem', transform: 'translateY(-50%)' },
      positionDesktop: { top: '50%', left: '2rem', transform: 'translateY(-50%)' }
    },
    { 
      id: 'step-2', 
      available: false, 
      // Mobile paysage : bas centre, Desktop : bas centre
      positionMobile: { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
      positionDesktop: { bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }
    },
    { 
      id: 'step-3', 
      available: false, 
      // Mobile paysage : haut centre, Desktop : haut centre
      positionMobile: { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
      positionDesktop: { top: '2rem', left: '50%', transform: 'translateX(-50%)' }
    },
    { 
      id: 'step-4', 
      available: false, 
      // Mobile paysage : haut droite, Desktop : haut droite
      positionMobile: { top: '1rem', right: '1rem' },
      positionDesktop: { top: '2rem', right: '2rem' }
    },
    { 
      id: 'step-5', 
      available: false, 
      // Mobile paysage : bas droite, Desktop : bas droite
      positionMobile: { bottom: '1rem', right: '1rem' },
      positionDesktop: { bottom: '2rem', right: '2rem' }
    },
  ];

  const handleStepClick = (stepId: string, available: boolean) => {
    if (available) {
      setSelectedStepId(stepId);
    }
  };

  const handleStart = () => {
    if (selectedStepId) {
      router.push(getStepPath(selectedStepId));
    }
  };

  const handleCloseModal = () => {
    setSelectedStepId(null);
  };

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
        {/* Menu principal en haut à gauche */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-16 md:left-4 z-10">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Menu principal
          </h1>
        </div>

        {/* Conteneur relatif pour les steps - adaptatif selon l'écran */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[85%] sm:w-[80%] sm:h-[88%] md:w-[70%] md:h-[88%]">
          <div className="relative h-full w-full">
            {steps.map((step) => {
              const stepNumber = step.id.split('-')[1];
              return (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step.id, step.available)}
                  className={`absolute flex flex-col items-center justify-center transition-all ${
                    step.available ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'
                  }`}
                  style={isMobile ? step.positionMobile : step.positionDesktop}
                >
                  {/* Tailles adaptatives : plus petites sur mobile paysage */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40">
                    <Image
                      src={step.available ? '/ui/picto_ile.webp' : '/ui/picto_ile_grey.webp'}
                      alt={`Step ${stepNumber}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-1 sm:mt-2 text-center">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                      Step {stepNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Icône menu en bas à gauche */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-4 md:left-4 z-10">
          <button
            onClick={() => router.push('/journal')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Journal de bord"
          >
            <Image
              src="/ui/icon_menu.webp"
              alt="Menu"
              width={48}
              height={48}
              className="sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain"
            />
          </button>
        </div>

        {/* Modal pour afficher les détails du step */}
        {selectedStep && (
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
              zIndex: 10000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={handleCloseModal}
          >
            <div
              className="relative w-[90%] max-w-md mx-4 rounded-2xl shadow-xl p-8"
              style={{ backgroundColor: '#E6D5B8' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Contenu de la modal */}
              <div className="flex flex-col items-center justify-center">
                {/* Nom de l'étape */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center">
                  {selectedStep.title || 'Nom étape'}
                </h2>
                
                {/* Bouton START */}
                <button
                  onClick={handleStart}
                  className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl md:text-2xl rounded-full transition-colors uppercase shadow-lg cursor-pointer"
                >
                  START
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function Home() {
  return (
    <OrientationGuard>
      <HomeContent />
    </OrientationGuard>
  );
}
