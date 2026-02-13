'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

interface OrientationProviderProps {
  children: ReactNode;
}

/**
 * Fournit le contexte d'orientation et affiche un message si l'utilisateur
 * est en mode portrait (pour l'inciter à tourner son appareil)
 * 
 * Cette approche évite les problèmes de rotation CSS avec le drag and drop
 */
export function OrientationProvider({ children }: OrientationProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

interface RotatedContainerProps {
  children: ReactNode;
}

/**
 * Conteneur simple sans transformation CSS
 * L'utilisateur est maintenant forcé de tourner physiquement son appareil
 */
export function RotatedContainer({ children }: RotatedContainerProps) {
  return <>{children}</>;
}
