"use client";

import React, { useState, useEffect } from "react";
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

  const isStep1 = step.id.endsWith("-step-1");
  const isMission2Step1 = step.id === "mission-2-step-1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = game.correctAnswer.trim().toLowerCase();

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

  useEffect(() => {
    if (!showRedFlash) return;
    const t = setTimeout(() => setShowRedFlash(false), 200);
    return () => clearTimeout(t);
  }, [showRedFlash]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (hasError) setHasError(false);
  };

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
        (isMission2Step1 ? (
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
                  maxHeight: "60dvh",
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
                      const textSize = isMobileOrTablet
                        ? isSmallScreen
                          ? "1.0625rem"
                          : "1.125rem"
                        : isDesktopSmall
                          ? "1.25rem"
                          : isDesktopMedium
                            ? "1.375rem"
                            : "1.5rem";
                      const sentenceSize = isMobileOrTablet
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
                            style={{ fontSize: sentenceSize, lineHeight: 1.4 }}
                          >
                            « {game.text} »
                          </p>
                        );
                      return (
                        <>
                          <p
                            className="text-gray-800 leading-tight italic font-display w-full"
                            style={{ fontSize: textSize, lineHeight: 1.4 }}
                          >
                            {parts[0]}
                          </p>
                          {parts.slice(1).map((paragraph, i) => (
                            <p
                              key={i}
                              className="text-gray-800 font-semibold leading-tight w-full whitespace-pre-line"
                              style={{
                                fontSize: sentenceSize,
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
                isStep1 && isMobileOrTablet
                  ? "24%"
                  : isStep1
                    ? "33.333%"
                    : "33vh",
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
                        ? "1.0625rem"
                        : "1.125rem"
                      : isDesktopSmall
                        ? "1.25rem"
                        : isDesktopMedium
                          ? "1.375rem"
                          : "1.5rem";
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
