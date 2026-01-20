'use client';

import React from 'react';
import { Hint } from '@/types/step';

interface HintPanelProps {
  hint: Hint;
  isVisible: boolean;
}

export function HintPanel({ hint, isVisible }: HintPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1 space-y-2">
          {hint.text && (
            <p className="text-yellow-800">{hint.text}</p>
          )}
          {hint.simplifiedInstruction && (
            <p className="text-yellow-700 italic">{hint.simplifiedInstruction}</p>
          )}
          {hint.visualHighlight && (
            <p className="text-yellow-700 text-sm">{hint.visualHighlight}</p>
          )}
        </div>
      </div>
    </div>
  );
}
