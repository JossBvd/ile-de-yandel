"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";

export default function WelcomePage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium } = useResponsive();

  useEffect(() => {
    const savedPseudo = localStorage.getItem("playerPseudo");
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  const handleStart = () => {
    if (pseudo.trim()) {
      localStorage.setItem("playerPseudo", pseudo.trim());
      router.push("/carte-de-l-ile");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && pseudo.trim()) {
      handleStart();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url(/backgrounds/Background_title_screen.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 
          className="font-bold text-gray-800 text-center mb-4"
          style={{
            fontSize: isSmallScreen ? '2rem' : isMediumScreen ? '2.5rem' : isDesktopSmall ? '3rem' : '3.75rem',
          }}
        >
          Île de Yandel
        </h1>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center px-4 w-full max-w-2xl"
        style={{
          gap: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
        }}
      >
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="PSEUDO"
          className="flex-1 rounded-none border-2 border-gray-400 focus:border-orange-500 focus:outline-none text-center bg-white shadow-lg text-black"
          style={{
            paddingLeft: isSmallScreen ? '24px' : isMediumScreen ? '24px' : '24px',
            paddingRight: isSmallScreen ? '24px' : isMediumScreen ? '24px' : '24px',
            paddingTop: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            paddingBottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.125rem' : '1.25rem',
          }}
          maxLength={20}
        />

        <button
          onClick={handleStart}
          disabled={!pseudo.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors uppercase shadow-lg"
          style={{
            paddingLeft: isSmallScreen ? '32px' : isMediumScreen ? '32px' : '32px',
            paddingRight: isSmallScreen ? '32px' : isMediumScreen ? '32px' : '32px',
            paddingTop: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            paddingBottom: isSmallScreen ? '16px' : isMediumScreen ? '16px' : '16px',
            fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : '1.5rem',
          }}
        >
          JOUER !
        </button>
      </div>
    </div>
  );
}
