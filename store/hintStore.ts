'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StepId } from '@/types/mission';
import { STORAGE_KEY_HINTS } from '@/lib/constants';

interface HintStore {
  usedHints: StepId[];
  useHint: (stepId: StepId) => void;
  hasUsedHint: (stepId: StepId) => boolean;
  reset: () => void;
}

export const useHintStore = create<HintStore>()(
  persist(
    (set, get) => ({
      usedHints: [],
      
      useHint: (stepId) =>
        set((state) => {
          if (state.usedHints.includes(stepId)) {
            return state;
          }
          return {
            usedHints: [...state.usedHints, stepId],
          };
        }),
      
      hasUsedHint: (stepId) =>
        get().usedHints.includes(stepId),
      
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
