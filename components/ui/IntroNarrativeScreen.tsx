"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAudioDescription } from "@/hooks/useAudioDescription";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { NarrativeDialogueLayout } from "@/components/ui/narrative/NarrativeDialogueLayout";
import { NarrativeYandelCharacter } from "@/components/ui/narrative/NarrativeYandelCharacter";
import { getNarrativeSceneLayout } from "@/components/ui/narrative/narrativeSceneLayout";
import { useNarrativeTypewriter } from "@/components/ui/narrative/useNarrativeTypewriter";
import { useResponsive } from "@/hooks/useResponsive";

const INTRO_SLIDES = [
  "Salut à toi jeune aventurier, Je m'appelle Yandel et je vais avoir besoin de ton aide.",
  "Mon avion s'est écrasé sur une île inconnue sans carte et sans moyen de partir. Pour m'aider, tu devras répondre aux questions qui te seront posées.",
  "Bonne chance, aventurier !",
];

const MAP_READ_ALOUD_TEXT =
  "Voici la carte de l'île ! C'est ici que va se dérouler ton aventure. Explore chaque zone pour aider Yandel à construire son radeau.";

interface IntroNarrativeScreenProps {
  onComplete: () => void;
}

export function IntroNarrativeScreen({
  onComplete,
}: IntroNarrativeScreenProps) {
  const { read, cancel, enabled: adEnabled } = useAudioDescription();
  const { audioDescriptionAutoPlay } = useAudioDescriptionStore();

  const [slideIndex, setSlideIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const currentText = INTRO_SLIDES[slideIndex];
  const isLastTextSlide = slideIndex === INTRO_SLIDES.length - 1;

  const { displayedText, isTyping, revealAll } =
    useNarrativeTypewriter(currentText);

  useEffect(() => {
    if (showMap) return;

    if (adEnabled && audioDescriptionAutoPlay) {
      read(currentText);
    }

    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex, showMap]);

  useEffect(() => {
    if (!showMap) return;
    if (adEnabled && audioDescriptionAutoPlay) {
      read(MAP_READ_ALOUD_TEXT);
    }
    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);

  useEffect(() => {
    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isSmallScreen, isMediumScreen, isMobileOrTablet } = useResponsive();
  const scene = getNarrativeSceneLayout({
    isSmallScreen,
    isMediumScreen,
    isMobileOrTablet,
  });

  const handleNext = () => {
    cancel();
    if (showMap) {
      onComplete();
      return;
    }
    if (isTyping) {
      revealAll();
      return;
    }
    if (isLastTextSlide) {
      setShowMap(true);
      return;
    }
    setSlideIndex((prev) => prev + 1);
  };

  if (showMap) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
        style={{
          backgroundImage: "url(/intro/background_sensi_intro.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="mx-auto flex h-dvh w-full items-end justify-center"
          style={{ padding: "0 3% 0 0" }}
        >
          <div
            className="relative w-full max-w-[1600px]"
            style={{ height: scene.sceneHeight }}
          >
            <NarrativeYandelCharacter yandelWidth={scene.yandelWidth} />

            <div
              className="absolute"
              style={{
                left: scene.bubbleLeft,
                top: scene.bubbleTop,
                width: scene.bubbleWidth,
                height: scene.bubbleHeight,
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src="/intro/INTRO_popup_carte.webp"
                  alt="Carte de l’île"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <div className="absolute top-2 right-2 z-10">
                <ReadAloudButton
                  text={MAP_READ_ALOUD_TEXT}
                  ariaLabel="Lire la description de la carte"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="absolute touch-manipulation transition-transform hover:scale-110"
          style={{
            bottom: "clamp(12px, 3vh, 28px)",
            right: "clamp(12px, 3vw, 28px)",
            width: "clamp(56px, 8vw, 96px)",
            height: "clamp(56px, 8vw, 96px)",
          }}
          aria-label="Commencer l'aventure"
        >
          <div className="relative h-full w-full">
            <Image
              src="/ui/icon_next.webp"
              alt="Suivant"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <NarrativeDialogueLayout
      displayedText={displayedText}
      isTyping={isTyping}
      readAloudText={currentText}
      onNext={handleNext}
      nextAriaLabel={isTyping ? "Afficher tout le texte" : "Continuer"}
    />
  );
}
