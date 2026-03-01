"use client";

import React from "react";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import type { AudioDescriptionSpeed } from "@/store/audioDescriptionStore";
import { useResponsive } from "@/hooks/useResponsive";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const SPEEDS: { value: AudioDescriptionSpeed; label: string }[] = [
  { value: 0.5, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 1.5, label: "1.5×" },
  { value: 2, label: "2×" },
];

interface AudioDescriptionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AudioDescriptionSettingsModal({
  isOpen,
  onClose,
}: AudioDescriptionSettingsModalProps) {
  const {
    audioDescriptionEnabled,
    setAudioDescriptionEnabled,
    audioDescriptionAutoPlay,
    setAudioDescriptionAutoPlay,
    audioDescriptionSpeed,
    setAudioDescriptionSpeed,
  } = useAudioDescriptionStore();
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const setContainerRef = useFocusTrap(isOpen);

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
      aria-labelledby="audio-settings-title"
      aria-describedby="audio-settings-desc"
    >
      <div
        ref={setContainerRef}
        className="bg-[#e8dcc4] rounded-lg shadow-xl w-full mx-4 border border-amber-800/20"
        style={{
          maxWidth: isSmallScreen ? "90%" : isMediumScreen ? "400px" : "440px",
          padding: isSmallScreen ? "16px" : "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="audio-settings-title"
          className="text-xl font-bold mb-2 text-gray-900"
        >
          Audio description
        </h2>
        <p id="audio-settings-desc" className="text-gray-600 text-sm mb-6">
          Lire le texte à l'écran à voix haute. Vous pouvez activer ou désactiver la lecture automatique et choisir la vitesse.
        </p>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={audioDescriptionEnabled}
              onChange={(e) => setAudioDescriptionEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              aria-describedby="audio-enabled-desc"
            />
            <span id="audio-enabled-desc" className="font-medium text-gray-800">
              Activer l'audio description
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={audioDescriptionAutoPlay}
              onChange={(e) => setAudioDescriptionAutoPlay(e.target.checked)}
              disabled={!audioDescriptionEnabled}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 disabled:opacity-50"
              aria-describedby="audio-autoplay-desc"
            />
            <span id="audio-autoplay-desc" className="font-medium text-gray-800">
              Lecture automatique au chargement des étapes
            </span>
          </label>

          <div>
            <span className="block font-medium text-gray-800 mb-2">
              Vitesse de lecture
            </span>
            <div className="flex gap-2 flex-wrap">
              {SPEEDS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAudioDescriptionSpeed(value)}
                  className={`min-h-[40px] min-w-[56px] px-3 rounded font-medium text-sm touch-manipulation ${
                    audioDescriptionSpeed === value
                      ? "bg-orange-500 text-white"
                      : "bg-[#ddd0b0] text-gray-800 hover:bg-[#d0c4a0]"
                  }`}
                  aria-pressed={audioDescriptionSpeed === value}
                  aria-label={`Vitesse ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
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
