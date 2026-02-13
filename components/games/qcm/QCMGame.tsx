"use client";

import React, { useState } from "react";
import { Step, QCMGameData } from "@/types/step";
import { useOrientationContext } from "@/components/game/OrientationGuard";

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
  const isMultiple = game.correctAnswers.length > 1;
  const isStep2 = step.id === "mission-1-step-2";
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [answersByQuestion, setAnswersByQuestion] = useState<
    Record<number, number>
  >({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const { height } = useOrientationContext();
  
  // Déterminer les tailles basées sur la hauteur de l'écran pour le mode PWA
  const isSmallScreen = height < 600;
  const isMediumScreen = height >= 600 && height < 800;
  const isLargeScreen = height >= 800;

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


  return (
    <>
      <div 
        className="absolute left-0 right-0 z-10 pointer-events-none flex flex-col"
        style={{
          top: isSmallScreen ? '16px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
          bottom: isSmallScreen ? '16px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
          paddingLeft: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isLargeScreen ? '16px' : '24px',
          paddingRight: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isLargeScreen ? '16px' : '24px',
        }}
      >
        <div 
          className="w-full flex-1 overflow-visible flex flex-col pointer-events-auto"
          style={{
            gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isLargeScreen ? '16px' : '20px',
            justifyContent: 'flex-start',
            paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px',
          }}
        >
          <div
            className="w-full shadow-xl pointer-events-auto"
            style={{
              backgroundColor: "#E8DCC8",
              border: "3px solid #D4B896",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              borderRadius: isSmallScreen ? '12px' : isMediumScreen ? '16px' : isLargeScreen ? '20px' : '20px',
              padding: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isLargeScreen ? '16px' : '20px',
              maxHeight: `${height / 3}px`,
              overflowY: 'auto',
            }}
          >
            <h2 
              className="font-bold text-gray-900 text-center"
              style={{
                fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : isLargeScreen ? '1.5rem' : '1.875rem',
                marginBottom: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px',
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
              style={{
                fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.125rem' : isLargeScreen ? '1.25rem' : '1.5rem',
              }}
            >
              {game.question}
            </p>
          </div>

          <div 
            className="w-full grid grid-cols-2 pointer-events-auto"
            style={{
              gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isLargeScreen ? '16px' : '20px',
              padding: isSmallScreen ? '4px' : isMediumScreen ? '8px' : '8px',
            }}
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
                  font-bold transition-all duration-300 transform
                  ${buttonColor}
                  text-white shadow-lg hover:shadow-xl
                  ${showCorrection ? "cursor-default" : ""}
                  focus:outline-none focus:ring-orange-300 flex items-center
                `}
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <span 
                  className="font-bold shrink-0"
                  style={{
                    fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : isLargeScreen ? '1.875rem' : '2.25rem',
                  }}
                >
                  {option.id}
                </span>
                <span 
                  className="flex-1 text-left"
                  style={{
                    fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isLargeScreen ? '1.125rem' : '1.25rem',
                  }}
                >
                  {option.text}
                </span>
              </button>
            );
          })}
          </div>

          <div 
            className={`w-full flex ${isStep2 ? "justify-center" : "justify-between"} items-center pointer-events-auto`}
            style={{
              paddingTop: isSmallScreen ? '4px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
              minHeight: isSmallScreen ? '2.5rem' : isMediumScreen ? '3rem' : isLargeScreen ? '3.5rem' : '3.5rem',
              gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : isLargeScreen ? '16px' : '16px',
              paddingLeft: isSmallScreen ? '4px' : isMediumScreen ? '8px' : '8px',
              paddingRight: isSmallScreen ? '4px' : isMediumScreen ? '8px' : '8px',
            }}
          >
          {!isStep2 && (
            <div className="min-w-0 flex-1 flex justify-start">
              {currentQuestion > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="font-bold bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
                  style={{
                    paddingLeft: isSmallScreen ? '8px' : isMediumScreen ? '16px' : isLargeScreen ? '24px' : '32px',
                    paddingRight: isSmallScreen ? '8px' : isMediumScreen ? '16px' : isLargeScreen ? '24px' : '32px',
                    paddingTop: isSmallScreen ? '6px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
                    paddingBottom: isSmallScreen ? '6px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
                    fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : isLargeScreen ? '1rem' : '1.125rem',
                  }}
                >
                  ← Question précédente
                </button>
              ) : (
                <span
                  className="inline-block w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
                  style={{
                    paddingTop: isSmallScreen ? '6px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
                    paddingBottom: isSmallScreen ? '6px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
                  }}
                  aria-hidden="true"
                >
                  ←
                </span>
              )}
            </div>
          )}
          <div className={`min-w-0 ${isStep2 ? "w-full flex justify-center" : "flex-1 flex justify-end"}`}>
            {showCorrection ? (
              currentQuestion === totalQuestions && results[currentQuestion] === false ? (
                <button
                  type="button"
                  onClick={handleRetryQuiz}
                  className="font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
                  style={{
                    paddingLeft: isSmallScreen ? '16px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
                    paddingRight: isSmallScreen ? '16px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
                    paddingTop: isSmallScreen ? '10px' : isMediumScreen ? '12px' : isLargeScreen ? '14px' : '18px',
                    paddingBottom: isSmallScreen ? '10px' : isMediumScreen ? '12px' : isLargeScreen ? '14px' : '18px',
                    fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isLargeScreen ? '1.125rem' : '1.25rem',
                    minWidth: isStep2 ? (isSmallScreen ? '140px' : isMediumScreen ? '160px' : isLargeScreen ? '180px' : '200px') : 'auto',
                  }}
                >
                  Rejouer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className={`font-bold text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap ${
                    isStep2 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  style={{
                    paddingLeft: isSmallScreen ? '16px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
                    paddingRight: isSmallScreen ? '16px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
                    paddingTop: isSmallScreen ? '10px' : isMediumScreen ? '12px' : isLargeScreen ? '14px' : '18px',
                    paddingBottom: isSmallScreen ? '10px' : isMediumScreen ? '12px' : isLargeScreen ? '14px' : '18px',
                    fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isLargeScreen ? '1.125rem' : '1.25rem',
                    minWidth: isStep2 ? (isSmallScreen ? '140px' : isMediumScreen ? '160px' : isLargeScreen ? '180px' : '200px') : 'auto',
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
                style={{
                  paddingTop: isSmallScreen ? '6px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
                  paddingBottom: isSmallScreen ? '6px' : isMediumScreen ? '8px' : isLargeScreen ? '12px' : '16px',
                }}
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
