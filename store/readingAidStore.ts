"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEY_READING_AID } from "@/lib/constants";

interface ReadingAidState {
  readingAidEnabled: boolean;
  readingAidFirstVisitDone: boolean;
  /** Flag dédié au workflow intro d'accueil (AD + DYS), indépendant du flag AD historique) */
  introWorkflowDone: boolean;
  setReadingAidEnabled: (enabled: boolean) => void;
  setReadingAidFirstVisitDone: (done: boolean) => void;
  setFirstVisitChoice: (enabled: boolean) => void;
  setIntroWorkflowDone: (done: boolean) => void;
  reset: () => void;
}

const initialState = {
  readingAidEnabled: false,
  readingAidFirstVisitDone: false,
  introWorkflowDone: false,
};

export const useReadingAidStore = create<ReadingAidState>()(
  persist(
    (set) => ({
      ...initialState,
      setReadingAidEnabled: (enabled) => set({ readingAidEnabled: enabled }),
      setReadingAidFirstVisitDone: (done) =>
        set({ readingAidFirstVisitDone: done }),
      setFirstVisitChoice: (enabled) =>
        set({
          readingAidEnabled: enabled,
          readingAidFirstVisitDone: true,
        }),
      setIntroWorkflowDone: (done) => set({ introWorkflowDone: done }),
      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEY_READING_AID,
      partialize: (state) => ({
        readingAidEnabled: state.readingAidEnabled,
        readingAidFirstVisitDone: state.readingAidFirstVisitDone,
        introWorkflowDone: state.introWorkflowDone,
      }),
    },
  ),
);
