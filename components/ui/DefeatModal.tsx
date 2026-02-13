"use client";

import React from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/useResponsive";

interface DefeatModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onGoBack: () => void;
}

/**
 * Modal affichée lors d'un échec à un step
 * Design : fond parchemin avec message d'encouragement et deux boutons
 */
export function DefeatModal({ isOpen, onRetry, onGoBack }: DefeatModalProps) {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
      }}
    >
      <div
        className="relative w-full rounded-3xl shadow-2xl flex flex-col items-center"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "3px solid #8B4513",
          padding: isSmallScreen ? '32px' : isMediumScreen ? '32px' : '32px',
          maxWidth: isSmallScreen ? '100%' : isMediumScreen ? '448px' : '448px',
        }}
      >
        <div 
          className="relative mb-6"
          style={{
            width: isSmallScreen ? '80px' : isMediumScreen ? '96px' : '96px',
            height: isSmallScreen ? '80px' : isMediumScreen ? '96px' : '96px',
          }}
        >
          <Image
            src="/ui/icon_false.webp"
            alt="Échec"
            fill
            className="object-contain"
          />
        </div>

        {/* Titre */}
        <h2
          className="font-bold mb-4 text-center"
          style={{
            color: "#2C3E50",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontSize: isSmallScreen ? '1.875rem' : isMediumScreen ? '2.25rem' : '2.25rem',
          }}
        >
          TU Y ES PRESQUE !
        </h2>

        <p
          className="text-center mb-8"
          style={{
            color: "#34495E",
            fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : '1.25rem',
          }}
        >
          Ne te décourage pas, réessaie !
        </p>

        <div 
          className="flex w-full"
          style={{
            flexDirection: isSmallScreen ? 'column' : 'row',
            gap: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
          }}
        >
          <button
            onClick={onRetry}
            className="flex-1 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
            style={{
              backgroundColor: "#27AE60",
              color: "white",
              border: "2px solid #229954",
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : '1.25rem',
            }}
          >
            j'y retourne !
          </button>
          <button
            onClick={onGoBack}
            className="flex-1 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
            style={{
              backgroundColor: "#27AE60",
              color: "white",
              border: "2px solid #229954",
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : '1.25rem',
            }}
          >
            j'essaie autre chose
          </button>
        </div>
      </div>
    </div>
  );
}
