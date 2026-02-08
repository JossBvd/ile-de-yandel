"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Step, DragOrderImagesGameData, ImageOption } from "@/types/step";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface DragOrderImagesGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function DragOrderImagesGame({
  step,
  onComplete,
  onDefeat,
}: DragOrderImagesGameProps) {
  const game = step.game as DragOrderImagesGameData;
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(game.slotsCount).fill(null),
  );
  const [lockedSlots, setLockedSlots] = useState<boolean[]>(
    Array(game.slotsCount).fill(false),
  );
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  const handleSubmit = () => {
    const newLockedSlots = [...lockedSlots];
    const newSlots = [...slots];
    let hasCorrectAnswers = false;
    let allCorrect = true;

    slots.forEach((imageId, index) => {
      if (imageId === game.correctOrder[index]) {
        newLockedSlots[index] = true;
        hasCorrectAnswers = true;
      } else {
        newSlots[index] = null;
        allCorrect = false;
      }
    });

    setLockedSlots(newLockedSlots);
    setSlots(newSlots);

    if (allCorrect && hasCorrectAnswers) {
      setTimeout(() => setShowVictory(true), 500);
    } else if (!hasCorrectAnswers && onDefeat) {
      // Aucune bonne réponse : afficher la modal de défaite
      setTimeout(() => onDefeat(), 500);
    }
  };

  const handleContinue = () => {
    setShowVictory(false);
    onComplete();
  };

  const isImageInSlot = (imageId: string) => {
    return slots.includes(imageId);
  };

  const canSubmit = slots.every((slot) => slot !== null);

  return (
    <>
      {/* Panneau beige en haut avec titre et instruction */}
      <div className="absolute top-5 left-2 right-2 sm:top-7 sm:left-4 sm:right-4 md:top-9 md:left-6 md:right-6 z-10 pointer-events-none">
        <div
          className="rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-5 lg:p-6 shadow-xl border-2 border-amber-800/30 pointer-events-auto"
          style={{
            backgroundColor: "#E6D5B8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 uppercase tracking-wide mb-0.5 sm:mb-1 md:mb-2">
            Énigme
          </h2>
          <p className="text-gray-800 text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight sm:leading-relaxed italic text-center line-clamp-2 sm:line-clamp-none">
            « {game.text || step.instruction} »
          </p>
        </div>
      </div>

      {/* Zone des images sources - positionnée en haut du milieu de l'écran */}
      <div className="absolute top-[32%] sm:top-[30%] md:top-[32%] lg:top-[34%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 pointer-events-auto">
          {game.sourceImages.map((image) => {
            const inSlot = isImageInSlot(image.id);
            if (inSlot) {
              return (
                <div
                  key={image.id}
                  className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-md sm:rounded-lg border-2 border-dashed border-white/40 bg-black/20"
                />
              );
            }

            return (
              <div
                key={image.id}
                className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-md sm:rounded-lg overflow-hidden border-2 border-white/60 hover:border-white transition-all shadow-lg group"
              >
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("imageId", image.id);
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                </div>
                {/* Bouton info */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(image);
                  }}
                  className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-md z-10 transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
                  aria-label="Voir les informations"
                >
                  <span className="text-white text-[10px] sm:text-xs font-bold">
                    i
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone de dépôt : 3 slots + bouton Envoyer - positionnée en bas du milieu */}
      <div className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[12%] lg:bottom-[14%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 pointer-events-auto">
          {/* Les 3 slots */}
          {slots.map((imageId, index) => {
            const isLocked = lockedSlots[index];
            const image = imageId
              ? game.sourceImages.find((img) => img.id === imageId)
              : null;

            return (
              <div
                key={`slot-${index}`}
                onDragOver={(e) => {
                  if (!isLocked) {
                    e.preventDefault();
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!isLocked) {
                    const draggedImageId = e.dataTransfer.getData("imageId");
                    const newSlots = [...slots];
                    newSlots[index] = draggedImageId;
                    setSlots(newSlots);
                  }
                }}
                className={`relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-md sm:rounded-lg transition-all ${
                  isLocked
                    ? "border-2 sm:border-4 border-green-500 bg-green-100/50 shadow-xl shadow-green-500/30"
                    : imageId
                      ? "border-2 sm:border-4 border-blue-500 bg-blue-100/50 shadow-lg"
                      : "border-2 sm:border-4 border-dashed border-white/60 bg-black/30 shadow-inner"
                }`}
              >
                {image && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover rounded-md"
                  />
                )}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 rounded-md sm:rounded-lg">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-md"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bouton Envoyer (icône bouteille) à droite des slots */}
          <div className="relative flex flex-col items-center">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="min-w-[48px] min-h-[48px] w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-transparent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:scale-105 active:scale-95 flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              aria-label="Envoyer"
            >
              <Image
                src="/ui/icon_bottle_send.webp"
                alt=""
                width={144}
                height={144}
                className="w-full h-full object-contain"
              />
            </button>
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-yellow-400 drop-shadow-lg whitespace-nowrap mt-1">
              Envoyer
            </span>
          </div>
        </div>
      </div>

      {/* Modal d'information */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundImage: "url(/backgrounds/paper_texture.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bordure déchirée effet */}
            <div className="absolute inset-0 border-4 border-amber-900/40 rounded-2xl pointer-events-none" />

            {/* Contenu de la modal */}
            <div className="relative p-6 sm:p-8 md:p-10">
              {/* Bouton fermer */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-10 touch-manipulation"
                aria-label="Fermer"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Titre INFO */}
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 uppercase mb-4 sm:mb-6">
                Info
              </h3>

              {/* Contenu : image + texte */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                {/* Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg shrink-0">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Texte */}
                <div className="flex-1 text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed">
                  <p>
                    {selectedImage.info ||
                      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de victoire */}
      <VictoryModal
        isOpen={showVictory}
        onContinue={handleContinue}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
      />
    </>
  );
}
