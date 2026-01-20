'use client';

import React from 'react';
import { InventoryButton } from '@/components/ui/InventoryButton';

export function GameHeader() {
  return (
    <header className="w-full bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">L'île de Yandel</h1>
        <InventoryButton />
      </div>
    </header>
  );
}
