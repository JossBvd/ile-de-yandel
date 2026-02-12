"use client";

import React from "react";

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
  return (
    <div
      className={`absolute left-0 top-0 bottom-0 z-20 flex transition-[width] duration-300 ease-out ${
        isOpen ? "w-[244px] sm:w-[264px] md:w-[294px]" : "w-11"
      }`}
      aria-label="Panneau mission"
    >
      {/* Panneau latéral */}
      <div
        className={`h-full flex flex-col transition-[width] duration-300 ease-out overflow-hidden relative ${
          isOpen
            ? "w-[200px] min-w-[200px] sm:w-[220px] sm:min-w-[220px] md:w-[250px] md:min-w-[250px]"
            : "w-0 min-w-0"
        }`}
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRight: isOpen ? "3px solid #8B4513" : "none",
          boxShadow: isOpen ? "4px 0 12px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* Titre mission / étape */}
        <div className="pt-3 px-4 pb-1 sm:pt-6 sm:pb-2 shrink-0">
          <p className="text-xl md:text-2xl font-bold text-gray-800 drop-shadow-sm">
            Mission {missionNumber}
          </p>
          <p className="text-base md:text-lg font-semibold text-gray-700 opacity-90">
            Etape {stepNumber}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex-1 flex flex-col items-start justify-evenly pl-6 sm:pl-8 pr-4 pb-4 pt-2 sm:pt-4 min-h-0 w-full">
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
