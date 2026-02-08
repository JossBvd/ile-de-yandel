"use client";

import React from "react";
import Image from "next/image";

interface RecapModalProps {
  isOpen: boolean;
  results: Record<number, boolean>; // {1: true, 2: true, 3: false}
  totalQuestions: number;
  onContinue: () => void;
  onReviewQuestion: (questionNumber: number) => void;
  /** Texte optionnel sous "Mission accomplie !" */
  missionMessage?: string;
  /** Pièce du radeau gagnée (step 2 QCM) : affichée dans le recap et gagnée au clic Continuer */
  raftPieceName?: string;
  raftPieceImage?: string;
  /** Si false : affiche le message d'échec (DefeatModal) et les boutons Réessayer / J'essaie autre chose */
  hasPassed?: boolean;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function RecapModal({
  isOpen,
  results,
  totalQuestions,
  onContinue,
  onReviewQuestion,
  missionMessage,
  raftPieceName,
  raftPieceImage,
  hasPassed = true,
  onRetry,
  onGoBack,
}: RecapModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 md:p-5 bg-black/60 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Même ratios que desktop : modale quasi plein écran sur mobile, mêmes tailles de texte partout */}
      <div
        className="relative flex flex-col w-full h-[96dvh] max-h-[96vh] sm:h-auto sm:max-h-[min(92dvh,92vh)] sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "3px solid #8B7355",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête — même ratio que desktop */}
        <header className="flex items-center justify-end shrink-0 pt-5 pr-5 pb-0 pl-6 lg:pt-6 lg:pr-6 lg:pl-8">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 italic">
            RECAP
          </h2>
        </header>

        {/* Contenu : 2 colonnes, centré verticalement */}
        <div className="flex flex-1 min-h-0 overflow-auto items-center justify-center px-3 sm:px-5 pb-20 sm:pb-20 lg:pb-24 pt-2 lg:pt-4">
          <div className="flex flex-row gap-3 sm:gap-6 lg:gap-8 xl:gap-10 w-full max-w-full">
            {/* Bloc gauche : Mission accomplie (succès) ou TU Y ES PRESQUE ! (échec) */}
            <div className="flex shrink-0 w-[40%] sm:w-auto sm:flex-1 min-w-0 flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-5 py-2 sm:py-4 lg:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 relative shrink-0">
                <Image
                  src={
                    hasPassed ? "/ui/icon_right.webp" : "/ui/icon_false.webp"
                  }
                  alt={hasPassed ? "Mission accomplie" : "Échec"}
                  width={96}
                  height={96}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="min-w-0 w-full flex-initial text-center px-1">
                <h3 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 uppercase leading-tight">
                  {hasPassed ? "Mission accomplie !" : "TU Y ES PRESQUE !"}
                </h3>
                {hasPassed ? (
                  <>
                    {missionMessage ? (
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 italic mt-1 line-clamp-2 max-w-[90%] mx-auto">
                        {missionMessage}
                      </p>
                    ) : null}
                    {raftPieceName ? (
                      <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                        {raftPieceImage ? (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0">
                            <Image
                              src={raftPieceImage}
                              alt=""
                              width={48}
                              height={48}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ) : null}
                        <p className="text-sm sm:text-base font-semibold text-gray-800">
                          Tu as collecté : {raftPieceName}
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p
                    className="text-sm sm:text-base lg:text-lg mt-1 max-w-[90%] mx-auto"
                    style={{ color: "#34495E" }}
                  >
                    Ne te décourage pas, réessaie !
                  </p>
                )}
              </div>
            </div>

            {/* Liste des questions — centrée verticalement dans la colonne */}
            <div className="flex flex-1 min-w-0 flex-col justify-center">
              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                {Array.from({ length: totalQuestions }, (_, i) => {
                  const questionNumber = i + 1;
                  const isCorrect = results[questionNumber];
                  const hasAnswered = results[questionNumber] !== undefined;

                  return (
                    <li
                      key={questionNumber}
                      className="flex items-center justify-between gap-2 sm:gap-3 py-1"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {hasAnswered ? (
                          isCorrect ? (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 shrink-0 relative">
                              <Image
                                src="/ui/icon_right.webp"
                                alt="Correct"
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 shrink-0 relative">
                              <Image
                                src="/ui/icon_false.webp"
                                alt="Incorrect"
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                          )
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 shrink-0 rounded-full bg-gray-300" />
                        )}
                        <span className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-gray-800 truncate">
                          Question {questionNumber}
                        </span>
                      </div>
                      {hasAnswered && !isCorrect && (
                        <button
                          type="button"
                          onClick={() => onReviewQuestion(questionNumber)}
                          className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-bold rounded-full transition-all hover:scale-105 active:scale-95 touch-manipulation"
                        >
                          Correction
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Pied : continuer (succès) ou j'y retourne / j'essaie autre chose (échec) */}
        {hasPassed ? (
          <button
            type="button"
            onClick={onContinue}
            className="absolute bottom-5 right-5 lg:bottom-6 lg:right-6 p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50"
            aria-label="Continuer"
          >
            <Image
              src="/ui/icon_back.webp"
              alt=""
              width={48}
              height={48}
              className="block w-12 h-12 lg:w-14 lg:h-14"
            />
          </button>
        ) : (
          <div className="absolute bottom-5 left-5 right-5 lg:bottom-6 lg:left-6 lg:right-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg border-2 border-[#229954] min-w-0"
                style={{
                  backgroundColor: "#27AE60",
                  color: "white",
                }}
              >
                j&apos;y retourne !
              </button>
            )}
            {onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg border-2 border-[#229954] min-w-0"
                style={{
                  backgroundColor: "#27AE60",
                  color: "white",
                }}
              >
                j&apos;essaie autre chose
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
