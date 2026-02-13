'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useOrientationContext } from '@/components/game/OrientationGuard';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { height } = useOrientationContext();
  
  // Déterminer les tailles basées sur la hauteur de l'écran pour le mode PWA
  const isSmallScreen = height < 600;
  const isMediumScreen = height >= 600 && height < 800;
  const isLargeScreen = height >= 800;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    const storedDismissal = localStorage.getItem('pwa-install-dismissed');
    const dismissalTime = storedDismissal ? parseInt(storedDismissal, 10) : 0;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (dismissalTime < oneWeekAgo) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div 
      className="fixed z-50 animate-slide-up"
      style={{
        bottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
        left: isSmallScreen ? '16px' : isMediumScreen ? 'auto' : 'auto',
        right: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
        width: isSmallScreen ? 'calc(100% - 32px)' : isMediumScreen ? '384px' : '384px',
      }}
    >
      <div className="bg-white rounded-lg shadow-xl border-2 border-amber-500 p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src="/ui/icon_menu.webp"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              Installer l'application
            </h3>
            <p className="text-sm text-gray-600">
              Pour une meilleure expérience en plein écran, installez l'application sur votre appareil.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 shrink-0"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Installer
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
