"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RaftPieceId } from "@/types/step";
import { TOTAL_RAFT_PIECES, MAX_FUSED_RAFT_PIECES } from "@/data/raft";

export type FusedPieceId = string;

interface InventoryState {
  collectedPieces: RaftPieceId[];
  fusedRaftPiecesCount: number;
  fusedPieces: FusedPieceId[];
  fusionHistory: [RaftPieceId, RaftPieceId, RaftPieceId][];
  /** Indices de missions (1–5) dont l'objet fusionné a été déposé sur le radeau */
  placedOnRaft: number[];
  addPiece: (pieceId: RaftPieceId) => void;
  hasPiece: (pieceId: RaftPieceId) => boolean;
  consumePiecesForFusion: (
    pieceIds: [RaftPieceId, RaftPieceId, RaftPieceId],
  ) => boolean;
  /** Dépose l'objet fusionné d'une mission sur le radeau (ordre 1→5 obligatoire). */
  placeOnRaft: (missionIndex: number) => boolean;
  getProgress: () => number;
  isRaftComplete: () => boolean;
  reset: () => void;
  resetFusions: () => void;
}

const initialState = {
  collectedPieces: [],
  fusedRaftPiecesCount: 0,
  fusedPieces: [],
  fusionHistory: [],
  placedOnRaft: [] as number[],
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /** Ajouter une pièce à l'inventaire (si pas déjà collectée) */
      addPiece: (pieceId: RaftPieceId) =>
        set((state) => {
          if (state.collectedPieces.includes(pieceId)) {
            return state; // Déjà collectée, pas de changement
          }
          return {
            collectedPieces: [...state.collectedPieces, pieceId],
          };
        }),

      /** Vérifier si une pièce est déjà collectée */
      hasPiece: (pieceId: RaftPieceId) => {
        return get().collectedPieces.includes(pieceId);
      },

      /** Fusionner 3 pièces : les retire, ajoute 1 objet fusionné dans l’inventaire (prend la place d’un des 3). */
      consumePiecesForFusion: (
        pieceIds: [RaftPieceId, RaftPieceId, RaftPieceId],
      ): boolean => {
        const state = get();
        if (state.fusedRaftPiecesCount >= MAX_FUSED_RAFT_PIECES) return false;

        const [first, second, third] = pieceIds;
        const getMissionKey = (id: RaftPieceId) =>
          id.split("-").slice(0, 2).join("-");
        const missionKey = getMissionKey(first);
        if (
          getMissionKey(second) !== missionKey ||
          getMissionKey(third) !== missionKey
        ) {
          return false;
        }

        const setIds = new Set(pieceIds);
        const stillHas = state.collectedPieces.filter((id) => setIds.has(id));
        if (stillHas.length !== 3) return false;
        const nextFusedId = `fused-${state.fusedRaftPiecesCount + 1}`;
        set({
          collectedPieces: state.collectedPieces.filter(
            (id) => !setIds.has(id),
          ),
          fusedRaftPiecesCount: state.fusedRaftPiecesCount + 1,
          fusedPieces: [...state.fusedPieces, nextFusedId],
          fusionHistory: [...state.fusionHistory, pieceIds],
        });
        return true;
      },

      /** Dépose l'objet fusionné d'une mission sur le radeau (ordre 1→5 obligatoire). */
      placeOnRaft: (missionIndex: number): boolean => {
        const state = get();
        const nextExpected = state.placedOnRaft.length + 1;
        if (missionIndex !== nextExpected) return false;
        if (state.placedOnRaft.includes(missionIndex)) return false;
        set({ placedOnRaft: [...state.placedOnRaft, missionIndex] });
        return true;
      },

      /** Calculer la progression en pourcentage */
      getProgress: () => {
        const collected = get().collectedPieces.length;
        return TOTAL_RAFT_PIECES > 0
          ? Math.round((collected / TOTAL_RAFT_PIECES) * 100)
          : 0;
      },

      /** Vérifier si le radeau est complet (toutes les pièces collectées) */
      isRaftComplete: () => {
        return get().collectedPieces.length === TOTAL_RAFT_PIECES;
      },

      /** Réinitialiser l'inventaire et les pièces fusion */
      reset: () => set(initialState),

      /** Réinitialiser uniquement les fusions (les pièces collectées restent) */
      resetFusions: () =>
        set((state) => {
          const restoredPieces = state.fusionHistory.flat();
          const restoredSet = new Set<RaftPieceId>([
            ...state.collectedPieces,
            ...restoredPieces,
          ]);
          return {
            ...state,
            collectedPieces: Array.from(restoredSet),
            fusedRaftPiecesCount: 0,
            fusedPieces: [],
            fusionHistory: [],
            placedOnRaft: [],
          };
        }),
    }),
    {
      name: "escape_game_inventory", // Clé localStorage
      partialize: (state) => ({
        collectedPieces: state.collectedPieces,
        fusedRaftPiecesCount: state.fusedRaftPiecesCount,
        fusedPieces: state.fusedPieces,
        fusionHistory: state.fusionHistory,
        placedOnRaft: state.placedOnRaft,
      }),
    },
  ),
);
