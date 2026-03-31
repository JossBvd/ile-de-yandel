"use client";

import { useState, useRef, useEffect } from "react";
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
import { Button } from "@/components/ui/Button";
import { AudioDescriptionSettingsModal } from "@/components/ui/AudioDescriptionSettingsModal";
import { AudioDescriptionChoiceModal } from "@/components/ui/AudioDescriptionChoiceModal";
import { MentionsLegalesModal } from "@/components/ui/MentionsLegalesModal";
import { PolitiqueConfidentialiteModal } from "@/components/ui/PolitiqueConfidentialiteModal";
import { AudioDescriptionButton } from "@/components/ui/AudioDescriptionButton";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { isMissionCompleted, getNextStep } from "@/lib/engine/missionEngine";
import { useUIStore } from "@/store/uiStore";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import type { MissionId } from "@/types/mission";

const MISSION_DISPLAY_NAMES: Record<string, string> = {
  "mission-1": "L'épave de l'avion",
  "mission-2": "Dans la forêt",
  "mission-3": "Le bosquet",
  "mission-4": "La forêt\ncôtière",
  "mission-5": "Mission 5",
};

const DEVELOPED_MISSIONS = new Set<string>([
  "mission-1",
  "mission-2",
  "mission-3",
  "mission-4",
]);

