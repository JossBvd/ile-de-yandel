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
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
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

  return (
    <OrientationContext.Provider
      value={{
        isRotated: false,
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <LandscapeEnforcer />
      {children}
    </OrientationContext.Provider>
  );
}
