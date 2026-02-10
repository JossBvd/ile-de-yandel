"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Step, ImageClickGameData } from "@/types/step";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface ImageClickGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function ImageClickGame({
  step,
  onComplete,
  onDefeat,
}: ImageClickGameProps) {
  const game = step.game as ImageClickGameData;
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);
  const [showVictory, setShowVictory] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalObjects = game.clickableZones.length;

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = game.image;
  }, [game.image]);

  const getImageCoordinates = (
    clientX: number,
    clientY: number,
  ): { x: number; y: number } | null => {
    if (!containerRef.current || !imageDimensions) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerRatio = containerRect.width / containerRect.height;
    const imageRatio = imageDimensions.width / imageDimensions.height;

    let imageWidth, imageHeight, offsetX, offsetY;

    if (containerRatio > imageRatio) {
      imageWidth = containerRect.width;
      imageHeight = imageWidth / imageRatio;
      offsetX = 0;
      offsetY = (containerRect.height - imageHeight) / 2;
    } else {
      imageHeight = containerRect.height;
      imageWidth = imageHeight * imageRatio;
      offsetX = (containerRect.width - imageWidth) / 2;
      offsetY = 0;
    }

    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top;

    const x = ((relX - offsetX) / imageWidth) * 100;
    const y = ((relY - offsetY) / imageHeight) * 100;

    return { x, y };
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const coords = getImageCoordinates(event.clientX, event.clientY);
    if (!coords) return;

    // Vérifier si le clic est dans une zone
    for (const zone of game.clickableZones) {
      if (zone.type === "circle") {
        const distance = Math.sqrt(
          Math.pow(coords.x - zone.x, 2) + Math.pow(coords.y - zone.y, 2),
        );
        if (distance <= (zone.radius || 0)) {
          const newClicks = [...clicks, coords];
          setClicks(newClicks);

          if (newClicks.length === totalObjects) {
            setTimeout(() => setShowVictory(true), 500);
          }
          return;
        }
      }
    }

    // Clic en dehors d'une zone valide : afficher directement la modal de défaite
    console.log(
      "❌ Clic en dehors d'une zone - Affichage de la modal de défaite",
    );
    if (onDefeat) {
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
          <p className="text-sm text-blue-600 mb-4">
            Objets trouvés: {clicks.length} / {totalObjects}
          </p>
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className="relative cursor-pointer w-full min-h-[300px]"
            style={
              imageDimensions
                ? {
                    aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                  }
                : { aspectRatio: "4/3" }
            }
          >
            <Image
              src={game.image}
              alt="Zone de jeu"
              fill
              className="rounded-lg object-contain"
              sizes="100vw"
            />
            {clicks.map((click, index) => (
              <div
                key={index}
                className="absolute w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${click.x}%`, top: `${click.y}%` }}
              />
            ))}
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
