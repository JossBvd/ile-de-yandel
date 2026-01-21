import { StepId, MissionId } from './step';

export interface GameProgress {
  currentStep: StepId | null;
  currentMission: MissionId | null;
  completedMissions: MissionId[];
  completedSteps: StepId[];
}

export interface GameState extends GameProgress {
  isInitialized: boolean;
}
