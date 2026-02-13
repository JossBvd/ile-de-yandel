"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePWAMode } from "@/hooks/usePWAMode";
import { getMissionById, getStepsByMissionId } from "@/data/missions";
import { getStepPath } from "@/lib/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { isMissionCompleted, getNextStep } from "@/lib/engine/missionEngine";
import { useUIStore } from "@/store/uiStore";
import type { MissionId } from "@/types/mission";

const MISSION_DISPLAY_NAMES: Record<string, string> = {
  "mission-1": "L'épave de l'avion",
  "mission-2": "Mission 2",
  "mission-3": "Mission 3",
  "mission-4": "Mission 4",
  "mission-5": "Mission 5",
};

function HomeContent() {
  const router = useRouter();
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    null,
  );
  const {
    completedSteps,
    completedMissions,
    reset: resetProgress,
    resetMissionSteps,
  } = useGameProgress();
  const { collectedPieces, reset: resetInventory } = useInventory();
  const { viewedMissions, raftViewed, lastViewedCompletedMission, markMissionAsViewed, markRaftAsViewed, setLastViewedCompletedMission, reset: resetUI } = useUIStore();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { isRotated, width, height } = useOrientationContext();
  const { isPWAFullscreen } = usePWAMode();

  const isMissionUnlocked = (missionId: string) => {
    if (completedMissions.includes(missionId)) return true;
    const prevMission = getMissionById(missionId);
    return prevMission
      ? isMissionCompleted(prevMission, completedSteps)
      : false;
  };

  const isMissionNew = (missionId: string, available: boolean) =>
    available &&
    !completedSteps.some((id) => id.startsWith(`${missionId}-`)) &&
    !viewedMissions.has(missionId as MissionId);

  const hasPendingFusionForMission = (missionId: string) => {
    if (!completedMissions.includes(missionId)) return false;
    const steps = getStepsByMissionId(missionId);
    const pieceIds = steps
      .map((s) => s.raftPiece)
      .filter((id): id is string => id != null);
    if (pieceIds.length !== 3) return false;
    return pieceIds.every((id) => collectedPieces.includes(id));
  };
  const showRaftNew = !raftViewed && completedMissions.some(hasPendingFusionForMission);

  const missions = [
    {
      id: "mission-1",
      available: true,
      positionMobile: {
        top: "50%",
        left: "12%",
        transform: "translate(-50%, -50%)",
      },
      positionDesktop: {
        top: "45%",
        left: "15%",
        transform: "translate(-50%, -50%)",
      },
    },
    {
      id: "mission-2",
      available: isMissionUnlocked("mission-1"),
      positionMobile: {
        top: "78%",
        left: "35%",
        transform: "translate(-50%, -50%)",
      },
      positionDesktop: {
        top: "78%",
        left: "38%",
        transform: "translate(-50%, -50%)",
      },
    },
    {
      id: "mission-3",
      available: isMissionUnlocked("mission-2"),
      positionMobile: {
        top: "22%",
        left: "40%",
        transform: "translate(-50%, -50%)",
      },
      positionDesktop: {
        top: "22%",
        left: "43%",
        transform: "translate(-50%, -50%)",
      },
    },
    {
      id: "mission-4",
      available: isMissionUnlocked("mission-3"),
      positionMobile: {
        top: "22%",
        left: "72%",
        transform: "translate(-50%, -50%)",
      },
      positionDesktop: {
        top: "28%",
        left: "72%",
        transform: "translate(-50%, -50%)",
      },
    },
    {
      id: "mission-5",
      available: isMissionUnlocked("mission-4"),
      positionMobile: {
        top: "78%",
        left: "72%",
        transform: "translate(-50%, -50%)",
      },
      positionDesktop: {
        top: "72%",
        left: "76%",
        transform: "translate(-50%, -50%)",
      },
    },
  ];

  const latestCompletedMission = completedMissions.length > 0 
    ? completedMissions[completedMissions.length - 1] 
    : null;
  const showJournalNew = latestCompletedMission !== lastViewedCompletedMission && 
    missions.some((m) => m.available);

  const handleMissionClick = (missionId: string, available: boolean) => {
    if (!available) return;
    const mission = getMissionById(missionId);
    if (!mission) return;
    markMissionAsViewed(missionId as MissionId);
    setSelectedMissionId(missionId);
  };

  const handleExploreMission = () => {
    if (!selectedMissionId) return;
    const mission = getMissionById(selectedMissionId);
    if (!mission) return;

    const nextStepId = getNextStep(mission, completedSteps);
    setSelectedMissionId(null);

    if (nextStepId) {
      router.push(getStepPath(selectedMissionId, nextStepId));
    } else {
      resetMissionSteps(mission.steps);
      const firstStepId = mission.steps[0];
      if (firstStepId) {
        router.push(getStepPath(selectedMissionId, firstStepId));
      }
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : isPWAFullscreen ? `${height}px` : "100dvh",
        backgroundImage: "url(/backgrounds/background_menu_screen.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Titre */}
      <div className="absolute top-4 left sm:top-2 md:top-8 z-10">
        <div className="relative w-60 h-20 sm:w-72 sm:h-24 md:w-80 md:h-28">
          <Image
            src="/ui/encart_map.webp"
            alt=""
            fill
            className="object-contain object-top-left"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-base sm:text-sm md:text-lg lg:text-2xl font-bold text-gray-800 drop-shadow-sm">
              Carte de l&apos;île
            </h1>
          </div>
        </div>
      </div>

      {/* Bouton reset */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-16 md:right-4 z-10">
        <button
          onClick={() => {
            if (
              window.confirm(
                "Êtes-vous sûr de vouloir réinitialiser toute la progression ?",
              )
            ) {
              resetProgress();
              resetInventory();
              resetUI();
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors text-sm sm:text-base"
          title="Réinitialiser la progression"
        >
          🔄 Reset
        </button>
      </div>

      {/* Conteneur missions */}
      <div className="absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[85%] sm:w-[80%] sm:h-[88%] md:w-[70%] md:h-[88%]">
        <div className="relative h-full w-full">
          {missions.map((missionConfig) => {
            const mission = getMissionById(missionConfig.id);
            if (!mission) return null;

            const missionNumber = missionConfig.id.split("-")[1];

            return (
              <div
                key={missionConfig.id}
                onClick={() =>
                  handleMissionClick(missionConfig.id, missionConfig.available)
                }
                className={`absolute flex flex-col items-center justify-center transition-all ${
                  missionConfig.available
                    ? "cursor-pointer hover:scale-105"
                    : "cursor-not-allowed opacity-50"
                }`}
                style={
                  isMobile
                    ? missionConfig.positionMobile
                    : missionConfig.positionDesktop
                }
              >
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-52 lg:h-52">
                  <Image
                    src={
                      missionConfig.available
                        ? "/ui/mission_button.webp"
                        : "/ui/mission_button_locked.webp"
                    }
                    alt={`Mission ${missionNumber}`}
                    fill
                    className="object-contain"
                  />
                  {isMissionNew(missionConfig.id, missionConfig.available) && (
                    <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 md:top-4 md:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 pointer-events-none">
                      <Image
                        src="/ui/icon_new.webp"
                        alt="Nouveau"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pt-[50%] pointer-events-none">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 drop-shadow-sm">
                      Mission {missionNumber}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Menu et radeau */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-4 md:left-4 z-10 flex items-center gap-2">
        <div className="relative">
          <IconButton
            icon="/ui/icon_menu.webp"
            alt="Journal de bord"
            onClick={() => {
              const latestCompletedMission = completedMissions.length > 0 
                ? completedMissions[completedMissions.length - 1] 
                : null;
              if (latestCompletedMission) {
                setLastViewedCompletedMission(latestCompletedMission as MissionId);
              }
              router.push("/journal-de-bord");
            }}
            label="Menu"
          />
          {showJournalNew && (
            <div className="absolute top-0 right-0 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
              <Image
                src="/ui/icon_new.webp"
                alt="Nouveau"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
        <div className="relative">
          <IconButton
            icon="/ui/icon_radeau.webp"
            alt="Radeau"
            onClick={() => {
              markRaftAsViewed();
              router.push("/radeau");
            }}
            label="Radeau"
          />
          {showRaftNew && (
            <div className="absolute top-0 right-0 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
              <Image
                src="/ui/icon_new.webp"
                alt="Nouveau"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {selectedMissionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedMissionId(null)}
        >
          <div
            className="relative w-[80vw] max-w-md aspect-4/3 bg-cover bg-center bg-no-repeat rounded-3xl shadow-2xl"
            style={{
              backgroundImage: "url(/ui/popup_start_mission.webp)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-14">
              <h2 className="m-0 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center drop-shadow-sm">
                {MISSION_DISPLAY_NAMES[selectedMissionId] ??
                  getMissionById(selectedMissionId)?.title}
              </h2>
              <button
                type="button"
                onClick={handleExploreMission}
                disabled={selectedMissionId === "mission-2"}
                className="px-8 py-4 sm:px-12 sm:py-6 md:px-14 md:py-7 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-colors text-xl sm:text-2xl md:text-3xl lg:text-4xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
              >
                Jouer !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <OrientationGuard>
      <HomeContent />
    </OrientationGuard>
  );
}
