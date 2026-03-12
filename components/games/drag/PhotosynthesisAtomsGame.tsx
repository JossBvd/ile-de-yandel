"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Step } from "@/types/step";
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

type AtomId =
  | "atom-1"
  | "atom-2"
  | "atom-3"
  | "atom-4"
  | "atom-5"
  | "atom-6";

const M2S3_INSPECT_HINT_READ_ALOUD: Record<string, string> = {
  "/missions/mission-2/step-3/M2_S3_popup-indice-01.webp":
    "Cette plante a besoin d'eau",
  "/missions/mission-2/step-3/M2_S3_popup-indice-02.webp":
    "Cette plante utilise du dioxyde de carbone",
  "/missions/mission-2/step-3/M2_S3_popup-indice-03.webp":
    "La croissance se fait grâce aux photons lumineux",
};

interface PhotosynthesisAtomsGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  questionContainerVisible?: boolean;
}

interface AtomImageConfig {
  id: AtomId;
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
  questionContainerVisible = true,
  onComplete,
}: PhotosynthesisAtomsGameProps) {
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
    height: windowHeight,
  } = useResponsive();

  const [mounted, setMounted] = useState(false);

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
    ? isSmallScreen
      ? "62vh"
      : isMediumScreen
        ? "60vh"
        : "58vh"
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
    ? isSmallScreen
      ? "18vh"
      : "16vh"
    : isDesktopSmall
      ? "88px"
      : "96px";

  const atomGridSize = isMobileOrTablet
    ? isSmallScreen
      ? Math.round(windowHeight * 0.11)
      : isMediumScreen
        ? Math.round(windowHeight * 0.10)
        : Math.round(windowHeight * 0.09)
    : isDesktopSmall
      ? 76
      : isDesktopMedium
        ? 84
        : 92;

  const fusionSlotSize = isMobileOrTablet
    ? isSmallScreen
      ? Math.round(windowHeight * 0.13)
      : isMediumScreen
        ? Math.round(windowHeight * 0.12)
        : Math.round(windowHeight * 0.11)
    : isDesktopSmall
      ? 84
      : isDesktopMedium
        ? 92
        : 100;

  const panelGap = isMobileOrTablet ? "4vw" : "48px";
  const atomGridGap = isMobileOrTablet ? "2vh" : "1rem";
  const fusionSlotGap = isMobileOrTablet ? "2vw" : "1rem";
  const rightPanelGap = isMobileOrTablet ? "4vh" : "2.5rem";

  const atomImages: AtomImageConfig[] = [
    {
      id: "atom-1",
      src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-01.webp",
      alt: "Atome gris",
    },
    {
      id: "atom-2",
      src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-02.webp",
      alt: "Atome noir",
    },
    {
      id: "atom-3",
      src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-03.webp",
      alt: "Atome bleu",
    },
    {
      id: "atom-4",
      src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-04.webp",
      alt: "Atome jaune",
    },
    {
      id: "atom-5",
      src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-05.webp",
      alt: "Atome rouge",
    },
    {
      id: "atom-6",
      src: "/missions/mission-2/step-3/M2_S3_beadsmolecule-06.webp",
      alt: "Atome violet",
    },
  ];

  const [fusionSlots, setFusionSlots] = useState<(AtomId | null)[]>([
    null,
    null,
    null,
  ]);
  const [completed, setCompleted] = useState({
    water: false,
    co2: false,
    light: false,
  });
  const [activeAtomId, setActiveAtomId] = useState<AtomId | null>(null);
  const [inspectHintImage, setInspectHintImage] = useState<string | null>(null);

  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const recipes: Record<
    "water" | "co2" | "light",
    Partial<Record<AtomId, number>>
  > = {
    water: {
      "atom-3": 2,
      "atom-2": 1,
    },
    co2: {
      "atom-1": 1,
      "atom-2": 2,
    },
    light: {
      "atom-5": 2,
      "atom-6": 1,
    },
  };

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveAtomId(event.active.id as AtomId);
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

    const atomId = active.id as AtomId;

    setFusionSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = atomId;
      return next;
    });
  };

  const isRecipeMatch = (
    selection: AtomId[],
    recipe: Partial<Record<AtomId, number>>,
  ) => {
    if (selection.length !== 3) {
      return false;
    }

    const counts: Partial<Record<AtomId, number>> = {};
    selection.forEach((id) => {
      counts[id] = (counts[id] ?? 0) + 1;
    });

    const recipeKeys = Object.keys(recipe) as AtomId[];
    const countKeys = Object.keys(counts) as AtomId[];

    if (recipeKeys.length !== countKeys.length) {
      return false;
    }

    return recipeKeys.every(
      (id) => counts[id] === recipe[id] && counts[id] !== undefined,
    );
  };

  const handleFusion = () => {
    const selection = fusionSlots.filter(
      (id): id is AtomId => id !== null,
    );
    if (selection.length !== 3) {
      return;
    }

    const nextCompleted = { ...completed };
    let matched = false;

    if (!nextCompleted.water && isRecipeMatch(selection, recipes.water)) {
      nextCompleted.water = true;
      matched = true;
    } else if (!nextCompleted.co2 && isRecipeMatch(selection, recipes.co2)) {
      nextCompleted.co2 = true;
      matched = true;
    } else if (!nextCompleted.light && isRecipeMatch(selection, recipes.light)) {
      nextCompleted.light = true;
      matched = true;
    }

    setFusionSlots([null, null, null]);

    if (!matched) {
      return;
    }

    setCompleted(nextCompleted);

    if (nextCompleted.water && nextCompleted.co2 && nextCompleted.light) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const getAtomById = (id: AtomId | null): AtomImageConfig | null =>
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
                    {[0, 1].map((rowIndex) => (
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
                {[
                  { label: "Eau (H₂O)", speech: "Eau, H 2 O" },
                  { label: "Dioxyde de carbone (CO₂)", speech: "Dioxyde de carbone, C O 2" },
                  { label: "Lumière (photons)", speech: "Lumière, photons" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center"
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
                            ? (isSmallScreen ? "1.1rem" : "1.2rem")
                            : (isDesktopSmall ? "1.5rem" : "1.85rem"),
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
                  Fusionne les bons atomes pour obtenir les éléments nécessaires
                  à la PHOTOSYNTHÈSE
                </p>
                <ReadAloudButton
                  text="Fusionne les bons atomes pour obtenir les éléments nécessaires à la photosynthèse."
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
                    {[0, 1].map((rowIndex) => (
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
                {[
                  {
                    key: "water" as const,
                    label: "Eau (H₂O)",
                    speech: "Eau, H 2 O"
                  },
                  {
                    key: "co2" as const,
                    label: "Dioxyde de carbone (CO₂)",
                    speech: "Dioxyde de carbone, C O 2"
                  },
                  {
                    key: "light" as const,
                    label: "Lumière (photons)",
                    speech: "Lumière, photons"
                  },
                ].map((item) => (
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
                            ? (isSmallScreen ? "1.1rem" : "1.2rem")
                            : (isDesktopSmall ? "1.5rem" : "1.85rem"),
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
              {[
                { top: "25%", left: "78%" },
                { top: "63%", left: "17%" },
                { top: "68%", left: "80%" },
              ].map((pos, index) => (
                <button
                  key={index}
                  type="button"
                  className="absolute flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 pointer-events-auto"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: isMobileOrTablet ? 40 : 48,
                    height: isMobileOrTablet ? 40 : 48,
                  }}
                  aria-label="Voir un indice dans la jungle"
                  onClick={() =>
                    setInspectHintImage(
                      index === 0
                        ? "/missions/mission-2/step-3/M2_S3_popup-indice-01.webp"
                        : index === 1
                          ? "/missions/mission-2/step-3/M2_S3_popup-indice-02.webp"
                          : "/missions/mission-2/step-3/M2_S3_popup-indice-03.webp",
                    )
                  }
                >
                  <Image
                    src="/missions/mission-2/step-3/M2_S3_target-icon.webp"
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
                  M2S3_INSPECT_HINT_READ_ALOUD[inspectHintImage] ?? "Indice"
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

