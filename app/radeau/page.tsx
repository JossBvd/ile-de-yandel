"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { useResponsive } from "@/hooks/useResponsive";
import { IconButton } from "@/components/ui/IconButton";
import { useInventoryStore } from "@/store/inventoryStore";
import { getRaftPieceById, MAX_FUSED_RAFT_PIECES } from "@/data/raft";
import type { RaftPieceId } from "@/types/step";
import { useEffect } from "react";
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

const INVENTORY_SLOTS_COUNT = 15;
const RAFT_STAGE_IMAGES = [
  "/raft/radeau_base.png",
  "/raft/radeauM1.png",
  "/raft/radeauM2.png",
  "/raft/radeauM3.png",
  "/raft/radeauM4.png",
  "/raft/radeauM5.png",
] as const;
const MERGED_OBJECT_MODAL_IMAGES = [
  "/raft/popup_merged_object-01.webp",
  "/raft/popup_merged_object-02.webp",
  "/raft/popup_merged_object-03.webp",
  "/raft/popup_merged_object-04.webp",
  "/raft/popup_merged_object-05.webp",
] as const;

interface DraggableItemProps {
  id: string;
  piece: ReturnType<typeof getRaftPieceById> | null;
  isInMergeSlot: boolean;
  isFused: boolean;
  canDrag: boolean;
  isGuidedOut: boolean;
}

function DraggableItem({
  id,
  piece,
  isInMergeSlot,
  isFused,
  canDrag,
  isGuidedOut,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: !canDrag || isInMergeSlot,
  });

  if (isInMergeSlot) {
    return (
      <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center overflow-hidden opacity-0 pointer-events-none" />
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full h-full min-w-0 min-h-0 flex items-center justify-center overflow-hidden touch-none ${
        piece?.image && !isFused
          ? ""
          : "rounded border-2 border-white bg-[#93c5fd]/80"
      } ${
        !canDrag
          ? "opacity-50 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "opacity-50" : ""} ${isGuidedOut ? "grayscale" : ""}`}
      style={
        piece?.image && !isFused
          ? undefined
          : {
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
            }
      }
    >
      {isFused ? (
        <span
          className="font-semibold text-gray-700 wrap-break-word text-center leading-tight"
          style={{ fontSize: "clamp(0.5rem, 2.2cqh, 0.75rem)" }}
        >
          Fusion {id.replace("fused-", "")}
        </span>
      ) : piece?.image ? (
        <div className="relative w-full h-full pointer-events-none">
          <Image
            src={piece.image}
            alt={piece.name || "Pièce du radeau"}
            fill
            className="object-contain"
            draggable={false}
          />
        </div>
      ) : (
        <span
          className="font-semibold text-gray-700 wrap-break-word text-center leading-tight pointer-events-none"
          style={{ fontSize: "clamp(0.5rem, 2.2cqh, 0.75rem)" }}
        >
          {piece?.name?.replace(new RegExp("^Pièce \\d+ - "), "") ?? "?"}
        </span>
      )}
    </div>
  );
}

interface DroppableSlotProps {
  index: number;
  pieceId: RaftPieceId | null;
  onRemove: () => void;
}

function DroppableSlot({
  index,
  pieceId,
  onRemove,
}: Omit<DroppableSlotProps, "onDrop">) {
  const piece = pieceId ? getRaftPieceById(pieceId) : null;
  const hasPiece = Boolean(pieceId);
  const { setNodeRef, isOver } = useDroppable({
    id: `merge-slot-${index}`,
    disabled: hasPiece,
  });

  return (
    <div
      className="w-full min-w-0 min-h-0 flex items-center justify-center"
      style={{ aspectRatio: "1 / 1" }}
    >
      <button
        type="button"
        ref={setNodeRef}
        onClick={onRemove}
        className={`w-full h-full min-w-0 min-h-0 rounded border-[3px] bg-gray-900/80 flex items-center justify-center touch-none transition-colors ${
          isOver ? "bg-gray-700/80" : ""
        }`}
        style={{
          borderColor: "#d97706",
          minHeight: 0,
        }}
      >
        {hasPiece ? (
          piece?.image ? (
            <div className="relative w-full h-full">
              <Image
                src={piece.image}
                alt={piece.name || "Pièce du radeau"}
                fill
                className="object-contain"
                draggable={false}
              />
            </div>
          ) : (
            <span
              className="font-semibold text-white wrap-break-word text-center leading-tight"
              style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.75rem)" }}
            >
              {piece?.name?.replace(new RegExp("^Pièce \\d+ - "), "") ?? "?"}
            </span>
          )
        ) : null}
      </button>
    </div>
  );
}

