'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useResponsive } from '@/hooks/useResponsive';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function PWAInstallPrompt() {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    const ios = isIOS();
    setIsIOSDevice(ios);

    const storedDismissal = localStorage.getItem('pwa-install-dismissed');
    const dismissalTime = storedDismissal ? parseInt(storedDismissal, 10) : 0;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    if (ios && dismissalTime < oneWeekAgo) {
      const t = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(t);
    }

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

  const showModal = showPrompt && (deferredPrompt !== null || isIOSDevice);
  if (isInstalled || !showModal) {
    return null;
  }

  const containerStyle = {
    bottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
    left: isSmallScreen ? '16px' : 'auto' as const,
    right: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
    width: isSmallScreen ? 'calc(100% - 32px)' : isMediumScreen ? '384px' : '384px',
  };

  const contentStyle = {
    padding: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
    gap: isSmallScreen ? '12px' : isMediumScreen ? '12px' : '12px',
  };

  return (
    <div className="fixed z-50 animate-slide-up" style={containerStyle}>
      <div
        className="bg-white rounded-lg shadow-xl border-2 border-amber-500 flex flex-col"
        style={contentStyle}
      >
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
            {isIOSDevice ? (
              <p className="text-sm text-gray-600">
                Pour jouer en mode plein écran, appuyez sur <strong>Partager</strong> (icône en bas de l'écran), puis sur <strong>« Sur l'écran d'accueil »</strong> pour installer l'application.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Pour jouer en mode plein écran, installez l'application sur votre appareil.
              </p>
            )}
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
          {!isIOSDevice && (
            <button
              onClick={handleInstall}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Installer
            </button>
          )}
          <button
            onClick={handleDismiss}
            className={
              isIOSDevice
                ? 'flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
                : 'px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors'
            }
          >
            {isIOSDevice ? "J'ai compris" : 'Plus tard'}
          </button>
        </div>
      </div>
    </div>
  );
}
