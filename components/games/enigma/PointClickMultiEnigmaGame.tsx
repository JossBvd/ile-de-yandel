"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Step, PointClickMultiEnigmaGameData } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { logDebug } from "@/lib/utils/logger";

interface PointClickMultiEnigmaGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  questionContainerVisible?: boolean;
}

export function PointClickMultiEnigmaGame({
  step,
  onComplete,
  questionContainerVisible = true,
}: PointClickMultiEnigmaGameProps) {
  const game = step.game as PointClickMultiEnigmaGameData;
  const { targetIconSrc } = game;
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
  } = useResponsive();

  const [answers, setAnswers] = useState<string[]>(
    Array(game.correctAnswers.length).fill(""),
  );
  const [hasError, setHasError] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const [openPopupImage, setOpenPopupImage] = useState<string | null>(null);

  useEffect(() => {
    if (!showRedFlash) return;
    const t = setTimeout(() => setShowRedFlash(false), 200);
    return () => clearTimeout(t);
  }, [showRedFlash]);

  useEffect(() => {
    if (!openPopupImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPopupImage(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPopupImage]);

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = game.correctAnswers.every(
      (correct, i) => normalize(answers[i] ?? "") === normalize(correct),
    );
    if (isCorrect) {
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

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (hasError) setHasError(false);
  };

  const allFilled = answers.every((a) => a.trim().length > 0);

  const targetSize = isSmallScreen
    ? 36
    : isMediumScreen
      ? 44
      : isDesktopSmall
        ? 56
        : 64;

  const inputWidth = isSmallScreen
    ? "80px"
    : isMediumScreen
      ? "96px"
      : isDesktopSmall
        ? "120px"
        : "140px";

  const inputHeight = isSmallScreen ? "38px" : isMediumScreen ? "44px" : "50px";

  const inputFontSize = isSmallScreen
    ? "0.875rem"
    : isMediumScreen
      ? "1rem"
      : "1.125rem";

  const sendBtnSize = isSmallScreen
    ? 52
    : isMediumScreen
      ? 64
      : isDesktopSmall
        ? 80
        : 90;

  return (
    <>
      {/* Flash rouge erreur */}
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

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={step.backgroundImage ?? ""}
          alt=""
          fill
          className="object-cover"
          draggable={false}
          priority
        />
      </div>

      {/* Cibles cliquables */}
      {game.targets.map((target, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setOpenPopupImage(target.image)}
          className="absolute z-10 touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded-full"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            transform: "translate(-50%, -50%)",
            width: `${targetSize}px`,
            height: `${targetSize}px`,
          }}
          aria-label={`Indice ${index + 1}`}
        >
          <Image
            src={targetIconSrc}
            alt=""
            fill
            className="object-contain"
            draggable={false}
          />
        </button>
      ))}

      {/* Conteneur question */}
      {questionContainerVisible && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            top: isSmallScreen
              ? "8px"
              : isMediumScreen
                ? "12px"
                : isDesktopSmall
                  ? "16px"
                  : "24px",
            left: isSmallScreen
              ? "8px"
              : isMediumScreen
                ? "12px"
                : isDesktopSmall
                  ? "16px"
                  : "24px",
            right: isSmallScreen
              ? "8px"
              : isMediumScreen
                ? "12px"
                : isDesktopSmall
                  ? "16px"
                  : "24px",
          }}
        >
          <div
            className="rounded-[1.25rem] border border-amber-900/50 bg-[#f5f0e6] bg-auto bg-center bg-no-repeat pointer-events-auto"
            style={{
              backgroundImage: "url(/backgrounds/paper_texture.webp)",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,90,43,0.2)",
              padding: isMobileOrTablet
                ? isSmallScreen
                  ? "10px 14px"
                  : "12px 16px"
                : isDesktopSmall
                  ? "14px 20px"
                  : isDesktopMedium
                    ? "16px 24px"
                    : "18px 28px",
            }}
            role="region"
            aria-label="Consigne du jeu"
          >
            <div
              className="flex flex-col items-center"
              style={{
                gap: isSmallScreen ? "10px" : isMediumScreen ? "12px" : "16px",
              }}
            >
              {/* Question text */}
              <div className="flex flex-row items-start gap-2 w-full">
                <p
                  className="flex-1 min-w-0 text-gray-800 font-bold font-display text-center whitespace-pre-line"
                  style={{
                    fontSize: isMobileOrTablet
                      ? isSmallScreen
                        ? "0.9375rem"
                        : "1rem"
                      : isDesktopSmall
                        ? "1.0625rem"
                        : isDesktopMedium
                          ? "1.125rem"
                          : "1.25rem",
                    lineHeight: 1.35,
                  }}
                >
                  {game.question}
                </p>
                <ReadAloudButton
                  text={game.question}
                  ariaLabel="Lire la consigne"
                  className="shrink-0"
                />
              </div>

              {/* Inputs + bouton envoyer */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-row items-center justify-center w-full"
                style={{
                  gap: isSmallScreen ? "8px" : isMediumScreen ? "10px" : "14px",
                }}
                aria-label="Formulaire de réponse"
              >
                {answers.map((value, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <span
                        className="text-gray-700 font-bold select-none"
                        style={{
                          fontSize: isSmallScreen ? "1.125rem" : "1.375rem",
                          lineHeight: 1,
                        }}
                        aria-hidden
                      >
                        –
                      </span>
                    )}
                    <label htmlFor={`m4s3-input-${index}`} className="sr-only">
                      Partie {index + 1} de la réponse
                    </label>
                    <input
                      id={`m4s3-input-${index}`}
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      placeholder="..."
                      autoComplete="off"
                      name={`m4s3-answer-${index}`}
                      aria-invalid={hasError}
                      className={`rounded-lg border-2 text-gray-900 placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 touch-manipulation transition-colors ${
                        hasError
                          ? "bg-red-50 border-red-500 focus:border-red-600"
                          : "bg-white border-gray-800"
                      }`}
                      style={{
                        width: inputWidth,
                        height: inputHeight,
                        fontSize: inputFontSize,
                        minWidth: "60px",
                      }}
                    />
                  </React.Fragment>
                ))}

                <button
                  type="submit"
                  disabled={!allFilled}
                  className="shrink-0 rounded-full bg-transparent hover:opacity-90 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                  aria-label="Envoyer"
                  style={{
                    width: `${sendBtnSize}px`,
                    height: `${sendBtnSize}px`,
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
      )}

      {openPopupImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-300 flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={() => setOpenPopupImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Indice"
          >
            <div
              className="relative cursor-default"
              style={{
                maxWidth: "90vw",
                maxHeight: "90dvh",
              }}
            >
              <Image
                src={openPopupImage}
                alt="Indice"
                width={900}
                height={600}
                className="rounded-xl object-contain pointer-events-none"
                style={{ maxWidth: "90vw", maxHeight: "85dvh" }}
                draggable={false}
              />
              <div
                className="absolute"
                style={{ top: "12px", right: "12px" }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <ReadAloudButton
                  text={
                    game.targets.find((t) => t.image === openPopupImage)
                      ?.readAloudText ?? "Indice visuel."
                  }
                  ariaLabel="Lire la description de l'indice"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopupImage(null);
                }}
                className="absolute top-3 left-3 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white transition-colors touch-manipulation cursor-pointer"
                style={{ width: "36px", height: "36px", fontSize: "1.125rem" }}
                aria-label="Fermer l'indice"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
