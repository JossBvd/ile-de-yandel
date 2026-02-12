import { useInventoryStore } from "@/store/inventoryStore";
import { RaftPieceId } from "@/types/step";
import { TOTAL_RAFT_PIECES } from "@/data/raft";

/**
 * Hook pour gérer l'inventaire du joueur
 *
 * Fournit un accès simplifié au store d'inventaire
 * et aux méthodes pour collecter des pièces
 */
export function useInventory() {
  const {
    collectedPieces,
    addPiece,
    hasPiece,
    getProgress,
    isRaftComplete,
    reset,
  } = useInventoryStore();

  return {
    /** Liste des pièces collectées */
    collectedPieces,

    /** Nombre total de pièces disponibles dans le jeu */
    totalPieces: TOTAL_RAFT_PIECES,

    /** Progression en pourcentage (0-100) */
    progress: getProgress(),

    /** Le radeau est-il complet ? */
    raftComplete: isRaftComplete(),

    /** Ajouter une pièce à l'inventaire */
    addPiece,

    /** Vérifier si une pièce est déjà collectée */
    hasPiece,

    /** Réinitialiser l'inventaire */
    reset,
  };
}
