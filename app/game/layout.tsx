'use client';

import React from 'react';
import { GameContainer } from '@/components/layout/GameContainer';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameContainer>{children}</GameContainer>
  );
}
