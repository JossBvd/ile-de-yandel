export type StepId = string;

export interface Step {
  id: StepId;
  title: string;
  description: string;
  location: string;
  narrative: string;
  missions: MissionId[];
  raftPiece: RaftPieceId;
  backgroundImage?: string;
}

export type MissionId = string;
export type RaftPieceId = string;
