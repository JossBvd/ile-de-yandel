"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEY_AUDIO_DESCRIPTION } from "@/lib/constants";

export type AudioDescriptionSpeed = 0.5 | 1 | 1.5 | 2;

interface AudioDescriptionState {
  audioDescriptionEnabled: boolean;
  audioDescriptionFirstVisitDone: boolean;
  audioDescriptionAutoPlay: boolean;
  audioDescriptionSpeed: AudioDescriptionSpeed;
  setAudioDescriptionEnabled: (enabled: boolean) => void;
  setAudioDescriptionFirstVisitDone: (done: boolean) => void;
  setAudioDescriptionAutoPlay: (autoPlay: boolean) => void;
  setAudioDescriptionSpeed: (speed: AudioDescriptionSpeed) => void;
  setFirstVisitChoice: (enabled: boolean) => void;
  reset: () => void;
}

const initialState = {
  audioDescriptionEnabled: false,
  audioDescriptionFirstVisitDone: false,
  audioDescriptionAutoPlay: false,
  audioDescriptionSpeed: 1 as AudioDescriptionSpeed,
};

export const useAudioDescriptionStore = create<AudioDescriptionState>()(
  persist(
    (set) => ({
      ...initialState,
      setAudioDescriptionEnabled: (enabled) =>
        set({ audioDescriptionEnabled: enabled }),
      setAudioDescriptionFirstVisitDone: (done) =>
        set({ audioDescriptionFirstVisitDone: done }),
      setAudioDescriptionAutoPlay: (autoPlay) =>
        set({ audioDescriptionAutoPlay: autoPlay }),
      setAudioDescriptionSpeed: (speed) =>
        set({ audioDescriptionSpeed: speed }),
      setFirstVisitChoice: (enabled) =>
        set({
          audioDescriptionEnabled: enabled,
          audioDescriptionFirstVisitDone: true,
        }),
      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEY_AUDIO_DESCRIPTION,
      partialize: (state) => ({
        audioDescriptionEnabled: state.audioDescriptionEnabled,
        audioDescriptionFirstVisitDone: state.audioDescriptionFirstVisitDone,
        audioDescriptionAutoPlay: state.audioDescriptionAutoPlay,
        audioDescriptionSpeed: state.audioDescriptionSpeed,
      }),
    },
  ),
);
