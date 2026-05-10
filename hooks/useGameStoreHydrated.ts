"use client";

import { useSyncExternalStore } from "react";
import { useGameStore } from "@/store/gameStore";

function subscribeHydration(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const api = useGameStore.persist;
  if (api.hasHydrated()) {
    queueMicrotask(cb);
    return () => {};
  }
  return api.onFinishHydration(cb);
}

export function useGameStoreHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useGameStore.persist.hasHydrated(),
    () => false,
  );
}
