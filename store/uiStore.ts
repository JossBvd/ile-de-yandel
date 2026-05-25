"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MissionId } from "@/types/mission";

interface UIState {
  viewedMissions: Set<MissionId>;
  viewedRaftMissions: Set<MissionId>;
  journalViewed: boolean;
  lastViewedCompletedMission: MissionId | null;
  markMissionAsViewed: (missionId: MissionId) => void;
  markRaftMissionAsViewed: (missionId: MissionId) => void;
  markJournalAsViewed: () => void;
  setLastViewedCompletedMission: (missionId: MissionId | null) => void;
  reset: () => void;
}

const initialState = {
  viewedMissions: new Set<MissionId>(),
  viewedRaftMissions: new Set<MissionId>(),
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

      markRaftMissionAsViewed: (missionId) =>
        set((state) => {
          const newSet = new Set(state.viewedRaftMissions);
          newSet.add(missionId);
          return { viewedRaftMissions: newSet };
        }),

      markJournalAsViewed: () => set({ journalViewed: true }),

      setLastViewedCompletedMission: (missionId) =>
        set({ lastViewedCompletedMission: missionId }),

      reset: () => set(initialState),
    }),
    {
      name: "escape_game_ui",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        viewedMissions: Array.from(state.viewedMissions),
        viewedRaftMissions: Array.from(state.viewedRaftMissions),
        journalViewed: state.journalViewed,
        lastViewedCompletedMission: state.lastViewedCompletedMission,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (Array.isArray(state.viewedMissions)) {
          state.viewedMissions = new Set(state.viewedMissions);
        }
        if (Array.isArray(state.viewedRaftMissions)) {
          state.viewedRaftMissions = new Set(state.viewedRaftMissions);
        } else {
          state.viewedRaftMissions = new Set();
        }
      },
    },
  ),
);
