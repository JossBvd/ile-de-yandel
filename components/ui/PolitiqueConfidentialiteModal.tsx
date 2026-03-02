"use client";

import React from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useResponsive } from "@/hooks/useResponsive";

interface PolitiqueConfidentialiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PolitiqueConfidentialiteModal({
  isOpen,
  onClose,
}: PolitiqueConfidentialiteModalProps) {
  const setContainerRef = useFocusTrap(isOpen);
  const { isSmallScreen, isMediumScreen } = useResponsive();

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="politique-confidentialite-title"
      aria-describedby="politique-confidentialite-desc"
    >
      <div
        ref={setContainerRef}
        className="bg-[#e8dcc4] rounded-lg shadow-xl w-full mx-4 flex flex-col border border-amber-800/20"
        style={{
          maxWidth: isSmallScreen ? "90%" : isMediumScreen ? "400px" : "520px",
          maxHeight: "90dvh",
          padding: isSmallScreen ? "16px" : "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="politique-confidentialite-title"
          className="text-xl font-bold mb-4 text-gray-900"
        >
          Politique de confidentialité
        </h2>
        <div
          id="politique-confidentialite-desc"
          className="text-gray-700 text-sm overflow-y-auto flex-1 min-h-0"
        >
          <p className="mb-3">
            L’application « L’île de Yandel » ne collecte aucune donnée personnelle. Aucun compte utilisateur n’est requis.
          </p>
          <p className="mb-3">
            <strong>Données stockées localement :</strong> la progression du jeu (étapes complétées, pièces du radeau, indices utilisés) est enregistrée uniquement sur votre appareil (localStorage / cookies), pour permettre de reprendre la partie après fermeture du navigateur.
          </p>
          <p className="mb-3">
            <strong>Audio description :</strong> si vous activez la lecture à voix haute, les préférences (activation, vitesse, lecture automatique) sont également stockées localement.
          </p>
          <p>
            Aucune de ces données n’est envoyée à un serveur. L’application fonctionne entièrement côté navigateur.
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[100px] px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors touch-manipulation"
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
