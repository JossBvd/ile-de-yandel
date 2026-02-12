import { useHintStore } from "@/store/hintStore";
import { StepId } from "@/types/step";

export function useHint(stepId: StepId) {
  const { hasUsedHint, markHintAsUsed } = useHintStore();

  const hintUsed = hasUsedHint(stepId);

  const markAsUsed = () => {
    markHintAsUsed(stepId);
  };

  return {
    hintUsed,
    markAsUsed,
  };
}
