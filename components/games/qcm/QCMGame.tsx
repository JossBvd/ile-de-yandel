'use client';

import React, { useState } from 'react';
import { QCMMission } from '@/types/mission';
import { QCMOption } from './QCMOption';
import { Button } from '@/components/ui/Button';

interface QCMGameProps {
  mission: QCMMission;
  onComplete: (answer: number | number[]) => void;
}

export function QCMGame({ mission, onComplete }: QCMGameProps) {
  // Détecter si c'est un QCM à réponses multiples
  const isMultiple = mission.correctAnswers.length > 1;
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (isMultiple) {
      // Mode multiple : toggle la sélection
      setSelectedIndices(prev => 
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      // Mode simple : une seule sélection
      setSelectedIndices([index]);
    }
  };

  const handleSubmit = () => {
    if (selectedIndices.length > 0) {
      // Envoyer un tableau si multiple, sinon un nombre
      onComplete(isMultiple ? selectedIndices : selectedIndices[0]);
    }
  };

  const canSubmit = selectedIndices.length > 0 && 
    (isMultiple ? selectedIndices.length === mission.correctAnswers.length : true);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{mission.question}</h3>
        {isMultiple && (
          <p className="text-sm text-gray-600 mb-4">
            ⚠️ Plusieurs réponses possibles ({mission.correctAnswers.length} réponse(s) attendue(s))
          </p>
        )}
        <div className="space-y-2">
          {mission.options.map((option, index) => (
            <QCMOption
              key={option.id}
              option={option}
              isSelected={selectedIndices.includes(index)}
              onClick={() => handleOptionClick(index)}
              multiple={isMultiple}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Valider
        </Button>
      </div>
    </div>
  );
}
