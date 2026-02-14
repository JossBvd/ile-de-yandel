"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrientationGuard } from "@/components/game/OrientationGuard";

function WelcomeContent() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");

  useEffect(() => {
    const savedPseudo = localStorage.getItem("playerPseudo");
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  const handlePlayClick = () => {
    if (!pseudo.trim()) return;
    localStorage.setItem("playerPseudo", pseudo.trim());
    router.push("/carte-de-l-ile");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && pseudo.trim()) {
      handlePlayClick();
    }
  };

  return (
    <div
      className="flex flex-col relative overflow-hidden min-h-dvh safe-area-inset"
      style={{
        backgroundImage: "url(/backgrounds/Background_title_screen.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-[clamp(0.75rem,4vw,2rem)] pt-[clamp(1rem,5vh,2rem)] pb-2">
        <h1
          className="font-bold text-gray-800 text-center mb-4 md:mb-6"
          style={{ fontSize: "clamp(1.75rem, 5vw + 1rem, 3.75rem)" }}
        >
          Île de Yandel
        </h1>
      </div>

      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-3 sm:gap-4 px-[clamp(0.75rem,4vw,2rem)] pb-[max(env(safe-area-inset-bottom),clamp(1rem,5vh,2rem))] max-w-[672px] mx-auto shrink-0"
      >
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
    </div>
  );
}

export default function WelcomePage() {
  return (
    <OrientationGuard allowPortrait>
      <WelcomeContent />
    </OrientationGuard>
  );
}
