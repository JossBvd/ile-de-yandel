import { RaftPieceId } from './mission';

export interface Inventory {
  collectedPieces: RaftPieceId[];
  totalPieces: number;
}

export interface RaftPiece {
  id: RaftPieceId;
  name: string;
  description: string;
  image: string;
  missionId: string;
}
