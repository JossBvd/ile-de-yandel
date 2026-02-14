"use client";

import React from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/useResponsive";

interface VictoryModalProps {
  isOpen: boolean;
  onContinue: () => void;
  raftPieceName?: string;
  raftPieceImage?: string;
}

/**
 * Modal affichée lors de la réussite d'un step
 * Design : fond parchemin avec pièce du radeau collectée
 */
export function VictoryModal({
  isOpen,
  onContinue,
  raftPieceName = "Pièce du radeau",
  raftPieceImage = "/ui/icon_right.webp",
}: VictoryModalProps) {
  const { isSmallScreen, isMediumScreen, isDesktopSmall } = useResponsive();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
      onClick={onContinue}
    >
      <div
        className="relative rounded-3xl shadow-2xl"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "3px solid #8B4513",
          padding: isSmallScreen ? '24px' : isMediumScreen ? '32px' : '32px',
          paddingBottom: isSmallScreen ? '96px' : isMediumScreen ? '96px' : '96px',
          paddingRight: isSmallScreen ? '96px' : isMediumScreen ? '96px' : '96px',
          maxWidth: isSmallScreen ? '90%' : isMediumScreen ? '448px' : '448px',
          width: isSmallScreen ? '90%' : 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="flex items-center justify-center mb-6"
          style={{
            gap: isSmallScreen ? '8px' : isMediumScreen ? '8px' : '8px',
          }}
        >
          <h2
            className="font-bold text-center"
            style={{
              color: "#2C3E50",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : isDesktopSmall ? '1.875rem' : '1.875rem',
            }}
          >
            MISSION ACCOMPLIE !
          </h2>
          <div 
            className="relative shrink-0"
            style={{
              width: isSmallScreen ? '28px' : isMediumScreen ? '32px' : '32px',
              height: isSmallScreen ? '28px' : isMediumScreen ? '32px' : '32px',
            }}
          >
            <Image
              src="/ui/icon_right.webp"
              alt="Succès"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div 
          className="flex items-center mb-8"
          style={{
            gap: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '24px',
          }}
        >
          <div
            className="relative shrink-0 rounded-lg overflow-hidden"
            style={{
              backgroundColor: "#87CEEB",
              border: "3px solid #5DADE2",
              width: isSmallScreen ? '96px' : isMediumScreen ? '112px' : '112px',
              height: isSmallScreen ? '96px' : isMediumScreen ? '112px' : '112px',
            }}
          >
            <Image
              src={raftPieceImage}
              alt={raftPieceName}
              fill
              className="object-contain p-2"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="mb-1"
              style={{
                color: "#34495E",
                fontSize: isSmallScreen ? '0.875rem' : '1rem',
              }}
            >
              Tu as collecté
            </p>
            <h3
              className="font-bold leading-tight break-all"
              style={{
                color: "#2C3E50",
                fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : isDesktopSmall ? '1.875rem' : '1.875rem',
              }}
            >
              {raftPieceName}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="absolute p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50"
          style={{
            bottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            right: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
          }}
          aria-label="Continuer"
        >
          <Image
            src="/ui/icon_back.webp"
            alt=""
            width={48}
            height={48}
            className="block"
          />
        </button>

        <button
          onClick={onContinue}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Continuer"
        />
      </div>
    </div>
  );
}
