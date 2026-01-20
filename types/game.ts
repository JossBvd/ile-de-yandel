import { MissionId, StepId } from './mission';

export interface GameProgress {
  currentMission: MissionId | null;
  currentStep: StepId | null;
  completedSteps: StepId[];
  completedMissions: MissionId[];
}

export interface GameState extends GameProgress {
  isInitialized: boolean;
}
