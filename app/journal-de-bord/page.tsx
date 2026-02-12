"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
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
      <div className="absolute top-1 left sm:top-1 md:top-6 z-10">
        <div className="relative w-48 h-16 sm:w-72 sm:h-24 md:w-80 md:h-28">
          <Image
            src="/ui/encart_map.webp"
            alt=""
            fill
            className="object-contain object-top-left"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 drop-shadow-sm">
              Mon journal de bord
            </h1>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-row gap-2 sm:gap-4 md:gap-8 p-2 sm:p-4 md:p-8 min-h-0">
        {/* Colonne missions */}
        <div
          className="journal-missions-column flex flex-col w-1/3 min-w-0 min-h-0 overflow-hidden pl-6 sm:pl-14 md:pl-16 shrink-0 items-center justify-center gap-0"
          style={{ 
            containerType: "size", 
            containerName: "journal-missions-column",
            paddingTop: "clamp(60px, 10vh, 120px)"
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
          <div className="flex flex-col w-full shrink-0 -mt-2 sm:-mt-4 md:-mt-6 items-center gap-0.5 sm:gap-1.5 md:gap-2.5">
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
              className="flex flex-col gap-2 sm:gap-4 md:gap-6 rounded-xl p-3 sm:p-4 md:p-6 min-h-full flex-1 overflow-y-auto"
              style={{
                border: "3px solid #c4a574",
                boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.12)",
              }}
            >
              <div className="relative w-full max-w-[200px] h-12 sm:h-14 md:h-16 self-center shrink-0">
                <Image
                  src="/ui/encart_journal.webp"
                  alt=""
                  fill
                  className="object-contain object-center"
                />
                <span className="absolute inset-0 flex items-center justify-center font-semibold text-gray-800 drop-shadow-sm text-base sm:text-lg md:text-xl">
                  Mission {selectedMissionId.split("-")[1]}
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="rounded-full px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 shadow-md bg-orange-500"
                  >
                    <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium text-center">
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
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-8 md:left-8 z-10">
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
