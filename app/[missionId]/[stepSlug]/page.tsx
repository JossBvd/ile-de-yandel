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
import {
  getStepPath,
  getStepIdFromSlug,
  validateStepIdFromSlug,
} from "@/lib/navigation";
import { logDebug } from "@/lib/utils/logger";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { GameRenderer } from "@/components/game/GameRenderer";
import { ClickableBackground } from "@/components/game/ClickableBackground";
import { StepBackground } from "@/components/game/StepBackground";
import { IconButton } from "@/components/ui/IconButton";
import { AudioDescriptionButton } from "@/components/ui/AudioDescriptionButton";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { useAudioDescription } from "@/hooks/useAudioDescription";
import { DefeatModal } from "@/components/ui/DefeatModal";
import { MissionCompleteModal } from "@/components/ui/MissionCompleteModal";
import { BackgroundHintZone } from "@/types/step";
import { announce } from "@/lib/accessibility/ariaAnnouncer";

const HINT_IMAGE_READ_ALOUD: Record<string, string> = {
  "/missions/mission-1/step-1/M1_S1_popup-indice-01.webp":
    "Indice: ce pantalon est déchiré (é)",
  "/missions/mission-1/step-1/M1_S1_popup-indice-02.webp":
    "Indice: ces t-shirts sont déchirés (é - s)",
  "/missions/mission-1/step-1/M1_S1_popup-indice-03.webp":
    "Indice: cette casquette est déchirée (é - e)",
  "/missions/mission-1/step-1/M1_S1_popup-indice-04.webp":
    "Indice : ces robes sont déchirées (é-e-s)",
};

const RAFT_OBJECT_MODAL_READ_ALOUD: Record<string, string> = {
  "/missions/mission-1/step-1/M1_S1_popup-ficelle.webp":
    "Étape 1 accomplie. Tu as collecté : ficelle",
  "/missions/mission-1/step-2/M1_S2_popup-aiguille.webp":
    "Étape 2 accomplie. Tu as collecté : aiguille",
  "/missions/mission-1/step-3/M1_S3_popup-tissu.webp":
    "Étape 3 accomplie. Tu as collecté : chutes de tissu",
  "/missions/mission-2/step-1/M2_S1_popup_baton.webp":
    "Étape 1 accomplie. Tu as collecté : bâton",
  "/missions/mission-2/step-2/M2_S2_popup-liane.webp":
    "Étape 2 accomplie. Tu as collecté : liane",
  "/missions/mission-2/step-3/M2_S3_popup-silex.webp":
    "Étape 3 accomplie. Tu as collecté : silex",
};

