"use client";

import { useEffect, useState } from "react";
import { useAudioDescription } from "@/hooks/useAudioDescription";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { NarrativeDialogueLayout } from "@/components/ui/narrative/NarrativeDialogueLayout";
import { formatYandelDialogue } from "@/components/ui/narrative/formatYandelDialogue";
import { useNarrativeTypewriter } from "@/components/ui/narrative/useNarrativeTypewriter";

const OUTRO_BACKGROUND = "/outro/background_end.jpeg";

const OUTRO_SLIDES = [
  "Je me suis crashé sur cette île sans savoir si je pourrais un jour en repartir. J'étais perdu, seul face à de nombreuses énigmes et obstacles.",
  "Mais grâce à toi, j'ai trouvé la force de continuer et de ne jamais abandonner. Tu m'as aidé à résoudre chaque énigme et à avancer pas à pas vers la liberté.",
  "Cette aventure captivante restera gravée dans ma mémoire.",
  "Aujourd'hui, je quitte enfin cette île… et c'est grâce à toi.",
  "Mais ce n'est peut-être pas la fin… une autre histoire commence peut-être déjà quelque part. Merci d'avoir joué, et merci de m'avoir aidé.",
].map(formatYandelDialogue);

interface OutroNarrativeScreenProps {
  onComplete: () => void;
}

export function OutroNarrativeScreen({ onComplete }: OutroNarrativeScreenProps) {
  const { read, cancel, enabled: adEnabled } = useAudioDescription();
  const { audioDescriptionAutoPlay } = useAudioDescriptionStore();
  const [slideIndex, setSlideIndex] = useState(0);
  const currentText = OUTRO_SLIDES[slideIndex];
  const isLastSlide = slideIndex === OUTRO_SLIDES.length - 1;

  const { displayedText, isTyping, revealAll } =
    useNarrativeTypewriter(currentText);

  useEffect(() => {
    if (adEnabled && audioDescriptionAutoPlay) {
      read(currentText);
    }
    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex]);

  useEffect(() => {
    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    cancel();
    if (isTyping) {
      revealAll();
      return;
    }
    if (isLastSlide) {
      onComplete();
      return;
    }
    setSlideIndex((prev) => prev + 1);
  };

  return (
    <NarrativeDialogueLayout
      displayedText={displayedText}
      isTyping={isTyping}
      readAloudText={currentText}
      onNext={handleNext}
      nextAriaLabel={
        isTyping
          ? "Afficher tout le texte"
          : isLastSlide
            ? "Terminer"
            : "Continuer"
      }
      backgroundImageUrl={OUTRO_BACKGROUND}
    />
  );
}
