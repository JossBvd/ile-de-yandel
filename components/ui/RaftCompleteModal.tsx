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
  const modalMaxHeightPx = height * 0.9;
  const modalPaddingY = isSmallScreen ? 32 : 56;
  const titleBlockHeight = isSmallScreen ? 56 : 72;
  const footerBlockHeight = nextIconSize + (isSmallScreen ? 20 : 28);
  const imageMaxHeight = Math.max(
    72,
    Math.min(
      isSmallScreen ? 150 : 260,
      modalMaxHeightPx - modalPaddingY - titleBlockHeight - footerBlockHeight - 8,
    ),
  );
  const imageMaxWidth = isSmallScreen ? 200 : 360;

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
        className="relative flex flex-col items-stretch w-full rounded-2xl border-2 border-amber-700/50 shadow-2xl overflow-hidden"
        style={{
          maxWidth: isSmallScreen ? "min(92vw, 420px)" : "min(90vw, 520px)",
          maxHeight: `${modalMaxHeightPx}px`,
          padding: isSmallScreen
            ? "16px 14px max(12px, env(safe-area-inset-bottom))"
            : "28px 24px max(20px, env(safe-area-inset-bottom))",
          backgroundImage: `url(${POPUP_BACKGROUND})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          gap: isSmallScreen ? 8 : 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-start gap-2 shrink-0">
          <h2
            id="raft-complete-title"
            className="flex-1 min-w-0 font-bold text-center text-gray-900"
            style={{
              fontSize: isSmallScreen ? "1.125rem" : "1.375rem",
              lineHeight: 1.35,
              paddingLeft: 4,
              paddingRight: 4,
            }}
          >
            Félicitations ! Tu as construit le radeau !
          </h2>
          <div className="shrink-0">
            <ReadAloudButton
              text={READ_ALOUD_TEXT}
              ariaLabel="Lire le message"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center shrink-0 overflow-hidden">
          <Image
            src={RAFT_COMPLETE_IMAGE}
            alt="Radeau terminé"
            width={360}
            height={270}
            className="object-contain pointer-events-none w-auto h-auto max-w-full"
            style={{
              maxWidth: imageMaxWidth,
              maxHeight: imageMaxHeight,
            }}
            sizes="(max-width: 640px) 200px, 360px"
            priority
          />
        </div>

        <div
          className="w-full flex justify-end shrink-0"
          style={{
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
