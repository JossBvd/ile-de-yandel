'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { OrientationGuard, useOrientationContext } from '@/components/game/OrientationGuard';
import { getStepById, getMissionById } from '@/data/steps';

function MissionPageContent() {
  const params = useParams();
  const router = useRouter();
  const stepId = params.stepId as string;
  const missionId = params.missionId as string;
  const { isRotated, width, height } = useOrientationContext();

  const [answer, setAnswer] = useState('');

  const step = getStepById(stepId);
  const mission = step ? getMissionById(stepId, missionId) : null;

  const handleHintClick = () => {
    // À implémenter
  };

  const handleSubmit = () => {
    // À implémenter
    console.log('Réponse envoyée:', answer);
  };

  return (
    <div 
      className="fixed inset-0 overflow-auto"
      style={{
        width: isRotated ? `${width}px` : '100vw',
        height: isRotated ? `${height}px` : '100vh',
        backgroundImage: 'url(/backgrounds/jungle.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Encadré en haut avec énigme et réponse */}
      <div className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 z-10">
        <div 
          className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl"
          style={{ backgroundColor: '#E6D5B8' }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Titre et texte énigme */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3">
                ENIGME
              </h2>
              <p className="text-gray-800 text-sm sm:text-base md:text-lg italic leading-relaxed">
                «Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.»
              </p>
            </div>

            {/* Input et bouton */}
            <div className="flex flex-row gap-3 items-center">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="px-4 py-2 bg-white text-black rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-sm sm:text-base placeholder-gray-500"
                placeholder="Votre réponse..."
              />
              
              {/* Bouton Envoyer avec bouteille - cercle parfait */}
              <button
                onClick={handleSubmit}
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors cursor-pointer flex flex-col items-center justify-center shadow-lg overflow-visible"
                aria-label="Envoyer"
              >
                {/* Bouteille superposée entre intérieur et extérieur */}
                <div className="absolute top-1.5 sm:top-1.5 md:top-1.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/ui/bouteille.webp"
                    alt=""
                    width={50}
                    height={50}
                    className="sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                  />
                </div>
                <span className="text-white text-xs sm:text-sm md:text-base font-bold mt-4 sm:mt-5 md:mt-6">Envoyer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Boutons en bas */}
      <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-8 md:left-8 z-10 flex items-center gap-2">
        {/* Bouton journal de bord */}
        <button
          onClick={() => router.push('/journal')}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Journal de bord"
        >
          <Image
            src="/ui/icon_menu.webp"
            alt="Journal de bord"
            width={40}
            height={40}
            className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 object-contain"
          />
        </button>

        {/* Bouton indice */}
        {mission?.hint && (
          <button
            onClick={handleHintClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Indice"
          >
            <Image
              src="/ui/icon_archive.webp"
              alt="Indice"
              width={40}
              height={40}
              className="sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 object-contain"
            />
          </button>
        )}
      </div>

      {/* Bouton retour */}
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-10">
        <button
          onClick={() => router.push(`/game/step/${stepId}`)}
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

export default function MissionPage() {
  return (
    <OrientationGuard>
      <MissionPageContent />
    </OrientationGuard>
  );
}
