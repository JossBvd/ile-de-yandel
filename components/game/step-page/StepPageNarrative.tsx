"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Step } from "@/types/step";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

const TYPING_SPEED_MS = 30;

/** Même découpage que l’historique données : doubles sauts → blocs distincts ; retours à la ligne simple → espaces */
function normalizeNarrativeParagraphs(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [""];

  return normalized.split(/\n\n+/).map((block) =>
    block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " "),
  );
}

function slidesFromNarrative(raw: string): string[] {
  const parts = normalizeNarrativeParagraphs(raw);
  if (parts.length === 1 && parts[0] === "") return [""];
  const nonEmpty = parts.map((p) => p.trim()).filter(Boolean);
  return nonEmpty.length > 0 ? nonEmpty : [""];
}

export interface StepPageNarrativeProps {
  step: Step;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isDesktopSmall: boolean;
  isDesktopMedium: boolean;
  isRotated: boolean;
  width: number;
  height: number;
  onContinue: () => void;
}

export function StepPageNarrative({
  step,
  isSmallScreen,
  onContinue,
}: StepPageNarrativeProps) {
  const fullText = step.narrative ?? "";
  const slides = useMemo(() => slidesFromNarrative(fullText), [fullText]);
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlideText = slides[slideIndex] ?? "";
  const isLastSlide = slideIndex >= slides.length - 1;

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [fullText]);

  useEffect(() => {
    charIndexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);

    function typeNextChar() {
      if (charIndexRef.current < currentSlideText.length) {
        charIndexRef.current += 1;
        setDisplayedText(currentSlideText.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED_MS);
      } else {
        setIsTyping(false);
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlideText]);

  const handleNext = () => {
    if (isTyping) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDisplayedText(currentSlideText);
      setIsTyping(false);
      return;
    }
    if (!isLastSlide) {
      setSlideIndex((prev) => prev + 1);
      return;
    }
    onContinue();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
      style={{
        backgroundImage: "url(/intro/background_sensi_intro.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full h-dvh flex items-end" style={{ padding: "0 3% 0 0" }}>
        <div
          className="relative shrink-0 self-end"
          style={{ width: "42%", height: "95%" }}
        >
          <Image
            src="/intro/yondel_crop.webp"
            alt="Yondel, le personnage principal"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom center" }}
            priority
          />
        </div>

        <div
          role="region"
          aria-labelledby="narrative-title"
          aria-describedby="narrative-text-body"
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
              priority
            />

            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ padding: "14% 10% 22% 28%" }}
            >
              <div
                id="narrative-text"
                className="flex w-full max-h-full min-h-0 flex-col items-center gap-[clamp(6px,1.5vh,14px)] overflow-y-auto scrollbar-hide text-gray-900"
              >
                <h2
                  id="narrative-title"
                  className="font-display shrink-0 text-center"
                  style={{
                    fontSize: isSmallScreen
                      ? "clamp(0.9rem, 1.8vw, 1.2rem)"
                      : "clamp(1rem, 2vw, 1.5rem)",
                    lineHeight: 1.35,
                  }}
                >
                  {step.title}
                </h2>
                <p
                  id="narrative-text-body"
                  lang="fr"
                  className="font-display w-full shrink-0 text-center text-pretty hyphens-none"
                  style={{
                    fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)",
                    lineHeight: 1.35,
                  }}
                >
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block animate-pulse" aria-hidden="true">
                      ▍
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-[12%] right-[8%] z-10">
            <ReadAloudButton
              text={`${step.title}. ${currentSlideText}`.trim()}
              ariaLabel="Lire le texte"
            />
          </div>
        </div>
      </div>

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
        aria-label={
          isTyping
            ? "Afficher tout le texte"
            : !isLastSlide
              ? "Afficher la suite du texte"
              : "Continuer vers l’énigme"
        }
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
