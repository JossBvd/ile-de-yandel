"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { useResponsive } from "@/hooks/useResponsive";
import { getStepById, getMissionById } from "@/data/missions";
import { getNextStep } from "@/lib/engine/missionEngine";
import { getStepPath, getStepIdFromSlug } from "@/lib/navigation";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { GameRenderer } from "@/components/game/GameRenderer";
import { ClickableBackground } from "@/components/game/ClickableBackground";
import { StepBackground } from "@/components/game/StepBackground";
import { IconButton } from "@/components/ui/IconButton";
import { DefeatModal } from "@/components/ui/DefeatModal";
import { MissionCompleteModal } from "@/components/ui/MissionCompleteModal";
import { BackgroundHintZone } from "@/types/step";

function StepPageContent() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;
  const stepSlug = params.stepSlug as string;
  const stepId = getStepIdFromSlug(missionId, stepSlug);

  const { completedSteps, setCurrentStepId, completeStep, completeMission } =
    useGameProgress();
  const { addPiece } = useInventory();
  const { isRotated, width, height } = useOrientationContext();
  const { isSmallScreen, isMediumScreen, isDesktopSmall, isDesktopMedium, isDesktopLarge, isMobileOrTablet } = useResponsive();

  const [showNarrative, setShowNarrative] = useState(true);
  const [hintModal, setHintModal] = useState<BackgroundHintZone | null>(null);
  const [generalHintModal, setGeneralHintModal] = useState<{
    title: string;
    hint: string;
  } | null>(null);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [raftObjectModalImage, setRaftObjectModalImage] = useState<
    string | null
  >(null);
  const [showMissionCompleteModal, setShowMissionCompleteModal] =
    useState(false);

  const step = getStepById(stepId);
  const mission = getMissionById(missionId);

  const isFirstStepOfMission = Boolean(mission && mission.steps[0] === stepId);

  React.useEffect(() => {
    if (!step) return;
    setCurrentStepId(step.id);
  }, [step, setCurrentStepId]);

  React.useEffect(() => {
    setShowNarrative(isFirstStepOfMission);
  }, [stepId, isFirstStepOfMission]);

  function applyStepCompletionOnly() {
    if (!step || !mission) return;
    completeStep(step.id);
    if (step.raftPiece) {
      addPiece(step.raftPiece);
      console.log("🎁 Pièce du radeau collectée:", step.raftPiece);
    }
  }

  function applyStepCompletionAndNavigate() {
    if (!step || !mission) {
      router.push("/carte-de-l-ile");
      return;
    }
    applyStepCompletionOnly();
    const updatedCompletedSteps = [...completedSteps, step.id];
    const nextStepId = getNextStep(mission, updatedCompletedSteps);
    console.log("🎮 Complétion du step:", step.id);
    console.log("➡️ Prochain step:", nextStepId);
    if (nextStepId) {
      router.push(getStepPath(missionId, nextStepId));
    } else {
      completeMission(missionId);
      router.push("/carte-de-l-ile");
    }
  }

  const handleGameComplete = () => {
    if (!step) return;
    if (step.id === "mission-1-step-1") {
      setRaftObjectModalImage(
        "/missions/mission-1/step-1/M1_S1_popup-ficelle.webp",
      );
      return;
    }
    if (step.id === "mission-1-step-2") {
      setRaftObjectModalImage(
        "/missions/mission-1/step-2/M1_S2_popup-aiguille.webp",
      );
      return;
    }
    if (step.id === "mission-1-step-3") {
      setRaftObjectModalImage(
        "/missions/mission-1/step-3/M1_S3_popup-tissu.webp",
      );
      return;
    }
    applyStepCompletionAndNavigate();
  };

  const handleRaftObjectModalClose = () => {
    setRaftObjectModalImage(null);
    if (step?.id === "mission-1-step-3") {
      setShowMissionCompleteModal(true);
    } else {
      applyStepCompletionAndNavigate();
    }
  };

  const handleContinueFromNarrative = () => {
    setShowNarrative(false);
  };

  const handleGameDefeat = () => {
    console.log("❌ Échec du step - Affichage de la modal de défaite");
    setShowDefeatModal(true);
  };

  const handleDefeatRetry = () => {
    console.log("🔄 L'utilisateur réessaie");
    setShowDefeatModal(false);
    window.location.reload();
  };

  const handleDefeatGoBack = () => {
    console.log("🏠 L'utilisateur retourne au menu");
    setShowDefeatModal(false);
    router.push("/carte-de-l-ile");
  };

  const handleMissionCompleteJournal = () => {
    setShowMissionCompleteModal(false);
    if (step) {
      applyStepCompletionOnly();
    }
    router.push("/journal-de-bord");
  };

  const handleMissionCompleteRaft = () => {
    setShowMissionCompleteModal(false);
    if (step) {
      applyStepCompletionOnly();
    }
    router.push("/radeau");
  };

  const handleMissionCompleteMap = () => {
    setShowMissionCompleteModal(false);
    if (step && mission) {
      applyStepCompletionOnly();
      const updatedCompletedSteps = [...completedSteps, step.id];
      const nextStepId = getNextStep(mission, updatedCompletedSteps);
      if (!nextStepId) {
        completeMission(missionId);
      }
    }
    router.push("/carte-de-l-ile");
  };

  if (!step) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-bold">Step non trouvé</p>
          <p className="mt-2 text-gray-600">Mission: {missionId}</p>
          <p className="text-gray-600">Step: {stepSlug}</p>
          <button
            onClick={() => router.push("/carte-de-l-ile")}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            Retour au menu
          </button>
        </div>
      </div>
    );
  }

  if (
    isFirstStepOfMission &&
    showNarrative &&
    step.narrative &&
    !completedSteps.includes(step.id)
  ) {
    return (
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          width: isRotated ? `${width}px` : "100vw",
          height: isRotated ? `${height}px` : "100dvh",
          backgroundImage: "url(/ui/background_story_screen.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Conteneur narrative */}
        <div
          role="region"
          aria-labelledby="narrative-title"
          aria-describedby="narrative-text"
          className="absolute w-full overflow-y-auto"
          style={{
            left: isSmallScreen ? '24px' : isMediumScreen ? '32px' : isDesktopSmall ? '48px' : isDesktopMedium ? '64px' : '80px',
            maxWidth: '50%',
            top: isSmallScreen ? '10%' : '33.333%',
            maxHeight: isSmallScreen ? 'none' : 'none',
            overflow: isSmallScreen ? 'visible' : 'visible',
            transform: isSmallScreen ? 'none' : 'translateY(-50%)',
          }}
        >
          <div
            className="relative rounded-3xl shadow-xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/ui/popup_start_mission.webp)",
              padding: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '32px',
            }}
          >
            <h2
              id="narrative-title"
              className="font-bold text-gray-800"
              style={{
                fontSize: isSmallScreen ? '1.25rem' : isMediumScreen ? '1.75rem' : isDesktopSmall ? '2rem' : '2.25rem',
                marginBottom: isSmallScreen ? '16px' : '24px',
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </h2>
            <div
              id="narrative-text"
              style={{
                marginBottom: isSmallScreen ? '24px' : '32px',
                paddingRight: isSmallScreen ? '56px' : isMediumScreen ? '64px' : '80px',
              }}
            >
              <p
                className="text-gray-800 italic leading-relaxed whitespace-pre-line"
                style={{
                  fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.125rem' : '1.25rem',
                  lineHeight: 1.5,
                }}
              >
                {step.narrative}
              </p>
            </div>
            <button
              type="button"
              onClick={handleContinueFromNarrative}
              className="absolute rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              style={{
                bottom: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '32px',
                right: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '32px',
                padding: '8px',
              }}
              aria-label="Continuer vers l’énigme"
            >
              <Image
                src="/ui/icon_next.webp"
                alt=""
                width={64}
                height={64}
                style={{
                  width: isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px',
                  height: isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px',
                }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const missionNumber = missionId?.replace("mission-", "") ?? "1";
  const stepIndex = mission?.steps.indexOf(stepId) ?? 0;
  const stepNumber = stepIndex + 1;

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black flex"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
      }}
    >
      {/* Barre latérale */}
      <div
        className="relative shrink-0 flex flex-col z-20"
        style={{
          width: isMobileOrTablet 
            ? (isSmallScreen ? '160px' : isMediumScreen ? '180px' : '200px')
            : "clamp(200px, 20vw, 250px)",
          backgroundImage: "url(/backgrounds/paper_texture.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRight: "3px solid #8B4513",
          boxShadow: "4px 0 12px rgba(0,0,0,0.15)",
          height: isRotated ? `${height}px` : "100dvh",
          overflowY: "auto",
        }}
      >
        <div className="flex flex-col min-h-0 flex-1">
          <div
            className="shrink-0 flex items-start justify-between gap-2"
            style={{
              paddingTop: isSmallScreen ? '8px' : isMediumScreen ? '12px' : '24px',
              paddingLeft: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
              paddingRight: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
              paddingBottom: isSmallScreen ? '4px' : isMediumScreen ? '4px' : '8px',
            }}
          >
            <div className="min-w-0">
              <p 
                className="font-bold text-gray-800 drop-shadow-sm whitespace-nowrap"
                style={{
                  fontSize: isSmallScreen ? '1.125rem' : isMediumScreen ? '1.25rem' : isDesktopSmall ? '1.5rem' : '1.5rem',
                }}
              >
                Mission {missionNumber}
              </p>
              <p 
                className="font-semibold text-gray-700 opacity-90"
                style={{
                  fontSize: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1.125rem',
                }}
              >
                Etape {stepNumber}
              </p>
            </div>
            <div
              className="relative shrink-0"
              style={{
                width: isMobileOrTablet ? (isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px') : (isDesktopSmall ? '72px' : isDesktopMedium ? '80px' : '88px'),
                height: isMobileOrTablet ? (isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px') : (isDesktopSmall ? '72px' : isDesktopMedium ? '80px' : '88px'),
                opacity: 0.72,
              }}
            >
              <Image
                src="/ui/icon_bottle.webp"
                alt="Bouteille à la mer"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div 
            className="flex flex-col shrink-0 mt-auto"
            style={{
              gap: isMobileOrTablet ? (isSmallScreen ? '10px' : isMediumScreen ? '12px' : '14px') : (isDesktopSmall ? '12px' : '16px'),
              paddingLeft: isMobileOrTablet ? (isSmallScreen ? '8px' : '10px') : (isDesktopSmall ? '12px' : '16px'),
              paddingRight: isMobileOrTablet ? (isSmallScreen ? '8px' : '10px') : (isDesktopSmall ? '12px' : '16px'),
              paddingBottom: isMobileOrTablet ? (isSmallScreen ? '12px' : '14px') : '16px',
              paddingTop: isMobileOrTablet ? (isSmallScreen ? '8px' : '10px') : '16px',
            }}
          >
            <IconButton
              icon="/ui/icon_clue.webp"
              alt="Indice"
              onClick={() => {
                if (step.hint) {
                  setGeneralHintModal({
                    title: "Indice",
                    hint:
                      step.hint.text || step.hint.simplifiedInstruction || "",
                  });
                }
              }}
              label="Indice"
              showLabel
              disabled={!step.hint}
              sizeVariant="sidebar"
              className="self-start"
            />
            <IconButton
              icon="/ui/icon_radeau.webp"
              alt="Radeau"
              onClick={() => router.push("/radeau")}
              label="Radeau"
              showLabel
              sizeVariant="sidebar"
              className="self-start"
            />
            <IconButton
              icon="/ui/icon_back.webp"
              alt="Retour"
              onClick={() => router.push("/carte-de-l-ile")}
              label="Retour"
              showLabel
              sizeVariant="sidebar"
              className="self-start"
            />
          </div>
        </div>
      </div>

      {/* Zone de jeu */}
      <div className="flex-1 relative overflow-hidden">
        {step.backgroundHintZones && step.backgroundHintZones.length > 0 ? (
          <ClickableBackground
            imageSrc={step.backgroundImage || "/backgrounds/jungle.webp"}
            hintZones={step.backgroundHintZones}
            onHintClick={(zone) => setHintModal(zone)}
            debugMode={false}
          >
            <GameRenderer
              step={step}
              onComplete={handleGameComplete}
              onDefeat={handleGameDefeat}
              onGoBackToMap={handleDefeatGoBack}
              skipVictoryModal={step.id === "mission-1-step-1"}
            />
          </ClickableBackground>
        ) : (
          <StepBackground
            imageSrc={step.backgroundImage || "/backgrounds/jungle.webp"}
            objectFit="cover"
          >
            <GameRenderer
              step={step}
              onComplete={handleGameComplete}
              onDefeat={handleGameDefeat}
              onGoBackToMap={handleDefeatGoBack}
              skipVictoryModal={step.id === "mission-1-step-1"}
            />
          </StepBackground>
        )}
      </div>

      <DefeatModal
        isOpen={showDefeatModal}
        onRetry={handleDefeatRetry}
        onGoBack={handleDefeatGoBack}
      />

      {raftObjectModalImage && (
        <div
          className="fixed z-50 flex items-center justify-center p-4"
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
          aria-label="Objet récupéré"
        >
          <div
            className="relative w-full max-w-lg"
            style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
          >
            <Image
              src={raftObjectModalImage}
              alt="Objet récupéré pour le radeau"
              width={800}
              height={600}
              className="w-full h-auto object-contain pointer-events-none"
              style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
              sizes="(max-width: 640px) 100vw, 32rem"
            />
            <div 
              className="absolute"
              style={{
                bottom: isSmallScreen ? '12px' : isMediumScreen ? '16px' : '16px',
                right: isSmallScreen ? '32px' : isMediumScreen ? '48px' : '48px',
              }}
            >
              <button
                type="button"
                onClick={handleRaftObjectModalClose}
                className="rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ padding: '6px' }}
                aria-label="Continuer au step suivant"
              >
                <Image
                  src="/ui/icon_next.webp"
                  alt=""
                  width={64}
                  height={64}
                  style={{
                    width: isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px',
                    height: isSmallScreen ? '48px' : isMediumScreen ? '56px' : '64px',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {hintModal && (
        <div
          className="fixed z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            width: isRotated ? `${width}px` : "100vw",
            height: isRotated ? `${height}px` : "100dvh",
            left: isRotated ? "50%" : "0",
            top: isRotated ? "50%" : "0",
            marginLeft: isRotated ? `-${width / 2}px` : "0",
            marginTop: isRotated ? `-${height / 2}px` : "0",
          }}
          onClick={() => setHintModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Indice"
        >
          {hintModal.image && !hintModal.hint ? (
            <div
              className="relative w-full max-w-4xl"
              style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
            >
              <Image
                src={hintModal.image}
                alt={hintModal.title ?? "Indice"}
                width={1200}
                height={800}
                className="w-full h-auto object-contain pointer-events-none"
                style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
                sizes="(max-width: 640px) 100vw, 80vw"
              />
            </div>
          ) : (
            <div
              className="relative rounded-3xl p-12 max-w-xl w-[92%] shadow-2xl flex flex-col"
              style={{
                backgroundImage: "url(/backgrounds/paper_texture.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "3px solid #8B4513",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-1 min-h-0 flex-col justify-center">
                <div className="flex gap-4 items-center">
                  <div 
                    className="shrink-0 bg-white border-2 border-amber-900/20 rounded-sm overflow-hidden self-center"
                    style={{
                      width: isSmallScreen ? '144px' : isMediumScreen ? '176px' : '208px',
                      height: isSmallScreen ? '144px' : isMediumScreen ? '176px' : '208px',
                    }}
                  >
                    {hintModal.image ? (
                      <Image
                        src={hintModal.image}
                        alt={hintModal.title ?? "Objet"}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-linear-to-b from-sky-200/80 to-green-200/80"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    {hintModal.title && (
                      <p className="text-xl font-bold text-black drop-shadow-sm uppercase tracking-wide mb-3 text-center">
                        {hintModal.title}
                      </p>
                    )}
                    <p className="text-gray-900 text-sm leading-relaxed flex-1 text-justify overflow-y-auto">
                      {hintModal.hint}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHintModal(null)}
                className="absolute bottom-4 right-4 p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50"
                aria-label="Fermer"
              >
                <Image
                  src="/ui/icon_back.webp"
                  alt=""
                  width={48}
                  height={48}
                  className="block"
                />
              </button>
            </div>
          )}
        </div>
      )}

      {generalHintModal && (
        <div
          className="fixed z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            width: isRotated ? `${width}px` : "100vw",
            height: isRotated ? `${height}px` : "100dvh",
            left: isRotated ? "50%" : "0",
            top: isRotated ? "50%" : "0",
            marginLeft: isRotated ? `-${width / 2}px` : "0",
            marginTop: isRotated ? `-${height / 2}px` : "0",
          }}
          onClick={() => setGeneralHintModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Indice"
        >
          <div
            className="relative rounded-3xl p-12 max-w-xl w-[92%] shadow-2xl flex flex-col"
            style={{
              backgroundImage: "url(/backgrounds/paper_texture.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "3px solid #8B4513",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 min-h-0 flex-col justify-center">
              <div className="flex flex-col gap-4">
                {generalHintModal.title && (
                  <p className="text-xl font-bold text-black drop-shadow-sm uppercase tracking-wide text-center">
                    {generalHintModal.title}
                  </p>
                )}
                <p className="text-gray-900 text-sm leading-relaxed text-justify overflow-y-auto">
                  {generalHintModal.hint}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGeneralHintModal(null)}
              className="absolute bottom-4 right-4 p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50"
              aria-label="Fermer"
            >
              <Image
                src="/ui/icon_back.webp"
                alt=""
                width={48}
                height={48}
                className="block"
              />
            </button>
          </div>
        </div>
      )}

      <MissionCompleteModal
        isOpen={showMissionCompleteModal}
        missionId={missionId}
        onJournalClick={handleMissionCompleteJournal}
        onRaftClick={handleMissionCompleteRaft}
        onMapClick={handleMissionCompleteMap}
      />
    </div>
  );
}

export default function StepPage() {
  return (
    <OrientationGuard>
      <StepPageContent />
    </OrientationGuard>
  );
}
