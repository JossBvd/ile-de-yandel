"use client";

import React, { useEffect } from "react";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { useResponsive } from "@/hooks/useResponsive";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface AudioDescriptionChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AudioDescriptionChoiceModal({
  isOpen,
  onClose,
}: AudioDescriptionChoiceModalProps) {
  const { setFirstVisitChoice } = useAudioDescriptionStore();
  const { isSmallScreen, isMediumScreen, isDesktopSmall } = useResponsive();
  const setContainerRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setFirstVisitChoice(false);
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, setFirstVisitChoice, onClose]);

  if (!isOpen) return null;

  const handleYes = () => {
    setFirstVisitChoice(true);
    onClose();
  };

  const handleNo = () => {
    setFirstVisitChoice(false);
    onClose();
  };

  const handleBackdropClose = () => {
    setFirstVisitChoice(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={handleBackdropClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-description-choice-title"
      aria-describedby="audio-description-choice-desc"
    >
      <div
        ref={setContainerRef}
        className="bg-white rounded-lg shadow-xl w-full mx-4"
        style={{
          maxWidth: isSmallScreen ? "90%" : isMediumScreen ? "85%" : isDesktopSmall ? "420px" : "480px",
          padding: isSmallScreen ? "16px" : isMediumScreen ? "20px" : "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="audio-description-choice-title"
          className="text-xl font-bold mb-2 text-gray-900"
        >
          Souhaitez-vous activer l'audio description ?
        </h2>
        <p
          id="audio-description-choice-desc"
          className="text-gray-700 mb-6"
        >
          Le texte à l'écran pourra être lu à voix haute pour vous aider. Vous pourrez modifier ce choix plus tard dans les paramètres.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleNo}
            className="min-h-[44px] min-w-[80px] px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors touch-manipulation"
            aria-label="Non, ne pas activer l'audio description"
          >
            Non
          </button>
          <button
            type="button"
            onClick={handleYes}
            className="min-h-[44px] min-w-[80px] px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors touch-manipulation"
            aria-label="Oui, activer l'audio description"
          >
            Oui
          </button>
        </div>
      </div>
    </div>
  );
}