function HomeContent() {
  const router = useRouter();
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    null,
  );
  const [showParamsMenu, setShowParamsMenu] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [showPolitiqueConfidentialite, setShowPolitiqueConfidentialite] = useState(false);
  const paramsMenuRef = useRef<HTMLDivElement>(null);
  const {
    completedSteps,
    completedMissions,
    reset: resetProgress,
    resetMissionSteps,
  } = useGameProgress();
  const { collectedPieces, reset: resetInventory } = useInventory();
  const { viewedMissions, raftViewed, journalViewed, lastViewedCompletedMission, markMissionAsViewed, markRaftAsViewed, markJournalAsViewed, setLastViewedCompletedMission, reset: resetUI } = useUIStore();
  const { audioDescriptionFirstVisitDone } = useAudioDescriptionStore();
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
  const showJournalNew = !journalViewed && latestCompletedMission !== null && 
    missions.some((m) => m.available);

  useEffect(() => {
    if (!showParamsMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (paramsMenuRef.current && !paramsMenuRef.current.contains(e.target as Node)) {
        setShowParamsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showParamsMenu]);

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
      id="main-content"
      role="main"
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
        className="absolute z-10 flex flex-col gap-2"
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
        <div style={{ marginLeft: isMobileOrTablet ? (isSmallScreen ? 8 : isMediumScreen ? 12 : 16) : (isDesktopSmall ? 16 : isDesktopMedium ? 24 : 32) }}>
          <AudioDescriptionButton
            textToRead="Carte de l'île. Choisissez une mission pour continuer l'aventure."
            sizeVariant="compact"
          />
        </div>
      </div>

      {/* Bouton Paramètres (bas à droite) + menu 4 choix */}
      <div
        ref={paramsMenuRef}
        className="absolute z-10"
        style={{
          bottom: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '24px' : isDesktopMedium ? '32px' : '40px'),
          right: isMobileOrTablet 
            ? (isSmallScreen ? '8px' : isMediumScreen ? '12px' : '16px')
            : (isDesktopSmall ? '16px' : isDesktopMedium ? '24px' : '32px'),
        }}
      >
        <div className="relative flex items-center gap-1">
          <Button
            type="button"
            variant="parchemin"
            size="md"
            onClick={() => setShowParamsMenu((v) => !v)}
            aria-label="Ouvrir le menu Paramètres"
            aria-expanded={showParamsMenu}
            aria-haspopup="true"
          >
            Paramètres
          </Button>
          <ReadAloudButton
            text="Paramètres. Ouvrir le menu : audio description, mentions légales, politique de confidentialité, nouvelle partie."
            ariaLabel="Lire : Paramètres"
            className="self-center"
          />
          {showParamsMenu && (
            <div
              role="menu"
              className="absolute bottom-full right-0 mb-2 rounded-lg shadow-xl overflow-hidden min-w-[200px] bg-[#e8dcc4] border border-amber-800/20"
              style={{
                padding: isMobileOrTablet ? '8px' : '12px',
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setShowParamsMenu(false);
                    setShowAudioSettings(true);
                  }}
                  className="flex-1 min-w-0 text-left py-2 px-3 rounded font-medium text-gray-800 hover:bg-[#ddd0b0] touch-manipulation transition-colors"
                  style={{
                    fontSize: isMobileOrTablet ? (isSmallScreen ? '0.875rem' : '1rem') : '1rem',
                    minHeight: '44px',
                  }}
                >
                  Audio description
                </button>
                <ReadAloudButton
                  text="Audio description. Régler la lecture à voix haute et la vitesse."
                  ariaLabel="Lire : Audio description"
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setShowParamsMenu(false);
                    setShowMentionsLegales(true);
                  }}
                  className="flex-1 min-w-0 text-left py-2 px-3 rounded font-medium text-gray-800 hover:bg-[#ddd0b0] touch-manipulation transition-colors"
                  style={{
                    fontSize: isMobileOrTablet ? (isSmallScreen ? '0.875rem' : '1rem') : '1rem',
                    minHeight: '44px',
                  }}
                >
                  Mentions légales
                </button>
                <ReadAloudButton
                  text="Mentions légales. Ouvrir les informations légales du jeu."
                  ariaLabel="Lire : Mentions légales"
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setShowParamsMenu(false);
                    setShowPolitiqueConfidentialite(true);
                  }}
                  className="flex-1 min-w-0 text-left py-2 px-3 rounded font-medium text-gray-800 hover:bg-[#ddd0b0] touch-manipulation transition-colors"
                  style={{
                    fontSize: isMobileOrTablet ? (isSmallScreen ? '0.875rem' : '1rem') : '1rem',
                    minHeight: '44px',
                  }}
                >
                  Politique de confidentialité
                </button>
                <ReadAloudButton
                  text="Politique de confidentialité. Ouvrir les informations sur les données et la vie privée."
                  ariaLabel="Lire : Politique de confidentialité"
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setShowParamsMenu(false);
                    if (
                      window.confirm(
                        "Êtes-vous sûr de vouloir commencer une nouvelle partie ?",
                      )
                    ) {
                      resetProgress();
                      resetInventory();
                      resetUI();
                      router.push("/");
                    }
                  }}
                  className="flex-1 min-w-0 text-left py-2 px-3 rounded font-medium text-gray-800 hover:bg-[#ddd0b0] touch-manipulation transition-colors"
                  style={{
                    fontSize: isMobileOrTablet ? (isSmallScreen ? '0.875rem' : '1rem') : '1rem',
                    minHeight: '44px',
                  }}
                  aria-label="Nouvelle partie"
                >
                  Nouvelle partie
                </button>
                <ReadAloudButton
                  text="Nouvelle partie. Effacer toute la partie et retourner à l'accueil."
                  ariaLabel="Lire : Nouvelle partie"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <AudioDescriptionSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />
      <AudioDescriptionChoiceModal
        isOpen={!audioDescriptionFirstVisitDone}
        onClose={() => {}}
      />
      <MentionsLegalesModal
        isOpen={showMentionsLegales}
        onClose={() => setShowMentionsLegales(false)}
      />
      <PolitiqueConfidentialiteModal
        isOpen={showPolitiqueConfidentialite}
        onClose={() => setShowPolitiqueConfidentialite(false)}
      />

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
            const clickable =
              missionConfig.available &&
              DEVELOPED_MISSIONS.has(missionConfig.id);
            const ariaLabel = clickable
              ? `Accéder à ${missionTitle}`
              : missionConfig.available
                ? `${missionTitle}, bientôt disponible`
                : `${missionTitle}, verrouillée`;
            const readAloudText = clickable
              ? `Mission ${missionNumber} : ${missionTitle}. Disponible. Cliquez pour jouer.`
              : missionConfig.available
                ? `Mission ${missionNumber} : ${missionTitle}. Bientôt disponible.`
                : `Mission ${missionNumber} : ${missionTitle}. Verrouillée.`;

            return (
              <div
                key={missionConfig.id}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                onClick={() =>
                  handleMissionClick(missionConfig.id, clickable)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMissionClick(missionConfig.id, clickable);
                  }
                }}
                className={`absolute flex flex-col items-center justify-center transition-all touch-manipulation ${
                  clickable
                    ? "cursor-pointer hover:scale-105 active:scale-95"
                    : "cursor-not-allowed"
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
                  <div
                    className="absolute top-0 left-0 z-20"
                    style={{
                      marginTop: isMobileOrTablet ? 4 : 6,
                      marginLeft: isMobileOrTablet ? 4 : 6,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ReadAloudButton
                      text={readAloudText}
                      ariaLabel={`Lire : ${missionTitle}`}
                    />
                  </div>
                  <Image
                    src={
                      clickable
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
        <div className="relative flex items-center gap-1">
          <div className="relative">
            <IconButton
              icon="/ui/icon_menu.webp"
              alt="Journal de bord"
              sizeVariant="map"
              onClick={() => {
                markJournalAsViewed();
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
          <ReadAloudButton
            text="Journal de bord. Consulter tes souvenirs."
            ariaLabel="Lire : Journal de bord"
            className="self-center"
          />
        </div>
        <div className="relative flex items-center gap-1">
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
          <ReadAloudButton
            text={
              showRaftNew
                ? "Radeau. Assembler les pièces pour construire ton embarcation. Vous avez des pièces à fusionner."
                : "Radeau. Assembler les pièces pour construire ton embarcation."
            }
            ariaLabel="Lire : Radeau"
            className="self-center"
          />
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
            <div
              className="absolute top-4 right-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <ReadAloudButton
                text={`${MISSION_DISPLAY_NAMES[selectedMissionId] ?? getMissionById(selectedMissionId)?.title ?? "Mission"}. Cliquez sur Jouer pour commencer la mission.`}
                ariaLabel="Lire le contenu de la modal"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-14">
              <h2 
                className="m-0 font-bold text-gray-800 text-center drop-shadow-sm px-4 font-display whitespace-pre-line"
                style={{
                  fontSize: isMobileOrTablet
                    ? (isSmallScreen ? '1.75rem' : isMediumScreen ? '2rem' : '2.25rem')
                    : (isSmallScreen ? '1.5rem' : isMediumScreen ? '2rem' : '2.5rem'),
                }}
              >
                {MISSION_DISPLAY_NAMES[selectedMissionId] ??
                  getMissionById(selectedMissionId)?.title}
              </h2>
              <button
                type="button"
                onClick={handleExploreMission}
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
