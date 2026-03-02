"use client";

import React, { useState } from "react";
import { useAudioDescription } from "@/hooks/useAudioDescription";
import type { AudioDescriptionSpeed } from "@/store/audioDescriptionStore";

const SPEED_OPTIONS: { value: AudioDescriptionSpeed; label: string }[] = [
  { value: 0.5, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 1.5, label: "1.5×" },
  { value: 2, label: "2×" },
];

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 6h12v12H6z" />
    </svg>
  );
}

interface AudioDescriptionButtonProps {
  textToRead?: string;
  className?: string;
  sizeVariant?: "default" | "compact";
}

export function AudioDescriptionButton({
  textToRead,
  className = "",
  sizeVariant = "default",
}: AudioDescriptionButtonProps) {
  const {
    isPlaying,
    isPaused,
    read,
    pause,
    resume,
    cancel,
    setSpeed,
    speed,
    enabled,
    supported,
  } = useAudioDescription();
  const [showControls, setShowControls] = useState(false);

  if (!enabled || !supported) return null;

  const handlePlayPause = () => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPlaying && isPaused) {
      resume();
    } else if (textToRead?.trim()) {
      read(textToRead);
    }
  };

  const iconSize = sizeVariant === "compact" ? "20px" : "24px";

  return (
    <div className={`relative flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={handlePlayPause}
        className="flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
        style={{ width: iconSize === "24px" ? 44 : 36, height: iconSize === "24px" ? 44 : 36 }}
        aria-label={
          isPlaying && !isPaused
            ? "Mettre en pause la lecture"
            : isPlaying && isPaused
              ? "Reprendre la lecture"
              : "Lire le texte à l'écran"
        }
      >
        {isPlaying && !isPaused ? (
          <PauseIcon className="w-5 h-5" />
        ) : (
          <SpeakerIcon className="w-5 h-5" />
        )}
      </button>
      <button
        type="button"
        onClick={() => cancel()}
        className="flex items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors touch-manipulation min-h-[44px] min-w-[44px] disabled:opacity-50"
        style={{ width: iconSize === "24px" ? 44 : 36, height: iconSize === "24px" ? 44 : 36 }}
        aria-label="Arrêter la lecture"
        disabled={!isPlaying}
      >
        <StopIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setShowControls((s) => !s)}
        className="flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] text-xs font-medium"
        style={{ width: iconSize === "24px" ? 44 : 36, height: iconSize === "24px" ? 44 : 36 }}
        aria-label="Vitesse de lecture"
        aria-expanded={showControls}
      >
        {speed}×
      </button>
      {showControls && (
        <div
          className="absolute top-full left-0 mt-1 flex gap-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          role="group"
          aria-label="Vitesse de lecture"
        >
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setSpeed(opt.value);
                setShowControls(false);
              }}
              className={`min-h-[36px] min-w-[44px] px-2 rounded text-sm font-medium touch-manipulation ${
                speed === opt.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              aria-label={`Vitesse ${opt.label}`}
              aria-pressed={speed === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
