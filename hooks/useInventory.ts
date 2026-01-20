'use client';

import { useInventoryStore } from '@/store/inventoryStore';
import { isRaftComplete, getRaftProgress } from '@/lib/engine/inventoryEngine';

export function useInventory() {
  const { collectedPieces, totalPieces, addPiece } = useInventoryStore();

  const raftComplete = isRaftComplete({ collectedPieces, totalPieces });
  const progress = getRaftProgress({ collectedPieces, totalPieces });

  return {
    collectedPieces,
    totalPieces,
    addPiece,
    raftComplete,
    progress,
  };
}
