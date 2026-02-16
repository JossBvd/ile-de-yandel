"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Step, EnigmaGameData } from "@/types/step";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";
import { useResponsive } from "@/hooks/useResponsive";
import { logDebug } from "@/lib/utils/logger";

interface EnigmaGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  skipVictoryModal?: boolean;
}

export function EnigmaGame({
  step,
  onComplete,
  skipVictoryModal,
}: EnigmaGameProps) {
  const game = step.game as EnigmaGameData;
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();
  const [answer, setAnswer] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  
  const isStep1 = step.id.endsWith('-step-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = game.correctAnswer.trim().toLowerCase();

    if (normalizedAnswer === normalizedCorrect) {
      setHasError(false);
      setShowRedFlash(false);
      logDebug("✅ Réponse correcte !");
      if (skipVictoryModal) {
        onComplete();
        return;
      }
      setShowVictory(true);
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

  const handleContinue = () => {
    setShowVictory(false);
    onComplete();
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
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{
          top: isStep1 ? '0' : (isSmallScreen ? '8px' : isMediumScreen ? '12px' : isDesktopSmall ? '16px' : '24px'),
          paddingLeft: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isDesktopSmall ? '16px' : '24px',
          paddingRight: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isDesktopSmall ? '16px' : '24px',
          maxHeight: isStep1 && isMobileOrTablet ? '24%' : isStep1 ? '33.333%' : '33vh',
        }}
      >
        <div
          className="rounded-xl shadow-xl border-2 border-amber-800/30 flex flex-col pointer-events-auto bg-cover bg-center bg-no-repeat w-full max-h-full overflow-y-auto"
          style={{
            backgroundImage: "url(/backgrounds/paper_texture.webp)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: isMobileOrTablet ? (isSmallScreen ? '8px 10px' : '10px 12px') : (isDesktopSmall ? '16px' : isDesktopMedium ? '20px' : '24px'),
            gap: isMobileOrTablet ? (isSmallScreen ? '8px' : '10px') : (isDesktopSmall ? '12px' : '16px'),
          }}
        >
          <div
            className="flex flex-row items-center gap-2"
            style={{
              gap: isMobileOrTablet ? (isSmallScreen ? '8px' : '10px') : (isDesktopSmall ? '16px' : isDesktopMedium ? '20px' : '24px'),
            }}
          >
            <div
              className="flex-1 min-w-0 flex flex-col"
              style={{ gap: isMobileOrTablet ? '2px' : '4px' }}
              role="region"
              aria-label="Énoncé de l’énigme"
            >
              {(() => {
                const [instruction, sentence] = game.text.split(/\n\n/, 2);
                const hasTwoParts = sentence !== undefined;
                const textSize = isMobileOrTablet ? (isSmallScreen ? '0.875rem' : '0.9375rem') : (isDesktopSmall ? '1rem' : isDesktopMedium ? '1.125rem' : '1.25rem');
                const titleSize = isMobileOrTablet ? (isSmallScreen ? '0.875rem' : '1rem') : (isDesktopSmall ? '1.125rem' : '1.25rem');
                return hasTwoParts ? (
                  <>
                    <p className="text-gray-800 leading-tight font-bold" style={{ fontSize: textSize, lineHeight: 1.4 }}>
                      {instruction}
                    </p>
                    <p className="text-gray-800 leading-tight italic" style={{ fontSize: textSize, lineHeight: 1.4 }}>
                      {sentence}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-gray-900 uppercase tracking-wide font-bold leading-tight" style={{ fontSize: titleSize, lineHeight: 1.3 }}>
                      Énigme
                    </h2>
                    <p className="text-gray-800 leading-tight italic" style={{ fontSize: textSize, lineHeight: 1.4 }}>
                      « {game.text} »
                    </p>
                  </>
                );
              })()}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-row items-center shrink-0"
              style={{
                gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isDesktopSmall ? '16px' : isDesktopMedium ? '20px' : '24px',
              }}
              aria-label="Formulaire de réponse à l’énigme"
            >
              <label htmlFor="enigma-answer" className="sr-only">
                Votre réponse à l’énigme
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
                aria-describedby={hasError ? 'enigma-error' : undefined}
                className={`rounded border-2 text-gray-900 placeholder-gray-500 focus:outline-none touch-manipulation transition-colors ${
                  hasError
                    ? "bg-red-100 border-red-500 focus:border-red-600"
                    : "bg-white border-gray-800 focus:border-amber-600"
                }`}
                style={{
                  width: isSmallScreen ? '100px' : isMediumScreen ? '120px' : isDesktopSmall ? '160px' : isDesktopMedium ? '180px' : '200px',
                  paddingLeft: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '16px' : '18px',
                  paddingRight: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '16px' : '18px',
                  paddingTop: isSmallScreen ? '10px' : isMediumScreen ? '12px' : isDesktopSmall ? '16px' : '18px',
                  paddingBottom: isSmallScreen ? '10px' : isMediumScreen ? '12px' : isDesktopSmall ? '16px' : '18px',
                  fontSize: isSmallScreen ? '0.8125rem' : isMediumScreen ? '0.875rem' : isDesktopSmall ? '1.125rem' : '1.25rem',
                  minHeight: isMobileOrTablet ? '40px' : '44px',
                }}
              />
              <button
                type="submit"
                disabled={!answer.trim()}
                className="shrink-0 rounded-full bg-transparent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                aria-label="Envoyer"
                style={{
                  width: isSmallScreen ? '48px' : isMediumScreen ? '56px' : isDesktopSmall ? '80px' : isDesktopMedium ? '88px' : '96px',
                  height: isSmallScreen ? '48px' : isMediumScreen ? '56px' : isDesktopSmall ? '80px' : isDesktopMedium ? '88px' : '96px',
                  minWidth: '48px',
                  minHeight: '48px',
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
      <VictoryModal
        isOpen={showVictory}
        onContinue={handleContinue}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
      />
    </>
  );
}
