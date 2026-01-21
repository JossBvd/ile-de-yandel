'use client';

import { useHintStore } from '@/store/hintStore';
import { MissionId } from '@/types/step';

export function useHint(missionId: MissionId) {
  const { useHint, hasUsedHint } = useHintStore();

  const markHintAsUsed = () => {
    useHint(missionId);
  };

  const hintUsed = hasUsedHint(missionId);

  return {
    markHintAsUsed,
    hintUsed,
  };
}
