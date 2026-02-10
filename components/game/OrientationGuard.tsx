'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useOrientation } from '@/hooks/useOrientation';

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

export function OrientationGuard({ children }: OrientationGuardProps) {
  const { isLandscape } = useOrientation();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
    };
    
    // Initialisation immédiate
    updateDimensions();
    
    // Délai pour s'assurer que les dimensions sont bien prises en compte
    const timeoutId = setTimeout(updateDimensions, 100);
    
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', () => {
      // Petit délai après le changement d'orientation pour que les dimensions soient mises à jour
      setTimeout(updateDimensions, 100);
    });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Gérer le scroll du body selon l'orientation
  useEffect(() => {
    if (!mounted) return;
    
    const needsRotation = !isLandscape;
    if (needsRotation) {
      // Empêcher le scroll quand on pivote
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
    };
  }, [isLandscape, mounted]);

  // Sur portrait (écran plus haut que large), forcer l'affichage en paysage en pivotant le contenu
  const needsRotation = mounted && !isLandscape;

  const rotatedWidth = needsRotation ? dimensions.height : dimensions.width;
  const rotatedHeight = needsRotation ? dimensions.width : dimensions.height;

  if (needsRotation && dimensions.width > 0 && dimensions.height > 0) {
    // En mode portrait sur mobile, on pivote le contenu de 90 degrés
    // et on inverse les dimensions pour que ça corresponde à un affichage paysage
    return (
      <OrientationContext.Provider
        value={{
          isRotated: true,
          width: rotatedWidth,
          height: rotatedHeight,
        }}
      >
        <div
          className="fixed overflow-hidden"
          style={{
            width: `${rotatedWidth}px`,
            height: `${rotatedHeight}px`,
            transform: 'rotate(90deg)',
            transformOrigin: 'center center',
            left: '50%',
            top: '50%',
            marginLeft: `-${rotatedWidth / 2}px`,
            marginTop: `-${rotatedHeight / 2}px`,
            zIndex: 9999,
          }}
        >
          {children}
        </div>
      </OrientationContext.Provider>
    );
  }

  const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <OrientationContext.Provider
      value={{
        isRotated: false,
        width: dimensions.width || defaultWidth,
        height: dimensions.height || defaultHeight,
      }}
    >
      {children}
    </OrientationContext.Provider>
  );
}
