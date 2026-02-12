import { StepId } from "./step";
import { MissionId } from "./mission";

export interface GameProgress {
  currentMissionId: MissionId | null;
  currentStepId: StepId | null;
  completedSteps: StepId[];
  completedMissions: MissionId[];
}

export interface GameState extends GameProgress {
  isInitialized: boolean;
}
