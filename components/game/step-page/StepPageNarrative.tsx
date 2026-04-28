"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Step } from "@/types/step";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

const TYPING_SPEED_MS = 30;
function paginateNarrative(
  text: string,
  maxLinesPerPage: number,
  maxCharsPerLine: number,
): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [""];

  const rawLines = normalized.split("\n").map((line) => line.trim());
  const wrappedLines: string[] = [];

  for (const rawLine of rawLines) {
    if (!rawLine) continue;

    const words = rawLine.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    let currentLine = words[0];

    for (let i = 1; i < words.length; i += 1) {
      const nextWord = words[i];
      const candidate = `${currentLine} ${nextWord}`;

      if (candidate.length <= maxCharsPerLine) {
        currentLine = candidate;
      } else {
        wrappedLines.push(currentLine);
        currentLine = nextWord;
      }
    }

    wrappedLines.push(currentLine);
  }

  const lines = wrappedLines.length > 0 ? wrappedLines : [normalized];
  const pages: string[] = [];

  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    pages.push(lines.slice(i, i + maxLinesPerPage).join("\n"));
  }

  return pages;
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
  isMediumScreen,
  isDesktopSmall: _isDesktopSmall,
  isDesktopMedium: _isDesktopMedium,
  isRotated: _isRotated,
  width: _width,
  height: _height,
  onContinue,
}: StepPageNarrativeProps) {
  const fullText = step.narrative ?? "";
  const maxLinesPerPage = isSmallScreen ? 2 : isMediumScreen ? 3 : 4;
  const maxCharsPerLine = isSmallScreen ? 26 : isMediumScreen ? 34 : 42;
  const pages = useMemo(
    () => paginateNarrative(fullText, maxLinesPerPage, maxCharsPerLine),
    [fullText, maxLinesPerPage, maxCharsPerLine],
  );
  const [pageIndex, setPageIndex] = useState(0);
  const currentPageText = pages[pageIndex] ?? "";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    charIndexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);

    function typeNextChar() {
      if (charIndexRef.current < currentPageText.length) {
        charIndexRef.current += 1;
        setDisplayedText(currentPageText.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED_MS);
      } else {
        setIsTyping(false);
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentPageText]);

  useEffect(() => {
    setPageIndex(0);
  }, [fullText]);

  const handleNext = () => {
    if (isTyping) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDisplayedText(currentPageText);
      setIsTyping(false);
      return;
    }
    if (pageIndex < pages.length - 1) {
      setPageIndex((prev) => prev + 1);
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
          aria-describedby="narrative-text"
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
              className="absolute inset-0 flex items-start justify-center"
              style={{ padding: "14% 10% 22% 28%" }}
            >
              <div
                id="narrative-text"
                className="text-gray-900 text-center w-full overflow-hidden"
                style={{ maxHeight: "100%" }}
              >
                <h2
                  id="narrative-title"
                  className="font-display"
                  style={{
                    fontSize: isSmallScreen
                      ? "clamp(0.9rem, 1.8vw, 1.2rem)"
                      : "clamp(1rem, 2vw, 1.5rem)",
                    lineHeight: 1.35,
                    marginBottom: "clamp(8px, 1.5vh, 16px)",
                  }}
                >
                  {step.title}
                </h2>
                <p
                  className="font-display whitespace-pre-line"
                  style={{
                    fontSize: isSmallScreen
                      ? "clamp(0.8rem, 1.5vw, 1.05rem)"
                      : "clamp(0.9rem, 1.7vw, 1.3rem)",
                    lineHeight: 1.55,
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
              text={`${step.title}. ${currentPageText}`.trim()}
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
            : pageIndex < pages.length - 1
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
