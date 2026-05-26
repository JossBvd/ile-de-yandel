import type { MissionId } from "@/types/mission";

/** Branche demo client : mission 1 uniquement, journal de bord inaccessible. */
export const DEMO_MISSION_ONE_ONLY = true;

export const DEMO_MAX_MISSION_ID: MissionId = "mission-1";

export const DEMO_JOURNAL_ENABLED = false;

export function isMissionAllowedInDemo(missionId: string): boolean {
  if (!DEMO_MISSION_ONE_ONLY) return true;
  return missionId === DEMO_MAX_MISSION_ID;
}
