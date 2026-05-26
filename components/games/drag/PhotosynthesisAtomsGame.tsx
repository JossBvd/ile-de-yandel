"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Step, PhotosynthesisAtomsGameData } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { useDndSensors } from "@/hooks/useDndSensors";
import { useDndCollisionDetection } from "@/hooks/useDndCollisionDetection";
import { computePhotosynthesisLayout } from "@/components/games/drag/photosynthesisLayout";
import { useReadingAidStore } from "@/store/readingAidStore";
import { useAudioDescription } from "@/hooks/useAudioDescription";

const emptySubscribe = () => () => {};

const PANEL_STYLE = {
  backgroundImage: "url(/backgrounds/paper_texture.webp)",
  backgroundSize: "cover",
  backgroundPosition: "center",
} as const;

interface PhotosynthesisAtomsGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  questionContainerVisible?: boolean;
}

interface AtomImageConfig {
  id: string;
  src: string;
  alt: string;
}

interface DraggableAtomProps {
  atom: AtomImageConfig;
  size: number;
  minTouchPx: number;
}

function DraggableAtom({ atom, size, minTouchPx }: DraggableAtomProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: atom.id,
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none shrink-0 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        isDragging ? "opacity-60" : ""
      }`}
      style={{
        width: size,
        height: size,
        minWidth: minTouchPx,
        minHeight: minTouchPx,
      }}
      aria-label={atom.alt}
    >
      <Image
        src={atom.src}
        alt={atom.alt}
        width={size}
        height={size}
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </button>
  );
}

interface DroppableFusionSlotProps {
  index: number;
  atom: AtomImageConfig | null;
  isActive: boolean;
  size: number;
  minTouchPx: number;
}

function DroppableFusionSlot({
  index,
  atom,
  isActive,
  size,
  minTouchPx,
}: DroppableFusionSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `fusion-slot-${index}`,
  });

  const borderColor = isOver
    ? "border-yellow-400"
    : isActive
      ? "border-emerald-500"
      : "border-amber-900/60";

  const backgroundColor = isActive ? "bg-white/90" : "bg-black/35";

  return (
    <div
      ref={setNodeRef}
      className={`rounded-md border-2 ${borderColor} ${backgroundColor} shadow-inner flex items-center justify-center touch-none shrink-0`}
      style={{
        width: size,
        height: size,
        minWidth: minTouchPx,
        minHeight: minTouchPx,
      }}
    >
      {atom && (
        <Image
          src={atom.src}
          alt={atom.alt}
          width={size}
          height={size}
          className="w-[80%] h-[80%] object-contain pointer-events-none"
          draggable={false}
        />
      )}
    </div>
  );
}

interface PhotosynthesisPanelsProps {
  game: PhotosynthesisAtomsGameData;
  atomImages: AtomImageConfig[];
  atomRowCount: number;
  layout: ReturnType<typeof computePhotosynthesisLayout>;
  isMobileOrTablet: boolean;
  fusionSlots: (string | null)[];
  completed: Record<string, boolean>;
  onFusion: () => void;
  getAtomById: (id: string | null) => AtomImageConfig | null;
  interactive: boolean;
}

function PhotosynthesisPanels({
  game,
  atomImages,
  atomRowCount,
  layout,
  isMobileOrTablet,
  fusionSlots,
  completed,
  onFusion,
  getAtomById,
  interactive,
}: PhotosynthesisPanelsProps) {
  const {
    panelHeightPx,
    playAreaMaxHeight,
    leftPanelWidthPx,
    rightPanelWidthPx,
    panelGapPx,
    atomGridSize,
    fusionSlotSize,
    minTouchPx,
    atomGridGapPx,
    fusionSlotGapPx,
    fusionZoneGapPx,
    rightPanelGapPx,
    instructionFontSize,
    recipeFontSize,
    recipeCheckSizePx,
  } = layout;

  return (
    <div
      className="flex w-full max-w-full items-stretch justify-center min-h-0 mx-auto shrink-0"
      style={{ gap: panelGapPx, maxHeight: playAreaMaxHeight }}
    >
      <div
        className="relative rounded-3xl shadow-xl border-2 border-amber-900/40 overflow-hidden flex flex-col min-h-0 shrink-0"
        style={{
          width: leftPanelWidthPx,
          height: panelHeightPx,
          maxHeight: playAreaMaxHeight,
          ...PANEL_STYLE,
        }}
      >
        <div className="relative flex flex-col flex-1 min-h-0 py-3">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div
              className="flex flex-col px-3 sm:px-5"
              style={{ gap: atomGridGapPx }}
            >
              {Array.from({ length: atomRowCount }, (_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-center"
                  style={{ gap: atomGridGapPx }}
                >
                  {atomImages
                    .slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((atom) =>
                      interactive ? (
                        <DraggableAtom
                          key={atom.id}
                          atom={atom}
                          size={atomGridSize}
                          minTouchPx={minTouchPx}
                        />
                      ) : (
                        <div
                          key={atom.id}
                          className="shrink-0 flex items-center justify-center"
                          style={{
                            width: atomGridSize,
                            height: atomGridSize,
                          }}
                        >
                          <Image
                            src={atom.src}
                            alt={atom.alt}
                            width={atomGridSize}
                            height={atomGridSize}
                            className="w-full h-full object-contain pointer-events-none"
                            draggable={false}
                          />
                        </div>
                      ),
                    )}
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex-none flex flex-col items-center justify-center"
            style={{
              gap: atomGridGapPx,
              marginTop: fusionZoneGapPx,
              paddingBottom: isMobileOrTablet ? 8 : 12,
            }}
          >
            <div className="flex" style={{ gap: fusionSlotGapPx }}>
              {fusionSlots.map((slotAtomId, index) =>
                interactive ? (
                  <DroppableFusionSlot
                    key={index}
                    index={index}
                    atom={getAtomById(slotAtomId)}
                    isActive={slotAtomId !== null}
                    size={fusionSlotSize}
                    minTouchPx={minTouchPx}
                  />
                ) : (
                  <div
                    key={index}
                    className="rounded-md border-2 border-amber-900/60 bg-black/35 shadow-inner shrink-0"
                    style={{
                      width: fusionSlotSize,
                      height: fusionSlotSize,
                    }}
                  />
                ),
              )}
            </div>
            {interactive ? (
              <button
                type="button"
                onClick={onFusion}
                className="px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg text-sm md:text-base lg:text-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all active:scale-95"
                style={{ minWidth: isMobileOrTablet ? "120px" : "140px" }}
                aria-label="Fusionner les atomes sélectionnés"
              >
                Fusionner&nbsp;!
              </button>
            ) : (
              <div className="px-6 py-2 rounded-full bg-orange-500/70 text-white font-bold opacity-70 text-sm md:text-base lg:text-lg flex items-center justify-center"
                style={{ minWidth: isMobileOrTablet ? "120px" : "140px" }}
              >
                Fusionner&nbsp;!
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="relative rounded-3xl shadow-xl border-2 border-amber-900/40 overflow-hidden flex flex-col min-h-0 shrink-0"
        style={{
          width: rightPanelWidthPx,
          height: panelHeightPx,
          maxHeight: playAreaMaxHeight,
          ...PANEL_STYLE,
        }}
      >
        <div
          className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide px-4 sm:px-6 md:px-8 py-4"
          style={{ gap: rightPanelGapPx }}
        >
          <div className="shrink-0 flex items-start gap-2 border-b-2 border-amber-900/25 pb-3">
            <p
              className="flex-1 text-gray-900 font-bold leading-snug"
              style={{ fontSize: instructionFontSize }}
            >
              {game.bar.fusion}
            </p>
            <ReadAloudButton
              text={game.bar.fusionSpeech}
              ariaLabel="Lire la consigne"
            />
          </div>

          {game.recipes.map((item) => (
            <div
              key={item.key}
              className="flex items-center shrink-0"
              style={{ gap: isMobileOrTablet ? 10 : 14 }}
            >
              <div
                className="shrink-0 border-2 border-black/70 bg-white/90 rounded-sm shadow-sm flex items-center justify-center overflow-hidden"
                style={{
                  width: recipeCheckSizePx,
                  height: recipeCheckSizePx,
                }}
              >
                {completed[item.key] && (
                  <Image
                    src="/ui/icon_right.webp"
                    alt="Élément obtenu"
                    width={recipeCheckSizePx}
                    height={recipeCheckSizePx}
                    className="w-[85%] h-[85%] object-contain pointer-events-none"
                    draggable={false}
                  />
                )}
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <p
                  className="text-gray-900 font-display font-bold"
                  style={{ fontSize: recipeFontSize }}
                >
                  {item.label}
                </p>
                <ReadAloudButton
                  text={item.speech}
                  ariaLabel={`Lire : ${item.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhotosynthesisAtomsGame({
  step,
  questionContainerVisible = true,
  onComplete,
}: PhotosynthesisAtomsGameProps) {
  const game = step.game as PhotosynthesisAtomsGameData;
  const atomImages: AtomImageConfig[] = game.atoms;
  const atomRowCount = Math.ceil(atomImages.length / 3) || 1;

  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
    width: windowWidth,
    height: windowHeight,
  } = useResponsive();

  const { readingAidEnabled } = useReadingAidStore();
  const { enabled: audioDescriptionEnabled } = useAudioDescription();
  const preferLargeTouchTargets =
    readingAidEnabled || audioDescriptionEnabled;

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const layout = computePhotosynthesisLayout({
    viewportWidth: windowWidth,
    viewportHeight: windowHeight,
    atomRowCount,
    isMobileOrTablet,
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    preferLargeTouchTargets,
  });

  const [fusionSlots, setFusionSlots] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(game.recipes.map((r) => [r.key, false])),
  );
  const [activeAtomId, setActiveAtomId] = useState<string | null>(null);
  const [inspectHintImage, setInspectHintImage] = useState<string | null>(null);

  const sensors = useDndSensors(preferLargeTouchTargets ? 12 : 8);
  const collisionDetection = useDndCollisionDetection();

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveAtomId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveAtomId(null);

    if (!over) return;

    const overId = over.id as string;
    if (!overId.startsWith("fusion-slot-")) return;

    const slotIndex = parseInt(overId.replace("fusion-slot-", ""), 10);
    if (Number.isNaN(slotIndex) || slotIndex < 0 || slotIndex > 2) return;

    const atomId = String(active.id);
    setFusionSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = atomId;
      return next;
    });
  };

  const isRecipeMatch = (
    selection: string[],
    recipe: Record<string, number>,
  ) => {
    if (selection.length !== 3) return false;

    const counts: Record<string, number> = {};
    selection.forEach((id) => {
      counts[id] = (counts[id] ?? 0) + 1;
    });

    const recipeKeys = Object.keys(recipe);
    const countKeys = Object.keys(counts);
    if (recipeKeys.length !== countKeys.length) return false;

    return recipeKeys.every(
      (id) => counts[id] === recipe[id] && counts[id] !== undefined,
    );
  };

  const handleFusion = () => {
    const selection = fusionSlots.filter((id): id is string => id !== null);
    if (selection.length !== 3) return;

    const nextCompleted = { ...completed };
    let matched = false;

    for (const recipe of game.recipes) {
      if (nextCompleted[recipe.key]) continue;
      if (isRecipeMatch(selection, recipe.atomCounts)) {
        nextCompleted[recipe.key] = true;
        matched = true;
        break;
      }
    }

    setFusionSlots([null, null, null]);
    if (!matched) return;

    setCompleted(nextCompleted);

    if (game.recipes.every((r) => nextCompleted[r.key])) {
      setTimeout(onComplete, 500);
    }
  };

  const getAtomById = (id: string | null): AtomImageConfig | null =>
    id ? atomImages.find((atom) => atom.id === id) ?? null : null;

  const activeAtom =
    activeAtomId !== null
      ? atomImages.find((atom) => atom.id === activeAtomId) ?? null
      : null;

  const inspectMode = !questionContainerVisible;

  const panelsProps: PhotosynthesisPanelsProps = {
    game,
    atomImages,
    atomRowCount,
    layout,
    isMobileOrTablet,
    fusionSlots,
    completed,
    onFusion: handleFusion,
    getAtomById,
    interactive: mounted,
  };

  const inspectInstruction = (
    <div className="pointer-events-auto absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
      <p
        className="text-center text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
        style={{
          fontSize: isMobileOrTablet
            ? "clamp(0.875rem, 3vh, 1rem)"
            : "1.125rem",
        }}
      >
        {game.bar.inspect}
      </p>
      <ReadAloudButton
        text={game.bar.inspectSpeech}
        ariaLabel="Lire : Explore la zone à la recherche d'indices"
      />
    </div>
  );

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
        style={{ padding: layout.paddingEdge }}
      >
        {!inspectMode && (
          <div className="pointer-events-auto w-full">
            <PhotosynthesisPanels {...panelsProps} interactive={false} />
          </div>
        )}
        {inspectMode && inspectInstruction}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
        style={{ padding: layout.paddingEdge }}
      >
        {!inspectMode && (
          <div className="pointer-events-auto w-full">
            <PhotosynthesisPanels {...panelsProps} interactive />
          </div>
        )}

        {inspectMode && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              {game.inspectTargets.map((target, index) => (
                <button
                  key={`${target.image}-${index}`}
                  type="button"
                  className="absolute flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 pointer-events-auto"
                  style={{
                    top: target.top,
                    left: target.left,
                    width: isMobileOrTablet ? 44 : 52,
                    height: isMobileOrTablet ? 44 : 52,
                  }}
                  aria-label="Voir un indice dans la jungle"
                  onClick={() => setInspectHintImage(target.image)}
                >
                  <Image
                    src={game.ui.targetIconSrc}
                    alt=""
                    width={52}
                    height={52}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
            {inspectInstruction}
          </>
        )}
      </div>

      {inspectHintImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Indice visuel"
          onClick={() => setInspectHintImage(null)}
        >
          <div className="relative w-full max-w-2xl max-h-[90dvh] flex items-center justify-center cursor-pointer">
            <Image
              src={inspectHintImage}
              alt="Indice dans la jungle"
              width={1000}
              height={700}
              className="w-full h-auto max-h-[90dvh] object-contain pointer-events-none"
              sizes="(max-width: 640px) 100vw, 42rem"
              draggable={false}
            />
            <div
              className="absolute top-4 right-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <ReadAloudButton
                text={
                  game.inspectTargets.find((t) => t.image === inspectHintImage)
                    ?.readAloudText ?? "Indice"
                }
                ariaLabel="Lire l'indice"
              />
            </div>
          </div>
        </div>
      )}

      <DragOverlay>
        {activeAtom ? (
          <div className="rounded-full shadow-lg overflow-hidden">
            <Image
              src={activeAtom.src}
              alt={activeAtom.alt}
              width={layout.atomGridSize}
              height={layout.atomGridSize}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
