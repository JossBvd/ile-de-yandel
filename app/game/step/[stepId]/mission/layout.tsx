'use client';

import React from 'react';

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout vide pour permettre aux pages mission de gérer leur propre layout
  return <>{children}</>;
}
