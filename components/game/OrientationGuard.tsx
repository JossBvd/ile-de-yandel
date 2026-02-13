'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { LandscapeEnforcer } from './LandscapeEnforcer';

interface OrientationContextType {
  isRotated: boolean;
  width: number;
  height: number;
}

const OrientationContext = createContext<OrientationContextType>({
  isRotated: false,
  width: 0,
  height: 0,
});

export const useOrientationContext = () => useContext(OrientationContext);

interface OrientationGuardProps {
  children: React.ReactNode;
}

/**
 * Composant qui fournit le contexte d'orientation et affiche un message
 * si l'utilisateur est en mode portrait (pour l'inciter à tourner son appareil)
 * 
 * Cette approche évite les problèmes de rotation CSS avec le drag & drop
 */
export function OrientationGuard({ children }: OrientationGuardProps) {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Détecter si on est en mode PWA fullscreen
      const isPWAFullscreen = typeof window !== 'undefined' && (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as any).standalone === true
      );
      
      // En mode PWA fullscreen, simuler la hauteur réduite avec la barre de navigation Android
      // La barre de navigation Android prend généralement entre 48px et 72px selon les appareils
      // On utilise une réduction dynamique basée sur la hauteur de l'écran
      let effectiveHeight = height;
      if (isPWAFullscreen && height < 1000) {
        // Seulement sur mobile/tablette en mode paysage
        // Calculer la réduction pour simuler la barre de navigation Android
        // Sur petits écrans (< 600px), la barre prend ~7% de la hauteur
        // Sur écrans moyens (600-800px), la barre prend ~6% de la hauteur
        // Sur grands écrans (> 800px), la barre prend ~5% de la hauteur
        let reductionPercent = 0.05;
        if (height < 600) {
          reductionPercent = 0.07;
        } else if (height < 800) {
          reductionPercent = 0.06;
        }
        effectiveHeight = Math.floor(height * (1 - reductionPercent));
      }
      
      setDimensions({ width, height: effectiveHeight });
    };
    updateDimensions();
    const timeoutId = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDimensions, 100);
    });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <OrientationContext.Provider
      value={{
        isRotated: false,
        width: dimensions.width > 0 ? dimensions.width : defaultWidth,
        height: dimensions.height > 0 ? dimensions.height : defaultHeight,
      }}
    >
      <LandscapeEnforcer />
      {children}
    </OrientationContext.Provider>
  );
}
