"use client";

import React from "react";
import Image from "next/image";
import { useOrientationContext } from "@/components/game/OrientationGuard";
import { useResponsive } from "@/hooks/useResponsive";

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
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium } = useResponsive();

  if (!isOpen) return null;

  const missionNumber = missionId.replace("mission-", "") || "1";

  return (
    <div
      className="fixed z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
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
              ? `min(98vw, calc(98dvh * 16/9))`
              : `min(95vw, calc(95dvh * 16/9))`,
          maxWidth: isRotated ? `${width * 0.95}px` : isSmallScreen ? "98vw" : "95vw",
          maxHeight: isRotated ? `${height * 0.95}px` : "95dvh",
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
              <div 
                className="flex flex-col items-center flex-1 max-w-[40%] min-w-0"
                style={{
                  gap: isSmallScreen ? '12px' : isMediumScreen ? '16px' : isDesktopSmall ? '20px' : '24px',
                }}
              >
                <div 
                  className="relative shrink-0"
                  style={{
                    width: isSmallScreen ? '64px' : isMediumScreen ? '80px' : isDesktopSmall ? '96px' : '112px',
                    height: isSmallScreen ? '64px' : isMediumScreen ? '80px' : isDesktopSmall ? '96px' : '112px',
                  }}
                >
                  <Image
                    src="/ui/icon_right.webp"
                    alt="Mission accomplie"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <h2 
                  className="font-bold uppercase tracking-wide wrap-break-word text-center"
                  style={{ 
                    color: "#1a1a1a",
                    fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.5rem' : isDesktopSmall ? '1.875rem' : '2.25rem',
                  }}
                >
                  MISSION {missionNumber} ACCOMPLIE !
                </h2>
                
                <p 
                  className="italic leading-relaxed wrap-break-word text-center"
                  style={{ 
                    color: "#1a1a1a",
                    fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : isDesktopSmall ? '1.125rem' : '1.25rem',
                  }}
                >
                  « {completionText} »
                </p>
              </div>

              <div 
                className="flex flex-col items-center shrink-0"
                style={{
                  gap: isSmallScreen ? '16px' : isMediumScreen ? '20px' : isDesktopSmall ? '24px' : '28px',
                }}
              >
                <div 
                  className="flex flex-col items-center"
                  style={{
                    gap: isSmallScreen ? '4px' : '6px',
                  }}
                >
                <button
                  onClick={onJournalClick}
                  className="relative flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 group"
                  aria-label="Journal de bord - complète tes souvenirs"
                >
                  <div 
                    className="relative shrink-0 z-10"
                    style={{
                      width: isSmallScreen ? '56px' : isMediumScreen ? '64px' : isDesktopSmall ? '72px' : '96px',
                      height: isSmallScreen ? '56px' : isMediumScreen ? '64px' : isDesktopSmall ? '72px' : '96px',
                    }}
                  >
                    <Image
                      src="/ui/icon_menu.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div 
                    className="flex flex-col items-start rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      paddingLeft: isSmallScreen ? '20px' : isMediumScreen ? '24px' : isDesktopSmall ? '28px' : '32px',
                      paddingRight: isSmallScreen ? '20px' : isMediumScreen ? '24px' : isDesktopSmall ? '28px' : '32px',
                      paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '12px' : '12px',
                      paddingBottom: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '12px' : '12px',
                      marginLeft: isSmallScreen ? '-12px' : isMediumScreen ? '-16px' : isDesktopSmall ? '-20px' : '-24px',
                      width: isSmallScreen ? '180px' : isMediumScreen ? '200px' : isDesktopSmall ? '220px' : '240px',
                    }}
                  >
                    <span 
                      className="text-white font-bold uppercase whitespace-nowrap"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : isDesktopSmall ? '1rem' : '1.125rem',
                      }}
                    >
                      journal de bord
                    </span>
                  </div>
                </button>
                <span 
                  className="italic text-center whitespace-nowrap"
                  style={{ 
                    color: "#1a1a1a",
                    fontSize: isSmallScreen ? '10px' : isMediumScreen ? '0.75rem' : isDesktopSmall ? '0.875rem' : '0.875rem',
                  }}
                >
                  complète tes souvenirs
                </span>
                </div>

                <div 
                  className="flex flex-col items-center"
                  style={{
                    gap: isSmallScreen ? '4px' : '6px',
                  }}
                >
                <button
                  onClick={onRaftClick}
                  className="relative flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 group"
                  aria-label="Radeau - fabrique ton embarcation"
                >
                  <div 
                    className="relative shrink-0 z-10"
                    style={{
                      width: isSmallScreen ? '56px' : isMediumScreen ? '64px' : isDesktopSmall ? '72px' : '96px',
                      height: isSmallScreen ? '56px' : isMediumScreen ? '64px' : isDesktopSmall ? '72px' : '96px',
                    }}
                  >
                    <Image
                      src="/ui/icon_radeau.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div 
                    className="flex flex-col items-start rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      paddingLeft: isSmallScreen ? '20px' : isMediumScreen ? '24px' : isDesktopSmall ? '28px' : '32px',
                      paddingRight: isSmallScreen ? '20px' : isMediumScreen ? '24px' : isDesktopSmall ? '28px' : '32px',
                      paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '12px' : '12px',
                      paddingBottom: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '12px' : '12px',
                      marginLeft: isSmallScreen ? '-12px' : isMediumScreen ? '-16px' : isDesktopSmall ? '-20px' : '-24px',
                      width: isSmallScreen ? '180px' : isMediumScreen ? '200px' : isDesktopSmall ? '220px' : '240px',
                    }}
                  >
                    <span 
                      className="text-white font-bold uppercase whitespace-nowrap"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : isDesktopSmall ? '1rem' : '1.125rem',
                      }}
                    >
                      radeau
                    </span>
                  </div>
                </button>
                <span 
                  className="italic text-center whitespace-nowrap"
                  style={{ 
                    color: "#1a1a1a",
                    fontSize: isSmallScreen ? '10px' : isMediumScreen ? '0.75rem' : isDesktopSmall ? '0.875rem' : '0.875rem',
                  }}
                >
                  fabrique ton embarcation
                </span>
                </div>

                <div 
                  className="flex flex-col items-center"
                  style={{
                    gap: isSmallScreen ? '4px' : '6px',
                  }}
                >
                <button
                  onClick={onMapClick}
                  className="relative flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 group"
                  aria-label="Carte de l'île - continuer l'aventure"
                >
                  <div 
                    className="relative shrink-0 z-10"
                    style={{
                      width: isSmallScreen ? '56px' : isMediumScreen ? '64px' : isDesktopSmall ? '72px' : '96px',
                      height: isSmallScreen ? '56px' : isMediumScreen ? '64px' : isDesktopSmall ? '72px' : '96px',
                    }}
                  >
                    <Image
                      src="/ui/icon_next.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div 
                    className="flex flex-col items-start rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      paddingLeft: isSmallScreen ? '20px' : isMediumScreen ? '24px' : isDesktopSmall ? '28px' : '32px',
                      paddingRight: isSmallScreen ? '20px' : isMediumScreen ? '24px' : isDesktopSmall ? '28px' : '32px',
                      paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '12px' : '12px',
                      paddingBottom: isSmallScreen ? '8px' : isMediumScreen ? '10px' : isDesktopSmall ? '12px' : '12px',
                      marginLeft: isSmallScreen ? '-12px' : isMediumScreen ? '-16px' : isDesktopSmall ? '-20px' : '-24px',
                      width: isSmallScreen ? '180px' : isMediumScreen ? '200px' : isDesktopSmall ? '220px' : '240px',
                    }}
                  >
                    <span 
                      className="text-white font-bold uppercase whitespace-nowrap"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : isDesktopSmall ? '1rem' : '1.125rem',
                      }}
                    >
                      carte de l&apos;île
                    </span>
                  </div>
                </button>
                <span 
                  className="italic text-center whitespace-nowrap"
                  style={{ 
                    color: "#1a1a1a",
                    fontSize: isSmallScreen ? '10px' : isMediumScreen ? '0.75rem' : isDesktopSmall ? '0.875rem' : '0.875rem',
                  }}
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
