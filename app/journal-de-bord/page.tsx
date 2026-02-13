"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { useResponsive } from "@/hooks/useResponsive";
import { MISSIONS } from "@/data/missions";
import { IconButton } from "@/components/ui/IconButton";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useUIStore } from "@/store/uiStore";
import { useEffect } from "react";
import type { MissionId } from "@/types/mission";


function isMissionUnlocked(
  missionId: string,
  completedMissions: string[],
): boolean {
  const n = parseInt(missionId.split("-")[1], 10);
  if (n === 1) return true;
  const prevId = `mission-${n - 1}`;
  return (
    completedMissions.includes(prevId) || completedMissions.includes(missionId)
  );
}

function JournalContent() {
  const router = useRouter();
  const { isRotated, width, height } = useOrientationContext();
  const { completedMissions } = useGameProgress();
  const { setLastViewedCompletedMission } = useUIStore();
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium } = useResponsive();

  useEffect(() => {
    const latestCompletedMission = completedMissions.length > 0 
      ? completedMissions[completedMissions.length - 1] 
      : null;
    if (latestCompletedMission) {
      setLastViewedCompletedMission(latestCompletedMission as MissionId);
    }
  }, [completedMissions, setLastViewedCompletedMission]);

  const [selectedMissionId, setSelectedMissionId] =
    useState<string>("mission-1");
  const selectedMission = MISSIONS.find((m) => m.id === selectedMissionId);

  const unlockedMissionIds = useMemo(
    () =>
      new Set(
        MISSIONS.filter((m) => isMissionUnlocked(m.id, completedMissions)).map(
          (m) => m.id,
        ),
      ),
    [completedMissions],
  );

  return (
    <div
      className="relative overflow-hidden flex flex-col min-h-0"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
        minHeight: isRotated ? undefined : "100dvh",
        backgroundImage: "url(/backgrounds/paper_texture.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Titre */}
      <div 
        className="absolute z-10"
        style={{
          top: isSmallScreen ? '4px' : isMediumScreen ? '8px' : '24px',
          left: isSmallScreen ? '4px' : isMediumScreen ? '8px' : '8px',
        }}
      >
        <div 
          className="relative"
          style={{
            width: isSmallScreen ? '192px' : isMediumScreen ? '288px' : '320px',
            height: isSmallScreen ? '64px' : isMediumScreen ? '96px' : '112px',
          }}
        >
          <Image
            src="/ui/encart_map.webp"
            alt=""
            fill
            className="object-contain object-top-left"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 
              className="font-bold text-gray-800 drop-shadow-sm"
              style={{
                fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1.125rem' : '1.25rem',
              }}
            >
              Mon journal de bord
            </h1>
          </div>
        </div>
      </div>

      <div 
        className="absolute top-0 left-0 right-0 bottom-0 flex flex-row min-h-0"
        style={{
          gap: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '32px',
          padding: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '32px',
        }}
      >
        {/* Colonne missions */}
        <div
          className="journal-missions-column flex flex-col w-1/3 min-w-0 min-h-0 overflow-hidden shrink-0 items-center justify-center gap-0"
          style={{ 
            containerType: "size", 
            containerName: "journal-missions-column",
            paddingTop: "clamp(60px, 10vh, 120px)",
            paddingLeft: isSmallScreen ? '24px' : isMediumScreen ? '48px' : '64px',
          }}
        >
          <div
            className="journal-picto-ile relative shrink-0 rounded-lg overflow-hidden"
            style={{ 
              aspectRatio: "280/170"
            }}
          >
            <Image
              src="/ui/picto_ile.webp"
              alt=""
              fill
              className="object-contain object-center"
            />
          </div>
          <div 
            className="flex flex-col w-full shrink-0 items-center"
            style={{
              marginTop: isSmallScreen ? '-8px' : isMediumScreen ? '-16px' : '-24px',
              gap: isSmallScreen ? '2px' : isMediumScreen ? '6px' : '10px',
            }}
          >
          {MISSIONS.map((mission) => {
            const missionNumber = mission.id.split("-")[1];
            const isUnlocked = unlockedMissionIds.has(mission.id);
            return (
              <button
                key={mission.id}
                onClick={() =>
                  isUnlocked && setSelectedMissionId(mission.id)
                }
                disabled={!isUnlocked}
                className={`journal-encart-mission relative shrink-0 rounded-none overflow-hidden transition-all touch-manipulation outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/50 focus-visible:ring-inset ${
                  isUnlocked
                    ? "cursor-pointer hover:opacity-95"
                    : "cursor-not-allowed opacity-50"
                }`}
                style={{ 
                  flexShrink: 0
                }}
                type="button"
                aria-label={`Mission ${missionNumber}`}
                aria-disabled={!isUnlocked}
              >
                <Image
                  src="/ui/encart_journal.webp"
                  alt={`Mission ${missionNumber}`}
                  fill
                  className="object-contain object-center"
                />
                <span className="journal-encart-text absolute inset-0 flex items-center justify-center font-semibold text-gray-800 drop-shadow-sm pointer-events-none">
                  Mission {missionNumber}
                </span>
              </button>
            );
          })}
          </div>
        </div>

        {/* Détail mission */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {selectedMission && (
            <div
              className="flex flex-col rounded-xl min-h-full flex-1 overflow-y-auto"
              style={{
                border: "3px solid #c4a574",
                boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.12)",
                gap: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '24px',
                padding: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '24px',
              }}
            >
              <div 
                className="relative w-full max-w-[200px] self-center shrink-0"
                style={{
                  height: isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px',
                }}
              >
                <Image
                  src="/ui/encart_journal.webp"
                  alt=""
                  fill
                  className="object-contain object-center"
                />
                <span 
                  className="absolute inset-0 flex items-center justify-center font-semibold text-gray-800 drop-shadow-sm"
                  style={{
                    fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.125rem' : '1.25rem',
                  }}
                >
                  Mission {selectedMissionId.split("-")[1]}
                </span>
              </div>

              <div 
                className="flex flex-col"
                style={{
                  gap: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px',
                }}
              >
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="rounded-full shadow-md bg-orange-500"
                    style={{
                      paddingLeft: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '32px',
                      paddingRight: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '32px',
                      paddingTop: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '20px',
                      paddingBottom: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '20px',
                    }}
                  >
                    <p 
                      className="text-white font-medium text-center"
                      style={{
                        fontSize: isSmallScreen ? '0.75rem' : isMediumScreen ? '0.875rem' : isDesktopMedium ? '1rem' : '1.125rem',
                      }}
                    >
                      Ressource enseignant
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton retour */}
      <div 
        className="absolute z-10"
        style={{
          bottom: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '32px',
          left: isSmallScreen ? '8px' : isMediumScreen ? '16px' : '32px',
        }}
      >
        <IconButton
          icon="/ui/icon_back.webp"
          alt="Retour"
          onClick={() => router.push("/carte-de-l-ile")}
          label="Retour"
        />
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <OrientationGuard>
      <JournalContent />
    </OrientationGuard>
  );
}
