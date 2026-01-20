'use client';

import React from 'react';
import { QCMOption as QCMOptionType } from '@/types/step';

interface QCMOptionProps {
  option: QCMOptionType;
  isSelected: boolean;
  onClick: () => void;
  multiple?: boolean;
}

export function QCMOption({ option, isSelected, onClick, multiple = false }: QCMOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
        isSelected
          ? 'border-blue-600 bg-blue-600'
          : 'border-gray-400 bg-white'
      }`}>
        {isSelected && (
          <span className="text-white text-xs font-bold">
            {multiple ? '✓' : '●'}
          </span>
        )}
      </div>
      <span className="text-gray-900 flex-1">{option.text}</span>
    </button>
  );
}
