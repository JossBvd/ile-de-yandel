"use client";

import Image from "next/image";
import { useOrientationContext } from "@/components/game/OrientationGuard";
import { useResponsive } from "@/hooks/useResponsive";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

const RAFT_COMPLETE_IMAGE = "/raft/radeauM5.png";
const POPUP_BACKGROUND = "/backgrounds/background_journal.webp";
const READ_ALOUD_TEXT =
  "Félicitations ! Tu as construit le radeau ! Tu peux continuer pour découvrir la fin de l'aventure.";

interface RaftCompleteModalProps {
  onContinue: () => void;
}

export function RaftCompleteModal({ onContinue }: RaftCompleteModalProps) {
  const { isRotated, width, height } = useOrientationContext();
  const { isSmallScreen, isMediumScreen } = useResponsive();

  const nextIconSize = isSmallScreen ? 48 : isMediumScreen ? 56 : 64;

  const modalMaxHeight = isRotated
    ? `${height * 0.9}px`
    : "min(90dvh, calc(var(--app-viewport-height, 100dvh) * 0.9))";

  return (
    <div
      className="fixed z-[60] flex items-center justify-center p-4 safe-area-inset overflow-y-auto"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
        left: isRotated ? "50%" : "0",
        top: isRotated ? "50%" : "0",
        marginLeft: isRotated ? `-${width / 2}px` : "0",
        marginTop: isRotated ? `-${height / 2}px` : "0",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="raft-complete-title"
    >
      <div
        className="relative flex flex-col w-full min-h-0 rounded-2xl border-2 border-amber-700/50 shadow-2xl overflow-hidden"
        style={{
          maxWidth: isSmallScreen ? "min(92vw, 420px)" : "min(90vw, 520px)",
          maxHeight: modalMaxHeight,
          padding: isSmallScreen
            ? "16px 14px max(12px, env(safe-area-inset-bottom))"
            : "28px 24px max(20px, env(safe-area-inset-bottom))",
          backgroundImage: `url(${POPUP_BACKGROUND})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 right-3 z-10">
          <ReadAloudButton text={READ_ALOUD_TEXT} ariaLabel="Lire le message" />
        </div>

        <h2
          id="raft-complete-title"
          className="font-bold text-center text-gray-900 shrink-0"
          style={{
            fontSize: isSmallScreen ? "1.125rem" : "1.375rem",
            lineHeight: 1.35,
            marginBottom: isSmallScreen ? 12 : 16,
            paddingTop: 4,
            paddingLeft: 36,
            paddingRight: 36,
          }}
        >
          Félicitations ! Tu as construit le radeau !
        </h2>

        <div
          className="relative w-full flex-1 min-h-0 overflow-hidden"
          style={{
            minHeight: isSmallScreen ? 96 : 120,
          }}
        >
          <Image
            src={RAFT_COMPLETE_IMAGE}
            alt="Radeau terminé"
            fill
            className="object-contain object-center pointer-events-none"
            sizes="(max-width: 640px) 92vw, 500px"
            priority
          />
        </div>

        <div
          className="w-full flex justify-end shrink-0"
          style={{
            marginTop: isSmallScreen ? 10 : 16,
            paddingBottom: "max(4px, env(safe-area-inset-bottom))",
          }}
        >
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 touch-manipulation"
            style={{ padding: 6 }}
            aria-label="Suivant"
          >
            <Image
              src="/ui/icon_next.webp"
              alt=""
              width={64}
              height={64}
              style={{ width: nextIconSize, height: nextIconSize }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
