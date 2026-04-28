"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { useResponsive } from "@/hooks/useResponsive";
import { getStepById, getMissionById } from "@/data/missions";
import { getNextStep } from "@/lib/engine/missionEngine";
import { getStepPath, validateStepIdFromSlug } from "@/lib/navigation";
import { logDebug } from "@/lib/utils/logger";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { GameRenderer } from "@/components/game/GameRenderer";
import { ClickableBackground } from "@/components/game/ClickableBackground";
import { StepBackground } from "@/components/game/StepBackground";
import { StepPageNarrative } from "@/components/game/step-page/StepPageNarrative";
import { StepPageSidebar } from "@/components/game/step-page/StepPageSidebar";
import { StepPageModals } from "@/components/game/step-page/StepPageModals";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { useAudioDescriptionStore } from "@/store/audioDescriptionStore";
import { useAudioDescription } from "@/hooks/useAudioDescription";
import { BackgroundHintZone } from "@/types/step";
import { announce } from "@/lib/accessibility/ariaAnnouncer";
import { DEFAULT_INSPECT_LOUPE_ICON } from "@/lib/constants";

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

  const { completedSteps, setCurrentStepId, completeStep, completeMission } =
    useGameProgress();
  const { addPiece } = useInventory();
  const { isRotated, width, height } = useOrientationContext();
  const {
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    isMobileOrTablet,
  } = useResponsive();

  const [showNarrative, setShowNarrative] = useState(true);
  const [hintModal, setHintModal] = useState<BackgroundHintZone | null>(null);
  const [inlineHintZone, setInlineHintZone] = useState<BackgroundHintZone | null>(
    null,
  );
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
  const [isBasketOverflowLocked, setIsBasketOverflowLocked] = useState(false);

  const step = stepId ? getStepById(stepId) : undefined;
  const mission = getMissionById(missionId);

  const missionNumber = missionId?.replace("mission-", "") ?? "1";
  const stepIndex =
    stepId && mission ? mission.steps.indexOf(stepId) : -1;
  const safeStepIndex = stepIndex >= 0 ? stepIndex : 0;
  const stepNumber = safeStepIndex + 1;
  const stepTextToRead = step
    ? [
        `Mission ${missionNumber}, Étape ${safeStepIndex + 1}.`,
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

  const isFirstStepOfMission = Boolean(
    stepId && mission && mission.steps[0] === stepId,
  );

  React.useEffect(() => {
    if (!step) return;
    setCurrentStepId(step.id);
  }, [step, setCurrentStepId]);

  React.useEffect(() => {
    setShowNarrative(isFirstStepOfMission);
    setInlineHintZone(null);
  }, [stepId, isFirstStepOfMission]);

  React.useEffect(() => {
    if (!inlineHintZone) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInlineHintZone(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [inlineHintZone]);

  React.useEffect(() => {
    const onBasketOverflowLock = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>;
      setIsBasketOverflowLocked(Boolean(customEvent.detail?.locked));
    };

    window.addEventListener(
      "basket-weight-overflow-lock",
      onBasketOverflowLock as EventListener,
    );

    return () => {
      window.removeEventListener(
        "basket-weight-overflow-lock",
        onBasketOverflowLock as EventListener,
      );
      setIsBasketOverflowLocked(false);
    };
  }, [stepId]);

  if (!stepId) {
    return null;
  }

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
    if (step.raftObject?.image) {
      setRaftObjectModalImage(step.raftObject.image);
      return;
    }
    applyStepCompletionAndNavigate();
  };

  const handleRaftObjectModalClose = () => {
    setRaftObjectModalImage(null);
    if (step?.completion?.showMissionModalAfterStep) {
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

  const instructionPrimaryIcon = step.ui?.instructionInspectToggle
    ? (step.ui.inspectLoupeIcon ?? DEFAULT_INSPECT_LOUPE_ICON)
    : "/ui/icon_bottle.webp";

  const handleOpenHint = () => {
    if (!step.hint) return;
    if (step.hint.image) {
      setHintModal({
        x: 50,
        y: 50,
        radius: 0,
        title: "Indice",
        hint: step.hint.text || step.hint.simplifiedInstruction || "",
        image: step.hint.image,
      });
      return;
    }
    setGeneralHintModal({
      title: "Indice",
      hint: step.hint.text || step.hint.simplifiedInstruction || "",
    });
  };

  const useInlineBackgroundHint = step.ui?.backgroundHintDisplay === "inline";

  if (
    isFirstStepOfMission &&
    showNarrative &&
    step.narrative &&
    !completedSteps.includes(step.id)
  ) {
    return (
      <StepPageNarrative
        step={step}
        isSmallScreen={isSmallScreen}
        isMediumScreen={isMediumScreen}
        isDesktopSmall={isDesktopSmall}
        isDesktopMedium={isDesktopMedium}
        isRotated={isRotated}
        width={width}
        height={height}
        onContinue={handleContinueFromNarrative}
      />
    );
  }

  return (
    <div
      id="main-content"
      role="main"
      className="fixed inset-0 overflow-hidden bg-black flex w-full h-full"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "var(--app-viewport-height)",
        maxWidth: "100vw",
        maxHeight: "var(--app-viewport-height)",
      }}
    >
      <div className="relative">
        <StepPageSidebar
          step={step}
          missionNumber={missionNumber}
          stepNumber={stepNumber}
          stepTextToRead={stepTextToRead}
          showQuestionContainer={showQuestionContainer}
          onToggleQuestionContainer={() =>
            setShowQuestionContainer((v) => !v)
          }
          instructionPrimaryIcon={instructionPrimaryIcon}
          onOpenHint={handleOpenHint}
          audioEnabled={audioEnabled}
          isMobileOrTablet={isMobileOrTablet}
          isSmallScreen={isSmallScreen}
          isMediumScreen={isMediumScreen}
          isDesktopSmall={isDesktopSmall}
          isDesktopMedium={isDesktopMedium}
          isRotated={isRotated}
          height={height}
        />
        {isBasketOverflowLocked && (
          <div className="absolute inset-0 z-40 bg-black/55 pointer-events-auto" />
        )}
      </div>

      <div className="flex-1 relative overflow-hidden min-w-0">
        {step.backgroundHintZones && step.backgroundHintZones.length > 0 ? (
          <ClickableBackground
            imageSrc={step.backgroundImage || "/backgrounds/jungle.webp"}
            hintZones={step.backgroundHintZones}
            onHintClick={(zone) => {
              if (useInlineBackgroundHint && zone.image) {
                setInlineHintZone(zone);
                return;
              }
              setHintModal(zone);
            }}
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

      <StepPageModals
        step={step}
        isRotated={isRotated}
        width={width}
        height={height}
        isSmallScreen={isSmallScreen}
        isMediumScreen={isMediumScreen}
        audioEnabled={audioEnabled}
        readAudio={readAudio}
        showDefeatModal={showDefeatModal}
        onDefeatRetry={handleDefeatRetry}
        onDefeatGoBack={handleDefeatGoBack}
        raftObjectModalImage={raftObjectModalImage}
        onRaftObjectModalClose={handleRaftObjectModalClose}
        hintModal={hintModal}
        onCloseHintModal={() => setHintModal(null)}
        generalHintModal={generalHintModal}
        onCloseGeneralHintModal={() => setGeneralHintModal(null)}
        showMissionCompleteModal={showMissionCompleteModal}
        missionId={missionId}
        completionText={mission?.completionText}
        onMissionCompleteJournal={handleMissionCompleteJournal}
        onMissionCompleteRaft={handleMissionCompleteRaft}
        onMissionCompleteMap={handleMissionCompleteMap}
      />

      {useInlineBackgroundHint && inlineHintZone?.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setInlineHintZone(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Indice"
        >
          <div
            className="relative w-full max-w-2xl max-h-[90dvh] flex items-center justify-center cursor-pointer"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={inlineHintZone.image}
              alt={inlineHintZone.title ?? "Indice visuel"}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[90dvh] object-contain pointer-events-none"
              sizes="(max-width: 640px) 100vw, 42rem"
              draggable={false}
            />
            <button
              type="button"
              onClick={() => setInlineHintZone(null)}
              className="absolute top-3 left-3 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white transition-colors touch-manipulation"
              style={{ width: "36px", height: "36px", fontSize: "1.125rem" }}
              aria-label="Fermer l'indice"
            >
              ✕
            </button>
            <div className="absolute top-4 right-4 z-10">
              <ReadAloudButton
                text={
                  inlineHintZone.readAloudText ??
                  inlineHintZone.title ??
                  "Indice visuel"
                }
                ariaLabel="Lire la description de l'indice"
              />
            </div>
          </div>
        </div>
      )}
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
