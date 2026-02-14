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
import { useResponsive } from "@/hooks/useResponsive";
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
  const { isSmallScreen, isMediumScreen, isLargeScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();

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
        height: isRotated ? `${height}px` : "100dvh",
        backgroundImage: "url(/backgrounds/background_menu_screen.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Titre */}
      <div 
        className="absolute z-10"
        style={{
          top: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '24px' : isDesktopMedium ? '32px' : '40px'),
          left: '0',
        }}
      >
        <div 
          className="relative"
          style={{
            width: isMobileOrTablet 
              ? (isSmallScreen ? '180px' : isMediumScreen ? '240px' : '280px')
              : (isDesktopSmall ? '400px' : isDesktopMedium ? '480px' : '560px'),
            height: isMobileOrTablet 
              ? (isSmallScreen ? '60px' : isMediumScreen ? '80px' : '100px')
              : (isDesktopSmall ? '140px' : isDesktopMedium ? '160px' : '180px'),
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
                fontSize: isMobileOrTablet 
                  ? (isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1.25rem')
                  : (isDesktopSmall ? '1.75rem' : isDesktopMedium ? '2rem' : '2.25rem'),
              }}
            >
              Carte de l&apos;île
            </h1>
          </div>
        </div>
      </div>

      {/* Bouton reset */}
      <div 
        className="absolute z-10"
        style={{
          top: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '24px' : isDesktopMedium ? '32px' : '40px'),
          right: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '16px' : isDesktopMedium ? '24px' : '32px'),
        }}
      >
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
              router.push("/");
            }
          }}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors touch-manipulation"
          style={{
            padding: isMobileOrTablet 
              ? (isSmallScreen ? '12px 16px' : isMediumScreen ? '14px 20px' : '16px 24px')
              : (isDesktopSmall ? '10px 20px' : isDesktopMedium ? '12px 24px' : '14px 28px'),
            fontSize: isMobileOrTablet 
              ? (isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1.125rem')
              : (isDesktopSmall ? '1rem' : isDesktopMedium ? '1.125rem' : '1.25rem'),
            minHeight: isMobileOrTablet ? '44px' : 'auto',
            minWidth: isMobileOrTablet ? '80px' : 'auto',
          }}
          aria-label="Réinitialiser la progression"
          title="Réinitialiser la progression"
        >
          🔄 Reset
        </button>
      </div>

      {/* Conteneur missions */}
      <div 
        className="absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isMobileOrTablet 
            ? (isSmallScreen ? '90%' : isMediumScreen ? '85%' : '80%')
            : (isDesktopSmall ? '65%' : isDesktopMedium ? '60%' : '55%'),
          height: isMobileOrTablet 
            ? (isSmallScreen ? '85%' : isMediumScreen ? '87%' : '88%')
            : (isDesktopSmall ? '88%' : isDesktopMedium ? '90%' : '92%'),
        }}
      >
        <div className="relative h-full w-full">
          {missions.map((missionConfig) => {
            const mission = getMissionById(missionConfig.id);
            if (!mission) return null;

            const missionNumber = missionConfig.id.split("-")[1];

            const missionTitle = mission.title ?? `Mission ${missionNumber}`;
            const ariaLabel = missionConfig.available
              ? `Accéder à ${missionTitle}`
              : `${missionTitle}, verrouillée`;

            return (
              <div
                key={missionConfig.id}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                onClick={() =>
                  handleMissionClick(missionConfig.id, missionConfig.available)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMissionClick(missionConfig.id, missionConfig.available);
                  }
                }}
                className={`absolute flex flex-col items-center justify-center transition-all touch-manipulation ${
                  missionConfig.available
                    ? "cursor-pointer hover:scale-105 active:scale-95"
                    : "cursor-not-allowed opacity-50"
                }`}
                style={
                  isMobile
                    ? missionConfig.positionMobile
                    : missionConfig.positionDesktop
                }
              >
                <div 
                  className="relative"
                  style={{
                    width: isMobileOrTablet 
                      ? (isSmallScreen ? '140px' : isMediumScreen ? '180px' : '220px')
                      : (isDesktopSmall ? '200px' : isDesktopMedium ? '220px' : '240px'),
                    height: isMobileOrTablet 
                      ? (isSmallScreen ? '140px' : isMediumScreen ? '180px' : '220px')
                      : (isDesktopSmall ? '200px' : isDesktopMedium ? '220px' : '240px'),
                    minWidth: isMobileOrTablet ? 48 : undefined,
                    minHeight: isMobileOrTablet ? 48 : undefined,
                  }}
                >
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
                    <div 
                      className="absolute z-10 pointer-events-none"
                      style={{
                        top: isMobileOrTablet 
                          ? (isSmallScreen ? '12px' : isMediumScreen ? '16px' : '20px')
                          : (isDesktopSmall ? '16px' : isDesktopMedium ? '20px' : '24px'),
                        right: isMobileOrTablet 
                          ? (isSmallScreen ? '12px' : isMediumScreen ? '16px' : '20px')
                          : (isDesktopSmall ? '16px' : isDesktopMedium ? '20px' : '24px'),
                        width: isMobileOrTablet 
                          ? (isSmallScreen ? '36px' : isMediumScreen ? '44px' : '52px')
                          : (isDesktopSmall ? '48px' : isDesktopMedium ? '56px' : '64px'),
                        height: isMobileOrTablet 
                          ? (isSmallScreen ? '36px' : isMediumScreen ? '44px' : '52px')
                          : (isDesktopSmall ? '48px' : isDesktopMedium ? '56px' : '64px'),
                      }}
                    >
                      <Image
                        src="/ui/icon_new.webp"
                        alt="Nouveau"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pt-[50%] pointer-events-none">
                    <span 
                      className="font-semibold text-gray-800 drop-shadow-sm"
                      style={{
                        fontSize: isMobileOrTablet 
                          ? (isSmallScreen ? '0.9375rem' : isMediumScreen ? '1.0625rem' : '1.25rem')
                          : (isDesktopSmall ? '1.25rem' : isDesktopMedium ? '1.5rem' : '1.75rem'),
                      }}
                    >
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
      <div 
        className="absolute z-10 flex items-center"
        style={{
          bottom: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '24px' : isDesktopMedium ? '32px' : '40px'),
          left: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '24px' : isDesktopMedium ? '32px' : '40px'),
          gap: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '20px' : isDesktopMedium ? '24px' : '32px'),
        }}
      >
        <div className="relative">
          <IconButton
            icon="/ui/icon_menu.webp"
            alt="Journal de bord"
            sizeVariant="map"
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
            <div 
              className="absolute top-0 right-0 z-10 pointer-events-none translate-x-1/4 -translate-y-1/4"
              style={{
                width: isSmallScreen ? '32px' : isMediumScreen ? '36px' : '44px',
                height: isSmallScreen ? '32px' : isMediumScreen ? '36px' : '44px',
              }}
            >
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
            sizeVariant="map"
            onClick={() => {
              markRaftAsViewed();
              router.push("/radeau");
            }}
            label="Radeau"
          />
          {showRaftNew && (
            <div 
              className="absolute top-0 right-0 z-10 pointer-events-none translate-x-1/4 -translate-y-1/4"
              style={{
                width: isSmallScreen ? '32px' : isMediumScreen ? '36px' : '44px',
                height: isSmallScreen ? '32px' : isMediumScreen ? '36px' : '44px',
              }}
            >
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
              <h2 
                className="m-0 font-bold text-gray-800 text-center drop-shadow-sm px-4"
                style={{
                  fontSize: isMobileOrTablet
                    ? (isSmallScreen ? '1.5rem' : isMediumScreen ? '1.75rem' : '2rem')
                    : (isSmallScreen ? '1.25rem' : isMediumScreen ? '1.75rem' : '2.25rem'),
                }}
              >
                {MISSION_DISPLAY_NAMES[selectedMissionId] ??
                  getMissionById(selectedMissionId)?.title}
              </h2>
              <button
                type="button"
                onClick={handleExploreMission}
                disabled={selectedMissionId === "mission-2"}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 touch-manipulation"
                style={{
                  padding: isMobileOrTablet
                    ? (isSmallScreen ? '20px 40px' : isMediumScreen ? '24px 48px' : '28px 56px')
                    : (isSmallScreen ? '12px 24px' : isMediumScreen ? '16px 36px' : '20px 48px'),
                  fontSize: isMobileOrTablet
                    ? (isSmallScreen ? '1.375rem' : isMediumScreen ? '1.5rem' : '1.75rem')
                    : (isSmallScreen ? '1rem' : isMediumScreen ? '1.5rem' : '2rem'),
                  minHeight: isMobileOrTablet ? (isSmallScreen ? 56 : isMediumScreen ? 60 : 64) : undefined,
                  minWidth: isMobileOrTablet ? (isSmallScreen ? 160 : isMediumScreen ? 180 : 200) : undefined,
                }}
                aria-label="Jouer à la mission"
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