interface RadeauContentProps {
  mergeSlots: (RaftPieceId | null)[];
  setMergeSlots: React.Dispatch<React.SetStateAction<(RaftPieceId | null)[]>>;
  activeId: string | null;
}

function RadeauContent({
  mergeSlots,
  setMergeSlots,
  activeId,
}: RadeauContentProps) {
  const router = useRouter();
  const { isRotated, width, height } = useOrientationContext();
  const {
    collectedPieces,
    fusedRaftPiecesCount,
    fusedPieces,
    consumePiecesForFusion,
    resetFusions,
    fusionHistory,
  } = useInventoryStore();
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isDesktopLarge,
    isMobileOrTablet,
  } = useResponsive();
  const [fusionFeedback, setFusionFeedback] = useState<string | null>(null);
  const [mergedObjectModalImage, setMergedObjectModalImage] = useState<
    string | null
  >(null);

  const inMergeSlots = new Set(
    mergeSlots.filter((id): id is RaftPieceId => id !== null),
  );
  const getMissionKey = (id: RaftPieceId) =>
    id.split("-").slice(0, 2).join("-");
  const firstMergePiece = mergeSlots.find(
    (slot): slot is RaftPieceId => slot !== null,
  );
  const lockedMissionKey = firstMergePiece
    ? getMissionKey(firstMergePiece)
    : null;

  const getMissionIndex = (id: RaftPieceId) => {
    const parts = id.split("-");
    const idx = Number.parseInt(parts[1], 10);
    return Number.isNaN(idx) ? null : idx;
  };

  const fusedMissionByIndex = new Map<
    number,
    {
      fusedId: string;
    }
  >();

  fusionHistory.forEach((triple, index) => {
    const missionIndex = getMissionIndex(triple[0]);
    if (missionIndex != null) {
      const fusedId = fusedPieces[index] ?? `fused-${index + 1}`;
      fusedMissionByIndex.set(missionIndex, { fusedId });
    }
  });

  type InventoryItem = {
    id: string;
    type: "mission" | "fused";
    isInMergeSlot?: boolean;
  } | null;

  const inventoryItems: InventoryItem[] = [];

  for (let missionIndex = 1; missionIndex <= 5; missionIndex += 1) {
    const fusedInfo = fusedMissionByIndex.get(missionIndex);

    if (fusedInfo) {
      inventoryItems.push({
        id: fusedInfo.fusedId,
        type: "fused",
      });
      inventoryItems.push(null);
      inventoryItems.push(null);
      continue;
    }

    for (let slotIndex = 1; slotIndex <= 3; slotIndex += 1) {
      const pieceId = `piece-${missionIndex}-${slotIndex}` as RaftPieceId;
      if (collectedPieces.includes(pieceId)) {
        inventoryItems.push({
          id: pieceId,
          type: "mission",
          isInMergeSlot: inMergeSlots.has(pieceId),
        });
      } else {
        inventoryItems.push(null);
      }
    }
  }
  const allMergeSlotsFilled =
    mergeSlots[0] !== null && mergeSlots[1] !== null && mergeSlots[2] !== null;

  const canFuse =
    allMergeSlotsFilled && fusedRaftPiecesCount < MAX_FUSED_RAFT_PIECES;

  const canCancelFusion =
    mergeSlots.some((slot) => slot !== null) || fusedRaftPiecesCount > 0;

  const raftVisualBaseWidth = isMobileOrTablet
    ? isSmallScreen
      ? 360
      : isMediumScreen
        ? 430
        : 500
    : isDesktopSmall
      ? 560
      : isDesktopMedium
        ? 620
        : 700;

  const raftVisualBaseHeight = isMobileOrTablet
    ? isSmallScreen
      ? 250
      : isMediumScreen
        ? 300
        : 340
    : isDesktopSmall
      ? 380
      : isDesktopMedium
        ? 420
        : 460;

  // Sur mobile/tablette on borne la hauteur du radeau à une part du viewport
  // pour éviter un débordement vers le haut tout en gardant un rendu visuellement grand.
  const raftVisualHeight = isMobileOrTablet
    ? Math.min(raftVisualBaseHeight, Math.floor(height * 0.44))
    : raftVisualBaseHeight;
  const raftVisualWidth =
    raftVisualBaseHeight > 0
      ? Math.round((raftVisualBaseWidth * raftVisualHeight) / raftVisualBaseHeight)
      : raftVisualBaseWidth;

  // handleDragStart et handleDragEnd sont maintenant dans RadeauWrapper

  const removeFromMergeSlot = (index: number) => {
    setMergeSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleFusionner = () => {
    if (!canFuse) return;
    const ids = mergeSlots as [RaftPieceId, RaftPieceId, RaftPieceId];

    const [first, second, third] = ids;
    const missionKey = getMissionKey(first);

    const sameMission =
      getMissionKey(second) === missionKey &&
      getMissionKey(third) === missionKey;

    if (!sameMission) {
      setFusionFeedback("Les 3 pièces doivent venir de la même mission.");
      setMergeSlots([null, null, null]);
      return;
    }

    const missionIndex = getMissionIndex(first);
    const expectedMissionIndex = fusedRaftPiecesCount + 1;
    if (missionIndex == null || missionIndex !== expectedMissionIndex) {
      setFusionFeedback("Ce n'est pas le moment de placer cette pièce");
      setMergeSlots([null, null, null]);
      return;
    }

    const ok = consumePiecesForFusion(ids);
    if (ok) {
      setFusionFeedback(null);
      setMergeSlots([null, null, null]);
      const modalImage = MERGED_OBJECT_MODAL_IMAGES[expectedMissionIndex - 1];
      if (modalImage) {
        setMergedObjectModalImage(modalImage);
      }
    }
  };

  const handleAnnuler = () => {
    if (!canCancelFusion) return;

    const confirmed = window.confirm(
      "Es-tu sûr de vouloir annuler toutes les fusions de pièces ?",
    );
    if (!confirmed) return;

    resetFusions();
    setFusionFeedback(null);
    setMergeSlots([null, null, null]);
  };

  return (
    <div
      id="main-content"
      role="main"
      className="relative flex w-full h-full overflow-hidden flex-nowrap"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
        minHeight: isRotated ? undefined : "100dvh",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative flex-1 min-w-0 flex flex-col z-10">
        {/* Titre */}
        <div
          className="absolute z-10 flex items-start gap-2"
          style={{
            top: isMobileOrTablet
              ? isSmallScreen
                ? 4
                : isMediumScreen
                  ? 8
                  : 12
              : 24,
            left: 0,
          }}
        >
          <div
            className="relative"
            style={{
              width: isMobileOrTablet
                ? isSmallScreen
                  ? 192
                  : isMediumScreen
                    ? 240
                    : 280
                : isDesktopSmall
                  ? 320
                  : isDesktopMedium
                    ? 360
                    : 400,
              height: isMobileOrTablet
                ? isSmallScreen
                  ? 64
                  : isMediumScreen
                    ? 80
                    : 96
                : isDesktopSmall
                  ? 112
                  : isDesktopMedium
                    ? 120
                    : 128,
            }}
          >
            <Image
              src="/ui/encart_map.webp"
              alt=""
              fill
              className="object-contain object-top-left"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1
                className="font-bold text-gray-800 drop-shadow-sm"
                style={{
                  fontSize: isMobileOrTablet
                    ? isSmallScreen
                      ? "0.875rem"
                      : isMediumScreen
                        ? "1rem"
                        : "1.125rem"
                    : isDesktopSmall
                      ? "1.25rem"
                      : isDesktopMedium
                        ? "1.375rem"
                        : "1.5rem",
                }}
              >
                Radeau
              </h1>
            </div>
          </div>
          <ReadAloudButton text="Radeau" ariaLabel="Lire le titre" />
        </div>

        {/* Progression */}
        <div
          className="absolute z-10 flex flex-col items-center"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            bottom: isMobileOrTablet
              ? isSmallScreen
                ? 24
                : isMediumScreen
                  ? 30
                  : 36
              : isDesktopSmall
                ? 40
                : isDesktopMedium
                  ? 48
                  : 56,
            gap: isMobileOrTablet
              ? isSmallScreen
                ? 4
                : isMediumScreen
                  ? 6
                  : 8
              : isDesktopSmall
                ? 8
                : 10,
            marginLeft: isMobileOrTablet
              ? isSmallScreen
                ? 20
                : isMediumScreen
                  ? 28
                  : 36
              : isDesktopSmall
                ? 40
                : isDesktopMedium
                  ? 52
                  : 64,
          }}
        >
          <div
            className="relative shrink-0"
            style={{
                width: raftVisualWidth,
                height: raftVisualHeight,
            }}
          >
            <Image
              src={
                RAFT_STAGE_IMAGES[
                  Math.min(fusedRaftPiecesCount, RAFT_STAGE_IMAGES.length - 1)
                ]
              }
              alt="Progression visuelle du radeau"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <span
              className="font-semibold text-gray-800"
              style={{
                fontSize: isMobileOrTablet
                  ? isSmallScreen
                    ? "0.875rem"
                    : "1rem"
                  : "1.125rem",
                lineHeight: 1,
              }}
              aria-live="polite"
            >
              {fusedRaftPiecesCount}/{MAX_FUSED_RAFT_PIECES}
            </span>
          </div>
          <div
            className="relative flex flex-col items-center"
            style={{
              width: "100%",
              gap: isSmallScreen ? 6 : isMediumScreen ? 8 : 10,
              maxWidth: isMobileOrTablet ? (isSmallScreen ? 184 : 212) : 236,
            }}
          >
            <div
              className="grid grid-cols-3 w-full"
              style={{
                gap: isMobileOrTablet
                  ? isSmallScreen
                    ? "4px"
                    : isMediumScreen
                      ? "6px"
                      : "8px"
                  : "10px",
              }}
            >
              {mergeSlots.map((pieceId, i) => (
                <DroppableSlot
                  key={i}
                  index={i}
                  pieceId={pieceId}
                  onRemove={() => removeFromMergeSlot(i)}
                />
              ))}
            </div>

            <div
              className="flex items-center w-full"
              style={{
                gap: isSmallScreen ? 6 : 8,
                flexWrap: "nowrap",
              }}
            >
              <button
                type="button"
                onClick={handleFusionner}
                disabled={!canFuse}
                className="min-w-0 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation bg-orange-500"
                style={{
                  flex: "1 1 auto",
                  padding: isMobileOrTablet
                    ? isSmallScreen
                      ? "8px 10px"
                      : "10px 12px"
                    : "11px 14px",
                  fontSize: isMobileOrTablet
                    ? isSmallScreen
                      ? "0.75rem"
                      : "0.875rem"
                    : "0.9rem",
                  minHeight: isMobileOrTablet ? 42 : 40,
                }}
                aria-label="Fusionner les pièces"
              >
                Fusionner !
              </button>
              <button
                type="button"
                onClick={handleAnnuler}
                disabled={!canCancelFusion}
                className="min-w-0 rounded-xl font-semibold text-gray-800 bg-gray-200 shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                style={{
                  flex: "1 1 auto",
                  padding: isMobileOrTablet
                    ? isSmallScreen
                      ? "8px 10px"
                      : "10px 12px"
                    : "11px 14px",
                  fontSize: isMobileOrTablet
                    ? isSmallScreen
                      ? "0.6875rem"
                      : "0.8125rem"
                    : "0.875rem",
                  minHeight: isMobileOrTablet ? 42 : 40,
                }}
                aria-label="Annuler toutes les fusions et remettre les pièces de base"
              >
                Annuler
              </button>
            </div>

            {fusionFeedback ? (
              <p
                className="text-red-700 font-semibold text-center"
                style={{
                  fontSize: isMobileOrTablet
                    ? isSmallScreen
                      ? "0.6875rem"
                      : "0.8125rem"
                    : "0.875rem",
                  minHeight: 20,
                }}
                aria-live="polite"
              >
                {fusionFeedback}
              </p>
            ) : null}
            <div
              className="absolute z-10"
              style={{
                top: 0,
                right: isMobileOrTablet
                  ? isSmallScreen
                    ? -54
                    : -58
                  : -64,
              }}
            >
              <ReadAloudButton
                text={`Pièces de radeau collectées ${fusedRaftPiecesCount} sur ${MAX_FUSED_RAFT_PIECES}. Fusionne les objets collectés pour construire le radeau.`}
                ariaLabel="Lire la progression et les actions de fusion"
              />
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div
          className="absolute z-10 flex items-center gap-2"
          style={{
            bottom: isMobileOrTablet
              ? isSmallScreen
                ? 8
                : isMediumScreen
                  ? 12
                  : 16
              : isDesktopSmall
                ? 16
                : isDesktopMedium
                  ? 24
                  : 32,
            left: isMobileOrTablet
              ? isSmallScreen
                ? 8
                : isMediumScreen
                  ? 12
                  : 16
              : isDesktopSmall
                ? 16
                : isDesktopMedium
                  ? 24
                  : 32,
          }}
        >
          <IconButton
            icon="/ui/icon_back.webp"
            alt="Retour"
            sizeVariant="map"
            onClick={() => router.push("/carte-de-l-ile")}
            label="Retour"
          />
          <ReadAloudButton
            text="Retour à la carte de l'île"
            ariaLabel="Lire : Retour"
          />
        </div>
      </div>

      <div
        className="relative shrink-0 flex flex-col overflow-hidden z-10"
        style={{
          height: "auto",
          width: isMobileOrTablet
            ? isSmallScreen
              ? 214
              : isMediumScreen
                ? 238
                : 268
            : isDesktopSmall
              ? 318
              : isDesktopMedium
                ? 348
                : 382,
          maxHeight: "96dvh",
          maxWidth: "90vw",
          aspectRatio: isMobileOrTablet ? "10.5/19" : "10/19",
          margin: isMobileOrTablet
            ? isSmallScreen
              ? 6
              : isMediumScreen
                ? 8
                : 10
            : isDesktopSmall
              ? 12
              : isDesktopMedium
                ? 14
                : 16,
          padding: isMobileOrTablet
            ? isSmallScreen
              ? 8
              : isMediumScreen
                ? 10
                : 12
            : isDesktopSmall
              ? 14
              : isDesktopMedium
                ? 16
                : 18,
          paddingBottom: isMobileOrTablet
            ? isSmallScreen
              ? 10
              : isMediumScreen
                ? 12
                : 14
            : isDesktopSmall
              ? 18
              : isDesktopMedium
                ? 20
                : 22,
          boxSizing: "border-box",
          backgroundImage: "url(/raft/background_radeau_merge_slots.webp)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="w-full h-full min-h-0 min-w-0 grid"
          style={{
            gridTemplateRows: "auto minmax(0, 1fr)",
            gap: isSmallScreen ? 10 : isMediumScreen ? 12 : 14,
          }}
        >
          <div
            className="w-full rounded-lg border border-amber-700/60"
            style={{
              gridColumn: "1 / -1",
              padding: isSmallScreen ? 10 : isMediumScreen ? 12 : 14,
              backgroundColor: "rgba(255, 245, 220, 0.82)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)",
              alignSelf: "stretch",
            }}
          >
            <p
              className="w-full font-semibold text-center"
              style={{
                color: "#1f2937",
                fontSize: isMobileOrTablet
                  ? isSmallScreen
                    ? "0.75rem"
                    : "0.875rem"
                  : "1rem",
                lineHeight: 1.4,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.35)",
                width: "100%",
              }}
            >
              Fusionne les objets collectés pour construire le radeau.
            </p>
          </div>

          <div
            className="min-h-0 min-w-0 flex items-center justify-center overflow-hidden"
            style={{ paddingLeft: isSmallScreen ? 4 : isMediumScreen ? 6 : 8 }}
          >
            <div
              className="grid shrink-0"
              style={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                minWidth: 0,
                maxHeight: "100%",
                maxWidth: "100%",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gridTemplateRows: "repeat(5, minmax(0, 1fr))",
                gap: isMobileOrTablet
                  ? isSmallScreen
                    ? 0
                    : isMediumScreen
                      ? 0
                      : 0
                  : isDesktopSmall
                    ? 0
                    : 0,
                alignContent: "stretch",
              }}
            >
              {Array.from({ length: INVENTORY_SLOTS_COUNT }).map((_, i) => {
                const item = inventoryItems[i];
                const piece =
                  item?.type === "mission"
                    ? getRaftPieceById(item.id as RaftPieceId)
                    : null;
                const isFused = item?.type === "fused";
                const isMission = item?.type === "mission";
                const isInMergeSlot = item?.isInMergeSlot ?? false;
                const isSameLockedMission =
                  lockedMissionKey == null || !isMission
                    ? true
                    : getMissionKey(item.id as RaftPieceId) ===
                      lockedMissionKey;
                const canDrag =
                  isMission &&
                  !isInMergeSlot &&
                  mergeSlots.some((s) => s === null) &&
                  isSameLockedMission &&
                  piece != null;
                const isGuidedOut =
                  Boolean(lockedMissionKey) &&
                  isMission &&
                  !isSameLockedMission;

                if (item) {
                  return (
                    <DraggableItem
                      key={item.id + i}
                      id={item.id}
                      piece={piece}
                      isInMergeSlot={isInMergeSlot}
                      isFused={isFused}
                      canDrag={canDrag}
                      isGuidedOut={isGuidedOut}
                    />
                  );
                }

                return (
                  <div
                    key={i}
                    className="w-full h-full min-w-0 min-h-0 flex items-center justify-center overflow-hidden"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {mergedObjectModalImage ? (
        <div
          className="fixed z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            width: isRotated ? `${width}px` : "100vw",
            height: isRotated ? `${height}px` : "100dvh",
            left: isRotated ? "50%" : "0",
            top: isRotated ? "50%" : "0",
            marginLeft: isRotated ? `-${width / 2}px` : "0",
            marginTop: isRotated ? `-${height / 2}px` : "0",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Objet fusionné"
        >
          <div
            className="relative w-full max-w-lg"
            style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
          >
            <Image
              src={mergedObjectModalImage}
              alt="Objet fusionné"
              width={800}
              height={600}
              className="w-full h-auto object-contain pointer-events-none"
              style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
              sizes="(max-width: 640px) 100vw, 32rem"
            />
            <div className="absolute top-4 right-4 z-10">
              <ReadAloudButton
                text="Objet fusionné récupéré."
                ariaLabel="Lire le message"
              />
            </div>
            <div
              className="absolute"
              style={{
                bottom: isSmallScreen
                  ? "12px"
                  : isMediumScreen
                    ? "16px"
                    : "16px",
                right: isSmallScreen
                  ? "32px"
                  : isMediumScreen
                    ? "48px"
                    : "48px",
              }}
            >
              <button
                type="button"
                onClick={() => setMergedObjectModalImage(null)}
                className="rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ padding: "6px" }}
                aria-label="Continuer"
              >
                <Image
                  src="/ui/icon_next.webp"
                  alt=""
                  width={64}
                  height={64}
                  style={{
                    width: isSmallScreen
                      ? "48px"
                      : isMediumScreen
                        ? "56px"
                        : "64px",
                    height: isSmallScreen
                      ? "48px"
                      : isMediumScreen
                        ? "56px"
                        : "64px",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RadeauWrapper() {
  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
  } = useResponsive();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mergeSlots, setMergeSlots] = useState<(RaftPieceId | null)[]>([
    null,
    null,
    null,
  ]);

  const dragOverlaySize = isMobileOrTablet
    ? isSmallScreen
      ? 56
      : isMediumScreen
        ? 64
        : 72
    : isDesktopSmall
      ? 80
      : isDesktopMedium
        ? 88
        : 96;

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const pieceId = active.id as string;
    const slotId = over.id as string;

    if (!slotId.startsWith("merge-slot-")) return;

    const slotIndex = parseInt(slotId.replace("merge-slot-", ""), 10);
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= 3) return;

    if (getRaftPieceById(pieceId as RaftPieceId) == null) return;

    setMergeSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = pieceId as RaftPieceId;
      return next;
    });
  };

  const activePiece = activeId
    ? getRaftPieceById(activeId as RaftPieceId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <RadeauContent
        mergeSlots={mergeSlots}
        setMergeSlots={setMergeSlots}
        activeId={activeId}
      />
      <DragOverlay>
        {activePiece ? (
          <div
            className="rounded border-2 border-white bg-[#93c5fd]/80 flex items-center justify-center overflow-hidden opacity-90 shrink-0"
            style={{
              width: dragOverlaySize,
              height: dragOverlaySize,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
            }}
          >
            {activePiece.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={activePiece.image}
                  alt={activePiece.name || "Pièce du radeau"}
                  fill
                  className="object-contain"
                  draggable={false}
                />
              </div>
            ) : (
              <span className="font-semibold text-gray-700 text-xs text-center">
                {activePiece.name?.replace(new RegExp("^Pièce \\d+ - "), "") ??
                  "?"}
              </span>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function RadeauPage() {
  return (
    <OrientationGuard>
      <RadeauWrapper />
    </OrientationGuard>
  );
}
