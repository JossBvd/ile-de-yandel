'use client';

import React from 'react';
import { GameHeader } from './GameHeader';
import { GameFooter } from './GameFooter';

interface GameContainerProps {
  children: React.ReactNode;
}

export function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GameHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      <GameFooter />
    </div>
  );
}
