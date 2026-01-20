'use client';

import React from 'react';

interface ErrorFeedbackProps {
  message: string;
  onRetry: () => void;
}

export function ErrorFeedback({ message, onRetry }: ErrorFeedbackProps) {
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl">❌</span>
        <div className="flex-1">
          <p className="text-red-800 font-medium">{message}</p>
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}
