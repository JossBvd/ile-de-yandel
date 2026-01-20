import { RaftPieceId } from '@/types/mission';
import { Inventory, RaftPiece } from '@/types/inventory';

export function addRaftPiece(
  inventory: Inventory,
  pieceId: RaftPieceId
): Inventory {
  if (inventory.collectedPieces.includes(pieceId)) {
    return inventory;
  }
  
  return {
    ...inventory,
    collectedPieces: [...inventory.collectedPieces, pieceId],
  };
}

export function isRaftComplete(inventory: Inventory): boolean {
  return inventory.collectedPieces.length >= inventory.totalPieces;
}

export function getRaftProgress(inventory: Inventory): number {
  return (inventory.collectedPieces.length / inventory.totalPieces) * 100;
}
