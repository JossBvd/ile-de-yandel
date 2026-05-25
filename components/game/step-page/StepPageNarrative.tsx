"use client";

import { useEffect, useMemo, useState } from "react";
import { Step } from "@/types/step";
import { NarrativeDialogueLayout } from "@/components/ui/narrative/NarrativeDialogueLayout";
import { slidesFromNarrative } from "@/components/ui/narrative/slidesFromNarrative";
import { useNarrativeTypewriter } from "@/components/ui/narrative/useNarrativeTypewriter";

export interface StepPageNarrativeProps {
  step: Step;
  onContinue: () => void;
}

export function StepPageNarrative({ step, onContinue }: StepPageNarrativeProps) {
  const fullText = step.narrative ?? "";
  const slides = useMemo(() => slidesFromNarrative(fullText), [fullText]);
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlideText = slides[slideIndex] ?? "";
  const isLastSlide = slideIndex >= slides.length - 1;

  const { displayedText, isTyping, revealAll } =
    useNarrativeTypewriter(currentSlideText);

  useEffect(() => {
    setSlideIndex(0);
  }, [fullText]);

  const handleNext = () => {
    if (isTyping) {
      revealAll();
      return;
    }
    if (!isLastSlide) {
      setSlideIndex((prev) => prev + 1);
      return;
    }
    onContinue();
  };

  const nextAriaLabel = isTyping
    ? "Afficher tout le texte"
    : !isLastSlide
      ? "Afficher la suite du texte"
      : "Continuer vers l’énigme";

  return (
    <NarrativeDialogueLayout
      title={step.title}
      displayedText={displayedText}
      isTyping={isTyping}
      readAloudText={`${step.title}. ${currentSlideText}`.trim()}
      onNext={handleNext}
      nextAriaLabel={nextAriaLabel}
    />
  );
}
