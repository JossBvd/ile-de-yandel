"use client";

import React from "react";
import Image from "next/image";

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
        className="relative rounded-3xl p-6 sm:p-8 pb-24 pr-24 max-w-md w-[90%] shadow-2xl"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "3px solid #8B4513",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-center"
            style={{
              color: "#2C3E50",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            MISSION ACCOMPLIE !
          </h2>
          <div className="w-7 h-7 sm:w-8 sm:h-8 relative shrink-0">
            <Image
              src="/ui/icon_right.webp"
              alt="Succès"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 mb-8">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0 rounded-lg overflow-hidden"
            style={{
              backgroundColor: "#87CEEB",
              border: "3px solid #5DADE2",
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
              className="text-sm sm:text-base mb-1"
              style={{
                color: "#34495E",
              }}
            >
              Tu as collecté
            </p>
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight break-all"
              style={{
                color: "#2C3E50",
              }}
            >
              {raftPieceName}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="absolute bottom-4 right-4 p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50"
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
