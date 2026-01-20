'use client';

export function isLandscape(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth > window.innerHeight;
}

export function useOrientationListener(
  callback: (isLandscape: boolean) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleResize = () => {
    callback(isLandscape());
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Vérification initiale
  handleResize();

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
}
