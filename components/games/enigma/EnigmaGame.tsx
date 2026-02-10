"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Step, EnigmaGameData } from "@/types/step";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface EnigmaGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
  /** Si true, ne pas afficher la VictoryModal et appeler onComplete() directement (ex. step 1 mission 1 avec modal image dédiée). */
  skipVictoryModal?: boolean;
}

export function EnigmaGame({ step, onComplete, skipVictoryModal }: EnigmaGameProps) {
  const game = step.game as EnigmaGameData;
  const [answer, setAnswer] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de la réponse (insensible à la casse, trim des espaces)
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
      // Mauvaise réponse : effet écran rouge + champ en rouge
      console.log("❌ Mauvaise réponse");
      setHasError(true);
      setShowRedFlash(true);
    }
  };

  // Flash rouge court puis disparition (l’input reste en rouge jusqu’au prochain saisie)
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
      {/* Effet écran rouge lors d’une mauvaise réponse */}
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
        className="absolute top-2 sm:top-3 md:top-4 lg:top-6 left-0 right-0 pl-2 sm:pl-3 md:pl-4 lg:pl-6 pr-2 sm:pr-3 md:pr-4 lg:pr-6 z-10 pointer-events-none"
        style={{
          maxHeight: "33vh",
        }}
      >
        <div
          className="rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-xl border-2 border-amber-800/30 flex flex-col gap-1.5 sm:gap-2 md:gap-3 pointer-events-auto bg-cover bg-center bg-no-repeat w-full max-h-full overflow-y-auto"
          style={{
            backgroundImage: "url(/backgrounds/paper_texture.webp)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          {/* Contenu principal : consigne à la place de "Énigme" + phrase à compléter */}
          <div className="flex flex-row items-start gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            <div className="flex-1 min-w-0 flex flex-col">
              {(() => {
                const [instruction, sentence] = game.text.split(/\n\n/, 2);
                const hasTwoParts = sentence !== undefined;
                return hasTwoParts ? (
                  <>
                    <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-tight mb-0.5 sm:mb-1 md:mb-2 font-bold">
                      {instruction}
                    </p>
                    <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-tight italic">
                      {sentence}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-center text-sm sm:text-base md:text-lg font-bold text-gray-900 uppercase tracking-wide mb-0.5 sm:mb-1 md:mb-2">
                      Énigme
                    </h2>
                    <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-tight italic">
                      « {game.text} »
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Droite : champ réponse + bouton Envoyer */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-row items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0"
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
                className={`w-24 sm:w-28 md:w-36 lg:w-40 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base rounded border-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none touch-manipulation transition-colors ${
                  hasError
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-800 focus:border-amber-600"
                }`}
              />
              <button
                type="submit"
                disabled={!answer.trim()}
                className="shrink-0 min-w-[32px] min-h-[32px] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-transparent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 touch-manipulation flex items-center justify-center"
                aria-label="Envoyer"
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

      {/* Modale de victoire */}
      <VictoryModal
        isOpen={showVictory}
        onContinue={handleContinue}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
      />
    </>
  );
}
