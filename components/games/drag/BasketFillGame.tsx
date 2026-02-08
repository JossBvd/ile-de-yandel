"use client";

import React, { useState } from "react";
import { Step, BasketFillGameData } from "@/types/step";
import { Button } from "@/components/ui/Button";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface BasketFillGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function BasketFillGame({
  step,
  onComplete,
  onDefeat,
}: BasketFillGameProps) {
  const game = step.game as BasketFillGameData;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showVictory, setShowVictory] = useState(false);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSubmit = () => {
    const isCorrect =
      selectedItems.length === game.correctItems.length &&
      selectedItems.every((id) => game.correctItems.includes(id));

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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
            {game.items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                  selectedItems.includes(item.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="text-xs sm:text-sm text-gray-800">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSubmit}>Valider le panier</Button>
          </div>
        </div>
      </div>

      {/* Modal de victoire */}
      <VictoryModal
        isOpen={showVictory}
        onContinue={handleContinue}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
      />
    </>
  );
}
