'use client';

import { useEffect, useState } from 'react';
import { useOrientationContext } from '@/components/game/OrientationGuard';
import { usePWAMode } from './usePWAMode';

/**
 * Hook centralisé pour la détection responsive optimisée PWA
 * 
 * Stratégie hybride :
 * - Mobile/Tablette (< 1024px) : Détection basée sur la hauteur (essentiel pour PWA paysage)
 * - Desktop (≥ 1024px) : Détection basée sur la largeur (différenciation desktop standard/large/très large)
 * 
 * Utilise un état `mounted` pour éviter les erreurs d'hydratation SSR/CSR
 */
export function useResponsive() {
  const { width, height } = useOrientationContext();
  const { isPWAFullscreen } = usePWAMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Détection mobile/tablette vs desktop
  // Utiliser des valeurs par défaut pour éviter l'erreur d'hydratation
  const effectiveWidth = mounted ? width : 1920;
  const effectiveHeight = mounted ? height : 1080;
  const isMobileOrTablet = effectiveWidth < 1024;

  // Pour mobile/tablette : basé sur la hauteur
  const isSmallScreen = isMobileOrTablet && effectiveHeight < 600;
  const isMediumScreen = isMobileOrTablet && effectiveHeight >= 600 && effectiveHeight < 800;
  const isLargeScreen = isMobileOrTablet && effectiveHeight >= 800;

  // Pour desktop : basé sur la largeur
  const isDesktopSmall = !isMobileOrTablet && effectiveWidth < 1440;
  const isDesktopMedium = !isMobileOrTablet && effectiveWidth >= 1440 && effectiveWidth < 1920;
  const isDesktopLarge = !isMobileOrTablet && effectiveWidth >= 1920;

  return {
    isMobileOrTablet,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isDesktopSmall,
    isDesktopMedium,
    isDesktopLarge,
    isPWAFullscreen,
    width: effectiveWidth,
    height: effectiveHeight,
    mounted,
  };
}
