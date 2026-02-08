"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getMissionById } from "@/data/missions";
import { getStepPath } from "@/lib/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { isMissionCompleted, getNextStep } from "@/lib/engine/missionEngine";

/** Noms affichés dans la popup de démarrage (lieu de l'île) */
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
  const { reset: resetInventory } = useInventory();
  // Détection si on est sur mobile (< 768px)
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { isRotated, width, height } = useOrientationContext();

  // Une mission est débloquée si la mission précédente a déjà été complétée.
  // Priorité à completedMissions (persiste au replay) ; sinon steps complets pour rétrocompatibilité.
  const isMissionUnlocked = (missionId: string) => {
    if (completedMissions.includes(missionId)) return true;
    const prevMission = getMissionById(missionId);
    return prevMission
      ? isMissionCompleted(prevMission, completedSteps)
      : false;
  };

  // Positionnement étalé : 1 centre-gauche, 3 et 4 en haut, 2 et 5 en bas — occupent l'espace
  const missions = [
    {
      id: "mission-1",
      available: true, // Toujours disponible
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

  const handleMissionClick = (missionId: string, available: boolean) => {
    if (!available) return;
    const mission = getMissionById(missionId);
    if (!mission) return;
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
        height: isRotated ? `${height}px` : "100vh",
        backgroundImage: "url(/backgrounds/background_menu_screen.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Menu principal en haut à gauche */}
      <div className="absolute top-10 left-10 sm:top-4 sm:left-4 md:top-16 md:left-22 z-10">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Carte de l&apos;île
        </h1>
      </div>

      {/* Bouton reset en haut à droite */}
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
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors text-sm sm:text-base"
          title="Réinitialiser la progression"
        >
          🔄 Reset
        </button>
      </div>

      {/* Conteneur relatif pour les missions - adaptatif selon l'écran */}
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
                {/* Tailles adaptatives : image + texte sur le parchemin */}
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

      {/* Menu + Radeau en bas à gauche : menu à gauche, radeau à droite (inactif pour l’instant) */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-4 md:left-4 z-10 flex items-center gap-2">
        <IconButton
          icon="/ui/icon_menu.webp"
          alt="Journal de bord"
          onClick={() => router.push("/journal-de-bord")}
          label="Menu"
        />
        <IconButton
          icon="/ui/icon_radeau.webp"
          alt="Radeau"
          onClick={() => router.push("/radeau")}
          label="Radeau"
        />
      </div>

      {/* Modal de démarrage de mission */}
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
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg transition-colors text-4xl"
              >
                Explorer
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
