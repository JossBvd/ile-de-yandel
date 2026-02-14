"use client";

import React from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/useResponsive";

interface IconButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
  /** Accessible via aria-label ; affiché à côté de l’icône uniquement si showLabel est true */
  label?: string;
  /** Afficher le texte du label à côté de l’icône (pour certains écrans uniquement) */
  showLabel?: boolean;
  /** Désactivé : transparent, non cliquable (ex. indice non disponible) */
  disabled?: boolean;
  className?: string;
  /** 'sidebar' = tailles optimisées pour la barre latérale des steps ; 'map' = icônes plus grandes sur mobile/PWA (carte de l'île) */
  sizeVariant?: 'default' | 'sidebar' | 'map';
}

/**
 * Composant de bouton icône responsive optimisé pour mobile
 * Taille de base : 56px (touch-friendly)
 */
export function IconButton({
  icon,
  alt,
  onClick,
  label,
  showLabel = false,
  disabled = false,
  className = "",
  sizeVariant = "default",
}: IconButtonProps) {
  const { isSmallScreen, isMediumScreen, isLargeScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();

  const isSidebar = sizeVariant === 'sidebar';
  const isMap = sizeVariant === 'map';

  const iconSize = isSidebar
    ? (isMobileOrTablet
        ? (isSmallScreen ? '64px' : isMediumScreen ? '72px' : '80px')
        : (isDesktopSmall ? '96px' : isDesktopMedium ? '104px' : '112px'))
    : isMap
      ? (isMobileOrTablet
          ? (isSmallScreen ? '56px' : isMediumScreen ? '64px' : '72px')
          : (isDesktopSmall ? '80px' : isDesktopMedium ? '96px' : '112px'))
      : (isMobileOrTablet
          ? (isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px')
          : (isDesktopSmall ? '72px' : isDesktopMedium ? '88px' : '104px'));

  const labelSize = isSidebar
    ? (isMobileOrTablet
        ? (isSmallScreen ? '0.8125rem' : isMediumScreen ? '0.875rem' : '1rem')
        : (isDesktopSmall ? '1.0625rem' : isDesktopMedium ? '1.125rem' : '1.25rem'))
    : isMap
      ? (isMobileOrTablet
          ? (isSmallScreen ? '0.8125rem' : isMediumScreen ? '0.875rem' : '1rem')
          : (isDesktopSmall ? '1rem' : isDesktopMedium ? '1.125rem' : '1.25rem'))
      : (isMobileOrTablet
          ? (isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem')
          : (isDesktopSmall ? '1rem' : isDesktopMedium ? '1.125rem' : '1.25rem'));

  const gap = isSidebar && isMobileOrTablet ? (isSmallScreen ? '6px' : '8px') : '8px';

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center transition-all touch-manipulation ${
        disabled
          ? "cursor-default opacity-40 pointer-events-none"
          : "cursor-pointer hover:opacity-80 active:scale-95"
      } ${className}`}
      style={{ gap }}
      aria-label={label || alt}
      aria-disabled={disabled}
    >
      <Image
        src={icon}
        alt={alt}
        width={56}
        height={56}
        className="object-contain shrink-0"
        style={{
          width: iconSize,
          height: iconSize,
          minWidth: iconSize,
          minHeight: iconSize,
        }}
      />
      {showLabel && label && (
        <span 
          className="font-semibold text-gray-800 drop-shadow-sm whitespace-nowrap min-w-0 truncate"
          style={{ fontSize: labelSize }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
