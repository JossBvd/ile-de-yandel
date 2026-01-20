'use client';

import React from 'react';
import { Button } from './Button';

interface HintButtonProps {
  onClick: () => void;
  used?: boolean;
  disabled?: boolean;
}

export function HintButton({ onClick, used = false, disabled = false }: HintButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={used ? 'opacity-50' : ''}
    >
      {used ? '💡 Indice utilisé' : '💡 Indice'}
    </Button>
  );
}
