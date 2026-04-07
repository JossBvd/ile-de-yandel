import { ALL_STEPS } from "@/data/missions";
import { RaftPiece } from "@/types/inventory";

export const RAFT_PIECES: RaftPiece[] = [
  {
    id: "piece-1-1",
    name: "Pièce 1 - Mission 1",
    description: "Première pièce de la mission 1",
    image: "/raft/mission-1-step-1.webp",
    stepId: "mission-1-step-1",
  },
  {
    id: "piece-1-2",
    name: "Pièce 2 - Mission 1",
    description: "Deuxième pièce de la mission 1",
    image: "/raft/mission-1-step-2.webp",
    stepId: "mission-1-step-2",
  },
  {
    id: "piece-1-3",
    name: "Pièce 3 - Mission 1",
    description: "Troisième pièce de la mission 1",
    image: "/raft/mission-1-step-3.webp",
    stepId: "mission-1-step-3",
  },
  {
    id: "piece-2-1",
    name: "Pièce 1 - Mission 2",
    description: "Première pièce de la mission 2",
    image: "/raft/mission-2-step-1.png", // À fournir par le client
    stepId: "mission-2-step-1",
  },
  {
    id: "piece-2-2",
    name: "Pièce 2 - Mission 2",
    description: "Deuxième pièce de la mission 2",
    image: "/raft/mission-2-step-2.png", // À fournir par le client
    stepId: "mission-2-step-2",
  },
  {
    id: "piece-2-3",
    name: "Pièce 3 - Mission 2",
    description: "Troisième pièce de la mission 2",
    image: "/raft/mission-2-step-3.png", // À fournir par le client
    stepId: "mission-2-step-3",
  },
  {
    id: "piece-3-1",
    name: "Pièce 1 - Mission 3",
    description: "Première pièce de la mission 3",
    image: "/raft/mission-3-step-1.png", // À fournir par le client
    stepId: "mission-3-step-1",
  },
  {
    id: "piece-3-2",
    name: "Pièce 2 - Mission 3",
    description: "Deuxième pièce de la mission 3",
    image: "/raft/mission-3-step-2.png", // À fournir par le client
    stepId: "mission-3-step-2",
  },
  {
    id: "piece-3-3",
    name: "Pièce 3 - Mission 3",
    description: "Troisième pièce de la mission 3",
    image: "/raft/mission-3-step-3.png", // À fournir par le client
    stepId: "mission-3-step-3",
  },
  {
    id: "piece-4-1",
    name: "Pièce 1 - Mission 4",
    description: "Première pièce de la mission 4",
    image: "/raft/mission-4-step-1.png", // À fournir par le client
    stepId: "mission-4-step-1",
  },
  {
    id: "piece-4-2",
    name: "Pièce 2 - Mission 4",
    description: "Deuxième pièce de la mission 4",
    image: "/raft/mission-4-step-2.png", // À fournir par le client
    stepId: "mission-4-step-2",
  },
  {
    id: "piece-4-3",
    name: "Pièce 3 - Mission 4",
    description: "Troisième pièce de la mission 4",
    image: "/raft/mission-4-step-3.png", // À fournir par le client
    stepId: "mission-4-step-3",
  },
  {
    id: "piece-5-1",
    name: "Pièce 1 - Mission 5",
    description: "Première pièce de la mission 5",
    image: "/raft/mission-5-step-1.png", // À fournir par le client
    stepId: "mission-5-step-1",
  },
  {
    id: "piece-5-2",
    name: "Pièce 2 - Mission 5",
    description: "Deuxième pièce de la mission 5",
    image: "/raft/mission-5-step-2.png", // À fournir par le client
    stepId: "mission-5-step-2",
  },
  {
    id: "piece-5-3",
    name: "Pièce 3 - Mission 5",
    description: "Troisième pièce de la mission 5",
    image: "/raft/mission-5-step-3.png", // À fournir par le client
    stepId: "mission-5-step-3",
  },
];

function validateRaftPiecesAgainstSteps(): void {
  for (const piece of RAFT_PIECES) {
    const step = ALL_STEPS.find((s) => s.id === piece.stepId);
    if (!step) {
      throw new Error(
        `Raft: pièce ${piece.id} référence un step inconnu (${piece.stepId}).`,
      );
    }
    if (step.raftPiece !== piece.id) {
      throw new Error(
        `Raft: pièce ${piece.id} / step ${step.id} — raftPiece du step (${step.raftPiece}) incohérent.`,
      );
    }
  }
  for (const step of ALL_STEPS) {
    if (!step.raftPiece) continue;
    const piece = RAFT_PIECES.find((p) => p.id === step.raftPiece);
    if (!piece || piece.stepId !== step.id) {
      throw new Error(
        `Raft: step ${step.id} a raftPiece ${step.raftPiece} sans entrée RAFT_PIECES valide.`,
      );
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  validateRaftPiecesAgainstSteps();
}

export function getRaftPieceById(id: string): RaftPiece | undefined {
  return RAFT_PIECES.find((piece) => piece.id === id);
}

export function getRaftPieceByStepId(stepId: string): RaftPiece | undefined {
  return RAFT_PIECES.find((piece) => piece.stepId === stepId);
}

export const TOTAL_RAFT_PIECES = RAFT_PIECES.length;
export const MAX_FUSED_RAFT_PIECES = 5;
