"use client";

import React from "react";
import Image from "next/image";

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col items-center"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "3px solid #8B4513",
        }}
      >
        {/* Icône de défaite */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-6">
          <Image
            src="/ui/icon_false.webp"
            alt="Échec"
            fill
            className="object-contain"
          />
        </div>

        {/* Titre */}
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4 text-center"
          style={{
            color: "#2C3E50",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          TU Y ES PRESQUE !
        </h2>

        {/* Message d'encouragement */}
        <p
          className="text-lg sm:text-xl text-center mb-8"
          style={{
            color: "#34495E",
          }}
        >
          Ne te décourage pas, réessaie !
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={onRetry}
            className="flex-1 px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
            style={{
              backgroundColor: "#27AE60",
              color: "white",
              border: "2px solid #229954",
            }}
          >
            j'y retourne !
          </button>
          <button
            onClick={onGoBack}
            className="flex-1 px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
            style={{
              backgroundColor: "#27AE60",
              color: "white",
              border: "2px solid #229954",
            }}
          >
            j'essaie autre chose
          </button>
        </div>
      </div>
    </div>
  );
}
