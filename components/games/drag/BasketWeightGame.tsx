"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Step, BasketWeightGameData, BasketWeightItem } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { useDndSensors } from "@/hooks/useDndSensors";
import { useDndCollisionDetection } from "@/hooks/useDndCollisionDetection";

interface BasketWeightGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

function formatWeight(value: number, unit: "grams" | "centiliters"): string {
  if (unit === "centiliters") {
    return `${value} cl`;
  }

  const grams = value;
  if (grams % 1000 === 0) return `${grams / 1000} kg`;
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
}

function getBasketImageSrc(
  currentWeight: number,
  initialWeight: number,
  targetWeight: number,
  basketImages: string[],
  overflowImage?: string,
): string {
  if (currentWeight > targetWeight && overflowImage) {
    return overflowImage;
  }

  const count = basketImages.length;
  if (count === 0) return "";
  if (count === 1) return basketImages[0];
  const ratio = (currentWeight - initialWeight) / (targetWeight - initialWeight);
  const clamped = Math.max(0, Math.min(1, ratio));
  const index = Math.round(clamped * (count - 1));
  return basketImages[index];
}

interface DraggableLianeProps {
  item: BasketWeightItem;
  size: number;
  disabled?: boolean;
  measurementUnit: "grams" | "centiliters";
}

function DraggableLiane({
  item,
  size,
  disabled = false,
  measurementUnit,
}: DraggableLianeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none relative rounded-xl overflow-hidden shadow-md transition-transform ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing hover:scale-105"
      } ${isDragging ? "opacity-50" : ""}`}
      style={{ width: size, height: size }}
      aria-label={`${item.alt}, ${formatWeight(item.weightGrams, measurementUnit)}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={size}
        height={size}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
    </div>
  );
}

interface DroppableBasketProps {
  basketImageSrc: string;
  size: number;
}

function DroppableBasket({ basketImageSrc, size }: DroppableBasketProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "basket" });

  return (
    <div
      ref={setNodeRef}
      className={`touch-none relative transition-all duration-150 ${
        isOver ? "scale-105" : ""
      }`}
      style={{ width: size, height: size }}
    >
      {basketImageSrc ? (
        <Image
          src={basketImageSrc}
          alt="Panier"
          fill
          className="object-contain pointer-events-none transition-opacity duration-200"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-8xl select-none">
          🧺
        </div>
      )}
      {isOver && (
        <div className="absolute inset-0 rounded-2xl bg-yellow-300/25 border-4 border-dashed border-yellow-400 pointer-events-none" />
      )}
    </div>
  );
}

