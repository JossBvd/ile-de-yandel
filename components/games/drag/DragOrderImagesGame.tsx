"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Step, DragOrderImagesGameData, ImageOption } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { useDndSensors } from "@/hooks/useDndSensors";
import { useDndCollisionDetection } from "@/hooks/useDndCollisionDetection";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

interface DraggableImageProps {
  image: ImageOption;
  isInSlot: boolean;
  onInfoClick: (url: string) => void;
  sizePx: number;
}

function DraggableImage({ image, isInSlot, onInfoClick, sizePx }: DraggableImageProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: image.id,
    disabled: isInSlot,
  });

  if (isInSlot) {
    return (
      <div
        className="rounded-lg border-2 border-dashed border-white/40 bg-black/20 shrink-0"
        style={{ width: sizePx, height: sizePx }}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative rounded-lg overflow-hidden border-2 border-white/60 hover:border-white transition-all shadow-lg group touch-none shrink-0 ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ width: sizePx, height: sizePx }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover pointer-events-none"
        draggable={false}
      />
      {image.infoImage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick(image.infoImage!);
          }}
          className="absolute top-1 right-1 w-7 h-7 min-w-[28px] min-h-[28px] bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-md z-10 transition-all touch-manipulation opacity-100"
          aria-label="Voir l'indice"
        >
          <span className="text-black text-sm font-bold">i</span>
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
  onInfoClick: (url: string) => void;
  sizePx: number;
}

