"use client";

import React, { useState } from "react";
import { Step, BottleEmptyGameData } from "@/types/step";
import { Button } from "@/components/ui/Button";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface BottleEmptyGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function BottleEmptyGame({
  step,
  onComplete,
  onDefeat,
}: BottleEmptyGameProps) {
  const game = step.game as BottleEmptyGameData;
  const [bottleItems, setBottleItems] = useState(game.items);
  const [showVictory, setShowVictory] = useState(false);

  const handleSubmit = () => {
    const isCorrect = bottleItems.every(
      (item, index) => item.id === game.correctOrder[index],
    );
    if (isCorrect) {
      setShowVictory(true);
    } else if (onDefeat) {
      onDefeat();
    }
  };

  const handleContinue = () => {
    setShowVictory(false);
    onComplete();
  };

  return (
    <>
      <div className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 z-10 pointer-events-none">
        <div
          className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl pointer-events-auto"
          style={{ backgroundColor: "#E6D5B8" }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3">
            {step.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            {step.instruction}
          </p>
          <div className="space-y-2 mb-4">
            {bottleItems.map((item) => (
              <div
                key={item.id}
                className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 bg-white"
              >
                <div className="text-xs sm:text-sm text-gray-800">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSubmit}>Valider l&apos;ordre</Button>
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
