'use client';

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface ContinueButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function ContinueButton({
  children = 'Continuer',
  className = '',
  ...props
}: ContinueButtonProps) {
  const { isSmallScreen, isMediumScreen, isDesktopSmall } = useResponsive();
  
  return (
    <button
      className={`bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors uppercase shadow-lg cursor-pointer ${className}`}
      style={{
        paddingLeft: isSmallScreen ? '48px' : isMediumScreen ? '48px' : '48px',
        paddingRight: isSmallScreen ? '48px' : isMediumScreen ? '48px' : '48px',
        paddingTop: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
        paddingBottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
        fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : '1.5rem',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