function DroppableSlot({
  index,
  imageId,
  image,
  isLocked,
  onInfoClick,
  sizePx,
}: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    disabled: isLocked,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-lg transition-all touch-none shrink-0 border-2 ${
        isLocked
          ? "border-green-500 bg-green-100/50 shadow-xl shadow-green-500/30"
          : imageId
            ? "border-blue-500 bg-blue-100/50 shadow-lg"
            : isOver
              ? "border-yellow-400 bg-yellow-100/50 shadow-lg"
              : "border-dashed border-white/60 bg-black/30 shadow-inner"
      }`}
      style={{ width: sizePx, height: sizePx }}
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
              className="absolute top-1 right-1 w-7 h-7 min-w-[28px] min-h-[28px] bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-md z-10 transition-all touch-manipulation"
              aria-label="Voir l'indice"
            >
              <span className="text-black text-sm font-bold">i</span>
            </button>
          )}
        </>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/30 rounded-lg pointer-events-none">
          <svg
            className="w-6 h-6 text-white drop-shadow-md"
            style={{ width: sizePx * 0.4, height: sizePx * 0.4 }}
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
  questionContainerVisible?: boolean;
}

export function DragOrderImagesGame({
  step,
  onComplete,
  onDefeat,
  questionContainerVisible = true,
}: DragOrderImagesGameProps) {
  const game = step.game as DragOrderImagesGameData;
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();
  const isCompactSource = game.layoutVariant === "compact-source";
  const isGrid5Cols = game.layoutVariant === "grid-5-cols";
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(game.slotsCount).fill(null),
  );
  const [lockedSlots, setLockedSlots] = useState<boolean[]>(
    Array(game.slotsCount).fill(false),
  );
  const [infoModalImageUrl, setInfoModalImageUrl] = useState<string | null>(
    null,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();

  useEffect(() => {
    setMounted(true);
  }, []);

  const paddingEdge = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? "4px 6px"
        : isMediumScreen
          ? "6px 8px"
          : "8px 10px"
      : isSmallScreen
        ? "8px"
        : isMediumScreen
          ? "10px"
          : "12px"
    : isDesktopSmall
      ? "16px"
      : isDesktopMedium
        ? "20px"
        : "24px";
  const imageSize = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? 92
        : isMediumScreen
          ? 100
          : 112
      : isGrid5Cols
        ? isSmallScreen
          ? 82
          : isMediumScreen
            ? 90
            : 98
      : isSmallScreen
        ? 100
        : isMediumScreen
          ? 108
          : 120
    : isDesktopSmall
      ? 128
      : isDesktopMedium
        ? 144
        : 160;
  const hasDenseSourceGrid = game.sourceImages.length >= 5;
  const hasManyAnswerSlots = game.slotsCount >= 5;
  const shouldEnableVerticalScroll = isMobileOrTablet && questionContainerVisible;
  const shouldTopAlignContent = shouldEnableVerticalScroll && (hasDenseSourceGrid || hasManyAnswerSlots);
  const shouldReduceSourceImageSize =
    isMobileOrTablet &&
    questionContainerVisible &&
    (hasDenseSourceGrid || hasManyAnswerSlots);
  const imageSizeReduction = shouldReduceSourceImageSize
    ? hasManyAnswerSlots
      ? isSmallScreen
        ? 16
        : isMediumScreen
          ? 14
          : 12
      : isSmallScreen
        ? 12
        : isMediumScreen
          ? 10
          : 8
    : 0;
  const effectiveImageSize = Math.max(72, imageSize - imageSizeReduction);
  const slotSize = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? 96
        : isMediumScreen
          ? 104
          : 116
      : isSmallScreen
        ? 108
        : isMediumScreen
          ? 116
          : 128
    : isDesktopSmall
      ? 136
      : isDesktopMedium
        ? 152
        : 168;
  const sendButtonSize = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? 68
        : isMediumScreen
          ? 76
          : 84
      : isSmallScreen
        ? 76
        : isMediumScreen
          ? 84
          : 92
    : isDesktopSmall
      ? 104
      : isDesktopMedium
        ? 112
        : 120;
  const questionTitleSize = isMobileOrTablet
    ? (isSmallScreen ? "1rem" : "1.125rem")
    : (isDesktopSmall ? "1.25rem" : isDesktopMedium ? "1.5rem" : "1.75rem");
  const questionTextSize = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? "1rem"
        : "1.03125rem"
      : isSmallScreen
        ? "1rem"
        : "1.0625rem"
    : isDesktopSmall
      ? "1.125rem"
      : isDesktopMedium
        ? "1.25rem"
        : "1.375rem";
  const gapImages = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? 4
        : 6
      : isSmallScreen
        ? 6
        : 8
    : isDesktopSmall
      ? 8
      : 12;
  const gapSlotsInner = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? 4
        : 6
      : isSmallScreen
        ? 6
        : 8
    : isDesktopSmall
      ? 8
      : 12;
  const gapSlotsOuter = isMobileOrTablet
    ? isCompactSource
      ? isSmallScreen
        ? 8
        : 10
      : isSmallScreen
        ? 10
        : 12
    : isDesktopSmall
      ? 14
      : 18;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || isLocked(over.id as string)) return;

    const slotId = over.id as string;
    
    if (!slotId.startsWith("slot-")) return;
    
    const slotIndex = parseInt(slotId.replace("slot-", ""), 10);

    if (!isNaN(slotIndex) && slotIndex >= 0 && slotIndex < slots.length) {
      const imageId = active.id as string;
      setSlots((prev) => {
        const newSlots = [...prev];
        newSlots[slotIndex] = imageId;
        return newSlots;
      });
    }
  };

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(event.active.id as string);
  };

  const isLocked = (id: string) => {
    if (!id.startsWith("slot-")) return false;
    const index = parseInt(id.replace("slot-", ""), 10);
    return lockedSlots[index] || false;
  };

  const handleSubmit = () => {
    const correctSet = new Set(game.correctOrder);
    const strictOrder = game.enforceOrder ?? game.correctOrder.length === game.slotsCount;
    const newLockedSlots = [...lockedSlots];
    const newSlots = [...slots];

    if (strictOrder) {
      slots.forEach((imageId, index) => {
        if (imageId === game.correctOrder[index]) {
          newLockedSlots[index] = true;
        } else {
          newSlots[index] = null;
          newLockedSlots[index] = false;
        }
      });
    } else {
      slots.forEach((imageId, index) => {
        if (imageId && correctSet.has(imageId)) {
          newLockedSlots[index] = true;
        } else {
          newSlots[index] = null;
          newLockedSlots[index] = false;
        }
      });
    }

    setLockedSlots(newLockedSlots);
    setSlots(newSlots);

    const remainingIds = newSlots.filter((id): id is string => id !== null);
    const remainingSet = new Set(remainingIds);
    const allCorrect = strictOrder
      ? newSlots.every((id, i) => id === game.correctOrder[i])
      : remainingSet.size === correctSet.size &&
        [...remainingSet].every((id) => correctSet.has(id));

    if (allCorrect) {
      setTimeout(() => onComplete(), 500);
    }
  };

  const isImageInSlot = (imageId: string) => {
    return slots.includes(imageId);
  };

  const canSubmit = slots.every((slot) => slot !== null);

  const activeImage = activeId
    ? game.sourceImages.find((img) => img.id === activeId)
    : null;

  const gameContent = (
    <div
      className="absolute inset-0 z-10 flex flex-col overflow-hidden pointer-events-none"
      style={{ padding: paddingEdge }}
    >
      <div className="pointer-events-auto flex flex-col flex-1 min-h-0" style={{ gap: isMobileOrTablet ? 8 : 12 }}>
        {questionContainerVisible && (
        <div
          className="rounded-xl shadow-xl border-2 border-amber-800/30 shrink-0 pointer-events-auto"
          style={{
            backgroundColor: "#E6D5B8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: isMobileOrTablet
              ? (isSmallScreen ? "8px 10px" : "10px 12px")
              : (isDesktopSmall ? "20px 16px" : "26px 20px"),
          }}
        >
          <h2
            className="text-center text-gray-900 uppercase tracking-wide font-display"
            style={{
              fontSize: questionTitleSize,
              marginBottom: isSmallScreen ? "4px" : "6px",
              lineHeight: 1.25,
            }}
          >
            {step.title}
          </h2>
            <p
              className="text-gray-800 text-center line-clamp-2 font-sans font-bold"
              style={{ fontSize: questionTextSize, lineHeight: 1.4 }}
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
        )}

        <div
          className={`flex-1 min-h-0 flex flex-col pointer-events-auto ${
            shouldTopAlignContent ? "justify-start" : "justify-center"
          } ${shouldEnableVerticalScroll ? "overflow-y-auto scrollbar-hide" : ""}`}
          style={{
            gap: isMobileOrTablet ? 8 : 12,
            paddingBottom: shouldEnableVerticalScroll ? "8px" : undefined,
          }}
        >
          <div
            className={
              isGrid5Cols
                ? "w-full grid grid-cols-5 justify-items-center items-center shrink-0"
                : "w-full flex flex-wrap justify-center items-center shrink-0"
            }
            style={{
              gap: gapImages,
              maxWidth: isGrid5Cols ? imageSize * 5 + gapImages * 4 : undefined,
              margin: isGrid5Cols ? "0 auto" : undefined,
            }}
          >
            {game.sourceImages.map((image) => (
              <DraggableImage
                key={image.id}
                image={image}
                isInSlot={isImageInSlot(image.id)}
                onInfoClick={setInfoModalImageUrl}
                sizePx={effectiveImageSize}
              />
            ))}
          </div>
          <div
            className="w-full flex flex-wrap items-center justify-center shrink-0"
            style={{ gap: gapSlotsOuter }}
          >
            <div
              className="flex flex-wrap items-center justify-center"
              style={{ gap: gapSlotsInner }}
            >
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
                    onInfoClick={setInfoModalImageUrl}
                    sizePx={slotSize}
                  />
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-full bg-transparent hover:opacity-90 disabled:cursor-not-allowed transition-opacity hover:scale-105 active:scale-95 flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 shrink-0"
              style={{
                width: sendButtonSize,
                height: sendButtonSize,
                minWidth: 48,
                minHeight: 48,
              }}
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
    </div>
  );

  if (!mounted) {
    return (
      <>
        <div
          className="absolute inset-0 z-10 flex flex-col overflow-hidden pointer-events-none"
          style={{ padding: paddingEdge }}
        >
          <div className="pointer-events-auto flex flex-col flex-1 min-h-0" style={{ gap: isMobileOrTablet ? 8 : 12 }}>
            {questionContainerVisible && (
            <div
              className="rounded-xl shadow-xl border-2 border-amber-800/30 shrink-0 pointer-events-auto"
              style={{
                backgroundColor: "#E6D5B8",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                padding: isMobileOrTablet
                  ? (isSmallScreen ? "8px 10px" : "10px 12px")
                  : (isDesktopSmall ? "20px 16px" : "26px 20px"),
              }}
            >
              <h2
                className="text-center text-gray-900 uppercase tracking-wide font-display"
                style={{
                  fontSize: questionTitleSize,
                  marginBottom: isSmallScreen ? "4px" : "6px",
                  lineHeight: 1.25,
                }}
              >
                {step.title}
              </h2>
              <p
                className="text-gray-800 text-center line-clamp-2 font-sans font-bold"
                style={{ fontSize: questionTextSize, lineHeight: 1.4 }}
              >
                « {game.text || step.instruction} »
              </p>
            </div>
            )}
            <div
              className="flex-1 min-h-0 flex flex-col justify-center pointer-events-auto"
              style={{ gap: isMobileOrTablet ? 8 : 12 }}
            >
              <div
                className={
                  isGrid5Cols
                    ? "w-full grid grid-cols-5 justify-items-center items-center shrink-0"
                    : "w-full flex flex-wrap justify-center items-center shrink-0"
                }
                style={{
                  gap: gapImages,
                  maxWidth: isGrid5Cols ? imageSize * 5 + gapImages * 4 : undefined,
                  margin: isGrid5Cols ? "0 auto" : undefined,
                }}
              >
                {game.sourceImages.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-lg border-2 border-white/40 bg-black/20 shrink-0"
                    style={{ width: effectiveImageSize, height: effectiveImageSize }}
                  />
                ))}
              </div>
              <div
                className="w-full flex flex-wrap items-center justify-center shrink-0"
                style={{ gap: gapSlotsOuter }}
              >
                <div
                  className="flex flex-wrap items-center justify-center"
                  style={{ gap: gapSlotsInner }}
                >
                  {slots.map((_, index) => (
                    <div
                      key={`slot-${index}`}
                      className="rounded-lg border-2 border-dashed border-white/40 bg-black/30 shrink-0"
                      style={{ width: slotSize, height: slotSize }}
                    />
                  ))}
                </div>
                <div
                  className="rounded-full bg-black/10 shrink-0"
                  style={{ width: sendButtonSize, height: sendButtonSize, minWidth: 48, minHeight: 48 }}
                />
              </div>
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
                  text={(() => {
                    const img = game.sourceImages.find(
                      (i) => i.infoImage === infoModalImageUrl,
                    );
                    return img?.readAloudText ?? img?.info ?? "Indice";
                  })()}
                  ariaLabel="Lire l'indice"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {gameContent}
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
                text={(() => {
                  const img = game.sourceImages.find(
                    (i) => i.infoImage === infoModalImageUrl,
                  );
                  return img?.readAloudText ?? img?.info ?? "Indice";
                })()}
                ariaLabel="Lire l'indice"
              />
            </div>
          </div>
        </div>
      )}
      <DragOverlay>
        {activeImage ? (
          <div
            className="relative rounded-lg overflow-hidden border-2 border-white/60 shadow-lg opacity-90"
            style={{ width: effectiveImageSize, height: effectiveImageSize }}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-cover"
              draggable={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
