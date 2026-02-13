"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Step, DragOrderImagesGameData, ImageOption } from "@/types/step";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";
import { useDragAndDrop, useDropZone } from "@/hooks/useDragAndDrop";

interface DraggableImageProps {
  image: ImageOption;
  isInSlot: boolean;
  onInfoClick: (url: string) => void;
}

function DraggableImage({ image, isInSlot, onInfoClick }: DraggableImageProps) {
  const dragHandlers = useDragAndDrop(image.id, !isInSlot, "imageId");

  if (isInSlot) {
    return (
      <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-md sm:rounded-lg border-2 border-dashed border-white/40 bg-black/20" />
    );
  }

  return (
    <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-md sm:rounded-lg overflow-hidden border-2 border-white/60 hover:border-white transition-all shadow-lg group">
      <div
        {...dragHandlers}
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
      {image.infoImage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick(image.infoImage!);
          }}
          className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-md z-10 transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
          aria-label="Voir l'indice"
        >
          <span className="text-white text-[10px] sm:text-xs font-bold">i</span>
        </button>
      )}
    </div>
  );
}

interface DroppableSlotProps {
  index: number;
  imageId: string | null;
  image: ImageOption | null | undefined;
  isLocked: boolean;
  onDrop: (id: string, index: number) => void;
  onInfoClick: (url: string) => void;
}

function DroppableSlot({
  index,
  imageId,
  image,
  isLocked,
  onDrop,
  onInfoClick,
}: DroppableSlotProps) {
  const dropHandlers = useDropZone(
    (id) => {
      if (!isLocked) {
        onDrop(id, index);
      }
    },
    !isLocked,
    "imageId"
  );

  return (
    <div
      {...dropHandlers}
      className={`relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-md sm:rounded-lg transition-all ${
        isLocked
          ? "border-2 sm:border-4 border-green-500 bg-green-100/50 shadow-xl shadow-green-500/30"
          : imageId
            ? "border-2 sm:border-4 border-blue-500 bg-blue-100/50 shadow-lg"
            : "border-2 sm:border-4 border-dashed border-white/60 bg-black/30 shadow-inner"
      }`}
    >
      {image && (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover rounded-md"
          />
          {image.infoImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick(image.infoImage!);
              }}
              className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-md z-10 transition-all touch-manipulation"
              aria-label="Voir l'indice"
            >
              <span className="text-white text-[10px] sm:text-xs font-bold">
                i
              </span>
            </button>
          )}
        </>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 rounded-md sm:rounded-lg pointer-events-none">
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
}

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
  const [infoModalImageUrl, setInfoModalImageUrl] = useState<string | null>(
    null,
  );
  const [showVictory, setShowVictory] = useState(false);

  const handleSubmit = () => {
    const correctSet = new Set(game.correctOrder);
    const newLockedSlots = [...lockedSlots];
    const newSlots = [...slots];

    slots.forEach((imageId, index) => {
      if (imageId && correctSet.has(imageId)) {
        newLockedSlots[index] = true;
      } else {
        newSlots[index] = null;
        newLockedSlots[index] = false;
      }
    });

    setLockedSlots(newLockedSlots);
    setSlots(newSlots);

    const remainingIds = newSlots.filter((id): id is string => id !== null);
    const remainingSet = new Set(remainingIds);
    const allCorrect =
      remainingSet.size === correctSet.size &&
      [...remainingSet].every((id) => correctSet.has(id));

    if (allCorrect) {
      if (step.id === "mission-1-step-3") {
        onComplete();
      } else {
        setTimeout(() => setShowVictory(true), 500);
      }
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
      <div className="absolute top-5 left-2 right-2 sm:top-7 sm:left-4 sm:right-4 md:top-9 md:left-6 md:right-6 z-10 pointer-events-none">
        <div
          className="rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-5 lg:p-6 shadow-xl border-2 border-amber-800/30 pointer-events-auto"
          style={{
            backgroundColor: "#E6D5B8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 uppercase tracking-wide mb-0.5 sm:mb-1 md:mb-2">
            {step.title}
          </h2>
          <p className="text-gray-800 text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight sm:leading-relaxed italic text-center line-clamp-2 sm:line-clamp-none">
            « {game.text || step.instruction} »
          </p>
        </div>
      </div>
      <div className="absolute top-[32%] sm:top-[30%] md:top-[32%] lg:top-[34%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 pointer-events-auto">
          {game.sourceImages.map((image) => (
            <DraggableImage
              key={image.id}
              image={image}
              isInSlot={isImageInSlot(image.id)}
              onInfoClick={setInfoModalImageUrl}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[12%] lg:bottom-[14%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 pointer-events-auto">
          {slots.map((imageId, index) => {
            const isLocked = lockedSlots[index];
            const image = imageId
              ? game.sourceImages.find((img) => img.id === imageId)
              : null;

            return (
              <DroppableSlot
                key={`slot-${index}`}
                index={index}
                imageId={imageId}
                image={image}
                isLocked={isLocked}
                onDrop={(id, idx) => {
                  const newSlots = [...slots];
                  newSlots[idx] = id;
                  setSlots(newSlots);
                }}
                onInfoClick={setInfoModalImageUrl}
              />
            );
          })}
          <div className="relative flex flex-col items-center">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="min-w-[48px] min-h-[48px] w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-transparent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:scale-105 active:scale-95 flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
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
          <div className="relative w-full max-w-2xl max-h-[90vh] flex items-center justify-center cursor-pointer">
            <Image
              src={infoModalImageUrl}
              alt="Indice"
              width={800}
              height={600}
              className="w-full h-auto max-h-[90vh] object-contain pointer-events-none"
              sizes="(max-width: 640px) 100vw, 42rem"
            />
          </div>
        </div>
      )}
      <VictoryModal
        isOpen={showVictory}
        onContinue={handleContinue}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
      />
    </>
  );
}
