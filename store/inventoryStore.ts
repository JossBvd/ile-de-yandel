'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Inventory } from '@/types/inventory';
import { RaftPieceId } from '@/types/mission';
import { STORAGE_KEY_INVENTORY } from '@/lib/constants';

interface InventoryStore extends Inventory {
  addPiece: (pieceId: RaftPieceId) => void;
  reset: () => void;
}

const initialState: Inventory = {
  collectedPieces: [],
  totalPieces: 5, // 5 missions = 5 pièces
};

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      addPiece: (pieceId) =>
        set((state) => {
          if (state.collectedPieces.includes(pieceId)) {
            return state;
          }
          return {
            collectedPieces: [...state.collectedPieces, pieceId],
          };
        }),
      
      reset: () =>
        set(initialState),
    }),
    {
      name: STORAGE_KEY_INVENTORY,
      partialize: (state) => ({
        collectedPieces: state.collectedPieces,
        totalPieces: state.totalPieces,
      }),
    }
  )
);
