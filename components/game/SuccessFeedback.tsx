'use client';

import React from 'react';

export function SuccessFeedback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md mx-4">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Bravo !</h3>
        <p className="text-gray-700 mb-4">Vous avez réussi cette étape !</p>
      </div>
    </div>
  );
}
