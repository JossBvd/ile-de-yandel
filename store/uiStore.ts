"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MissionId } from "@/types/mission";

interface UIState {
  viewedMissions: Set<MissionId>;
  raftViewed: boolean;
  journalViewed: boolean;
  lastViewedCompletedMission: MissionId | null;
  markMissionAsViewed: (missionId: MissionId) => void;
  markRaftAsViewed: () => void;
  markJournalAsViewed: () => void;
  setLastViewedCompletedMission: (missionId: MissionId | null) => void;
  reset: () => void;
}

const initialState = {
  viewedMissions: new Set<MissionId>(),
  raftViewed: false,
  journalViewed: false,
  lastViewedCompletedMission: null as MissionId | null,
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...initialState,

      markMissionAsViewed: (missionId) =>
        set((state) => {
          const newSet = new Set(state.viewedMissions);
          newSet.add(missionId);
          return { viewedMissions: newSet };
        }),

      markRaftAsViewed: () => set({ raftViewed: true }),

      markJournalAsViewed: () => set({ journalViewed: true }),

      setLastViewedCompletedMission: (missionId) =>
        set({ lastViewedCompletedMission: missionId }),

      reset: () => set(initialState),
    }),
    {
      name: "escape_game_ui",
      partialize: (state) => ({
        viewedMissions: Array.from(state.viewedMissions),
        raftViewed: state.raftViewed,
        journalViewed: state.journalViewed,
        lastViewedCompletedMission: state.lastViewedCompletedMission,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.viewedMissions)) {
          state.viewedMissions = new Set(state.viewedMissions);
        }
      },
    },
  ),
);
