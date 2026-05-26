"use client";

import {
  STORAGE_KEY_PLAYER_PSEUDO,
  STORAGE_KEY_PWA_INSTALL_DISMISSED,
} from "@/lib/constants";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { useGameStore } from "@/store/gameStore";
import { useHintStore } from "@/store/hintStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useReadingAidStore } from "@/store/readingAidStore";
import { useUIStore } from "@/store/uiStore";

/** Réinitialise toute la session de jeu (stores Zustand + clés sessionStorage hors persist). */
export function resetGameSession(): void {
  useGameStore.getState().reset();
  useInventoryStore.getState().reset();
  useHintStore.getState().reset();
  useUIStore.getState().reset();
  useAudioDescriptionStore.getState().reset();
  useReadingAidStore.getState().reset();

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY_PLAYER_PSEUDO);
    sessionStorage.removeItem(STORAGE_KEY_PWA_INSTALL_DISMISSED);
  }
}
