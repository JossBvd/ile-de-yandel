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

const INVENTORY_SLOTS_COUNT = 15;

interface DraggableItemProps {
  id: string;
  piece: ReturnType<typeof getRaftPieceById> | null;
  isInMergeSlot: boolean;
  isFused: boolean;
  canDrag: boolean;
}

function DraggableItem({
  id,
  piece,
  isInMergeSlot,
  isFused,
  canDrag,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: !canDrag || isInMergeSlot,
  });

  if (isInMergeSlot) {
    return (
      <div
        className="w-full aspect-square min-w-0 min-h-0 rounded border-2 border-white bg-[#93c5fd]/80 flex items-center justify-center overflow-hidden opacity-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
        }}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full aspect-square min-w-0 min-h-0 rounded border-2 flex items-center justify-center overflow-hidden touch-none border-white bg-[#93c5fd]/80 ${
        !canDrag
          ? "opacity-50 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "opacity-50" : ""}`}
      style={{
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
      }}
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
    <div className="w-full flex items-center justify-center" style={{ aspectRatio: "1/1" }}>
      <button
        type="button"
        ref={setNodeRef}
        onClick={onRemove}
        className={`w-full h-full rounded border-[3px] bg-gray-900/80 flex items-center justify-center touch-none transition-colors ${
          isOver ? "bg-gray-700/80" : ""
        }`}
        style={{ 
          borderColor: "#d97706",
          aspectRatio: "1/1",
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
  } = useInventoryStore();
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();

  const inMergeSlots = new Set(
    mergeSlots.filter((id): id is RaftPieceId => id !== null),
  );

  const mission1Order = ["piece-1-1", "piece-1-2", "piece-1-3"];
  const sortedMissionPieces = [...collectedPieces].sort((a, b) => {
    const aIndex = mission1Order.indexOf(a);
    const bIndex = mission1Order.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });
  const inventoryItems: {
    id: string;
    type: "mission" | "fused";
    isInMergeSlot?: boolean;
  }[] = [
    ...sortedMissionPieces.map((id) => ({
      id,
      type: "mission" as const,
      isInMergeSlot: inMergeSlots.has(id),
    })),
    ...fusedPieces.map((id) => ({ id, type: "fused" as const })),
  ].slice(0, INVENTORY_SLOTS_COUNT);
  const canFuse =
    mergeSlots[0] !== null &&
    mergeSlots[1] !== null &&
    mergeSlots[2] !== null &&
    fusedRaftPiecesCount < MAX_FUSED_RAFT_PIECES;

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
    const ok = consumePiecesForFusion(ids);
    if (ok) setMergeSlots([null, null, null]);
  };

  return (
    <div
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
          className="absolute z-10"
          style={{
            top: isMobileOrTablet ? (isSmallScreen ? 4 : isMediumScreen ? 8 : 12) : 24,
            left: 0,
          }}
        >
          <div 
            className="relative"
            style={{
              width: isMobileOrTablet ? (isSmallScreen ? 192 : isMediumScreen ? 240 : 280) : (isDesktopSmall ? 320 : isDesktopMedium ? 360 : 400),
              height: isMobileOrTablet ? (isSmallScreen ? 64 : isMediumScreen ? 80 : 96) : (isDesktopSmall ? 112 : isDesktopMedium ? 120 : 128),
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
                  fontSize: isMobileOrTablet ? (isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1.125rem') : (isDesktopSmall ? '1.25rem' : isDesktopMedium ? '1.375rem' : '1.5rem'),
                }}
              >
                Radeau
              </h1>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div
          className="absolute z-10 flex flex-col items-center"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            bottom: isMobileOrTablet ? (isSmallScreen ? 48 : isMediumScreen ? 56 : 64) : (isDesktopSmall ? 72 : isDesktopMedium ? 80 : 88),
            gap: isMobileOrTablet ? (isSmallScreen ? 4 : isMediumScreen ? 6 : 8) : (isDesktopSmall ? 8 : 10),
            marginLeft: isMobileOrTablet ? (isSmallScreen ? 40 : isMediumScreen ? 56 : 72) : (isDesktopSmall ? 80 : isDesktopMedium ? 96 : 112),
          }}
        >
          <div
            className="relative shrink-0"
            style={{
              width: isMobileOrTablet ? (isSmallScreen ? 160 : isMediumScreen ? 200 : 240) : (isDesktopSmall ? 280 : isDesktopMedium ? 320 : 360),
              height: isMobileOrTablet ? (isSmallScreen ? 160 : isMediumScreen ? 200 : 240) : (isDesktopSmall ? 280 : isDesktopMedium ? 320 : 360),
              opacity: 0.25,
            }}
          >
            <Image
              src="/raft/picto-ile-grey.webp"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div
            className="flex"
            style={{
              gap: isMobileOrTablet ? (isSmallScreen ? 4 : 6) : (isDesktopSmall ? 8 : 10),
            }}
          >
            {Array.from({ length: MAX_FUSED_RAFT_PIECES }).map((_, i) => (
              <div
                key={i}
                className="relative shrink-0"
                style={{
                  width: isMobileOrTablet ? (isSmallScreen ? 32 : isMediumScreen ? 40 : 48) : (isDesktopSmall ? 52 : isDesktopMedium ? 58 : 64),
                  height: isMobileOrTablet ? (isSmallScreen ? 32 : isMediumScreen ? 40 : 48) : (isDesktopSmall ? 52 : isDesktopMedium ? 58 : 64),
                }}
              >
                <Image
                  src={
                    i < fusedRaftPiecesCount
                      ? "/raft/icon_radeau_stepchecked.webp"
                      : "/raft/icon_radeau_steplocked.webp"
                  }
                  alt={
                    i < fusedRaftPiecesCount
                      ? "Pièce obtenue"
                      : "Pièce à obtenir"
                  }
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <p
            className="font-semibold text-gray-800 drop-shadow-sm"
            style={{
              fontSize: isMobileOrTablet ? (isSmallScreen ? '0.8125rem' : isMediumScreen ? '0.9375rem' : '1rem') : (isDesktopSmall ? '1rem' : isDesktopMedium ? '1.0625rem' : '1.125rem'),
            }}
          >
            Pièces de radeau collectées {fusedRaftPiecesCount}/
            {MAX_FUSED_RAFT_PIECES}
          </p>
        </div>

        {/* Bouton retour */}
        <div
          className="absolute z-10"
          style={{
            bottom: isMobileOrTablet ? (isSmallScreen ? 8 : isMediumScreen ? 12 : 16) : (isDesktopSmall ? 16 : isDesktopMedium ? 24 : 32),
            left: isMobileOrTablet ? (isSmallScreen ? 8 : isMediumScreen ? 12 : 16) : (isDesktopSmall ? 16 : isDesktopMedium ? 24 : 32),
          }}
        >
          <IconButton
            icon="/ui/icon_back.webp"
            alt="Retour"
            sizeVariant="map"
            onClick={() => router.push("/carte-de-l-ile")}
            label="Retour"
          />
        </div>
      </div>

      <div
        className="relative shrink-0 flex flex-col overflow-hidden z-10"
        style={{
          height: "auto",
          width: "auto",
          maxHeight: "96dvh",
          maxWidth: isMobileOrTablet ? (isSmallScreen ? 240 : isMediumScreen ? 280 : 320) : (isDesktopSmall ? 320 : isDesktopMedium ? 360 : 400),
          aspectRatio: "9/19",
          margin: isMobileOrTablet ? (isSmallScreen ? 8 : isMediumScreen ? 12 : 16) : (isDesktopSmall ? 20 : isDesktopMedium ? 24 : 28),
          padding: isMobileOrTablet ? (isSmallScreen ? 10 : isMediumScreen ? 12 : 14) : (isDesktopSmall ? 16 : isDesktopMedium ? 18 : 20),
          paddingBottom: isMobileOrTablet ? (isSmallScreen ? 12 : isMediumScreen ? 16 : 20) : (isDesktopSmall ? 24 : isDesktopMedium ? 28 : 32),
          boxSizing: "border-box",
          backgroundImage: "url(/raft/background_radeau_merge_slots.webp)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Grille inventaire */}
        <div className="flex-1 min-h-0 w-full min-w-0 flex items-center justify-center overflow-hidden">
          <div
            className="grid grid-cols-3 grid-rows-5 shrink-0"
            style={{
              width: "min(100%, 90cqw)",
              aspectRatio: "3/5",
              maxHeight: "100%",
              maxWidth: "100%",
              gap: isMobileOrTablet ? (isSmallScreen ? 4 : isMediumScreen ? 6 : 8) : (isDesktopSmall ? 8 : 10),
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
              const canDrag =
                isMission &&
                !isInMergeSlot &&
                mergeSlots.some((s) => s === null) &&
                piece != null;

              if (item) {
                return (
                  <DraggableItem
                    key={item.id + i}
                    id={item.id}
                    piece={piece}
                    isInMergeSlot={isInMergeSlot}
                    isFused={isFused}
                    canDrag={canDrag}
                  />
                );
              }

              return (
                <div
                  key={i}
                  className="w-full aspect-square min-w-0 min-h-0 rounded border-2 border-white bg-[#93c5fd]/80 flex items-center justify-center overflow-hidden"
                  style={{
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
                  }}
                >
                  <div
                    className="w-1/3 h-1/3 bg-green-600/40 rounded-br"
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone fusion */}
        <div
          className="shrink-0 w-full min-w-0 flex flex-col self-center"
          style={{
            gap: isMobileOrTablet ? (isSmallScreen ? 4 : 6) : 8,
            maxWidth: "90%",
            paddingBottom: 2,
          }}
        >
          <div 
            className="grid grid-cols-3 w-full min-w-0 shrink-0 max-w-full"
            style={{
              gap: isMobileOrTablet ? (isSmallScreen ? "4px" : isMediumScreen ? "6px" : "8px") : "10px",
              gridTemplateRows: "1fr",
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

          <button
            type="button"
            onClick={handleFusionner}
            disabled={!canFuse}
            className="w-full rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation bg-orange-500"
            style={{
              padding: isMobileOrTablet ? (isSmallScreen ? "12px 16px" : isMediumScreen ? "14px 18px" : "16px 20px") : (isDesktopSmall ? "14px 20px" : "18px 24px"),
              fontSize: isMobileOrTablet ? (isSmallScreen ? "1rem" : isMediumScreen ? "1.0625rem" : "1.125rem") : (isDesktopSmall ? "1rem" : isDesktopMedium ? "1.0625rem" : "1.125rem"),
              minHeight: isMobileOrTablet ? 48 : 44,
              minWidth: 120,
            }}
            aria-label="Fusionner les pièces"
          >
            Fusionner !
          </button>
        </div>
      </div>
    </div>
  );
}

function RadeauWrapper() {
  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isMobileOrTablet } = useResponsive();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mergeSlots, setMergeSlots] = useState<(RaftPieceId | null)[]>([
    null,
    null,
    null,
  ]);

  const dragOverlaySize = isMobileOrTablet
    ? (isSmallScreen ? 56 : isMediumScreen ? 64 : 72)
    : (isDesktopSmall ? 80 : isDesktopMedium ? 88 : 96);

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
