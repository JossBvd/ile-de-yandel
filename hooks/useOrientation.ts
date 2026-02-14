'use client';

import { useEffect, useState } from 'react';
import { isLandscape } from '@/lib/orientation';

export function useOrientation() {
  const [landscape, setLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return isLandscape();
  });

  useEffect(() => {
    const updateLandscape = () => {
      setLandscape(isLandscape());
    };
    
    updateLandscape();
    
    const handleResize = () => {
      updateLandscape();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { isLandscape: landscape };
}
