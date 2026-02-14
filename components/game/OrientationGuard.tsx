'use client';

import { createContext, useContext, useLayoutEffect, useEffect, useState } from 'react';
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
  /** Si true, n'affiche pas l'overlay "mode paysage requis" (ex. page d'accueil en portrait) */
  allowPortrait?: boolean;
}

/**
 * Composant qui fournit le contexte d'orientation et affiche un message
 * si l'utilisateur est en mode portrait (pour l'inciter à tourner son appareil).
 * Avec allowPortrait, l'overlay paysage est désactivé (pour la page d'accueil).
 */
export function OrientationGuard({ children, allowPortrait = false }: OrientationGuardProps) {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    const timeoutId = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    const handleOrientationChange = () => setTimeout(updateDimensions, 100);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <OrientationContext.Provider
      value={{
        isRotated: false,
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {!allowPortrait && <LandscapeEnforcer />}
      {children}
    </OrientationContext.Provider>
  );
}
