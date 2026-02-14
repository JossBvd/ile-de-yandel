"use client";

import React, { useState } from "react";
import { Step, QCMGameData } from "@/types/step";
import { useResponsive } from "@/hooks/useResponsive";

interface QCMGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  onGoBackToMap?: () => void;
}

const MIN_CORRECT_TO_PASS = 1;
const totalQuestions = 1;

export function QCMGame({
  step,
  onComplete,
  onDefeat,
  onGoBackToMap,
}: QCMGameProps) {
  const game = step.game as QCMGameData;
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();
  const isMultiple = game.correctAnswers.length > 1;
  const isStep2 = step.id === "mission-1-step-2";
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [answersByQuestion, setAnswersByQuestion] = useState<
    Record<number, number>
  >({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  const goToQuestion = (questionNum: number) => {
    setCurrentQuestion(questionNum);
    const saved = answersByQuestion[questionNum];
    if (saved !== undefined) {
      setSelectedIndex(saved);
      setShowCorrection(true);
    } else {
      setSelectedIndex(null);
      setShowCorrection(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (showCorrection) return;

    if (!isMultiple) {
      setSelectedIndex(index);
      setAnswersByQuestion((prev) => ({ ...prev, [currentQuestion]: index }));
      const isCorrect = game.correctAnswers.includes(index);
      setResults((prev) => ({ ...prev, [currentQuestion]: isCorrect }));

      setShowCorrection(true);
    }
  };

  const handleContinue = () => {
    if (currentQuestion < totalQuestions) {
      goToQuestion(currentQuestion + 1);
    } else {
      const isCorrect = results[currentQuestion] === true;
      if (isCorrect) onComplete();
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestion(1);
    setSelectedIndex(null);
    setShowCorrection(false);
    setAnswersByQuestion({});
    setResults({});
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const paddingEdge = isMobileOrTablet
    ? (isSmallScreen ? "8px" : isMediumScreen ? "12px" : "16px")
    : (isDesktopSmall ? "20px" : isDesktopMedium ? "24px" : "32px");
  const gapMain = isMobileOrTablet
    ? (isSmallScreen ? "8px" : isMediumScreen ? "12px" : "16px")
    : (isDesktopSmall ? "18px" : isDesktopMedium ? "22px" : "28px");
  const cardPadding = isMobileOrTablet
    ? (isSmallScreen ? "12px" : isMediumScreen ? "16px" : "20px")
    : (isDesktopSmall ? "24px" : isDesktopMedium ? "28px" : "36px");
  const cardRadius = isMobileOrTablet
    ? (isSmallScreen ? "12px" : "14px")
    : (isDesktopSmall ? "16px" : isDesktopMedium ? "20px" : "24px");
  const titleSize = isMobileOrTablet
    ? (isSmallScreen ? "1rem" : isMediumScreen ? "1.125rem" : "1.25rem")
    : (isDesktopSmall ? "1.5rem" : isDesktopMedium ? "1.875rem" : "2.25rem");
  const questionSize = isMobileOrTablet
    ? (isSmallScreen ? "0.8125rem" : isMediumScreen ? "0.9375rem" : "1.0625rem")
    : (isDesktopSmall ? "1.25rem" : isDesktopMedium ? "1.5rem" : "1.875rem");
  const gridGap = isMobileOrTablet
    ? (isSmallScreen ? "8px" : isMediumScreen ? "10px" : "12px")
    : (isDesktopSmall ? "18px" : isDesktopMedium ? "22px" : "28px");
  const optionLetterSize = isMobileOrTablet
    ? (isSmallScreen ? "1rem" : isMediumScreen ? "1.25rem" : "1.5rem")
    : (isDesktopSmall ? "1.75rem" : isDesktopMedium ? "2.25rem" : "2.5rem");
  const optionTextSize = isMobileOrTablet
    ? (isSmallScreen ? "0.75rem" : isMediumScreen ? "0.875rem" : "1rem")
    : (isDesktopSmall ? "1.125rem" : isDesktopMedium ? "1.375rem" : "1.5rem");
  const optionPaddingY = isMobileOrTablet
    ? (isSmallScreen ? "10px" : isMediumScreen ? "12px" : "14px")
    : (isDesktopSmall ? "18px" : isDesktopMedium ? "22px" : "28px");
  const optionPaddingX = isMobileOrTablet
    ? (isSmallScreen ? "8px" : isMediumScreen ? "10px" : "12px")
    : (isDesktopSmall ? "18px" : isDesktopMedium ? "22px" : "28px");
  const optionRadius = isMobileOrTablet
    ? (isSmallScreen ? "14px" : "16px")
    : (isDesktopSmall ? "18px" : isDesktopMedium ? "22px" : "26px");
  const optionGap = isMobileOrTablet
    ? (isSmallScreen ? "6px" : "8px")
    : (isDesktopSmall ? "12px" : "16px");
  const btnMinHeight = isMobileOrTablet ? "44px" : "48px";
  const btnPadding = isMobileOrTablet
    ? (isSmallScreen ? "10px 16px" : "12px 20px")
    : (isDesktopSmall ? "14px 24px" : isDesktopMedium ? "16px 28px" : "18px 32px");
  const btnFontSize = isMobileOrTablet
    ? (isSmallScreen ? "0.8125rem" : isMediumScreen ? "0.9375rem" : "1rem")
    : (isDesktopSmall ? "1.125rem" : "1.25rem");

  return (
    <>
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none flex flex-col overflow-hidden"
        style={{
          top: paddingEdge,
          bottom: paddingEdge,
          paddingLeft: paddingEdge,
          paddingRight: paddingEdge,
        }}
      >
        <div
          className="w-full flex-1 flex flex-col pointer-events-auto justify-center min-h-0 overflow-y-auto"
          style={{ gap: gapMain }}
        >
          <div
            className="w-full shadow-xl pointer-events-auto shrink-0"
            style={{
              backgroundColor: "#E8DCC8",
              border: "3px solid #D4B896",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              padding: cardPadding,
              borderRadius: cardRadius,
            }}
          >
            <h2
              className="font-bold text-gray-900 text-center"
              style={{
                fontSize: titleSize,
                marginBottom: isMobileOrTablet
                  ? (isSmallScreen ? "8px" : isMediumScreen ? "10px" : "12px")
                  : (isDesktopSmall ? "14px" : "16px"),
              }}
            >
              {showCorrection
                ? `Correction question ${currentQuestion}`
                : totalQuestions === 1
                  ? step.title
                  : `${step.title} - Question ${currentQuestion}/${totalQuestions}`}
            </h2>

            <p
              className="text-gray-800 italic text-center leading-relaxed"
              style={{ fontSize: questionSize }}
            >
              {game.question}
            </p>
          </div>

          <div
            className="w-full pointer-events-auto shrink-0"
            style={{
              paddingLeft: isMobileOrTablet ? "12px" : "20px",
              paddingRight: isMobileOrTablet ? "12px" : "20px",
              paddingBottom: "8px",
            }}
          >
            <div
              className="w-full grid grid-cols-2"
              style={{ gap: gridGap }}
            >
            {game.options.map((option, index) => {
              const isCorrectOption = game.correctAnswers.includes(index);

              let buttonColor =
                "bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 hover:scale-105 active:scale-95";

              if (showCorrection) {
                if (isCorrectOption) {
                  buttonColor = "bg-correct-answer";
                } else {
                  buttonColor = "bg-incorrect-answer";
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(index)}
                  disabled={showCorrection}
                  className={`
                  transition-all duration-300 transform font-bold
                  ${buttonColor}
                  text-white shadow-lg hover:shadow-xl
                  ${showCorrection ? "cursor-default" : ""}
                  focus:outline-none focus:ring-2 focus:ring-orange-300
                  flex items-center touch-manipulation
                `}
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    paddingTop: optionPaddingY,
                    paddingBottom: optionPaddingY,
                    paddingLeft: optionPaddingX,
                    paddingRight: optionPaddingX,
                    gap: optionGap,
                    minHeight: btnMinHeight,
                    borderRadius: optionRadius,
                  }}
                >
                  <span className="font-bold shrink-0" style={{ fontSize: optionLetterSize }}>
                    {option.id}
                  </span>
                  <span className="flex-1 text-left min-w-0" style={{ fontSize: optionTextSize }}>
                    {option.text}
                  </span>
                </button>
              );
            })}
            </div>
          </div>

          <div
            className="w-full flex shrink-0 items-center pointer-events-auto"
            style={{
              justifyContent: isStep2 ? "center" : "space-between",
              paddingTop: isSmallScreen ? "8px" : "12px",
              gap: "12px",
              minHeight: "44px",
            }}
          >
            {!isStep2 && (
              <div className="min-w-0 flex-1 flex justify-start">
                {currentQuestion > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-3 py-2 font-bold bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
                    style={{ fontSize: btnFontSize, minHeight: btnMinHeight }}
                  >
                    ← Question précédente
                  </button>
                ) : (
                  <span
                    className="inline-block w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    ←
                  </span>
                )}
              </div>
            )}
            <div className={`min-w-0 ${isStep2 ? "w-full flex justify-center" : "flex-1 flex justify-end"}`}>
              {showCorrection ? (
                currentQuestion === totalQuestions &&
                results[currentQuestion] === false ? (
                  <button
                    type="button"
                    onClick={handleRetryQuiz}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
                    style={{
                      padding: btnPadding,
                      fontSize: btnFontSize,
                      minHeight: btnMinHeight,
                      minWidth: isMobileOrTablet ? (isSmallScreen ? "100px" : "120px") : "160px",
                    }}
                  >
                    Rejouer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className={`text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap ${
                      isStep2 ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"
                    }`}
                    style={{
                      padding: btnPadding,
                      fontSize: btnFontSize,
                      minHeight: btnMinHeight,
                      minWidth: isStep2 && isMobileOrTablet ? (isSmallScreen ? "100px" : "120px") : isStep2 ? "160px" : undefined,
                    }}
                  >
                    {currentQuestion < totalQuestions
                      ? "Question suivante →"
                      : "Terminer"}
                  </button>
                )
              ) : (
                <span
                  className="inline-block w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
