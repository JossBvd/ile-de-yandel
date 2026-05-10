"use client";

import React from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useResponsive } from "@/hooks/useResponsive";

interface MentionsLegalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MentionsLegalesModal({
  isOpen,
  onClose,
}: MentionsLegalesModalProps) {
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
      aria-labelledby="mentions-legales-title"
      aria-describedby="mentions-legales-desc"
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
          id="mentions-legales-title"
          className="text-xl font-bold mb-4 text-gray-900"
        >
          Mentions légales
        </h2>
        <div
          id="mentions-legales-desc"
          className="text-gray-700 text-sm overflow-y-auto flex-1 min-h-0"
        >
          <p className="mb-3">
            <strong>Application :</strong> Le crash de Yandel – escape game
            éducatif en ligne.
          </p>
          <p className="mb-3">
            <strong>Éditeur et responsable de la publication :</strong>
            <br />
            MK Team building
            <br />
            5, boulevard Aristide Briand
            <br />
            91450 Soisy-sur-Seine
            <br />
            France
            <br />
            SIRET : 849 862 933 00025
            <br />
            Site : mk-teambuilding.com
          </p>
          <p className="mb-3">
            <strong>Hébergement :</strong>
            <br />
            Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723
            <br />
            États-Unis
          </p>
          <p className="mb-3">
            <strong>Public cible :</strong> élèves de 6ᵉ et 5ᵉ (usage scolaire
            et familial).
          </p>
          <p>
            Pour toute question concernant les mentions légales ou le jeu,
            contactez MK Team building via le site mk-teambuilding.com.
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
