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
}: IconButtonProps) {
  const { isSmallScreen, isMediumScreen, isLargeScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();
  
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center gap-2 transition-opacity touch-manipulation ${
        disabled
          ? "cursor-default opacity-40 pointer-events-none"
          : "cursor-pointer hover:opacity-80"
      } ${className}`}
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
          width: isMobileOrTablet 
            ? (isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px')
            : (isDesktopSmall ? '72px' : isDesktopMedium ? '88px' : '104px'),
          height: isMobileOrTablet 
            ? (isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px')
            : (isDesktopSmall ? '72px' : isDesktopMedium ? '88px' : '104px'),
        }}
      />
      {showLabel && label && (
        <span 
          className="font-semibold text-gray-800 drop-shadow-sm whitespace-nowrap"
          style={{
            fontSize: isMobileOrTablet 
              ? (isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem')
              : (isDesktopSmall ? '1rem' : isDesktopMedium ? '1.125rem' : '1.25rem'),
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