export function BasketWeightGame({ step, onComplete }: BasketWeightGameProps) {
  const game = step.game as BasketWeightGameData;
  const measurementUnit = game.measurementUnit ?? "grams";
  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();

  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
    mounted,
  } = useResponsive();

  const [currentWeightGrams, setCurrentWeightGrams] = useState(
    game.initialWeightGrams,
  );
  const [dropCounts, setDropCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(game.items.map((item) => [item.id, 0])),
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [isExceeded, setIsExceeded] = useState(false);

  const activeItem = activeDragId
    ? game.items.find((it) => it.id === activeDragId)
    : null;

  const basketImageSrc = getBasketImageSrc(
    currentWeightGrams,
    game.initialWeightGrams,
    game.targetWeightGrams,
    game.basketImages,
    game.overflowImage,
  );

  const itemSize = isMobileOrTablet
    ? isSmallScreen
      ? 80
      : isMediumScreen
        ? 96
        : 108
    : isDesktopSmall
      ? 110
      : isDesktopMedium
        ? 126
        : 140;

  const basketSize = isMobileOrTablet
    ? isSmallScreen
      ? 130
      : isMediumScreen
        ? 160
        : 180
    : isDesktopSmall
      ? 190
      : isDesktopMedium
        ? 220
        : 250;

  const textSize = isMobileOrTablet
    ? isSmallScreen
      ? "0.875rem"
      : isMediumScreen
        ? "1rem"
        : "1.0625rem"
    : isDesktopSmall
      ? "1.125rem"
      : isDesktopMedium
        ? "1.25rem"
        : "1.375rem";

  const weightTextSize = isMobileOrTablet
    ? isSmallScreen
      ? "1rem"
      : isMediumScreen
        ? "1.125rem"
        : "1.25rem"
    : isDesktopSmall
      ? "1.375rem"
      : isDesktopMedium
        ? "1.5rem"
        : "1.625rem";

  const panelPadding = isMobileOrTablet
    ? isSmallScreen
      ? "10px 12px"
      : isMediumScreen
        ? "12px 16px"
        : "16px 20px"
    : isDesktopSmall
      ? "20px 28px"
      : "24px 36px";

  const gap = isMobileOrTablet
    ? isSmallScreen
      ? 10
      : isMediumScreen
        ? 14
        : 16
    : isDesktopSmall
      ? 20
      : isDesktopMedium
        ? 24
        : 28;
  const draggableColumnGap = isMobileOrTablet
    ? isSmallScreen
      ? 10
      : isMediumScreen
        ? 12
        : 14
    : isDesktopSmall
      ? 16
      : isDesktopMedium
        ? 18
        : 22;
  const outerLeftPadding = isMobileOrTablet
    ? isSmallScreen
      ? 20
      : isMediumScreen
        ? 26
        : 34
    : isDesktopSmall
      ? 36
      : isDesktopMedium
        ? 48
        : 60;
  const panelMaxWidth = isMobileOrTablet
    ? isSmallScreen
      ? "61vw"
      : isMediumScreen
        ? "63vw"
        : "65vw"
    : isDesktopSmall
      ? "54vw"
      : isDesktopMedium
        ? "56vw"
        : "58vw";
  const titleToContentGap = isMobileOrTablet
    ? isSmallScreen
      ? 14
      : isMediumScreen
        ? 18
        : 22
    : isDesktopSmall
      ? 24
      : isDesktopMedium
        ? 30
        : 34;

  useEffect(() => {
    if (isWon) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [isWon, onComplete]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("basket-weight-overflow-lock", {
        detail: { locked: isExceeded },
      }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("basket-weight-overflow-lock", {
          detail: { locked: false },
        }),
      );
    };
  }, [isExceeded]);

  const resetBasket = () => {
    setCurrentWeightGrams(game.initialWeightGrams);
    setDropCounts(Object.fromEntries(game.items.map((item) => [item.id, 0])));
    setIsWon(false);
    setIsExceeded(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    if (isExceeded) return;

    const { active, over } = event;
    if (!over || over.id !== "basket") return;

    const draggedId = active.id as string;
    const item = game.items.find((it) => it.id === draggedId);
    if (!item) return;

    const used = dropCounts[draggedId] ?? 0;
    if (item.maxUses !== undefined && used >= item.maxUses) return;

    const newWeight = currentWeightGrams + item.weightGrams;

    if (newWeight > game.targetWeightGrams) {
      setCurrentWeightGrams(newWeight);
      setIsExceeded(true);
      return;
    }

    setCurrentWeightGrams(newWeight);
    setDropCounts((prev) => ({
      ...prev,
      [draggedId]: (prev[draggedId] ?? 0) + 1,
    }));

    if (newWeight === game.targetWeightGrams) {
      setIsWon(true);
    }
  };

  if (!mounted) return null;

  const instructionText =
    game.text ??
    "Ajoute les bons morceaux de lianes au panier ! Attention, si c'est trop lourd, le panier va craquer !";

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      {isExceeded && (
        <div className="absolute inset-0 z-20 bg-black/55 pointer-events-auto" />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="pointer-events-auto flex items-center relative"
          style={{ gap, paddingLeft: outerLeftPadding }}
        >
          <div className="flex flex-col items-center" style={{ gap: draggableColumnGap }}>
            {game.items.map((item) => {
              const used = dropCounts[item.id] ?? 0;
              const exhausted =
                item.maxUses !== undefined && used >= item.maxUses;
              return (
                <DraggableLiane
                  key={item.id}
                  item={item}
                  size={itemSize}
                  disabled={isExceeded || isWon || exhausted}
                  measurementUnit={measurementUnit}
                />
              );
            })}
          </div>

          <div
            className="rounded-3xl shadow-2xl flex flex-col"
            style={{
              backgroundColor: "#E8D8B4",
              padding: panelPadding,
              gap: gap,
              maxWidth: panelMaxWidth,
              maxHeight: "92dvh",
            }}
          >
            <div className="flex items-center" style={{ gap: 8 }}>
              <ReadAloudButton text={instructionText} />
              <p
                className="font-display text-gray-800 text-center flex-1"
                style={{ fontSize: textSize, lineHeight: 1.3 }}
              >
                {instructionText}
              </p>
            </div>

            <div
              className="flex items-center justify-center self-center"
              style={{ gap, marginTop: titleToContentGap }}
            >
              <div className="flex flex-col items-center" style={{ gap: 8 }}>
                <DroppableBasket basketImageSrc={basketImageSrc} size={basketSize} />
                <div
                  className={`rounded-xl border-2 flex items-center justify-center font-bold transition-colors duration-300 ${
                    isExceeded
                      ? "bg-red-100 border-red-500 text-red-600"
                      : isWon
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-white border-gray-300 text-gray-800"
                  }`}
                  style={{
                    minWidth: basketSize * 0.7,
                    padding: "6px 16px",
                    fontSize: weightTextSize,
                  }}
                >
                  {formatWeight(currentWeightGrams, measurementUnit)}
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: gap * 0.6 }}>
                {game.items.map((item) => {
                  const used = dropCounts[item.id] ?? 0;
                  const exhausted =
                    item.maxUses !== undefined && used >= item.maxUses;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center"
                      style={{ gap: 8 }}
                    >
                      <div
                        className={`relative rounded-lg overflow-hidden shadow-sm shrink-0 transition-opacity ${
                          exhausted ? "opacity-40" : ""
                        }`}
                        style={{
                          width: itemSize * 0.55,
                          height: itemSize * 0.55,
                        }}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                      <span
                        className={`font-bold whitespace-nowrap ${
                          exhausted ? "text-gray-400" : "text-gray-800"
                        }`}
                        style={{ fontSize: textSize }}
                      >
                        x{" "}
                        {used}
                      </span>
                    </div>
                  );
                })}

                <button
                  onClick={resetBasket}
                  className={`mt-2 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 hover:brightness-110 relative ${
                    isExceeded ? "z-30" : ""
                  }`}
                  style={{
                    backgroundColor: "#F59E0B",
                    padding: "8px 16px",
                    fontSize: textSize,
                    minHeight: 44,
                    minWidth: 120,
                  }}
                  aria-label={game.resetButtonLabel ?? "Vider le panier"}
                >
                  {game.resetButtonLabel ?? "Vider le panier"}
                </button>
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeItem && (
              <div
                className="rounded-xl overflow-hidden border-4 border-yellow-400 shadow-xl opacity-90"
                style={{ width: itemSize, height: itemSize }}
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  width={itemSize}
                  height={itemSize}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
}
