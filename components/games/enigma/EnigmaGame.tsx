"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Step, EnigmaGameData } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";
import { logDebug } from "@/lib/utils/logger";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

interface EnigmaGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  questionContainerVisible?: boolean;
}

export function EnigmaGame({
  step,
  onComplete,
  questionContainerVisible = true,
}: EnigmaGameProps) {
  const game = step.game as EnigmaGameData;
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
  } = useResponsive();
  const [answer, setAnswer] = useState("");
  const [hasError, setHasError] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const viewportHeight = "var(--app-viewport-height)";
  const decodeLetterImages = game.decodeLetterImages ?? [];
  const isLetterDecode =
    game.layout === "letter-decode" && decodeLetterImages.length > 0;
  const isStackedLayout = game.layout === "stacked";
  const hasBackgroundHintZones = Boolean(
    step.backgroundHintZones && step.backgroundHintZones.length > 0,
  );
  const letterCount = isLetterDecode ? decodeLetterImages.length : 0;
  const [decodedLetters, setDecodedLetters] = useState<string[]>(() =>
    letterCount > 0 ? Array(letterCount).fill("") : [],
  );
  const [lockedDecodedLetters, setLockedDecodedLetters] = useState<boolean[]>(
    () => (letterCount > 0 ? Array(letterCount).fill(false) : []),
  );
  const decodedInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const normalizeForComparison = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (game.accentSensitive) {
      return normalized;
    }
    return normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedAnswer = normalizeForComparison(answer);
    const normalizedCorrect = normalizeForComparison(game.correctAnswer);

    if (normalizedAnswer === normalizedCorrect) {
      setHasError(false);
      setShowRedFlash(false);
      logDebug("✅ Réponse correcte !");
      onComplete();
    } else {
      logDebug("❌ Mauvaise réponse");
      setHasError(true);
      setShowRedFlash(true);
    }
  };

  const handleDecodedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCorrect = normalizeForComparison(game.correctAnswer);
    const nextLocked = lockedDecodedLetters.map((locked, index) => {
      if (locked) return true;
      const normalizedLetter = normalizeForComparison(decodedLetters[index] ?? "");
      const expectedLetter = normalizedCorrect[index] ?? "";
      return normalizedLetter === expectedLetter;
    });

    const nextLetters = decodedLetters.map((letter, index) =>
      nextLocked[index] ? letter : "",
    );
    setLockedDecodedLetters(nextLocked);
    setDecodedLetters(nextLetters);

    const isAllCorrect = nextLetters.every((letter) => letter !== "");
    if (isAllCorrect) {
      setHasError(false);
      setShowRedFlash(false);
      logDebug("✅ Réponse correcte !");
      onComplete();
    } else {
      logDebug("❌ Mauvaise réponse");
      setHasError(true);
      setShowRedFlash(true);
    }
  };

  useEffect(() => {
    if (!showRedFlash) return;
    const t = setTimeout(() => setShowRedFlash(false), 200);
    return () => clearTimeout(t);
  }, [showRedFlash]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (hasError) setHasError(false);
  };

  const handleDecodedLetterChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (lockedDecodedLetters[index]) return;
    const value = e.target.value.slice(-1);
    setDecodedLetters((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (hasError) setHasError(false);

    if (value && index < decodedLetters.length - 1) {
      decodedInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDecodedLetterKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (lockedDecodedLetters[index]) return;
    if (e.key === "Backspace" && !decodedLetters[index] && index > 0) {
      decodedInputRefs.current[index - 1]?.focus();
    }
  };

  if (isLetterDecode) {
    return (
      <>
        <div
          aria-hidden
          className={`fixed inset-0 z-100 pointer-events-none transition-opacity duration-150 ${
            showRedFlash ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "rgba(180, 0, 0, 0.35)",
            boxShadow: "inset 0 0 80px 20px rgba(200, 0, 0, 0.2)",
          }}
        />
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{
            padding: isSmallScreen
              ? "8px"
              : isMediumScreen
                ? "12px"
                : isDesktopSmall
                  ? "16px"
                  : "24px",
          }}
        >
          <div
            className="flex flex-col items-center justify-center pointer-events-auto"
            style={{
              gap: isSmallScreen ? "10px" : isMediumScreen ? "12px" : "16px",
              width: isSmallScreen ? "90%" : isMediumScreen ? "84%" : "78%",
              maxWidth: isSmallScreen ? "90%" : isMediumScreen ? "84%" : "78%",
            }}
          >
            {questionContainerVisible && (
              <div
                className="rounded-[1.25rem] flex flex-col pointer-events-auto border border-amber-900/50 bg-[#f5f0e6] bg-auto bg-center bg-no-repeat w-full"
                style={{
                  backgroundImage: "url(/backgrounds/paper_texture.webp)",
                  boxShadow:
                    "0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,90,43,0.2)",
                  padding: isMobileOrTablet
                    ? isSmallScreen
                      ? "14px"
                      : "16px"
                    : isDesktopSmall
                      ? "18px"
                      : isDesktopMedium
                        ? "22px"
                        : "26px",
                }}
                role="region"
                aria-label="Énoncé de l'énigme"
              >
                <div className="flex flex-row items-start gap-2 w-full">
                  <p
                    className="flex-1 min-w-0 text-gray-800 italic font-display whitespace-pre-line text-center"
                    style={{
                      fontSize: isMobileOrTablet
                        ? isSmallScreen
                          ? "1rem"
                          : "1.0625rem"
                        : isDesktopSmall
                          ? "1.125rem"
                          : "1.375rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {game.text}
                  </p>
                  <ReadAloudButton
                    text={game.text}
                    ariaLabel="Lire l'énigme"
                    className="shrink-0"
                  />
                </div>
              </div>
            )}

            <div
              className="rounded-[1.25rem] flex flex-col pointer-events-auto border border-amber-900/50 bg-[#f5f0e6] bg-auto bg-center bg-no-repeat w-full"
              style={{
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,90,43,0.2)",
                padding: isMobileOrTablet
                  ? isSmallScreen
                    ? "12px"
                    : "14px"
                  : isDesktopSmall
                    ? "16px"
                    : isDesktopMedium
                      ? "18px"
                      : "22px",
                gap: isSmallScreen ? "10px" : isMediumScreen ? "12px" : "16px",
              }}
            >
              <form
                onSubmit={handleDecodedSubmit}
                className="flex items-center justify-center"
                style={{
                  flexDirection: "row",
                  gap: isSmallScreen
                    ? "8px"
                    : isMediumScreen
                      ? "12px"
                      : isDesktopSmall
                        ? "16px"
                        : "20px",
                }}
                aria-label="Formulaire de réponse à l'énigme"
              >
                <div
                  className="grid justify-items-center items-center"
                  style={{
                    gap: isSmallScreen ? 4 : 6,
                    gridTemplateColumns: `repeat(${decodeLetterImages.length}, minmax(0, 1fr))`,
                  }}
                >
                  {decodeLetterImages.map((src, index) => (
                    <div
                      key={`decoded-cell-${index}`}
                      className="flex flex-col items-center"
                      style={{ gap: isSmallScreen ? 4 : 6 }}
                    >
                      <div
                        className="relative overflow-hidden rounded-md border border-white/50 bg-black/10"
                        style={{
                          width: isSmallScreen
                            ? 42
                            : isMediumScreen
                              ? 48
                              : isDesktopSmall
                                ? 64
                                : 72,
                          height: isSmallScreen
                            ? 42
                            : isMediumScreen
                              ? 48
                              : isDesktopSmall
                                ? 64
                                : 72,
                        }}
                        aria-label={`Lettre ${index + 1}`}
                      >
                        <Image
                          src={src}
                          alt={`Lettre ${index + 1}`}
                          fill
                          className="object-contain"
                          draggable={false}
                        />
                      </div>
                      <input
                        ref={(node) => {
                          decodedInputRefs.current[index] = node;
                        }}
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        value={decodedLetters[index]}
                        onChange={(e) => handleDecodedLetterChange(index, e)}
                        onKeyDown={(e) => handleDecodedLetterKeyDown(index, e)}
                        maxLength={1}
                        disabled={lockedDecodedLetters[index]}
                        aria-label={`Saisir la lettre ${index + 1}`}
                        aria-invalid={hasError}
                        className={`rounded border text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 touch-manipulation transition-colors disabled:opacity-100 ${
                          lockedDecodedLetters[index]
                            ? "bg-green-100 border-green-600"
                            : hasError
                              ? "bg-red-50 border-red-600"
                              : "bg-white border-gray-800"
                        }`}
                        style={{
                          width: isSmallScreen
                            ? "36px"
                            : isMediumScreen
                              ? "42px"
                              : isDesktopSmall
                                ? "58px"
                                : "64px",
                          height: isSmallScreen
                            ? "36px"
                            : isMediumScreen
                              ? "42px"
                              : isDesktopSmall
                                ? "58px"
                                : "64px",
                          fontSize: isSmallScreen
                            ? "1rem"
                            : isMediumScreen
                              ? "1.125rem"
                              : isDesktopSmall
                                ? "1.25rem"
                                : "1.375rem",
                          textTransform: "uppercase",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={decodedLetters.some((letter) => !letter.trim())}
                  className="shrink-0 rounded-full bg-transparent hover:opacity-90 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                  aria-label="Envoyer"
                  style={{
                    width: isSmallScreen
                      ? "48px"
                      : isMediumScreen
                        ? "56px"
                        : isDesktopSmall
                          ? "80px"
                          : "88px",
                    height: isSmallScreen
                      ? "48px"
                      : isMediumScreen
                        ? "56px"
                        : isDesktopSmall
                          ? "80px"
                          : "88px",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                >
                  <Image
                    src="/ui/icon_bottle_send.webp"
                    alt=""
                    width={144}
                    height={144}
                    className="w-full h-full object-contain"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        aria-hidden
        className={`fixed inset-0 z-100 pointer-events-none transition-opacity duration-150 ${
          showRedFlash ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "rgba(180, 0, 0, 0.35)",
          boxShadow: "inset 0 0 80px 20px rgba(200, 0, 0, 0.2)",
        }}
      />
      {questionContainerVisible &&
        (isStackedLayout ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{
              padding: isSmallScreen
                ? "8px"
                : isMediumScreen
                  ? "12px"
                  : isDesktopSmall
                    ? "16px"
                    : "24px",
            }}
          >
            <div
              className="flex flex-col items-center justify-center pointer-events-auto gap-4"
              style={{
              gap: isSmallScreen ? "12px" : isMediumScreen ? "16px" : "20px",
              width: isSmallScreen ? "84%" : isMediumScreen ? "78%" : "70%",
              maxWidth: isSmallScreen ? "84%" : isMediumScreen ? "78%" : "70%",
              }}
            >
              <div
                className="rounded-[1.25rem] flex flex-col pointer-events-auto overflow-y-auto scrollbar-hide border border-amber-900/50 bg-[#f5f0e6] bg-auto bg-center bg-no-repeat w-full"
                style={{
                  backgroundImage: "url(/backgrounds/paper_texture.webp)",
                  boxShadow:
                    "0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,90,43,0.2)",
                  padding: isMobileOrTablet
                    ? isSmallScreen
                      ? "22px"
                      : "26px"
                    : isDesktopSmall
                      ? "28px"
                      : isDesktopMedium
                        ? "34px"
                        : "40px",
                  maxHeight: `calc(${viewportHeight} * 0.6)`,
                }}
                role="region"
                aria-label="Énoncé de l'énigme"
              >
                <div className="flex flex-row items-start gap-2 w-full">
                  <div
                    className="flex-1 min-w-0 flex flex-col items-center text-center"
                    style={{ gap: isSmallScreen ? "10px" : "12px" }}
                  >
                    {(() => {
                      const parts = game.text.split(/\n\n/).filter(Boolean);
                      const textSizeDisplay = isMobileOrTablet
                        ? isSmallScreen
                          ? "1rem"
                          : "1.0625rem"
                        : isDesktopSmall
                          ? "1.125rem"
                          : isDesktopMedium
                            ? "1.25rem"
                            : "1.375rem";
                      const sentenceQuoteDisplay = isMobileOrTablet
                        ? isSmallScreen
                          ? "1.0625rem"
                          : "1.125rem"
                        : isDesktopSmall
                          ? "1.125rem"
                          : isDesktopMedium
                            ? "1.25rem"
                            : "1.375rem";
                      const sentenceBodySize = isMobileOrTablet
                        ? isSmallScreen
                          ? "1.125rem"
                          : "1.1875rem"
                        : isDesktopSmall
                          ? "1.25rem"
                          : isDesktopMedium
                            ? "1.375rem"
                            : "1.5rem";
                      if (parts.length === 0)
                        return (
                          <p
                            className="text-gray-800 italic font-display w-full"
                            style={{ fontSize: sentenceQuoteDisplay, lineHeight: 1.4 }}
                          >
                            « {game.text} »
                          </p>
                        );
                      return (
                        <>
                          <p
                            className="text-gray-800 leading-tight italic font-display w-full"
                            style={{ fontSize: textSizeDisplay, lineHeight: 1.4 }}
                          >
                            {parts[0]}
                          </p>
                          {parts.slice(1).map((paragraph, i) => (
                            <p
                              key={i}
                              className="text-gray-800 font-semibold leading-tight w-full whitespace-pre-line"
                              style={{
                                fontSize: sentenceBodySize,
                                lineHeight: 1.5,
                              }}
                            >
                              {paragraph}
                            </p>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                  <ReadAloudButton
                    text={game.text}
                    ariaLabel="Lire l'énigme"
                    className="shrink-0"
                  />
                </div>
              </div>
              <div
                className="rounded-[1.25rem] flex flex-row items-center pointer-events-auto border border-amber-900/50 bg-[#f5f0e6] bg-auto bg-center bg-no-repeat w-full"
                style={{
                  backgroundImage: "url(/backgrounds/paper_texture.webp)",
                  boxShadow:
                    "0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,90,43,0.2)",
                  padding: isMobileOrTablet
                    ? isSmallScreen
                      ? "12px 14px"
                      : "14px 16px"
                    : isDesktopSmall
                      ? "14px 18px"
                      : isDesktopMedium
                        ? "18px 22px"
                        : "20px 26px",
                  gap: isSmallScreen
                    ? "12px"
                    : isMediumScreen
                      ? "16px"
                      : "22px",
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-row items-center flex-1 min-w-0"
                  style={{
                    gap: isSmallScreen
                      ? "16px"
                      : isMediumScreen
                        ? "20px"
                        : "28px",
                  }}
                  aria-label="Formulaire de réponse à l'énigme"
                >
                  <label htmlFor="enigma-answer-m2" className="sr-only">
                    Votre réponse à l&apos;énigme
                  </label>
                  {hasError && (
                    <span id="enigma-error-m2" role="alert" className="sr-only">
                      Réponse incorrecte. Saisissez une autre réponse.
                    </span>
                  )}
                  <input
                    id="enigma-answer-m2"
                    type="text"
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="Champ réponse"
                    autoComplete="off"
                    name={`enigma-answer-${step.id}`}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? "enigma-error-m2" : undefined}
                    className={`flex-1 min-w-0 rounded-lg border border-gray-800 bg-white text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 touch-manipulation transition-colors ${hasError ? "bg-red-50 border-red-600" : ""}`}
                    style={{
                      paddingLeft: isSmallScreen
                        ? "14px"
                        : isMediumScreen
                          ? "16px"
                          : "20px",
                      paddingRight: isSmallScreen
                        ? "14px"
                        : isMediumScreen
                          ? "16px"
                          : "20px",
                      paddingTop: isSmallScreen ? "12px" : "14px",
                      paddingBottom: isSmallScreen ? "12px" : "14px",
                      fontSize: isSmallScreen
                        ? "0.9375rem"
                        : isMediumScreen
                          ? "1rem"
                          : "1.125rem",
                      minHeight: isMobileOrTablet ? "44px" : "48px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!answer.trim()}
                    className="shrink-0 rounded-full bg-transparent hover:opacity-90 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                    aria-label="Envoyer"
                    style={{
                      width: isSmallScreen
                        ? "48px"
                        : isMediumScreen
                          ? "56px"
                          : isDesktopSmall
                            ? "80px"
                            : isDesktopMedium
                              ? "88px"
                              : "96px",
                      height: isSmallScreen
                        ? "48px"
                        : isMediumScreen
                          ? "56px"
                          : isDesktopSmall
                            ? "80px"
                            : isDesktopMedium
                              ? "88px"
                              : "96px",
                      minWidth: "48px",
                      minHeight: "48px",
                    }}
                  >
                    <Image
                      src="/ui/icon_bottle_send.webp"
                      alt=""
                      width={144}
                      height={144}
                      className="w-full h-full object-contain"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="absolute left-0 right-0 z-10 pointer-events-none"
            style={{
              top: isSmallScreen
                ? "8px"
                : isMediumScreen
                  ? "12px"
                  : isDesktopSmall
                    ? "16px"
                    : "24px",
              paddingLeft: isSmallScreen
                ? "8px"
                : isMediumScreen
                  ? "12px"
                  : isDesktopSmall
                    ? "16px"
                    : "24px",
              paddingRight: isSmallScreen
                ? "8px"
                : isMediumScreen
                  ? "12px"
                  : isDesktopSmall
                    ? "16px"
                    : "24px",
              maxHeight:
                hasBackgroundHintZones && isMobileOrTablet
                  ? "24%"
                  : hasBackgroundHintZones
                    ? "33.333%"
                    : `calc(${viewportHeight} * 0.33)`,
            }}
          >
            <div
              className="rounded-xl shadow-xl border-2 border-amber-800/30 flex flex-col pointer-events-auto bg-cover bg-center bg-no-repeat w-full max-h-full overflow-y-auto"
              style={{
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                padding: isMobileOrTablet
                  ? isSmallScreen
                    ? "8px 10px"
                    : "10px 12px"
                  : isDesktopSmall
                    ? "16px"
                    : isDesktopMedium
                      ? "20px"
                      : "24px",
                gap: isMobileOrTablet
                  ? isSmallScreen
                    ? "8px"
                    : "10px"
                  : isDesktopSmall
                    ? "12px"
                    : "16px",
              }}
            >
              <div
                className="flex flex-row items-center gap-2"
                style={{
                  gap: isMobileOrTablet
                    ? isSmallScreen
                      ? "8px"
                      : "10px"
                    : isDesktopSmall
                      ? "16px"
                      : isDesktopMedium
                        ? "20px"
                        : "24px",
                }}
              >
                <div
                  className="flex-1 min-w-0 flex flex-col"
                  style={{ gap: isMobileOrTablet ? "2px" : "4px" }}
                  role="region"
                  aria-label="Énoncé de l'énigme"
                >
                  {(() => {
                    const [instruction, sentence] = game.text.split(/\n\n/, 2);
                    const hasTwoParts = sentence !== undefined;
                    const textSize = isMobileOrTablet
                      ? isSmallScreen
                        ? "0.875rem"
                        : "0.9375rem"
                      : isDesktopSmall
                        ? "1rem"
                        : isDesktopMedium
                          ? "1.125rem"
                          : "1.25rem";
                    const titleSize = isMobileOrTablet
                      ? isSmallScreen
                        ? "0.875rem"
                        : "1rem"
                      : isDesktopSmall
                        ? "1.125rem"
                        : "1.25rem";
                    const sentenceSize = isMobileOrTablet
                      ? isSmallScreen
                        ? "1rem"
                        : "1.0625rem"
                      : isDesktopSmall
                        ? "1.125rem"
                        : isDesktopMedium
                          ? "1.25rem"
                          : "1.375rem";
                    return hasTwoParts ? (
                      <>
                        <p
                          className="text-gray-800 leading-tight font-bold"
                          style={{ fontSize: textSize, lineHeight: 1.4 }}
                        >
                          {instruction}
                        </p>
                        <p
                          className="text-gray-800 leading-tight italic font-display"
                          style={{ fontSize: sentenceSize, lineHeight: 1.4 }}
                        >
                          {sentence}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2
                          className="text-gray-900 uppercase tracking-wide font-bold leading-tight"
                          style={{ fontSize: titleSize, lineHeight: 1.3 }}
                        >
                          Énigme
                        </h2>
                        <p
                          className="text-gray-800 leading-tight italic font-display"
                          style={{ fontSize: sentenceSize, lineHeight: 1.4 }}
                        >
                          « {game.text} »
                        </p>
                      </>
                    );
                  })()}
                </div>

                <ReadAloudButton
                  text={game.text}
                  ariaLabel="Lire l'énigme"
                  className="shrink-0"
                />

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-row items-center shrink-0"
                  style={{
                    gap: isSmallScreen
                      ? "8px"
                      : isMediumScreen
                        ? "12px"
                        : isDesktopSmall
                          ? "16px"
                          : isDesktopMedium
                            ? "20px"
                            : "24px",
                  }}
                  aria-label="Formulaire de réponse à l'énigme"
                >
                  <label htmlFor="enigma-answer" className="sr-only">
                    Votre réponse à l&apos;énigme
                  </label>
                  {hasError && (
                    <span id="enigma-error" role="alert" className="sr-only">
                      Réponse incorrecte. Saisissez une autre réponse.
                    </span>
                  )}
                  <input
                    id="enigma-answer"
                    type="text"
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="Réponse"
                    autoComplete="off"
                    name={`enigma-answer-${step.id}`}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? "enigma-error" : undefined}
                    className={`rounded border-2 text-gray-900 placeholder-gray-500 focus:outline-none touch-manipulation transition-colors ${
                      hasError
                        ? "bg-red-100 border-red-500 focus:border-red-600"
                        : "bg-white border-gray-800 focus:border-amber-600"
                    }`}
                    style={{
                      width: isSmallScreen
                        ? "100px"
                        : isMediumScreen
                          ? "120px"
                          : isDesktopSmall
                            ? "160px"
                            : isDesktopMedium
                              ? "180px"
                              : "200px",
                      paddingLeft: isSmallScreen
                        ? "8px"
                        : isMediumScreen
                          ? "10px"
                          : isDesktopSmall
                            ? "16px"
                            : "18px",
                      paddingRight: isSmallScreen
                        ? "8px"
                        : isMediumScreen
                          ? "10px"
                          : isDesktopSmall
                            ? "16px"
                            : "18px",
                      paddingTop: isSmallScreen
                        ? "10px"
                        : isMediumScreen
                          ? "12px"
                          : isDesktopSmall
                            ? "16px"
                            : "18px",
                      paddingBottom: isSmallScreen
                        ? "10px"
                        : isMediumScreen
                          ? "12px"
                          : isDesktopSmall
                            ? "16px"
                            : "18px",
                      fontSize: isSmallScreen
                        ? "0.8125rem"
                        : isMediumScreen
                          ? "0.875rem"
                          : isDesktopSmall
                            ? "1.125rem"
                            : "1.25rem",
                      minHeight: isMobileOrTablet ? "40px" : "44px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!answer.trim()}
                    className="shrink-0 rounded-full bg-transparent hover:opacity-90 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                    aria-label="Envoyer"
                    style={{
                      width: isSmallScreen
                        ? "48px"
                        : isMediumScreen
                          ? "56px"
                          : isDesktopSmall
                            ? "80px"
                            : isDesktopMedium
                              ? "88px"
                              : "96px",
                      height: isSmallScreen
                        ? "48px"
                        : isMediumScreen
                          ? "56px"
                          : isDesktopSmall
                            ? "80px"
                            : isDesktopMedium
                              ? "88px"
                              : "96px",
                      minWidth: "48px",
                      minHeight: "48px",
                    }}
                  >
                    <Image
                      src="/ui/icon_bottle_send.webp"
                      alt=""
                      width={144}
                      height={144}
                      className="w-full h-full object-contain"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
