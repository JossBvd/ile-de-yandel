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

const ORANGE_RESSOURCE = "#f7941d";

/** Mission N est débloquée si c'est la mission 1, ou si la mission N-1 est complétée, ou si la mission N est complétée. */
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
      {/* Banner "Mon journal de bord" — même position sur mobile (paysage) et desktop */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-8 md:left-8 z-10">
        <div
          className="px-3 py-2 sm:px-6 sm:py-3 rounded-lg"
          style={{ backgroundColor: "#E6D5B8" }}
        >
          <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
            Mon journal de bord
          </h1>
        </div>
      </div>

      {/* Contenu principal : même disposition partout — missions à gauche (tout visible, pas de scroll), détail à droite */}
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-row gap-2 sm:gap-4 md:gap-8 p-2 sm:p-4 md:p-8 min-h-0">
        {/* Liste des missions à gauche — tailles augmentées pour remplir l'espace */}
        <div
          className="journal-missions-column flex flex-col w-1/3 min-w-0 min-h-0 overflow-hidden pt-14 sm:pt-20 md:pt-24 flex-shrink-0 items-center"
          style={{ containerType: "size", containerName: "journal-missions-column" }}
        >
          <div
            className="journal-missions-list flex flex-col w-full items-center origin-top"
            style={{
              gap: "clamp(0.75rem, 4cqi, 2rem)",
            }}
          >
            {MISSIONS.map((mission) => {
              const missionNumber = mission.id.split("-")[1];
              const isSelected = mission.id === selectedMissionId;
              const isMission1 = mission.id === "mission-1";
              const isUnlocked = unlockedMissionIds.has(mission.id);

              return (
                <div
                  key={mission.id}
                  className="flex flex-col items-center w-full shrink-0"
                  style={{
                    paddingInline: "clamp(0.5rem, 2cqi, 2rem)",
                  }}
                >
                  {isMission1 ? (
                    <button
                      onClick={() =>
                        isUnlocked && setSelectedMissionId(mission.id)
                      }
                      disabled={!isUnlocked}
                      className={`relative w-full aspect-280/170 min-h-0 rounded-lg overflow-hidden transition-all flex items-center justify-center touch-manipulation
                        ${isUnlocked ? `cursor-pointer ${isSelected ? "scale-105" : "hover:scale-105 active:scale-105"}` : "cursor-not-allowed opacity-50 grayscale"}`}
                      style={{
                        maxWidth: "clamp(240px, 100cqi, 480px)",
                      }}
                      type="button"
                      aria-disabled={!isUnlocked}
                    >
                      <Image
                        src="/ui/mission_button.webp"
                        alt="Mission 1"
                        fill
                        className="object-contain object-center"
                      />
                      <span
                        className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-[6%] font-semibold text-gray-800 drop-shadow-sm"
                        style={{
                          fontSize: "clamp(1rem, 6cqi, 2rem)",
                        }}
                      >
                        Mission {missionNumber}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        isUnlocked && setSelectedMissionId(mission.id)
                      }
                      disabled={!isUnlocked}
                      className={`rounded-lg transition-all w-full touch-manipulation flex items-center justify-center shrink-0
                        ${isUnlocked ? `cursor-pointer ${isSelected ? "scale-105" : "hover:scale-105 active:scale-105"}` : "cursor-not-allowed opacity-50"}`}
                      style={{
                        backgroundColor: isUnlocked ? "#E6D5B8" : "#b0a090",
                        padding: "clamp(0.75rem, 4cqi, 1.75rem) clamp(1rem, 5cqi, 3rem)",
                        minHeight: "clamp(50px, 12cqi, 80px)",
                        maxWidth: "clamp(240px, 100cqi, 450px)",
                      }}
                      type="button"
                      aria-disabled={!isUnlocked}
                    >
                      <span
                        className={`font-semibold ${
                          isSelected ? "text-gray-900" : isUnlocked ? "text-gray-700" : "text-gray-500"
                        }`}
                        style={{
                          fontSize: "clamp(0.875rem, 5cqi, 1.5rem)",
                        }}
                      >
                        Mission {missionNumber}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vue détaillée à droite — encadrée type parchemin, même emplacement que desktop */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {selectedMission && (
            <div
              className="flex flex-col gap-2 sm:gap-4 md:gap-6 rounded-xl p-3 sm:p-4 md:p-6 min-h-full flex-1 overflow-y-auto"
              style={{
                border: "3px solid #c4a574",
                boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.12)",
              }}
            >
              <div
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg w-fit self-center"
                style={{ backgroundColor: "#d4c4a0" }}
              >
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                  Mission {selectedMissionId.split("-")[1]}
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="rounded-full px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 shadow-md"
                    style={{ backgroundColor: ORANGE_RESSOURCE }}
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

      {/* Bouton retour — même position en bas à droite */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-10">
        <IconButton
          icon="/ui/icon_back.webp"
          alt="Retour"
          onClick={() => router.back()}
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