function StepPageContent() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;
  const stepSlug = params.stepSlug as string;
  const stepId = validateStepIdFromSlug(missionId, stepSlug);

  React.useEffect(() => {
    if (!stepId) {
      router.push("/carte-de-l-ile");
    }
  }, [stepId, router]);

  if (!stepId) {
    return null;
  }

  const { completedSteps, setCurrentStepId, completeStep, completeMission } =
    useGameProgress();
  const { addPiece } = useInventory();
  const { isRotated, width, height } = useOrientationContext();
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isDesktopLarge,
    isMobileOrTablet,
  } = useResponsive();

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
  const [showQuestionContainer, setShowQuestionContainer] = useState(true);

  const step = getStepById(stepId);
  const mission = getMissionById(missionId);

  const missionNumber = missionId?.replace("mission-", "") ?? "1";
  const stepIndex = mission?.steps.indexOf(stepId) ?? 0;
  const stepNumber = stepIndex + 1;
  const stepTextToRead = step
    ? [
        `Mission ${missionNumber}, Étape ${stepIndex + 1}.`,
        step.title,
        step.instruction,
        step.game && "question" in step.game
          ? (step.game as { question?: string }).question
          : null,
        step.game && "text" in step.game
          ? (step.game as { text?: string }).text
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const { audioDescriptionAutoPlay } = useAudioDescriptionStore();
  const { read: readAudio, enabled: audioEnabled } = useAudioDescription();

  React.useEffect(() => {
    if (!audioEnabled || !audioDescriptionAutoPlay || !stepTextToRead.trim())
      return;
    const t = setTimeout(() => readAudio(stepTextToRead), 500);
    return () => clearTimeout(t);
  }, [
    audioEnabled,
    audioDescriptionAutoPlay,
    stepId,
    readAudio,
    stepTextToRead,
  ]);

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
      logDebug("🎁 Pièce du radeau collectée:", step.raftPiece);
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
    logDebug("🎮 Complétion du step:", step.id);
    logDebug("➡️ Prochain step:", nextStepId);
    if (nextStepId) {
      router.push(getStepPath(missionId, nextStepId));
    } else {
      completeMission(missionId);
      router.push("/carte-de-l-ile");
    }
  }

  const handleGameComplete = () => {
    if (!step) return;
    announce("Mission réussie ! Vous avez obtenu une pièce du radeau.", {
      priority: "polite",
    });
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
    if (step.id === "mission-2-step-1") {
      setRaftObjectModalImage(
        "/missions/mission-2/step-1/M2_S1_popup_baton.webp",
      );
      return;
    }
    if (step.id === "mission-2-step-2") {
      setRaftObjectModalImage(
        "/missions/mission-2/step-2/M2_S2_popup-liane.webp",
      );
      return;
    }
    if (step.id === "mission-2-step-3") {
      setRaftObjectModalImage(
        "/missions/mission-2/step-3/M2_S3_popup-silex.webp",
      );
      return;
    }
    applyStepCompletionAndNavigate();
  };

  const handleRaftObjectModalClose = () => {
    setRaftObjectModalImage(null);
    if (step?.id === "mission-1-step-3" || step?.id === "mission-2-step-3") {
      setShowMissionCompleteModal(true);
    } else {
      applyStepCompletionAndNavigate();
    }
  };

  const handleContinueFromNarrative = () => {
    setShowNarrative(false);
  };

  const handleGameDefeat = () => {
    announce("Ce n'est pas la bonne réponse. Vous pouvez réessayer.", {
      priority: "polite",
    });
    logDebug("❌ Échec du step - Affichage de la modal de défaite");
    setShowDefeatModal(true);
  };

  const handleDefeatRetry = () => {
    logDebug("🔄 L'utilisateur réessaie");
    setShowDefeatModal(false);
    window.location.reload();
  };

  const handleDefeatGoBack = () => {
    logDebug("🏠 L'utilisateur retourne au menu");
    setShowDefeatModal(false);
    router.push("/carte-de-l-ile");
  };

  const handleMissionCompleteJournal = () => {
    setShowMissionCompleteModal(false);
    if (step && mission) {
      applyStepCompletionOnly();
      const updatedCompletedSteps = [...completedSteps, step.id];
      const nextStepId = getNextStep(mission, updatedCompletedSteps);
      if (!nextStepId) {
        completeMission(missionId);
      }
    }
    router.push("/journal-de-bord");
  };

  const handleMissionCompleteRaft = () => {
    setShowMissionCompleteModal(false);
    if (step && mission) {
      applyStepCompletionOnly();
      const updatedCompletedSteps = [...completedSteps, step.id];
      const nextStepId = getNextStep(mission, updatedCompletedSteps);
      if (!nextStepId) {
        completeMission(missionId);
      }
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
            left: isSmallScreen
              ? "24px"
              : isMediumScreen
                ? "32px"
                : isDesktopSmall
                  ? "48px"
                  : isDesktopMedium
                    ? "64px"
                    : "80px",
            maxWidth: "50%",
            top: isSmallScreen ? "10%" : "33.333%",
            maxHeight: isSmallScreen ? "none" : "none",
            overflow: isSmallScreen ? "visible" : "visible",
            transform: isSmallScreen ? "none" : "translateY(-50%)",
          }}
        >
          <div
            className="relative rounded-3xl shadow-xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/ui/popup_start_mission.webp)",
              padding: isSmallScreen
                ? "16px"
                : isMediumScreen
                  ? "24px"
                  : "32px",
            }}
          >
            <h2
              id="narrative-title"
              className="font-bold text-gray-800"
              style={{
                fontSize: isSmallScreen
                  ? "1.25rem"
                  : isMediumScreen
                    ? "1.75rem"
                    : isDesktopSmall
                      ? "2rem"
                      : "2.25rem",
                marginBottom: isSmallScreen ? "16px" : "24px",
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </h2>
            <div
              id="narrative-text"
              style={{
                marginBottom: isSmallScreen ? "24px" : "32px",
                paddingRight: isSmallScreen
                  ? "56px"
                  : isMediumScreen
                    ? "64px"
                    : "80px",
              }}
            >
              <p
                className="text-gray-800 italic leading-relaxed whitespace-pre-line font-display"
                style={{
                  fontSize: isSmallScreen
                    ? "1.25rem"
                    : isMediumScreen
                      ? "1.375rem"
                      : "1.625rem",
                  lineHeight: 1.5,
                }}
              >
                {step.narrative}
              </p>
            </div>
            <div
              className="absolute"
              style={{
                top: isSmallScreen ? "16px" : isMediumScreen ? "24px" : "32px",
                right: isSmallScreen
                  ? "16px"
                  : isMediumScreen
                    ? "24px"
                    : "32px",
              }}
            >
              <ReadAloudButton
                text={`${step.title}. ${step.narrative ?? ""}`.trim()}
                ariaLabel="Lire le texte"
              />
            </div>
            <button
              type="button"
              onClick={handleContinueFromNarrative}
              className="absolute rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              style={{
                bottom: isSmallScreen
                  ? "16px"
                  : isMediumScreen
                    ? "24px"
                    : "32px",
                right: isSmallScreen
                  ? "16px"
                  : isMediumScreen
                    ? "24px"
                    : "32px",
                padding: "8px",
              }}
              aria-label="Continuer vers l’énigme"
            >
              <Image
                src="/ui/icon_next.webp"
                alt=""
                width={64}
                height={64}
                style={{
                  width: isSmallScreen
                    ? "48px"
                    : isMediumScreen
                      ? "56px"
                      : "64px",
                  height: isSmallScreen
                    ? "48px"
                    : isMediumScreen
                      ? "56px"
                      : "64px",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="main-content"
      role="main"
      className="fixed inset-0 overflow-hidden bg-black flex w-full h-full"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
        maxWidth: "100vw",
        maxHeight: "100dvh",
      }}
    >
      {/* Barre latérale */}
      <div
        className="relative shrink-0 flex flex-col z-20 overflow-x-hidden scrollbar-hide min-w-0"
        style={{
          width: isMobileOrTablet
            ? isSmallScreen
              ? "160px"
              : isMediumScreen
                ? "180px"
                : "200px"
            : "clamp(200px, 20vw, 250px)",
          maxWidth: isMobileOrTablet
            ? isSmallScreen
              ? "160px"
              : isMediumScreen
                ? "180px"
                : "200px"
            : "min(250px, 20vw)",
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
            className="shrink-0"
            style={{
              paddingTop:
                audioEnabled && isMobileOrTablet
                  ? isSmallScreen
                    ? "6px"
                    : "8px"
                  : isSmallScreen
                    ? "8px"
                    : isMediumScreen
                      ? "12px"
                      : "24px",
              paddingLeft: isSmallScreen
                ? "12px"
                : isMediumScreen
                  ? "16px"
                  : "16px",
              paddingRight: isSmallScreen
                ? "12px"
                : isMediumScreen
                  ? "16px"
                  : "16px",
              paddingBottom:
                audioEnabled && isMobileOrTablet
                  ? "2px"
                  : isSmallScreen
                    ? "4px"
                    : isMediumScreen
                      ? "4px"
                      : "8px",
            }}
          >
            <div className="min-w-0">
              <p
                className="text-gray-800 drop-shadow-sm whitespace-nowrap font-display"
                style={{
                  fontSize: isSmallScreen
                    ? "1.375rem"
                    : isMediumScreen
                      ? "1.5rem"
                      : isDesktopSmall
                        ? "1.8125rem"
                        : "1.875rem",
                }}
              >
                Mission {missionNumber}
              </p>
              <p
                className="text-gray-700 opacity-90 font-display"
                style={{
                  fontSize: isSmallScreen
                    ? "1.125rem"
                    : isMediumScreen
                      ? "1.25rem"
                      : "1.375rem",
                }}
              >
                Etape {stepNumber}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col shrink-0 mt-auto"
            style={{
              gap:
                audioEnabled && isMobileOrTablet
                  ? isSmallScreen
                    ? "6px"
                    : "8px"
                  : isMobileOrTablet
                    ? isSmallScreen
                      ? "10px"
                      : isMediumScreen
                        ? "12px"
                        : "14px"
                    : isDesktopSmall
                      ? "12px"
                      : "16px",
              paddingLeft: isMobileOrTablet
                ? isSmallScreen
                  ? "8px"
                  : "10px"
                : isDesktopSmall
                  ? "12px"
                  : "16px",
              paddingRight: isMobileOrTablet
                ? isSmallScreen
                  ? "8px"
                  : "10px"
                : isDesktopSmall
                  ? "12px"
                  : "16px",
              paddingBottom:
                audioEnabled && isMobileOrTablet
                  ? isSmallScreen
                    ? "8px"
                    : "10px"
                  : isMobileOrTablet
                    ? isSmallScreen
                      ? "12px"
                      : "14px"
                    : "16px",
              paddingTop:
                audioEnabled && isMobileOrTablet
                  ? isSmallScreen
                    ? "6px"
                    : "8px"
                  : isMobileOrTablet
                    ? isSmallScreen
                      ? "8px"
                      : "10px"
                    : "16px",
            }}
          >
            <AudioDescriptionButton
              textToRead={stepTextToRead}
              sizeVariant="compact"
              className="self-start"
            />
            <div className="flex items-center gap-1 self-start">
              <IconButton
                icon={
                  step.id === "mission-2-step-3"
                    ? "/missions/mission-2/step-3/m2_S3_loupe_icon.webp"
                    : "/ui/icon_bottle.webp"
                }
                alt={
                  step.id === "mission-2-step-3"
                    ? showQuestionContainer
                      ? "Masquer les panneaux du jeu pour inspecter le décor"
                      : "Afficher les panneaux du jeu (mode énigme)"
                    : showQuestionContainer
                      ? "Masquer l'instruction"
                      : "Afficher l'instruction"
                }
                onClick={() => setShowQuestionContainer((v) => !v)}
                label={
                  step.id === "mission-2-step-3"
                    ? showQuestionContainer
                      ? "Inspecter"
                      : "Énigme"
                    : "Instruction"
                }
                showLabel
                sizeVariant={
                  audioEnabled && isMobileOrTablet
                    ? "sidebarCompact"
                    : "sidebar"
                }
                className="shrink-0"
              />
              <ReadAloudButton
                text={
                  step.id === "mission-2-step-3"
                    ? showQuestionContainer
                      ? "Inspecter. Masquer les panneaux du jeu pour voir le décor."
                      : "Énigme. Afficher les panneaux du jeu."
                    : showQuestionContainer
                      ? "Instruction. Masquer l'instruction."
                      : "Instruction. Afficher l'instruction."
                }
                ariaLabel={
                  step.id === "mission-2-step-3"
                    ? showQuestionContainer
                      ? "Lire : Masquer les panneaux du jeu pour voir le décor"
                      : "Lire : Énigme. Afficher les panneaux du jeu"
                    : showQuestionContainer
                      ? "Lire : Masquer l'instruction"
                      : "Lire : Afficher l'instruction"
                }
              />
            </div>
            <div className="flex items-center gap-1 self-start">
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
                sizeVariant={
                  audioEnabled && isMobileOrTablet
                    ? "sidebarCompact"
                    : "sidebar"
                }
                className="shrink-0"
              />
              <ReadAloudButton
                text={
                  step.hint
                    ? "Indice. Voir un indice pour cette étape."
                    : "Indice. Indice non disponible pour cette étape."
                }
                ariaLabel="Lire : Indice"
              />
            </div>
            <div className="flex items-center gap-1 self-start">
              <IconButton
                icon="/ui/icon_radeau.webp"
                alt="Radeau"
                onClick={() => router.push("/radeau")}
                label="Radeau"
                showLabel
                sizeVariant={
                  audioEnabled && isMobileOrTablet
                    ? "sidebarCompact"
                    : "sidebar"
                }
                className="shrink-0"
              />
              <ReadAloudButton
                text="Radeau. Voir les pièces collectées et assembler le radeau."
                ariaLabel="Lire : Radeau"
              />
            </div>
            <div className="flex items-center gap-1 self-start">
              <IconButton
                icon="/ui/icon_back.webp"
                alt="Retour"
                onClick={() => router.push("/carte-de-l-ile")}
                label="Retour"
                showLabel
                sizeVariant={
                  audioEnabled && isMobileOrTablet
                    ? "sidebarCompact"
                    : "sidebar"
                }
                className="shrink-0"
              />
              <ReadAloudButton
                text="Retour. Revenir à la carte de l'île."
                ariaLabel="Lire : Retour"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Zone de jeu */}
      <div className="flex-1 relative overflow-hidden min-w-0">
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
              questionContainerVisible={showQuestionContainer}
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
              questionContainerVisible={showQuestionContainer}
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
            <div className="absolute top-4 right-4 z-10">
              <ReadAloudButton
                text={
                  RAFT_OBJECT_MODAL_READ_ALOUD[raftObjectModalImage] ??
                  "Objet récupéré pour le radeau."
                }
                ariaLabel="Lire le message"
              />
            </div>
            <div
              className="absolute"
              style={{
                bottom: isSmallScreen
                  ? "12px"
                  : isMediumScreen
                    ? "16px"
                    : "16px",
                right: isSmallScreen
                  ? "32px"
                  : isMediumScreen
                    ? "48px"
                    : "48px",
              }}
            >
              <button
                type="button"
                onClick={handleRaftObjectModalClose}
                className="rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ padding: "6px" }}
                aria-label="Continuer au step suivant"
              >
                <Image
                  src="/ui/icon_next.webp"
                  alt=""
                  width={64}
                  height={64}
                  style={{
                    width: isSmallScreen
                      ? "48px"
                      : isMediumScreen
                        ? "56px"
                        : "64px",
                    height: isSmallScreen
                      ? "48px"
                      : isMediumScreen
                        ? "56px"
                        : "64px",
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
                alt={hintModal.title ?? "Indice visuel"}
                width={1200}
                height={800}
                className="w-full h-auto object-contain pointer-events-none"
                style={{ maxHeight: isRotated ? `${height * 0.9}px` : "90dvh" }}
                sizes="(max-width: 640px) 100vw, 80vw"
              />
              <div
                className="absolute top-4 right-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <ReadAloudButton
                  text={
                    HINT_IMAGE_READ_ALOUD[hintModal.image] ??
                    hintModal.title ??
                    "Indice visuel"
                  }
                  ariaLabel="Lire l'indice"
                />
              </div>
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
                      width: isSmallScreen
                        ? "144px"
                        : isMediumScreen
                          ? "176px"
                          : "208px",
                      height: isSmallScreen
                        ? "144px"
                        : isMediumScreen
                          ? "176px"
                          : "208px",
                    }}
                  >
                    {hintModal.image ? (
                      <Image
                        src={hintModal.image}
                        alt={hintModal.title ?? "Objet de l'indice"}
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
                    {audioEnabled && (hintModal.title || hintModal.hint) && (
                      <button
                        type="button"
                        onClick={() =>
                          readAudio(
                            [hintModal.title, hintModal.hint]
                              .filter(Boolean)
                              .join(". "),
                          )
                        }
                        className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline"
                        aria-label="Décrire l'image à voix haute"
                      >
                        Décrire l'image
                      </button>
                    )}
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
