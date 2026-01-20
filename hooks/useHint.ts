'use client';

import { useHintStore } from '@/store/hintStore';
import { StepId } from '@/types/mission';

export function useHint(stepId: StepId) {
  const { useHint, hasUsedHint } = useHintStore();

  const markHintAsUsed = () => {
    useHint(stepId);
  };

  const hintUsed = hasUsedHint(stepId);

  return {
    markHintAsUsed,
    hintUsed,
  };
}
