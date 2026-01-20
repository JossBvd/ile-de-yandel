'use client';

import { useEffect, useState } from 'react';
import { isLandscape, useOrientationListener } from '@/lib/orientation';

export function useOrientation() {
  const [landscape, setLandscape] = useState(true);

  useEffect(() => {
    setLandscape(isLandscape());
    return useOrientationListener(setLandscape);
  }, []);

  return { isLandscape: landscape };
}
