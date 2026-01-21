'use client';

import React from 'react';

interface ContinueButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function ContinueButton({
  children = 'Continuer',
  className = '',
  ...props
}: ContinueButtonProps) {
  return (
    <button
      className={`px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl md:text-2xl rounded-full transition-colors uppercase shadow-lg cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
