"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { IconButton } from "@/components/ui/IconButton";
import { useInventoryStore } from "@/store/inventoryStore";
import { getRaftPieceById, MAX_FUSED_RAFT_PIECES } from "@/data/raft";
import type { RaftPieceId } from "@/types/step";

/** 15 objets au total (5 missions × 3 steps) */
const INVENTORY_SLOTS_COUNT = 15;

function RadeauContent() {
  const router = useRouter();
  const { isRotated, width, height } = useOrientationContext();
  const {
    collectedPieces,
    fusedRaftPiecesCount,
    fusedPieces,
    consumePiecesForFusion,
  } = useInventoryStore();

  const [mergeSlots, setMergeSlots] = useState<(RaftPieceId | null)[]>([
    null,
    null,
    null,
  ]);

  const inMergeSlots = new Set(
    mergeSlots.filter((id): id is RaftPieceId => id !== null),
  );
  const availableMissionPieces = collectedPieces.filter(
    (id) => !inMergeSlots.has(id),
  );
  /** Inventaire affiché : pièces mission disponibles + objets fusionnés (max 15 slots) */
  const inventoryItems: { id: string; type: "mission" | "fused" }[] = [
    ...availableMissionPieces.map((id) => ({ id, type: "mission" as const })),
    ...fusedPieces.map((id) => ({ id, type: "fused" as const })),
  ].slice(0, INVENTORY_SLOTS_COUNT);
  const canFuse =
    mergeSlots[0] !== null &&
    mergeSlots[1] !== null &&
    mergeSlots[2] !== null &&
    fusedRaftPiecesCount < MAX_FUSED_RAFT_PIECES;

  const addToMergeSlot = (pieceId: string) => {
    if (getRaftPieceById(pieceId as RaftPieceId) == null) return;
    const idx = mergeSlots.findIndex((s) => s === null);
    if (idx === -1) return;
    setMergeSlots((prev) => {
      const next = [...prev];
      next[idx] = pieceId as RaftPieceId;
      return next;
    });
  };

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
      {/* Fond plein écran (PRD : position absolute inset 0) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Partie gauche : titre, progression, bouton retour (même position partout) */}
      <div className="relative flex-1 min-w-0 flex flex-col z-10">
        {/* Titre Radeau — tailles proportionnelles */}
        <div
          className="absolute z-10"
          style={{
            top: "clamp(0.25rem, 1.5vw, 1.5rem)",
            left: "clamp(0.25rem, 1.5vw, 1.5rem)",
          }}
        >
          <div
            className="rounded-lg"
            style={{
              padding:
                "clamp(0.375rem, 1.2vw, 0.625rem) clamp(0.5rem, 1.5vw, 1rem)",
              backgroundColor: "rgba(230, 213, 184, 0.95)",
            }}
          >
            <h1
              className="font-bold text-gray-800"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
            >
              Radeau
            </h1>
          </div>
        </div>

        {/* Progression dynamique : pièces créées par fusion */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center translate-y-6"
          style={{
            bottom: "clamp(3rem, 10vh, 5rem)",
            gap: "clamp(0.25rem, 1vh, 0.5rem)",
          }}
        >
          <div
            className="relative shrink-0"
            style={{
              width: "clamp(13.5rem, 42vw, 21rem)",
              height: "clamp(13.5rem, 42vw, 21rem)",
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
          <div className="flex" style={{ gap: "clamp(0.25rem, 1vw, 0.5rem)" }}>
            {Array.from({ length: MAX_FUSED_RAFT_PIECES }).map((_, i) => (
              <div
                key={i}
                className="relative shrink-0"
                style={{
                  width: "clamp(2rem, 5vw, 3rem)",
                  height: "clamp(2rem, 5vw, 3rem)",
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
            style={{ fontSize: "clamp(0.75rem, 2vw, 1.125rem)" }}
          >
            Pièces de radeau collectées {fusedRaftPiecesCount}/
            {MAX_FUSED_RAFT_PIECES}
          </p>
        </div>

        {/* Bouton retour — en bas à gauche, même position */}
        <div
          className="absolute z-10"
          style={{
            bottom: "clamp(0.25rem, 1.5vw, 1rem)",
            left: "clamp(0.25rem, 1.5vw, 1rem)",
          }}
        >
          <IconButton
            icon="/ui/icon_back.webp"
            alt="Retour"
            onClick={() => router.back()}
            label="Retour"
          />
        </div>
      </div>

      {/* Conteneur droit : aspect ratio fixe pour coller à l'image de fond */
      /* Le panneau s'adapte à la hauteur d'écran ou à la largeur max, en gardant ses proportions */}
      <div
        className="relative shrink-0 flex flex-col overflow-hidden z-10"
        style={{
          // Dimensions contraintes par le ratio de l'image
          height: "auto",
          width: "auto",
          maxHeight: "96dvh",
          maxWidth: "320px",
          aspectRatio: "9/19",

          // Marge et padding
          margin: "clamp(0.5rem, 2vw, 1.5rem)",
          padding: "clamp(0.75rem, 3vw, 1.5rem)",
          paddingBottom: "clamp(1rem, 4vw, 2rem)",
          boxSizing: "border-box",

          // Fond qui remplit exactement ce ratio
          backgroundImage: "url(/raft/background_radeau_merge_slots.webp)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Zone inventaire : grille 5×3 */}
        <div className="flex-1 min-h-0 w-full min-w-0 flex items-center justify-center overflow-hidden">
          <div
            className="grid grid-cols-3 grid-rows-5 shrink-0"
            style={{
              width: "min(100%, 90cqw)",
              aspectRatio: "3/5",
              maxHeight: "100%",
              maxWidth: "100%",
              gap: "clamp(0.2rem, 0.8cqh, 0.5rem)",
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
              const canAddToMerge =
                isMission &&
                mergeSlots.some((s) => s === null) &&
                piece != null;
              return (
                <button
                  key={item ? item.id + i : i}
                  type="button"
                  onClick={() =>
                    isMission &&
                    item &&
                    canAddToMerge &&
                    addToMergeSlot(item.id)
                  }
                  disabled={!canAddToMerge}
                  className="w-full aspect-square min-w-0 min-h-0 rounded border-2 border-white bg-[#93c5fd]/80 flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  style={{
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
                  }}
                >
                  {item ? (
                    <span
                      className="font-semibold text-gray-700 wrap-break-word text-center leading-tight"
                      style={{ fontSize: "clamp(0.5rem, 2.2cqh, 0.75rem)" }}
                    >
                      {isFused
                        ? `Fusion ${item.id.replace("fused-", "")}`
                        : (piece?.name?.replace(
                            new RegExp("^Pièce \\d+ - "),
                            "",
                          ) ?? "?")}
                    </span>
                  ) : (
                    <div
                      className="w-1/3 h-1/3 bg-green-600/40 rounded-br"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone fusion : 3 slots + bouton */}
        <div
          className="shrink-0 w-full min-w-0 flex flex-col self-center"
          style={{
            gap: "clamp(0.2rem, 0.6vh, 0.4rem)",
            maxWidth: "90%",
            paddingBottom: "0.15rem",
          }}
        >
          <div className="grid grid-cols-3 w-full min-w-0 shrink-0 gap-0 aspect-3/1 max-w-full">
            {mergeSlots.map((pieceId, i) => {
              const piece = pieceId ? getRaftPieceById(pieceId) : null;
              const hasPiece = Boolean(pieceId);
              return (
                <div
                  key={i}
                  className="min-w-0 min-h-0 flex"
                  style={{ padding: "clamp(0.15rem, 0.5vw, 0.375rem)" }}
                >
                  <button
                    type="button"
                    onClick={() => removeFromMergeSlot(i)}
                    className="w-full h-full aspect-square min-w-0 min-h-0 rounded border-[3px] bg-gray-900/80 flex items-center justify-center touch-manipulation"
                    style={{ borderColor: "#d97706" }}
                  >
                    {hasPiece ? (
                      <span
                        className="font-semibold text-white wrap-break-word text-center leading-tight"
                        style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.75rem)" }}
                      >
                        {piece?.name?.replace(
                          new RegExp("^Pièce \\d+ - "),
                          "",
                        ) ?? "?"}
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleFusionner}
            disabled={!canFuse}
            className="w-full rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            style={{
              backgroundColor: "#f97316",
              padding: "clamp(0.375rem, 1.2vh, 0.625rem)",
              fontSize: "clamp(0.75rem, 2vw, 1rem)",
            }}
          >
            Fusionner !
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RadeauPage() {
  return (
    <OrientationGuard>
      <RadeauContent />
    </OrientationGuard>
  );
}
