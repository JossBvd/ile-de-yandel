"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Step, DragSelectImageGameData } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

const SELECT_INFO_IMAGE_READ_ALOUD: Record<string, string> = {
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-01.webp":
    "Indice de l'image un.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-02.webp":
    "Indice de l'image deux.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-03.webp":
    "Indice de l'image trois.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-04.webp":
    "Indice de l'image quatre.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-05.webp":
    "Indice de l'image cinq.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-06.webp":
    "Indice de l'image six.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-07.webp":
    "Indice de l'image sept.",
  "/missions/mission-3/step-1/m3_S1_popup_indice_photos-08.webp":
    "Indice de l'image huit.",
};

interface DragSelectImageGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function DragSelectImageGame({
  step,
  onComplete,
  onDefeat: _onDefeat,
}: DragSelectImageGameProps) {
  const game = step.game as DragSelectImageGameData;
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isMobileOrTablet } =
    useResponsive();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [infoModalImageUrl, setInfoModalImageUrl] = useState<string | null>(null);

  const maxSelections = game.maxSelections ?? game.correctImages.length;
  const canSubmit = selectedImages.length === maxSelections;

  const imageSize = isMobileOrTablet
    ? isSmallScreen
      ? 100
      : isMediumScreen
        ? 112
        : 124
    : isDesktopSmall
      ? 132
      : isDesktopMedium
        ? 148
        : 164;

  const containerPadding = isMobileOrTablet
    ? isSmallScreen
      ? "8px"
      : "10px"
    : isDesktopSmall
      ? "16px"
      : "20px";

  const toggleImage = (imageId: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      }
      if (prev.length >= maxSelections) {
        return prev;
      }
      return [...prev, imageId];
    });
  };

  const handleSubmit = () => {
    const correctSet = new Set(game.correctImages);
    const selectedSet = new Set(selectedImages);
    const isCorrect =
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((id) => correctSet.has(id));

    if (isCorrect) {
      onComplete();
      return;
    }

    // Conserver uniquement les bonnes réponses déjà trouvées.
    setSelectedImages((prev) => prev.filter((id) => correctSet.has(id)));
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col overflow-hidden pointer-events-none" style={{ padding: containerPadding }}>
      <div className="pointer-events-auto flex flex-col flex-1 min-h-0" style={{ gap: isMobileOrTablet ? 8 : 12 }}>
        <div
          className="rounded-xl shadow-xl border-2 border-amber-800/30 shrink-0"
          style={{
            backgroundColor: "#E6D5B8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: isMobileOrTablet ? (isSmallScreen ? "10px 12px" : "12px 14px") : "20px 22px",
          }}
        >
          <h2
            className="text-center text-gray-900 uppercase tracking-wide font-display"
            style={{
              fontSize: isMobileOrTablet ? (isSmallScreen ? "1.125rem" : "1.25rem") : "1.625rem",
              marginBottom: isSmallScreen ? "4px" : "6px",
              lineHeight: 1.25,
            }}
          >
            {step.title}
          </h2>
          <p
            className="text-gray-800 text-center font-sans font-bold"
            style={{
              fontSize: isMobileOrTablet ? (isSmallScreen ? "1rem" : "1.0625rem") : "1.25rem",
              lineHeight: 1.4,
            }}
          >
            « {game.text || step.instruction} »
          </p>
          <div className="flex justify-center mt-2">
            <ReadAloudButton
              text={`${step.title}. ${game.text || step.instruction}`}
              ariaLabel="Lire la consigne"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center" style={{ gap: isMobileOrTablet ? 8 : 12 }}>
          <div
            className="w-full flex items-center justify-center"
            style={{ gap: isMobileOrTablet ? 10 : 16 }}
          >
            <div
              className="grid grid-cols-4 justify-items-center items-center"
            style={{
              gap: isMobileOrTablet ? 8 : 12,
              maxWidth: imageSize * 4 + (isMobileOrTablet ? 8 : 12) * 3,
            }}
          >
            {game.images.map((image) => (
              <div
                key={image.id}
                onClick={() => toggleImage(image.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleImage(image.id);
                  }
                }}
                className={`relative rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                  selectedImages.includes(image.id)
                    ? "border-yellow-400 shadow-[0_0_0_3px_rgba(250,204,21,0.35)]"
                    : "border-white/70"
                }`}
                style={{ width: imageSize, height: imageSize }}
                role="button"
                tabIndex={0}
                aria-label={`Sélectionner ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  draggable={false}
                />
                {image.infoImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModalImageUrl(image.infoImage ?? null);
                    }}
                    className="absolute top-1 right-1 w-7 h-7 min-w-[28px] min-h-[28px] bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-md z-10 transition-all touch-manipulation"
                    aria-label="Voir l'indice"
                  >
                    <span className="text-black text-sm font-bold">i</span>
                  </button>
                )}
              </div>
            ))}
          </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex flex-col items-center justify-center gap-1 rounded-full bg-transparent hover:opacity-90 disabled:cursor-not-allowed transition-opacity touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 shrink-0"
              aria-label="Envoyer"
            >
              <div
                style={{
                  width: isMobileOrTablet ? (isSmallScreen ? 72 : 84) : 96,
                  height: isMobileOrTablet ? (isSmallScreen ? 72 : 84) : 96,
                  minWidth: 48,
                  minHeight: 48,
                }}
              >
                <Image
                  src="/ui/icon_bottle_send.webp"
                  alt=""
                  width={144}
                  height={144}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {infoModalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto"
          onClick={() => setInfoModalImageUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Indice"
        >
          <div className="relative w-full max-w-2xl max-h-[90dvh] flex items-center justify-center cursor-pointer">
            <Image
              src={infoModalImageUrl}
              alt="Indice"
              width={800}
              height={600}
              className="w-full h-auto max-h-[90dvh] object-contain pointer-events-none"
              sizes="(max-width: 640px) 100vw, 42rem"
            />
            <div
              className="absolute top-4 right-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <ReadAloudButton
                text={SELECT_INFO_IMAGE_READ_ALOUD[infoModalImageUrl] ?? "Indice"}
                ariaLabel="Lire l'indice"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
