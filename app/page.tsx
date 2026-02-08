"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");

  // Charger le pseudo depuis localStorage au montage
  useEffect(() => {
    const savedPseudo = localStorage.getItem("playerPseudo");
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  const handleStart = () => {
    if (pseudo.trim()) {
      // Sauvegarder le pseudo dans localStorage
      localStorage.setItem("playerPseudo", pseudo.trim());
      // Rediriger vers la page de l'île
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
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url(/backgrounds/paper_texture.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center gap-8 p-8">
        {/* Titre principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 text-center mb-4">
          Île de Yandel
        </h1>

        {/* Input pseudo */}
        <div className="w-full max-w-md">
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Entrez votre pseudo"
            className="w-full px-6 py-4 text-lg md:text-xl rounded-full border-2 border-gray-400 focus:border-orange-500 focus:outline-none text-center bg-white shadow-lg"
            maxLength={20}
          />
        </div>

        {/* Bouton commencer */}
        <button
          onClick={handleStart}
          disabled={!pseudo.trim()}
          className="px-12 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-xl md:text-2xl rounded-full transition-colors uppercase shadow-lg"
        >
          Commencer
        </button>
      </div>
    </div>
  );
}
