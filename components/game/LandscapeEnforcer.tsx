'use client';

import Image from 'next/image';
import { useOrientation } from '@/hooks/useOrientation';

/**
 * Composant qui affiche un message à l'utilisateur pour qu'il tourne son appareil
 * en mode paysage s'il est actuellement en mode portrait
 * 
 * Cette approche est plus simple et plus fiable que d'appliquer une rotation CSS,
 * car elle évite les problèmes de coordonnées avec le drag and drop
 */
export function LandscapeEnforcer() {
  const { isLandscape } = useOrientation();

  if (isLandscape) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-6"
      style={{ zIndex: 99999 }}
    >
      <div className="flex flex-col items-center justify-center max-w-md text-center space-y-8">
        <div className="relative w-32 h-32 animate-bounce">
          <Image
            src="/ui/icon_menu.webp"
            alt="Rotation de l'appareil"
            fill
            className="object-contain opacity-80"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Mode paysage requis
          </h1>
          
          <p className="text-lg text-gray-300">
            Pour une meilleure expérience de jeu, veuillez tourner votre appareil en mode paysage
          </p>
        </div>

        <div className="relative w-48 h-48">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full animate-pulse"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="20" y="30" width="40" height="60" rx="4" className="opacity-50" />
            
            <path 
              d="M 35 20 Q 50 10 65 20" 
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            />
            
            <rect x="55" y="20" width="60" height="40" rx="4" className="opacity-80" />
            
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="white" />
              </marker>
            </defs>
          </svg>
        </div>

        <p className="text-sm text-gray-400">
          🔄 Tournez votre appareil pour continuer
        </p>
      </div>
    </div>
  );
}
