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

const emptySubscribe = () => () => {};

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
}

function DraggableAtom({ atom, size }: DraggableAtomProps) {
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
}

function DroppableFusionSlot({
  index,
  atom,
  isActive,
  size,
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
      style={{ width: size, height: size }}
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
    height: windowHeight,
  } = useResponsive();
  const isVeryShortViewport = isMobileOrTablet && windowHeight < 440;

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const paddingEdge = isMobileOrTablet
    ? isSmallScreen
      ? "2vh 4vw"
      : isMediumScreen
        ? "2.5vh 4vw"
        : "3vh 5vw"
    : isDesktopSmall
      ? "16px"
      : isDesktopMedium
        ? "20px"
        : "24px";

  const questionFontSize = isMobileOrTablet
    ? isSmallScreen
      ? "4.5vh"
      : "4vh"
    : isDesktopSmall
      ? "1.125rem"
      : isDesktopMedium
        ? "1.25rem"
        : "1.375rem";

  const boardWidth = isMobileOrTablet
    ? isSmallScreen
      ? "34vw"
      : isMediumScreen
        ? "32vw"
        : "30vw"
    : isDesktopSmall
      ? "360px"
      : isDesktopMedium
        ? "400px"
        : "440px";

  const boardHeight = isMobileOrTablet
    ? isVeryShortViewport
      ? "50vh"
      : isSmallScreen
        ? "56vh"
        : isMediumScreen
          ? "54vh"
          : "52vh"
    : isDesktopSmall
      ? "340px"
      : isDesktopMedium
        ? "360px"
        : "380px";

  const rightPanelWidth = isMobileOrTablet
    ? isSmallScreen
      ? "34vw"
      : isMediumScreen
        ? "32vw"
        : "30vw"
    : isDesktopSmall
      ? "480px"
      : isDesktopMedium
        ? "520px"
        : "560px";

  const questionBarHeight = isMobileOrTablet
    ? isVeryShortViewport
      ? "12vh"
      : isSmallScreen
        ? "14vh"
        : "13vh"
    : isDesktopSmall
      ? "88px"
      : "96px";

  const atomGridSize = isMobileOrTablet
    ? isVeryShortViewport
      ? Math.round(windowHeight * 0.09)
      : isSmallScreen
        ? Math.round(windowHeight * 0.1)
        : isMediumScreen
          ? Math.round(windowHeight * 0.095)
          : Math.round(windowHeight * 0.088)
    : isDesktopSmall
      ? 76
      : isDesktopMedium
        ? 84
        : 92;

  const fusionSlotSize = isMobileOrTablet
    ? isVeryShortViewport
      ? Math.round(windowHeight * 0.1)
      : isSmallScreen
        ? Math.round(windowHeight * 0.115)
        : isMediumScreen
          ? Math.round(windowHeight * 0.11)
          : Math.round(windowHeight * 0.105)
    : isDesktopSmall
      ? 84
      : isDesktopMedium
        ? 92
        : 100;

  const panelGap = isMobileOrTablet ? (isVeryShortViewport ? "2vw" : "3vw") : "48px";
  const atomGridGap = isMobileOrTablet ? (isVeryShortViewport ? "1.2vh" : "1.6vh") : "1rem";
  const fusionSlotGap = isMobileOrTablet ? (isVeryShortViewport ? "1.2vw" : "2vw") : "1rem";
  const rightPanelGap = isMobileOrTablet ? (isVeryShortViewport ? "2.4vh" : "3.2vh") : "2.5rem";

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

  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveAtomId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveAtomId(null);

    if (!over) {
      return;
    }

    const overId = over.id as string;
    if (!overId.startsWith("fusion-slot-")) {
      return;
    }

    const slotIndex = parseInt(overId.replace("fusion-slot-", ""), 10);
    if (Number.isNaN(slotIndex) || slotIndex < 0 || slotIndex > 2) {
      return;
    }

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
    if (selection.length !== 3) {
      return false;
    }

    const counts: Record<string, number> = {};
    selection.forEach((id) => {
      counts[id] = (counts[id] ?? 0) + 1;
    });

    const recipeKeys = Object.keys(recipe);
    const countKeys = Object.keys(counts);

    if (recipeKeys.length !== countKeys.length) {
      return false;
    }

    return recipeKeys.every(
      (id) => counts[id] === recipe[id] && counts[id] !== undefined,
    );
  };

  const handleFusion = () => {
    const selection = fusionSlots.filter((id): id is string => id !== null);
    if (selection.length !== 3) {
      return;
    }

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

    if (!matched) {
      return;
    }

    setCompleted(nextCompleted);

    const allDone = game.recipes.every((r) => nextCompleted[r.key]);
    if (allDone) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const getAtomById = (id: string | null): AtomImageConfig | null =>
    id ? atomImages.find((atom) => atom.id === id) ?? null : null;

  const activeAtom =
    activeAtomId !== null
      ? atomImages.find((atom) => atom.id === activeAtomId) ?? null
      : null;

  const inspectMode = !questionContainerVisible;

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 flex flex-col overflow-hidden pointer-events-none"
        style={{ padding: paddingEdge }}
      >
        <div className="flex-1 min-h-0 flex flex-col justify-center pointer-events-auto">
          <div className="flex w-full items-center justify-center"
            style={{ gap: panelGap }}
          >
            <div
              className="relative rounded-3xl shadow-xl border-2 border-amber-900/40 overflow-hidden"
              style={{
                width: boardWidth,
                minHeight: boardHeight,
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative min-h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="flex flex-col px-6"
                    style={{ gap: atomGridGap }}
                  >
                    {Array.from({ length: atomRowCount }, (_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex justify-center"
                        style={{ gap: atomGridGap }}
                      >
                        {atomImages
                          .slice(rowIndex * 3, rowIndex * 3 + 3)
                          .map((atom) => (
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
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-none flex flex-col items-center justify-center"
                  style={{
                    gap: atomGridGap,
                    paddingBottom: isMobileOrTablet
                      ? isSmallScreen
                        ? "2vh"
                        : "3vh"
                      : isDesktopSmall
                        ? "32px"
                        : isDesktopMedium
                          ? "40px"
                          : "48px",
                  }}
                >
                  <div className="flex"
                    style={{ gap: fusionSlotGap }}
                  >
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className="rounded-md border-2 border-amber-900/60 bg-black/35 shadow-inner"
                        style={{ width: fusionSlotSize, height: fusionSlotSize }}
                      />
                    ))}
                  </div>
                  <div className="px-6 py-2 rounded-full bg-orange-500/70 text-white font-bold opacity-70 text-sm md:text-base lg:text-lg flex items-center justify-center"
                    style={{ 
                      marginTop: isMobileOrTablet ? "1vh" : "16px",
                      marginBottom: isMobileOrTablet ? "1vh" : "16px",
                      minWidth: isMobileOrTablet ? "120px" : "140px"
                    }}
                  >
                    Fusionner&nbsp;!
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative rounded-3xl shadow-xl border-2 border-amber-900/40 overflow-hidden flex flex-col justify-center"
              style={{
                width: rightPanelWidth,
                minHeight: boardHeight,
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="flex flex-col pl-6 pr-10 md:pl-8 md:pr-12"
                style={{
                  gap: rightPanelGap,
                }}
              >
                {game.recipes.map((item) => (
                  <div key={item.key} className="flex items-center"
                    style={{
                      gap: isMobileOrTablet ? "2vw" : "1rem",
                    }}
                  >
                    <div
                      className="shrink-0 border-2 border-black/70 bg-white/90 rounded-sm shadow-sm flex items-center justify-center overflow-hidden"
                      style={{
                        width: isMobileOrTablet
                          ? isSmallScreen
                            ? 40
                            : 48
                          : isDesktopSmall
                            ? 64
                            : 80,
                        height: isMobileOrTablet
                          ? isSmallScreen
                            ? 40
                            : 48
                          : isDesktopSmall
                            ? 64
                            : 80,
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <p
                        className="text-gray-900 font-display font-bold"
                        style={{ 
                          fontSize: isMobileOrTablet 
                            ? (isSmallScreen ? "1rem" : "1.125rem")
                            : (isDesktopSmall ? "1.375rem" : "1.75rem"),
                          paddingRight: isMobileOrTablet ? "1vw" : "0.5rem"
                        }}
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
        </div>

        {questionContainerVisible && (
          <div
            className="w-full shrink-0 mt-3 md:mt-4 flex items-center justify-center"
            style={{ minHeight: questionBarHeight }}
          >
            <div
              className="w-[92%] max-w-3xl rounded-2xl shadow-xl border-2 border-amber-900/40 flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 md:py-3"
              style={{
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <p
                  className="text-center text-gray-900 font-bold"
                  style={{
                    fontSize: questionFontSize,
                    lineHeight: 1.4,
                  }}
                >
                  {game.bar.fusion}
                </p>
                <ReadAloudButton
                  text={game.bar.fusionSpeech}
                  ariaLabel="Lire la consigne"
                />
              </div>
            </div>
          </div>
        )}
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
        className="absolute inset-0 flex flex-col overflow-hidden pointer-events-none"
        style={{ padding: paddingEdge }}
      >
        <div className="flex-1 min-h-0 flex flex-col justify-center pointer-events-auto">
          {!inspectMode && (
            <div className="flex w-full items-center justify-center"
              style={{ gap: panelGap }}
            >
              {/* Panneau atomes (gauche de la partie droite) */}
            <div
              className="relative rounded-3xl shadow-xl border-2 border-amber-900/40 overflow-hidden"
              style={{
                width: boardWidth,
                minHeight: boardHeight,
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative min-h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="flex flex-col px-6"
                    style={{ gap: atomGridGap }}
                  >
                    {Array.from({ length: atomRowCount }, (_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex justify-center"
                        style={{ gap: atomGridGap }}
                      >
                        {atomImages
                          .slice(rowIndex * 3, rowIndex * 3 + 3)
                          .map((atom) => (
                            <DraggableAtom
                              key={atom.id}
                              atom={atom}
                              size={atomGridSize}
                            />
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-none flex flex-col items-center justify-center"
                  style={{
                    gap: atomGridGap,
                    paddingBottom: isMobileOrTablet
                      ? isSmallScreen
                        ? "2vh"
                        : "3vh"
                      : isDesktopSmall
                        ? "32px"
                        : isDesktopMedium
                          ? "40px"
                          : "48px",
                  }}
                >
                  <div className="flex"
                    style={{ gap: fusionSlotGap }}
                  >
                      {fusionSlots.map((slotAtomId, index) => (
                        <DroppableFusionSlot
                          key={index}
                          index={index}
                          atom={getAtomById(slotAtomId)}
                          isActive={slotAtomId !== null}
                          size={fusionSlotSize}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleFusion}
                      className="px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg text-sm md:text-base lg:text-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all active:scale-95"
                      style={{
                        minWidth: isMobileOrTablet ? "120px" : "140px",
                        marginTop: isMobileOrTablet ? "1vh" : "16px",
                        marginBottom: isMobileOrTablet ? "1vh" : "16px",
                      }}
                      aria-label="Fusionner les atomes sélectionnés"
                    >
                      Fusionner&nbsp;!
                    </button>
                  </div>
                </div>
              </div>

              {/* Panneau éléments chimiques (droite) */}
            <div
              className="relative rounded-3xl shadow-xl border-2 border-amber-900/40 overflow-hidden flex flex-col justify-center"
              style={{
                width: rightPanelWidth,
                minHeight: boardHeight,
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="flex flex-col pl-6 pr-10 md:pl-8 md:pr-12"
                style={{
                  gap: rightPanelGap,
                }}
              >
                {game.recipes.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center"
                    style={{
                      gap: isMobileOrTablet ? "2vw" : "1rem",
                    }}
                  >
                    <div
                      className="shrink-0 border-2 border-black/70 bg-white/90 rounded-sm shadow-sm flex items-center justify-center overflow-hidden"
                      style={{
                        width: isMobileOrTablet
                          ? isSmallScreen
                            ? 40
                            : 48
                          : isDesktopSmall
                            ? 64
                            : 80,
                        height: isMobileOrTablet
                          ? isSmallScreen
                            ? 40
                            : 48
                          : isDesktopSmall
                            ? 64
                            : 80,
                      }}
                    >
                        {completed[item.key] && (
                          <Image
                            src="/ui/icon_right.webp"
                            alt="Élément obtenu"
                            width={56}
                            height={56}
                            className="w-[85%] h-[85%] object-contain pointer-events-none"
                            draggable={false}
                          />
                        )}
                      </div>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-gray-900 font-display font-bold"
                        style={{ 
                          fontSize: isMobileOrTablet 
                            ? (isSmallScreen ? "1rem" : "1.125rem")
                            : (isDesktopSmall ? "1.375rem" : "1.75rem"),
                          paddingRight: isMobileOrTablet ? "1vw" : "0.5rem"
                        }}
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
          )}

          {inspectMode && (
            <div className="absolute inset-0 pointer-events-none">
              {game.inspectTargets.map((target, index) => (
                <button
                  key={`${target.image}-${index}`}
                  type="button"
                  className="absolute flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 pointer-events-auto"
                  style={{
                    top: target.top,
                    left: target.left,
                    width: isMobileOrTablet ? 40 : 48,
                    height: isMobileOrTablet ? 40 : 48,
                  }}
                  aria-label="Voir un indice dans la jungle"
                  onClick={() => setInspectHintImage(target.image)}
                >
                  <Image
                    src={game.ui.targetIconSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bandeau question en bas — toujours visible, texte selon mode */}
        <div
          className="w-full shrink-0 mt-3 md:mt-4 flex items-center justify-center pointer-events-auto"
          style={{ minHeight: questionBarHeight }}
        >
          <div
            className="w-[92%] max-w-3xl rounded-2xl shadow-xl border-2 border-amber-900/40 flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 md:py-3"
            style={{
              backgroundImage: "url(/backgrounds/paper_texture.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <p
                className="text-center text-gray-900 font-bold"
                style={{
                  fontSize: questionFontSize,
                  lineHeight: 1.4,
                }}
              >
                {inspectMode
                  ? "Explore la zone à la recherche d'indices"
                  : "Fusionne les bons atomes pour obtenir les éléments nécessaires à la PHOTOSYNTHÈSE"}
              </p>
              <ReadAloudButton
                text={
                  inspectMode
                    ? "Explore la zone à la recherche d'indices."
                    : "Fusionne les bons atomes pour obtenir les éléments nécessaires à la photosynthèse."
                }
                ariaLabel={
                  inspectMode
                    ? "Lire : Explore la zone à la recherche d'indices"
                    : "Lire la consigne"
                }
              />
            </div>
          </div>
        </div>
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
              width={atomGridSize}
              height={atomGridSize}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

