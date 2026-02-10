"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Step, DragSelectImageGameData } from "@/types/step";
import { Button } from "@/components/ui/Button";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface DragSelectImageGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function DragSelectImageGame({
  step,
  onComplete,
  onDefeat,
}: DragSelectImageGameProps) {
  const game = step.game as DragSelectImageGameData;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showVictory, setShowVictory] = useState(false);

  const toggleImage = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId],
    );
  };

  const handleSubmit = () => {
    const isCorrect =
      selectedImages.length === game.correctImages.length &&
      selectedImages.every((id) => game.correctImages.includes(id));

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
            {game.images.map((image) => (
              <button
                key={image.id}
                onClick={() => toggleImage(image.id)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImages.includes(image.id)
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                {selectedImages.includes(image.id) && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                    <span className="text-white text-2xl sm:text-3xl">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSubmit}>Valider la sélection</Button>
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
