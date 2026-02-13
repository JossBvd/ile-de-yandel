'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

interface OrientationProviderProps {
  children: ReactNode;
}

/**
 * Fournit le contexte d'orientation sans appliquer de transformation CSS
 * Permet de placer le DndContext entre ce provider et le RotatedContainer
 */
export function OrientationProvider({ children }: OrientationProviderProps) {
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

  useEffect(() => {
    if (!mounted) return;
    
    const needsRotation = !isLandscape;
    if (needsRotation) {
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

  const needsRotation = mounted && !isLandscape;
  const rotatedWidth = needsRotation ? dimensions.height : dimensions.width;
  const rotatedHeight = needsRotation ? dimensions.width : dimensions.height;

  const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <OrientationContext.Provider
      value={{
        isRotated: needsRotation,
        width: dimensions.width > 0 ? rotatedWidth : defaultWidth,
        height: dimensions.height > 0 ? rotatedHeight : defaultHeight,
      }}
    >
      {children}
    </OrientationContext.Provider>
  );
}

interface RotatedContainerProps {
  children: ReactNode;
}

/**
 * Conteneur avec transformation CSS de 90° si nécessaire
 * À utiliser APRÈS le DndContext
 */
export function RotatedContainer({ children }: RotatedContainerProps) {
  const { isRotated, width, height } = useOrientationContext();

  if (isRotated) {
    return (
      <div
        className="fixed overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: 'rotate(90deg)',
          transformOrigin: 'center center',
          left: '50%',
          top: '50%',
          marginLeft: `-${width / 2}px`,
          marginTop: `-${height / 2}px`,
          zIndex: 9999,
        }}
      >
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
