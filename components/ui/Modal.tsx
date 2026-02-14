'use client';

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { isSmallScreen, isMediumScreen, isDesktopSmall } = useResponsive();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4"
        style={{
          maxWidth: isSmallScreen ? '90%' : isMediumScreen ? '85%' : isDesktopSmall ? '600px' : '768px',
          padding: isSmallScreen ? '16px' : isMediumScreen ? '20px' : '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
        )}
        <div className="text-gray-700">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
