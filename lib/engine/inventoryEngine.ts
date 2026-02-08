import { RaftPieceId } from "@/types/step";
import { getRaftPieceByStepId, TOTAL_RAFT_PIECES } from "@/data/raft";

/**
 * Moteur de gestion de l'inventaire et du radeau
 *
 * Gère la collecte des pièces du radeau et la progression
 */

/** Obtenir la pièce associée à un step */
export function getRaftPieceForStep(stepId: string): RaftPieceId | null {
  const piece = getRaftPieceByStepId(stepId);
  return piece ? piece.id : null;
}

/** Vérifier si toutes les pièces sont collectées */
export function isInventoryComplete(collectedPieces: RaftPieceId[]): boolean {
  return collectedPieces.length >= TOTAL_RAFT_PIECES;
}

/** Calculer le pourcentage de progression de l'inventaire */
export function getInventoryProgress(collectedPieces: RaftPieceId[]): number {
  if (TOTAL_RAFT_PIECES === 0) return 0;
  return Math.round((collectedPieces.length / TOTAL_RAFT_PIECES) * 100);
}

/** Obtenir le nombre de pièces manquantes */
export function getMissingPiecesCount(collectedPieces: RaftPieceId[]): number {
  return Math.max(0, TOTAL_RAFT_PIECES - collectedPieces.length);
}
