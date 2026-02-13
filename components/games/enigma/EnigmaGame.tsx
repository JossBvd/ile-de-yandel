"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Step, EnigmaGameData } from "@/types/step";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";
import { useOrientationContext } from "@/components/game/OrientationGuard";

interface EnigmaGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  skipVictoryModal?: boolean;
}

export function EnigmaGame({ step, onComplete, skipVictoryModal }: EnigmaGameProps) {
  const game = step.game as EnigmaGameData;
  const { height } = useOrientationContext();
  const [answer, setAnswer] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  
  // Déterminer les tailles basées sur la hauteur de l'écran pour le mode PWA
  const isSmallScreen = height < 600;
  const isMediumScreen = height >= 600 && height < 800;
  const isLargeScreen = height >= 800;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = game.correctAnswer.trim().toLowerCase();

    if (normalizedAnswer === normalizedCorrect) {
      setHasError(false);
      setShowRedFlash(false);
      console.log("✅ Réponse correcte !");
      if (skipVictoryModal) {
        onComplete();
        return;
      }
      setShowVictory(true);
    } else {
      console.log("❌ Mauvaise réponse");
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
          top: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px',
          paddingLeft: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px',
          paddingRight: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px',
          maxHeight: `${Math.floor(height / 3)}px`,
        }}
      >
        <div
          className="shadow-xl border-2 border-amber-800/30 flex flex-col pointer-events-auto bg-cover bg-center bg-no-repeat w-full overflow-y-auto"
          style={{
            backgroundImage: "url(/backgrounds/paper_texture.webp)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: isSmallScreen ? '10px' : isMediumScreen ? '12px' : '14px',
            padding: isSmallScreen ? '6px 8px' : isMediumScreen ? '8px 10px' : '10px 12px',
            gap: isSmallScreen ? '6px' : isMediumScreen ? '8px' : '10px',
          }}
        >
          <div 
            className="flex flex-row items-start"
            style={{
              gap: isSmallScreen ? '6px' : isMediumScreen ? '8px' : '10px',
            }}
          >
            <div className="flex-1 min-w-0 flex flex-col">
              {(() => {
                const [instruction, sentence] = game.text.split(/\n\n/, 2);
                const hasTwoParts = sentence !== undefined;
                return hasTwoParts ? (
                  <>
                    <p 
                      className="text-gray-800 font-bold"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem',
                        lineHeight: '1.2',
                        marginBottom: isSmallScreen ? '4px' : isMediumScreen ? '6px' : '8px',
                      }}
                    >
                      {instruction}
                    </p>
                    <p 
                      className="text-gray-800 italic"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem',
                        lineHeight: '1.2',
                      }}
                    >
                      {sentence}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 
                      className="text-center font-bold text-gray-900 uppercase tracking-wide"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem',
                        marginBottom: isSmallScreen ? '4px' : isMediumScreen ? '6px' : '8px',
                      }}
                    >
                      Énigme
                    </h2>
                    <p 
                      className="text-gray-800 italic"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem',
                        lineHeight: '1.2',
                      }}
                    >
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
                gap: isSmallScreen ? '4px' : isMediumScreen ? '6px' : '8px',
              }}
            >
              <label htmlFor="enigma-answer" className="sr-only">
                Champ réponse
              </label>
              <input
                id="enigma-answer"
                type="text"
                value={answer}
                onChange={handleAnswerChange}
                placeholder="Réponse"
                autoComplete="off"
                name={`enigma-answer-${step.id}`}
                className={`rounded border-2 text-gray-900 placeholder-gray-500 focus:outline-none touch-manipulation transition-colors ${
                  hasError
                    ? "bg-red-100 border-red-500 focus:border-red-600"
                    : "bg-white border-gray-800 focus:border-amber-600"
                }`}
                style={{
                  width: isSmallScreen ? '60px' : isMediumScreen ? '80px' : '100px',
                  padding: isSmallScreen ? '4px 6px' : isMediumScreen ? '6px 8px' : '8px 10px',
                  fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : '1rem',
                }}
              />
              <button
                type="submit"
                disabled={!answer.trim()}
                className="shrink-0 rounded-full bg-transparent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                aria-label="Envoyer"
                style={{
                  minWidth: isSmallScreen ? '32px' : isMediumScreen ? '40px' : '48px',
                  minHeight: isSmallScreen ? '32px' : isMediumScreen ? '40px' : '48px',
                  width: isSmallScreen ? '32px' : isMediumScreen ? '40px' : '48px',
                  height: isSmallScreen ? '32px' : isMediumScreen ? '40px' : '48px',
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
