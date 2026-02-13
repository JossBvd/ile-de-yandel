"use client";

import React from "react";
import Image from "next/image";
import { useOrientationContext } from "@/components/game/OrientationGuard";

interface RecapModalProps {
  isOpen: boolean;
  results: Record<number, boolean>;
  totalQuestions: number;
  onContinue: () => void;
  onReviewQuestion: (questionNumber: number) => void;
  missionMessage?: string;
  raftPieceName?: string;
  raftPieceImage?: string;
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
  const { height } = useOrientationContext();
  
  // Déterminer les tailles basées sur la hauteur de l'écran pour le mode PWA
  const isSmallScreen = height < 600;
  const isMediumScreen = height >= 600 && height < 800;
  const isLargeScreen = height >= 800;
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto"
      style={{
        padding: isSmallScreen ? '4px' : isMediumScreen ? '16px' : '20px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative flex flex-col shadow-2xl overflow-hidden"
        style={{
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "3px solid #8B7355",
          width: '100%',
          height: isSmallScreen ? '96dvh' : 'auto',
          maxHeight: isSmallScreen ? '96dvh' : '92dvh',
          maxWidth: isSmallScreen ? '100%' : isMediumScreen ? '672px' : isLargeScreen ? '896px' : '1280px',
          borderRadius: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header 
          className="flex items-center justify-end shrink-0"
          style={{
            paddingTop: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
            paddingRight: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
            paddingBottom: '0',
            paddingLeft: isSmallScreen ? '24px' : isMediumScreen ? '24px' : '32px',
          }}
        >
          <h2 
            className="font-bold text-gray-800 italic"
            style={{
              fontSize: isSmallScreen ? '1.5rem' : isMediumScreen ? '1.875rem' : '2.25rem',
            }}
          >
            RECAP
          </h2>
        </header>

        <div 
          className="flex flex-1 min-h-0 overflow-auto items-center justify-center"
          style={{
            paddingLeft: isSmallScreen ? '12px' : isMediumScreen ? '20px' : '20px',
            paddingRight: isSmallScreen ? '12px' : isMediumScreen ? '20px' : '20px',
            paddingBottom: isSmallScreen ? '80px' : isMediumScreen ? '80px' : '96px',
            paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '8px' : '16px',
          }}
        >
          <div 
            className="flex flex-row w-full max-w-full"
            style={{
              gap: isSmallScreen ? '12px' : isMediumScreen ? '24px' : isLargeScreen ? '32px' : '40px',
            }}
          >
            <div 
              className="flex shrink-0 min-w-0 flex-col items-center justify-center"
              style={{
                width: isSmallScreen ? '40%' : 'auto',
                flex: isSmallScreen ? 'none' : '1',
                gap: isSmallScreen ? '12px' : isMediumScreen ? '16px' : isLargeScreen ? '20px' : '20px',
                paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '32px',
                paddingBottom: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '32px',
              }}
            >
              <div 
                className="relative shrink-0"
                style={{
                  width: isSmallScreen ? '48px' : isMediumScreen ? '64px' : isLargeScreen ? '80px' : '96px',
                  height: isSmallScreen ? '48px' : isMediumScreen ? '64px' : isLargeScreen ? '80px' : '96px',
                }}
              >
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
              <div 
                className="min-w-0 w-full flex-initial text-center"
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }}
              >
                <h3 
                  className="font-bold text-gray-900 uppercase leading-tight"
                  style={{
                    fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.25rem' : isLargeScreen ? '1.5rem' : '1.875rem',
                  }}
                >
                  {hasPassed ? "Mission accomplie !" : "TU Y ES PRESQUE !"}
                </h3>
                {hasPassed ? (
                  <>
                    {missionMessage ? (
                      <p 
                        className="text-gray-700 italic line-clamp-2 mx-auto"
                        style={{
                          fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isLargeScreen ? '1.125rem' : '1.125rem',
                          marginTop: '4px',
                          maxWidth: '90%',
                        }}
                      >
                        {missionMessage}
                      </p>
                    ) : null}
                    {raftPieceName ? (
                      <div 
                        className="flex items-center justify-center"
                        style={{
                          gap: '8px',
                          marginTop: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
                        }}
                      >
                        {raftPieceImage ? (
                          <div 
                            className="relative shrink-0"
                            style={{
                              width: isSmallScreen ? '40px' : isMediumScreen ? '48px' : '48px',
                              height: isSmallScreen ? '40px' : isMediumScreen ? '48px' : '48px',
                            }}
                          >
                            <Image
                              src={raftPieceImage}
                              alt=""
                              width={48}
                              height={48}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ) : null}
                        <p 
                          className="font-semibold text-gray-800"
                          style={{
                            fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1rem',
                          }}
                        >
                          Tu as collecté : {raftPieceName}
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p
                    className="mx-auto"
                    style={{ 
                      color: "#34495E",
                      fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isLargeScreen ? '1.125rem' : '1.125rem',
                      marginTop: '4px',
                      maxWidth: '90%',
                    }}
                  >
                    Ne te décourage pas, réessaie !
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-1 min-w-0 flex-col justify-center">
              <ul 
                style={{
                  gap: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isLargeScreen ? '12px' : '12px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {Array.from({ length: totalQuestions }, (_, i) => {
                  const questionNumber = i + 1;
                  const isCorrect = results[questionNumber];
                  const hasAnswered = results[questionNumber] !== undefined;

                  return (
                    <li
                      key={questionNumber}
                      className="flex items-center justify-between"
                      style={{
                        gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '12px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                      }}
                    >
                      <div 
                        className="flex items-center min-w-0"
                        style={{
                          gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '12px',
                        }}
                      >
                        {hasAnswered ? (
                          isCorrect ? (
                            <div 
                              className="shrink-0 relative"
                              style={{
                                width: isSmallScreen ? '24px' : isMediumScreen ? '28px' : isLargeScreen ? '32px' : '32px',
                                height: isSmallScreen ? '24px' : isMediumScreen ? '28px' : isLargeScreen ? '32px' : '32px',
                              }}
                            >
                              <Image
                                src="/ui/icon_right.webp"
                                alt="Correct"
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div 
                              className="shrink-0 relative"
                              style={{
                                width: isSmallScreen ? '24px' : isMediumScreen ? '28px' : isLargeScreen ? '32px' : '32px',
                                height: isSmallScreen ? '24px' : isMediumScreen ? '28px' : isLargeScreen ? '32px' : '32px',
                              }}
                            >
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
                          <div 
                            className="shrink-0 rounded-full bg-gray-300"
                            style={{
                              width: isSmallScreen ? '24px' : isMediumScreen ? '28px' : isLargeScreen ? '32px' : '32px',
                              height: isSmallScreen ? '24px' : isMediumScreen ? '28px' : isLargeScreen ? '32px' : '32px',
                            }}
                          />
                        )}
                        <span 
                          className="font-semibold text-gray-800 truncate"
                          style={{
                            fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isLargeScreen ? '1.125rem' : '1.25rem',
                          }}
                        >
                          Question {questionNumber}
                        </span>
                      </div>
                      {hasAnswered && !isCorrect && (
                        <button
                          type="button"
                          onClick={() => onReviewQuestion(questionNumber)}
                          className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 touch-manipulation"
                          style={{
                            paddingLeft: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '20px',
                            paddingRight: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '20px',
                            paddingTop: isSmallScreen ? '6px' : isMediumScreen ? '8px' : '10px',
                            paddingBottom: isSmallScreen ? '6px' : isMediumScreen ? '8px' : '10px',
                            fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1rem',
                          }}
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

        {hasPassed ? (
          <button
            type="button"
            onClick={onContinue}
            className="absolute p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50"
            style={{
              bottom: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
              right: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
            }}
            aria-label="Continuer"
          >
            <Image
              src="/ui/icon_back.webp"
              alt=""
              width={48}
              height={48}
              className="block object-contain"
              style={{
                width: isSmallScreen ? '48px' : isMediumScreen ? '48px' : '56px',
                height: isSmallScreen ? '48px' : isMediumScreen ? '48px' : '56px',
              }}
            />
          </button>
        ) : (
          <div 
            className="absolute flex justify-end"
            style={{
              bottom: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
              left: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
              right: isSmallScreen ? '20px' : isMediumScreen ? '20px' : '24px',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
            }}
          >
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full font-bold transition-all hover:scale-105 shadow-lg border-2 border-[#229954] min-w-0"
                style={{
                  backgroundColor: "#27AE60",
                  color: "white",
                  flex: isSmallScreen ? '1' : 'none',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : '1.25rem',
                }}
              >
                j&apos;y retourne !
              </button>
            )}
            {onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="rounded-full font-bold transition-all hover:scale-105 shadow-lg border-2 border-[#229954] min-w-0"
                style={{
                  backgroundColor: "#27AE60",
                  color: "white",
                  flex: isSmallScreen ? '1' : 'none',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : '1.25rem',
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
