"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrientationGuard, useOrientationContext } from "@/components/game/OrientationGuard";

function WelcomeContent() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const { height } = useOrientationContext();
  
  // Déterminer les tailles basées sur la hauteur de l'écran pour le mode PWA
  const isSmallScreen = height < 600;
  const isMediumScreen = height >= 600 && height < 800;
  const isLargeScreen = height >= 800;

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
            fontSize: isSmallScreen ? '2rem' : isMediumScreen ? '2.5rem' : '3rem',
          }}
        >
          Île de Yandel
        </h1>
      </div>

      <div 
        className="absolute left-1/2 transform -translate-x-1/2 flex items-center w-full max-w-2xl"
        style={{
          bottom: isSmallScreen ? '24px' : isMediumScreen ? '32px' : '32px',
          gap: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
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
            padding: isSmallScreen ? '12px 20px' : isMediumScreen ? '14px 24px' : '16px 24px',
            fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.125rem' : '1.25rem',
          }}
          maxLength={20}
        />

        <button
          onClick={handleStart}
          disabled={!pseudo.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors uppercase shadow-lg"
          style={{
            padding: isSmallScreen ? '12px 24px' : isMediumScreen ? '14px 28px' : '16px 32px',
            fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.25rem' : '1.5rem',
          }}
        >
          JOUER !
        </button>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <OrientationGuard>
      <WelcomeContent />
    </OrientationGuard>
  );
}
