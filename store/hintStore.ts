"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StepId } from "@/types/step";
import { STORAGE_KEY_HINTS } from "@/lib/constants";

interface HintState {
  usedHints: StepId[];
  hasUsedHint: (stepId: StepId) => boolean;
  markHintAsUsed: (stepId: StepId) => void;
  reset: () => void;
}

export const useHintStore = create<HintState>()(
  persist(
    (set, get) => ({
      usedHints: [],

      hasUsedHint: (stepId) => {
        return get().usedHints.includes(stepId);
      },

      markHintAsUsed: (stepId) => {
        set((state) => ({
          usedHints: state.usedHints.includes(stepId)
            ? state.usedHints
            : [...state.usedHints, stepId],
        }));
      },

      reset: () => set({ usedHints: [] }),
    }),
    {
      name: STORAGE_KEY_HINTS,
    },
  ),
);
