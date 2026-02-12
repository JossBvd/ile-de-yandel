"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useOrientationContext } from "@/components/game/OrientationGuard";

interface MissionCompleteModalProps {
  isOpen: boolean;
  missionId?: string;
  completionText?: string;
  onJournalClick: () => void;
  onRaftClick: () => void;
  onMapClick: () => void;
}

export function MissionCompleteModal({
  isOpen,
  missionId = "mission-1",
  completionText = "Grâce à tout ce que j'ai collecté près de l'épave, je vais pouvoir fabriquer une voile pour mon radeau !",
  onJournalClick,
  onRaftClick,
  onMapClick,
}: MissionCompleteModalProps) {
  const { isRotated, width, height } = useOrientationContext();
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  if (!isOpen) return null;

  const missionNumber = missionId.replace("mission-", "") || "1";
  const isSmallScreen = screenWidth > 0 && screenWidth < 593;

  return (
    <div
      className="fixed z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100vh",
        left: isRotated ? "50%" : "0",
        top: isRotated ? "50%" : "0",
        marginLeft: isRotated ? `-${width / 2}px` : "0",
        marginTop: isRotated ? `-${height / 2}px` : "0",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mission accomplie"
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          aspectRatio: "16/9",
          width: isRotated 
            ? `${Math.min(width * 0.95, height * 0.95 * 16/9)}px` 
            : isSmallScreen 
              ? `min(98vw, calc(98vh * 16/9))`
              : `min(95vw, calc(95vh * 16/9))`,
          maxWidth: isRotated ? `${width * 0.95}px` : isSmallScreen ? "98vw" : "95vw",
          maxHeight: isRotated ? `${height * 0.95}px` : "95vh",
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/ui/support_paper.webp"
            alt="Mission accomplie"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1920px) 95vw, 95vh"
            style={{ 
              objectFit: "cover",
              objectPosition: "center"
            }}
          />

          <div 
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
              paddingLeft: isSmallScreen ? "3%" : "5%",
              paddingRight: isSmallScreen ? "3%" : "5%",
              paddingTop: isSmallScreen ? "3%" : "5%",
              paddingBottom: isSmallScreen ? "3%" : "5%",
            }}
          >
            <div 
              className="w-full flex items-center justify-center"
              style={{
                maxWidth: isSmallScreen ? "98%" : "95%",
                gap: isSmallScreen ? "0.75rem" : undefined,
              }}
            >
              <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-1 max-w-[40%] min-w-0">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 shrink-0">
                  <Image
                    src="/ui/icon_right.webp"
                    alt="Mission accomplie"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <h2 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide wrap-break-word text-center"
                  style={{ color: "#1a1a1a" }}
                >
                  MISSION {missionNumber} ACCOMPLIE !
                </h2>
                
                <p 
                  className="text-sm sm:text-base md:text-lg lg:text-xl italic leading-relaxed wrap-break-word text-center"
                  style={{ color: "#1a1a1a" }}
                >
                  « {completionText} »
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 items-center shrink-0">
                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onJournalClick}
                  className="relative flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 group"
                  aria-label="Journal de bord - complète tes souvenirs"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-24 lg:h-24 shrink-0 z-10">
                    <Image
                      src="/ui/icon_menu.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div 
                    className="flex flex-col items-start px-5 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-full -ml-3 sm:-ml-4 md:-ml-5 lg:-ml-6 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase whitespace-nowrap">
                      journal de bord
                    </span>
                  </div>
                </button>
                <span 
                  className="text-[10px] sm:text-xs md:text-sm italic text-center whitespace-nowrap"
                  style={{ color: "#1a1a1a" }}
                >
                  complète tes souvenirs
                </span>
                </div>

                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onRaftClick}
                  className="relative flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 group"
                  aria-label="Radeau - fabrique ton embarcation"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-24 lg:h-24 shrink-0 z-10">
                    <Image
                      src="/ui/icon_radeau.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div 
                    className="flex flex-col items-start px-5 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-full -ml-3 sm:-ml-4 md:-ml-5 lg:-ml-6 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase whitespace-nowrap">
                      radeau
                    </span>
                  </div>
                </button>
                <span 
                  className="text-[10px] sm:text-xs md:text-sm italic text-center whitespace-nowrap"
                  style={{ color: "#1a1a1a" }}
                >
                  fabrique ton embarcation
                </span>
                </div>

                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onMapClick}
                  className="relative flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 group"
                  aria-label="Carte de l'île - continuer l'aventure"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-24 lg:h-24 shrink-0 z-10">
                    <Image
                      src="/ui/icon_next.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div 
                    className="flex flex-col items-start px-5 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-full -ml-3 sm:-ml-4 md:-ml-5 lg:-ml-6 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase whitespace-nowrap">
                      carte de l&apos;île
                    </span>
                  </div>
                </button>
                <span 
                  className="text-[10px] sm:text-xs md:text-sm italic text-center whitespace-nowrap"
                  style={{ color: "#1a1a1a" }}
                >
                  continuer l&apos;aventure
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
