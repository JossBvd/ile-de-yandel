"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OrientationGuard } from "@/components/game/OrientationGuard";
import { IntroAccessibilityChoiceModal } from "@/components/ui/IntroAccessibilityChoiceModal";
import { IntroNarrativeScreen } from "@/components/ui/IntroNarrativeScreen";
import { STORAGE_KEY_PLAYER_PSEUDO } from "@/lib/constants";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { useReadingAidStore } from "@/store/readingAidStore";

function sanitizePseudo(input: string): string {
  return input
    .trim()
    .replace(/[<>"']/g, "")
    .substring(0, 20);
}

function WelcomeContent({
  onNarrativeStart,
}: {
  onNarrativeStart: () => void;
}) {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [showAudioChoice, setShowAudioChoice] = useState(false);
  const [showReadingAidChoice, setShowReadingAidChoice] = useState(false);
  const { setFirstVisitChoice: setAudioFirstVisitChoice } =
    useAudioDescriptionStore();
  const {
    introWorkflowDone,
    setFirstVisitChoice: setReadingAidFirstVisitChoice,
    setIntroWorkflowDone,
  } = useReadingAidStore();

  useEffect(() => {
    const savedPseudo = sessionStorage.getItem(STORAGE_KEY_PLAYER_PSEUDO);
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  const handlePlayClick = () => {
    const sanitized = sanitizePseudo(pseudo);
    if (!sanitized || sanitized.length < 1) return;
    sessionStorage.setItem(STORAGE_KEY_PLAYER_PSEUDO, sanitized);
    if (!introWorkflowDone) {
      setShowAudioChoice(true);
      return;
    }
    router.push("/carte-de-l-ile");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const sanitized = sanitizePseudo(pseudo);
      if (sanitized && sanitized.length >= 1) {
        handlePlayClick();
      }
    }
  };

  return (
    <div
      id="main-content"
      role="main"
      className="flex flex-col relative overflow-hidden min-h-dvh safe-area-inset bg-[#e8dbb8]"
      style={{
        backgroundImage: "url(/backgrounds/background_journal.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-[clamp(0.625rem,3.5vw,1.5rem)] pt-[max(env(safe-area-inset-top),clamp(0.5rem,2vh,1rem))]">
        <div
          className="relative shrink-0"
          style={{
            width: "clamp(175px, 50vw, 300px)",
            height: "clamp(65px, 13vh, 96px)",
          }}
        >
          <Image
            src="/intro/Logo seine et marne.svg"
            alt="Seine-et-Marne"
            fill
            className="object-contain object-top-left"
            priority
          />
        </div>
        <div
          className="relative shrink-0"
          style={{
            width: "clamp(100px, 32vw, 150px)",
            height: "clamp(100px, 18vh, 140px)",
          }}
        >
          <Image
            src="/intro/logoMK_fond_clair.png"
            alt="MK Team Building"
            fill
            className="object-contain object-top-right"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-[clamp(0.75rem,4vw,2rem)] pt-[clamp(4rem,14vh,6rem)] max-sm:landscape:pt-[max(env(safe-area-inset-top),0.75rem)] sm:pt-0">
        <div
          className="relative mx-auto w-full max-w-[min(960px,95vw)] lg:max-w-[min(800px,92vw)]"
          style={{
            aspectRatio: "280/170",
            width:
              "min(100%, calc((100dvh - 15rem) * 280 / 170))",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
            <Image
              src="/ui/picto_ile.webp"
              alt=""
              fill
              className="object-contain object-center"
              priority
            />
          </div>
          <h1
            className="absolute inset-0 flex items-center justify-center font-bold text-gray-800 text-center px-4"
            style={{ fontSize: "clamp(1.75rem, 5vw + 1rem, 3.75rem)" }}
          >
            Le crash de Yandel
          </h1>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-3 sm:gap-4 px-[clamp(0.75rem,4vw,2rem)] pb-[max(env(safe-area-inset-bottom),clamp(1rem,5vh,2rem))] max-w-[672px] mx-auto shrink-0">
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="PSEUDO"
          className="flex-1 rounded-none border-2 border-gray-400 focus:border-orange-500 focus:outline-none text-center bg-white shadow-lg text-gray-900 min-w-0 min-h-[48px] px-4 py-3 touch-manipulation"
          style={{ fontSize: "clamp(1rem, 2vw + 0.5rem, 1.25rem)" }}
          maxLength={20}
          aria-label="Votre pseudo"
        />
        <button
          type="button"
          onClick={handlePlayClick}
          disabled={!pseudo.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors uppercase shadow-lg touch-manipulation shrink-0 min-h-[48px] min-w-[120px] px-6 py-3"
          style={{ fontSize: "clamp(1.125rem, 2vw + 0.5rem, 1.5rem)" }}
          aria-label="Jouer"
        >
          JOUER !
        </button>
      </div>

      <IntroAccessibilityChoiceModal
        isOpen={showAudioChoice}
        acronym="AD"
        question="Veux - tu activer l'audiodescription ?"
        onYes={() => {
          setAudioFirstVisitChoice(true);
          setShowAudioChoice(false);
          setShowReadingAidChoice(true);
        }}
        onNo={() => {
          setAudioFirstVisitChoice(false);
          setShowAudioChoice(false);
          setShowReadingAidChoice(true);
        }}
      />

      <IntroAccessibilityChoiceModal
        isOpen={showReadingAidChoice}
        acronym="DYS"
        question="Veux - tu activer l'aide à la lecture ?"
        onYes={() => {
          setReadingAidFirstVisitChoice(true);
          setIntroWorkflowDone(true);
          setShowReadingAidChoice(false);
          onNarrativeStart();
        }}
        onNo={() => {
          setReadingAidFirstVisitChoice(false);
          setIntroWorkflowDone(true);
          setShowReadingAidChoice(false);
          onNarrativeStart();
        }}
      />
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const [showIntroNarrative, setShowIntroNarrative] = useState(false);

  if (showIntroNarrative) {
    return (
      <OrientationGuard>
        <IntroNarrativeScreen
          onComplete={() => router.push("/carte-de-l-ile")}
        />
      </OrientationGuard>
    );
  }

  return (
    <OrientationGuard allowPortrait>
      <WelcomeContent onNarrativeStart={() => setShowIntroNarrative(true)} />
    </OrientationGuard>
  );
}
