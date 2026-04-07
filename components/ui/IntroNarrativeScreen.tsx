"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAudioDescription } from "@/hooks/useAudioDescription";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

const INTRO_SLIDES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint.",
];

const TYPING_SPEED_MS = 30;

const MAP_READ_ALOUD_TEXT =
  "Voici la carte de l'île ! C'est ici que va se dérouler ton aventure. Explore chaque zone pour aider Yandel à construire son radeau.";

interface IntroNarrativeScreenProps {
  onComplete: () => void;
}

export function IntroNarrativeScreen({ onComplete }: IntroNarrativeScreenProps) {
  const { read, cancel, enabled: adEnabled } = useAudioDescription();
  const { audioDescriptionAutoPlay } = useAudioDescriptionStore();

  const [slideIndex, setSlideIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  const isLastTextSlide = slideIndex === INTRO_SLIDES.length - 1;

  // Typewriter + auto-play audio
  useEffect(() => {
    if (showMap) return;
    const currentText = INTRO_SLIDES[slideIndex];
    charIndexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);

    if (adEnabled && audioDescriptionAutoPlay) {
      read(currentText);
    }

    function typeNextChar() {
      if (charIndexRef.current < currentText.length) {
        charIndexRef.current++;
        setDisplayedText(currentText.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED_MS);
      } else {
        setIsTyping(false);
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex, showMap]);

  // Auto-play carte
  useEffect(() => {
    if (!showMap) return;
    if (adEnabled && audioDescriptionAutoPlay) {
      read(MAP_READ_ALOUD_TEXT);
    }
    return () => { cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);

  // Annuler l'audio au démontage
  useEffect(() => {
    return () => { cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    cancel();
    if (showMap) {
      onComplete();
      return;
    }
    const currentText = INTRO_SLIDES[slideIndex];
    if (isTyping) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDisplayedText(currentText);
      setIsTyping(false);
      return;
    }
    if (isLastTextSlide) {
      setShowMap(true);
    } else {
      setSlideIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        backgroundImage: "url(/intro/background_sensi_intro.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full h-full flex items-end"
        style={{ padding: "0 3% 0 0" }}
      >
        {/* Personnage Yandel – côté gauche, collé en bas */}
        <div
          className="relative shrink-0 self-end"
          style={{ width: "42%", height: "95%" }}
        >
          <Image
            src="/intro/yandel_crop.webp"
            alt="Yandel, le personnage principal"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom center" }}
            priority
          />
        </div>

        {showMap ? (
          /* Carte de l'île */
          <div
            className="self-center relative"
            style={{
              width: "62%",
              height: "90%",
              marginLeft: "-6%",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/intro/INTRO_popup_carte.webp"
                alt="La carte de l'île de Yandel"
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
        ) : (
          /* Bulle de dialogue – décalée vers la gauche, centrée verticalement */
          <div
            className="self-center relative"
            style={{
              width: "65%",
              height: "82%",
              marginLeft: "-8%",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/intro/bullebd.webp"
                alt=""
                aria-hidden="true"
                fill
                style={{ objectFit: "fill" }}
              />

              {/* Texte dans la bulle – décalé à droite pour éviter la queue */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ padding: "14% 10% 22% 28%" }}
              >
                <p
                  className="font-display text-gray-900 text-center"
                  style={{
                    fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                    lineHeight: 1.55,
                  }}
                >
                  {displayedText}
                  {isTyping && (
                    <span
                      className="inline-block animate-pulse"
                      aria-hidden="true"
                    >
                      ▍
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Bouton lire à voix haute – coin haut-droit de la bulle */}
            <div className="absolute top-[12%] right-[8%] z-10">
              <ReadAloudButton
                text={INTRO_SLIDES[slideIndex]}
                ariaLabel="Lire le texte à voix haute"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bouton suivant – bas droite */}
      <button
        type="button"
        onClick={handleNext}
        className="absolute touch-manipulation hover:scale-110 transition-transform"
        style={{
          bottom: "clamp(12px, 3vh, 28px)",
          right: "clamp(12px, 3vw, 28px)",
          width: "clamp(56px, 8vw, 96px)",
          height: "clamp(56px, 8vw, 96px)",
        }}
        aria-label={showMap ? "Commencer l'aventure" : "Continuer"}
      >
        <div className="relative w-full h-full">
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
