"use client";

import React, { useState } from "react";
import { Step, QCMGameData } from "@/types/step";

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
        className="absolute top-4 sm:top-6 md:top-8 lg:top-10 bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-0 right-0 pl-2 sm:pl-3 md:pl-4 lg:pl-6 pr-2 sm:pr-3 md:pr-4 lg:pr-6 z-10 pointer-events-none flex flex-col"
      >
        <div className="w-full flex-1 overflow-visible flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 pointer-events-auto justify-center">
          <div
            className="w-full rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-xl pointer-events-auto"
            style={{
              backgroundColor: "#E8DCC8",
              border: "3px solid #D4B896",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 text-center">
              {showCorrection
                ? `Correction question ${currentQuestion}`
                : totalQuestions === 1
                ? step.title
                : `${step.title} - Question ${currentQuestion}/${totalQuestions}`}
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 italic text-center leading-relaxed">
              {game.question}
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5 pointer-events-auto p-1 sm:p-2">
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
                  py-3 sm:py-4 md:py-5 lg:py-6 px-3 sm:px-5 md:px-7 lg:px-9 rounded-xl sm:rounded-2xl md:rounded-3xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold
                  transition-all duration-300 transform
                  ${buttonColor}
                  text-white
                  shadow-lg hover:shadow-xl
                  ${showCorrection ? "cursor-default" : ""}
                  focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-orange-300
                  flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5
                `}
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold shrink-0">
                  {option.id}
                </span>
                <span className="flex-1 text-left text-sm sm:text-base md:text-lg lg:text-xl">
                  {option.text}
                </span>
              </button>
            );
          })}
          </div>

          <div className={`w-full flex ${isStep2 ? "justify-center" : "justify-between"} items-center pt-1 sm:pt-2 md:pt-3 lg:pt-4 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] gap-2 sm:gap-3 md:gap-4 pointer-events-auto px-1 sm:px-2`}>
          {!isStep2 && (
            <div className="min-w-0 flex-1 flex justify-start">
              {currentQuestion > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 lg:py-4 text-xs sm:text-sm md:text-base lg:text-lg font-bold bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
                >
                  ← Question précédente
                </button>
              ) : (
                <span
                  className="inline-block py-1.5 sm:py-2 md:py-3 lg:py-4 w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
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
                  className={`px-4 sm:px-6 md:px-8 lg:px-9 xl:px-10 py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-4.5 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap ${
                    isStep2 ? "w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px]" : ""
                  }`}
                >
                  Rejouer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className={`px-4 sm:px-6 md:px-8 lg:px-9 xl:px-10 py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-4.5 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl font-bold text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap ${
                    isStep2 
                      ? "bg-orange-500 hover:bg-orange-600 w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px]" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {currentQuestion < totalQuestions
                    ? "Question suivante →"
                    : "Terminer"}
                </button>
              )
            ) : (
              <span
                className="inline-block py-1.5 sm:py-2 md:py-3 lg:py-4 w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
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
