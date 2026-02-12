import { StepId, RaftPieceId } from "./step";

export type MissionId = string;

/** Mission = conteneur de steps. */
export interface Mission {
  id: MissionId;
  title: string;
  description?: string;
  steps: StepId[];
}

// Re-export pour compatibilité
export type { RaftPieceId };
