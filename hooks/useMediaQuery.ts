'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Vérification initiale
    setMatches(media.matches);

    // Écouteur pour les changements
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Support pour les anciens navigateurs
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas addEventListener
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
