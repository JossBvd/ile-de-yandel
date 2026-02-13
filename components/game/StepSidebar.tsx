"use client";

import React from "react";
import { useOrientationContext } from "./OrientationGuard";

const TAB_WIDTH = 44;

interface StepSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  missionNumber: string;
  stepNumber: number;
  children: React.ReactNode;
}

export function StepSidebar({
  isOpen,
  onToggle,
  missionNumber,
  stepNumber,
  children,
}: StepSidebarProps) {
  const { height } = useOrientationContext();
  
  // Déterminer les tailles basées sur la hauteur de l'écran pour le mode PWA
  const isSmallScreen = height < 600;
  const isMediumScreen = height >= 600 && height < 800;
  const isLargeScreen = height >= 800;
  
  const sidebarWidth = isOpen 
    ? (isSmallScreen ? '244px' : isMediumScreen ? '264px' : '294px')
    : '44px';
  const panelWidth = isOpen
    ? (isSmallScreen ? '200px' : isMediumScreen ? '220px' : '250px')
    : '0px';
  
  return (
    <div
      className="absolute left-0 top-0 bottom-0 z-20 flex transition-[width] duration-300 ease-out"
      style={{ width: sidebarWidth }}
      aria-label="Panneau mission"
    >
      {/* Panneau latéral */}
      <div
        className="h-full flex flex-col transition-[width] duration-300 ease-out overflow-hidden relative"
        style={{
          width: panelWidth,
          minWidth: isOpen ? panelWidth : '0px',
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRight: isOpen ? "3px solid #8B4513" : "none",
          boxShadow: isOpen ? "4px 0 12px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* Titre mission / étape */}
        <div 
          className="shrink-0"
          style={{
            paddingTop: isSmallScreen ? '12px' : isMediumScreen ? '24px' : '24px',
            paddingLeft: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            paddingBottom: isSmallScreen ? '4px' : isMediumScreen ? '8px' : '8px',
          }}
        >
          <p 
            className="font-bold text-gray-800 drop-shadow-sm"
            style={{
              fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : '1.5rem',
            }}
          >
            Mission {missionNumber}
          </p>
          <p 
            className="font-semibold text-gray-700 opacity-90"
            style={{
              fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.125rem' : '1.125rem',
            }}
          >
            Etape {stepNumber}
          </p>
        </div>

        {/* Boutons d'action */}
        <div 
          className="flex-1 flex flex-col items-start justify-evenly min-h-0 w-full"
          style={{
            paddingLeft: isSmallScreen ? '24px' : isMediumScreen ? '32px' : '32px',
            paddingRight: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            paddingBottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '16px',
          }}
        >
          {children}
        </div>
      </div>

      {/* Zone de jeu */}
      <div className="relative h-full shrink-0" style={{ width: TAB_WIDTH }}>
        <button
          type="button"
          onClick={onToggle}
          className="absolute left-0 w-11 h-24 flex items-center justify-center rounded-r-lg transition-colors touch-manipulation"
          style={{
            top: "16.666%",
            transform: "translateY(-50%)",
            backgroundImage: "url(/backgrounds/paper_texture.webp)",
            backgroundSize: "cover",
            borderTop: isOpen ? "2px solid #8B4513" : "none",
            borderRight: isOpen ? "2px solid #8B4513" : "none",
            borderBottom: isOpen ? "2px solid #8B4513" : "none",
            borderLeft: "none",
            boxShadow: isOpen
              ? "2px 0 8px rgba(0,0,0,0.2)"
              : "1px 0 4px rgba(0,0,0,0.15)",
          }}
          aria-label={isOpen ? "Fermer le panneau" : "Ouvrir le panneau"}
        >
          <span className="text-amber-900 font-bold text-xl">
            {isOpen ? "‹" : "›"}
          </span>
        </button>
      </div>
    </div>
  );
}
