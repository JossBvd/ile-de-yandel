export type MissionId = string;

export interface Mission {
  id: MissionId;
  title: string;
  description: string;
  location: string;
  narrative: string;
  steps: StepId[];
  raftPiece: RaftPieceId;
  backgroundImage?: string;
}

export type StepId = string;
export type RaftPieceId = string;
