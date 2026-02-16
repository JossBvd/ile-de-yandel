"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";
import { useDndSensors } from "@/hooks/useDndSensors";
import { useDndCollisionDetection } from "@/hooks/useDndCollisionDetection";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Step, DragSortGameData } from "@/types/step";
import { SortableItem } from "./SortableItem";
import { Button } from "@/components/ui/Button";
import { VictoryModal } from "@/components/ui/VictoryModal";
import { getRaftPieceByStepId } from "@/data/raft";

interface DragSortGameProps {
  step: Step;
  onComplete: () => void;
  onDefeat?: () => void;
}

export function DragSortGame({
  step,
  onComplete,
  onDefeat,
}: DragSortGameProps) {
  const game = step.game as DragSortGameData;
  const [items, setItems] = useState(game.items);
  const [showVictory, setShowVictory] = useState(false);
  const sensors = useDndSensors();
  const collisionDetection = useDndCollisionDetection();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    const isCorrect = items.every(
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
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex justify-center mt-6">
          <Button onClick={handleSubmit}>Valider</Button>
        </div>
      </div>

      <VictoryModal
        isOpen={showVictory}
        onContinue={handleContinue}
        raftPieceName={getRaftPieceByStepId(step.id)?.name}
        raftPieceImage={getRaftPieceByStepId(step.id)?.image}
      />
    </div>
  );
}
