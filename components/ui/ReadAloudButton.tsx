"use client";

import React from "react";
import { useAudioDescription } from "@/hooks/useAudioDescription";

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

interface ReadAloudButtonProps {
  text: string;
  ariaLabel?: string;
  className?: string;
}

export function ReadAloudButton({
  text,
  ariaLabel,
  className = "",
}: ReadAloudButtonProps) {
  const { read, enabled, supported } = useAudioDescription();

  if (!enabled || !supported || !text.trim()) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        read(text);
      }}
      className={`flex items-center justify-center rounded-full bg-orange-500/90 text-white hover:bg-orange-600 transition-colors touch-manipulation shrink-0 ${className}`}
      style={{ minWidth: 32, minHeight: 32, width: 32, height: 32 }}
      aria-label={ariaLabel ?? `Lire : ${text.slice(0, 50)}${text.length > 50 ? "…" : ""}`}
      title="Lire"
    >
      <SpeakerIcon className="w-4 h-4" />
    </button>
  );
}
