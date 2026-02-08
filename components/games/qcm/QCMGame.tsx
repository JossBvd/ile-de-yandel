"use client";

import React, { useState } from "react";
import { Step, QCMGameData } from "@/types/step";
import { RecapModal } from "@/components/ui/RecapModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface QCMGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  onGoBackToMap?: () => void;
}

const MIN_CORRECT_TO_PASS = 2;
const totalQuestions = 3;

export function QCMGame({
  step,
  onComplete,
  onDefeat,
  onGoBackToMap,
}: QCMGameProps) {
  const game = step.game as QCMGameData;
  const isMultiple = game.correctAnswers.length > 1;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  // Réponses déjà données (question numéro → index de l’option choisie) pour réafficher la correction au retour
  const [answersByQuestion, setAnswersByQuestion] = useState<
    Record<number, number>
  >({});
  // Tracker des résultats (question numéro → true si correct, false si incorrect)
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [showRecap, setShowRecap] = useState(false);

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

      // Enregistrer si la réponse est correcte ou non
      const isCorrect = game.correctAnswers.includes(index);
      setResults((prev) => ({ ...prev, [currentQuestion]: isCorrect }));

      setShowCorrection(true);
    }
  };

  const handleContinue = () => {
    if (currentQuestion < totalQuestions) {
      goToQuestion(currentQuestion + 1);
    } else {
      // Fin du quiz : recap toujours affiché ; pièce seulement si >= 2 bonnes réponses
      setShowRecap(true);
    }
  };

  const handleRetryQuiz = () => {
    setShowRecap(false);
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

  const handleRecapContinue = () => {
    setShowRecap(false);
    // Pièce du radeau uniquement si au moins 2 bonnes réponses (hasPassed)
    onComplete();
  };

  const handleReviewQuestion = (questionNumber: number) => {
    setShowRecap(false);
    goToQuestion(questionNumber);
  };

  return (
    <>
      {/* Container centré pour le quiz — plus large sur desktop pour lisibilité */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-xl md:max-w-2xl lg:max-w-3xl z-10 pointer-events-none flex flex-col items-center gap-3 sm:gap-5 md:gap-6">
        {/* Panneau beige avec titre et question UNIQUEMENT */}
        <div
          className="w-full rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl pointer-events-auto"
          style={{
            backgroundColor: "#E8DCC8",
            border: "3px solid #D4B896",
          }}
        >
          {/* Titre centré — change en "Correction question X" après le clic */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 text-center">
            {showCorrection
              ? `Correction question ${currentQuestion}`
              : `${step.title} - Question ${currentQuestion}/${totalQuestions}`}
          </h2>

          {/* Question en italique — taille lisible sur desktop (base → lg) */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 italic text-center leading-relaxed">
            {game.question}
          </p>
        </div>

        {/* Grille de 4 boutons EN DESSOUS du panneau */}
        <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 pointer-events-auto">
          {game.options.map((option, index) => {
            // En mode correction : afficher toutes les réponses avec leurs couleurs
            const isCorrectOption = game.correctAnswers.includes(index);

            let buttonColor =
              "bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 hover:scale-105 active:scale-95";

            if (showCorrection) {
              // Afficher la correction : vert pour correct, rouge pour incorrect
              if (isCorrectOption) {
                buttonColor = "bg-green-500";
              } else {
                buttonColor = "bg-red-500";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(index)}
                disabled={showCorrection}
                className={`
                  py-3 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 rounded-3xl text-lg sm:text-xl md:text-2xl font-bold
                  transition-all duration-300 transform
                  ${buttonColor}
                  text-white
                  shadow-lg hover:shadow-xl
                  ${showCorrection ? "cursor-default" : ""}
                  focus:outline-none focus:ring-4 focus:ring-orange-300
                `}
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        {/* Navigation : espace fixe (2 emplacements) pour éviter tout décalage */}
        <div className="w-full flex justify-between items-center pt-2 sm:pt-4 min-h-[3.25rem] sm:min-h-[3.5rem] md:min-h-[4rem] gap-3 sm:gap-4 pointer-events-auto px-2">
          <div className="min-w-0 flex-1 flex justify-start">
            {currentQuestion > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
              >
                ← Question précédente
              </button>
            ) : (
              <span
                className="inline-block py-3 sm:py-4 md:py-5 w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
                aria-hidden="true"
              >
                ←
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 flex justify-end">
            {showCorrection ? (
              <button
                type="button"
                onClick={handleContinue}
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 touch-manipulation whitespace-nowrap"
              >
                {currentQuestion < totalQuestions
                  ? "Question suivante →"
                  : "Terminer"}
              </button>
            ) : (
              <span
                className="inline-block py-3 sm:py-4 md:py-5 w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recap toujours affiché ; si < 2 bonnes réponses : pas de pièce + texte DefeatModal + boutons Réessayer / J'essaie autre chose */}
      <RecapModal
        isOpen={showRecap}
        results={results}
        totalQuestions={totalQuestions}
        onContinue={handleRecapContinue}
        onReviewQuestion={handleReviewQuestion}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
        hasPassed={
          Object.values(results).filter(Boolean).length >= MIN_CORRECT_TO_PASS
        }
        onRetry={handleRetryQuiz}
        onGoBack={onGoBackToMap}
      />
    </>
  );
}
