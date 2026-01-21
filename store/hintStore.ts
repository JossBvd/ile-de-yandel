'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MissionId } from '@/types/step';
import { STORAGE_KEY_HINTS } from '@/lib/constants';

interface HintStore {
  usedHints: MissionId[];
  useHint: (missionId: MissionId) => void;
  hasUsedHint: (missionId: MissionId) => boolean;
  reset: () => void;
}

export const useHintStore = create<HintStore>()(
  persist(
    (set, get) => ({
      usedHints: [],
      
      useHint: (missionId) =>
        set((state) => {
          if (state.usedHints.includes(missionId)) {
            return state;
          }
          return {
            usedHints: [...state.usedHints, missionId],
          };
        }),
      
      hasUsedHint: (missionId) =>
        get().usedHints.includes(missionId),
      
      reset: () =>
        set({ usedHints: [] }),
    }),
    {
      name: STORAGE_KEY_HINTS,
      partialize: (state) => ({
        usedHints: state.usedHints,
      }),
    }
  )
);
