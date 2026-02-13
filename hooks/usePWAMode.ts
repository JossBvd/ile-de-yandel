'use client';

import { useEffect, useState } from 'react';

/**
 * Hook pour détecter si l'application est en mode PWA (standalone ou fullscreen)
 */
export function usePWAMode() {
  const [isPWAFullscreen, setIsPWAFullscreen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPWAMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      setIsPWAFullscreen(isStandalone || isFullscreen || isIOSStandalone);
    };

    checkPWAMode();
    
    // Écouter les changements de media query
    const standaloneMedia = window.matchMedia('(display-mode: standalone)');
    const fullscreenMedia = window.matchMedia('(display-mode: fullscreen)');
    
    const handleChange = () => checkPWAMode();
    
    standaloneMedia.addEventListener('change', handleChange);
    fullscreenMedia.addEventListener('change', handleChange);

    return () => {
      standaloneMedia.removeEventListener('change', handleChange);
      fullscreenMedia.removeEventListener('change', handleChange);
    };
  }, []);

  return { isPWAFullscreen };
}
