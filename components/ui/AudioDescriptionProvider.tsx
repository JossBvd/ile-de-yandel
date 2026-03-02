"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import * as audioDescription from "@/lib/accessibility/audioDescription";
import type { AudioDescriptionSpeed } from "@/lib/accessibility/audioDescription";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";

interface AudioDescriptionContextValue {
  isPlaying: boolean;
  isPaused: boolean;
  read: (text: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  setSpeed: (speed: AudioDescriptionSpeed) => void;
  speed: AudioDescriptionSpeed;
  enabled: boolean;
  supported: boolean;
}

const AudioDescriptionContext = createContext<AudioDescriptionContextValue | null>(
  null,
);

export function AudioDescriptionProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPausedState] = useState(false);
  const {
    audioDescriptionEnabled: enabled,
    audioDescriptionSpeed: speed,
    setAudioDescriptionSpeed: setStoreSpeed,
  } = useAudioDescriptionStore();

  const setSpeed = useCallback(
    (s: AudioDescriptionSpeed) => {
      setStoreSpeed(s);
      audioDescription.setRate(s);
    },
    [setStoreSpeed],
  );

  useEffect(() => {
    audioDescription.setRate(speed);
  }, [speed]);

  const read = useCallback(
    (text: string) => {
      if (!enabled || !text.trim()) return;
      audioDescription.speak(text, {
        rate: speed,
        onEnd: () => {
          setIsPlaying(false);
          setIsPausedState(false);
        },
      });
      setIsPlaying(true);
      setIsPausedState(false);
    },
    [enabled, speed],
  );

  const pause = useCallback(() => {
    audioDescription.pause();
    setIsPausedState(true);
  }, []);

  const resume = useCallback(() => {
    audioDescription.resume();
    setIsPausedState(false);
  }, []);

  const cancel = useCallback(() => {
    audioDescription.cancel();
    setIsPlaying(false);
    setIsPausedState(false);
  }, []);

  const value: AudioDescriptionContextValue = {
    isPlaying,
    isPaused,
    read,
    pause,
    resume,
    cancel,
    setSpeed,
    speed,
    enabled,
    supported: audioDescription.isAudioDescriptionSupported(),
  };

  return (
    <AudioDescriptionContext.Provider value={value}>
      {children}
    </AudioDescriptionContext.Provider>
  );
}

export function useAudioDescription(): AudioDescriptionContextValue {
  const ctx = useContext(AudioDescriptionContext);
  if (!ctx) {
    return {
      isPlaying: false,
      isPaused: false,
      read: () => {},
      pause: () => {},
      resume: () => {},
      cancel: () => {},
      setSpeed: () => {},
      speed: 1,
      enabled: false,
      supported: false,
    };
  }
  return ctx;
}
