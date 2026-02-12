"use client";

import React from "react";
import Image from "next/image";

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
        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain shrink-0"
      />
      {showLabel && label && (
        <span className="text-sm sm:text-base font-semibold text-gray-800 drop-shadow-sm whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}
