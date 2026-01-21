'use client';

import React from 'react';

interface MissionTitleProps {
  title: string;
  instruction: string;
}

export function MissionTitle({ title, instruction }: MissionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">{title}</h2>
      <p className="text-lg text-gray-700">{instruction}</p>
    </div>
  );
}
