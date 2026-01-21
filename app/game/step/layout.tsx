'use client';

import React from 'react';

export default function StepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout vide pour permettre aux pages step de gérer leur propre layout
  return <>{children}</>;
}
