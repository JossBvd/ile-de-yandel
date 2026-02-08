"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  OrientationGuard,
  useOrientationContext,
} from "@/components/game/OrientationGuard";
import { getStepById, getMissionById } from "@/data/missions";
import { getNextStep } from "@/lib/engine/missionEngine";
import { getStepPath, getStepIdFromSlug } from "@/lib/navigation";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useInventory } from "@/hooks/useInventory";
import { ContinueButton } from "@/components/ui/ContinueButton";
import { GameRenderer } from "@/components/game/GameRenderer";
import { ClickableBackground } from "@/components/game/ClickableBackground";
import { IconButton } from "@/components/ui/IconButton";
import { DefeatModal } from "@/components/ui/DefeatModal";
import { StepSidebar } from "@/components/game/StepSidebar";
import { BackgroundHintZone } from "@/types/step";

function StepPageContent() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string; // ex: "mission-1"
  const stepSlug = params.stepSlug as string; // ex: "step-1"
  const stepId = getStepIdFromSlug(missionId, stepSlug); // ex: "mission-1-step-1"

  const { completedSteps, setCurrentStepId, completeStep, completeMission } =
    useGameProgress();
  const { addPiece } = useInventory();
  const { isRotated, width, height } = useOrientationContext();

  const [showNarrative, setShowNarrative] = useState(true);
  const [hintModal, setHintModal] = useState<BackgroundHintZone | null>(null);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /** Modal "objet récupéré pour le radeau" (ex. ficelle step 1 mission 1) : image à afficher ou null */
  const [raftObjectModalImage, setRaftObjectModalImage] = useState<string | null>(null);
  /** True quand l'user a cliqué sur l'icône radeau : on ne doit pas rediriger vers le step suivant. */
  const navigatingToRaftRef = React.useRef(false);

  const step = getStepById(stepId);
  const mission = getMissionById(missionId);

  // Intro narrative uniquement au step 1 de la mission ; les steps suivants enchaînent directement sur le jeu
  const isFirstStepOfMission = Boolean(mission && mission.steps[0] === stepId);

  React.useEffect(() => {
    if (!step) return;
    setCurrentStepId(step.id);
  }, [step, setCurrentStepId]);

  // Si on arrive sur un step déjà complété (ex. retour depuis la page radeau), rediriger vers le step suivant ou la carte (sauf si l'user vient de cliquer sur l'icône radeau)
  React.useEffect(() => {
    if (!step || !mission || raftObjectModalImage) return;
    if (navigatingToRaftRef.current) {
      navigatingToRaftRef.current = false;
      return;
    }
    if (!completedSteps.includes(step.id)) return;
    const nextStepId = getNextStep(mission, completedSteps);
    if (nextStepId) {
      router.replace(getStepPath(missionId, nextStepId));
    } else {
      router.replace("/carte-de-l-ile");
    }
  }, [step, mission, missionId, completedSteps, router, raftObjectModalImage]);

  // Réinitialiser l’affichage narrative quand on change de step (ex. step 1 → step 2)
  React.useEffect(() => {
    setShowNarrative(isFirstStepOfMission);
  }, [stepId, isFirstStepOfMission]);

  /** Enregistre la complétion du step et l’ajout de la pièce (sans naviguer). Utilisé quand l’user part vers le radeau depuis la modal. */
  function applyStepCompletionOnly() {
    if (!step || !mission) return;
    completeStep(step.id);
    if (step.raftPiece) {
      addPiece(step.raftPiece);
      console.log("🎁 Pièce du radeau collectée:", step.raftPiece);
    }
  }

  /** Applique complétion du step, ajout pièce radeau, et navigation (utilisé après fermeture de la modal "objet récupéré" si affichée). */
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
    // Step 1 mission 1 : afficher la modal "premier objet récupéré" (ficelle) avant de compléter
    if (step.id === "mission-1-step-1") {
      setRaftObjectModalImage("/missions/mission-1/step-1/M1_S1_popup-ficelle.webp");
      return;
    }
    applyStepCompletionAndNavigate();
  };

  const handleRaftObjectModalClose = () => {
    setRaftObjectModalImage(null);
    applyStepCompletionAndNavigate();
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
    // On recharge la page pour réinitialiser le jeu
    window.location.reload();
  };

  const handleDefeatGoBack = () => {
    console.log("🏠 L'utilisateur retourne au menu");
    setShowDefeatModal(false);
    router.push("/carte-de-l-ile");
  };

  // Afficher l’intro narrative uniquement au premier step de la mission
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

  // Ne pas afficher la narrative si le step est déjà complété (redirection vers step suivant en cours, évite un flash)
  if (isFirstStepOfMission && showNarrative && step.narrative && !completedSteps.includes(step.id)) {
    return (
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          width: isRotated ? `${width}px` : "100vw",
          height: isRotated ? `${height}px` : "100vh",
          backgroundImage: "url(/ui/background_story_screen.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Sur mobile paysage : conteneur dans les 2/3 gauche (pas dans le dernier tiers à droite) */}
        <div className="absolute left-[8%] max-w-[58%] w-full top-[10%] overflow-y-auto sm:left-[10%] sm:max-w-2xl sm:w-[85%] sm:top-1/3 sm:max-h-none sm:overflow-visible sm:transform sm:-translate-y-1/2">
          <div
            className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/ui/popup_start_mission.webp)",
            }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              {step.title}
            </h2>
            <div className="mb-6 sm:mb-8">
              <p className="text-gray-800 text-sm sm:text-base md:text-lg italic leading-relaxed whitespace-pre-line">
                {step.narrative}
              </p>
            </div>
            <div className="flex justify-center">
              <ContinueButton onClick={handleContinueFromNarrative}>
                Continuer
              </ContinueButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step déjà complété (ex. retour depuis le radeau) : écran neutre le temps de la redirection, évite tout flash
  if (completedSteps.includes(step.id)) {
    return <div className="fixed inset-0 bg-black" aria-hidden="true" />;
  }

  // Numéro de mission et d’étape pour l’affichage (ex. "Mission 1", "Etape 1")
  const missionNumber = missionId?.replace("mission-", "") ?? "1";
  const stepIndex = mission?.steps.indexOf(stepId) ?? 0;
  const stepNumber = stepIndex + 1;

  // Afficher le mini-jeu
  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      style={{
        width: isRotated ? `${width}px` : "100vw",
        height: isRotated ? `${height}px` : "100dvh",
      }}
    >
      {/* Fond en position absolue pour remplir tout l'écran (évite la bande noire sur mobile) */}
      <div className="absolute inset-0 w-full h-full">
        <ClickableBackground
          imageSrc={step.backgroundImage || "/backgrounds/jungle.webp"}
          hintZones={step.backgroundHintZones}
          onHintClick={(zone) => setHintModal(zone)}
          debugMode={true}
        >
          <GameRenderer
            step={step}
            onComplete={handleGameComplete}
            onDefeat={handleGameDefeat}
            onGoBackToMap={handleDefeatGoBack}
            skipVictoryModal={step.id === "mission-1-step-1"}
          />
        </ClickableBackground>
      </div>

      {/* Sidebar gauche (Mission / Etape, bouteille, Indice, Radeau, Retour) */}
      <StepSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        missionNumber={missionNumber}
        stepNumber={stepNumber}
      >
        <IconButton
          icon="/ui/icon_clue.webp"
          alt="Indice"
          onClick={() => {
            if (step.hint) {
              /* À implémenter : ouvrir modal indice */
            }
          }}
          label="Indice"
          showLabel
          disabled={!step.hint}
        />
        <IconButton
          icon="/ui/icon_radeau.webp"
          alt="Radeau"
          onClick={() => router.push("/radeau")}
          label="Radeau"
          showLabel
        />
        <IconButton
          icon="/ui/icon_back.webp"
          alt="Retour"
          onClick={() => router.push("/carte-de-l-ile")}
          label="Retour"
          showLabel
        />
      </StepSidebar>

      {/* Modal de défaite */}
      <DefeatModal
        isOpen={showDefeatModal}
        onRetry={handleDefeatRetry}
        onGoBack={handleDefeatGoBack}
      />

      {/* Modal = image seule (texte déjà dans l’image), clic pour fermer */}
      {raftObjectModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Objet récupéré"
        >
          <div className="relative w-full max-w-lg max-h-[90vh]">
            <Image
              src={raftObjectModalImage}
              alt="Objet récupéré pour le radeau"
              width={800}
              height={600}
              className="w-full h-auto max-h-[90vh] object-contain pointer-events-none"
              sizes="(max-width: 640px) 100vw, 32rem"
            />
            {/* Icônes en bas à droite : radeau → page radeau, next → step suivant */}
            <div className="absolute bottom-3 right-8 sm:bottom-4 sm:right-12 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setRaftObjectModalImage(null);
                  navigatingToRaftRef.current = true;
                  applyStepCompletionOnly();
                  router.push("/radeau");
                }}
                className="p-1.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Voir le radeau"
              >
                <Image
                  src="/ui/icon_radeau.webp"
                  alt=""
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                />
              </button>
              <button
                type="button"
                onClick={handleRaftObjectModalClose}
                className="p-1.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Continuer au step suivant"
              >
                <Image
                  src="/ui/icon_next.webp"
                  alt=""
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal indice (même forme et fond que modal step accomplie) */}
      {hintModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setHintModal(null)}
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
            {/* Contenu centré verticalement : image à gauche, colonne titre + texte à droite */}
            <div className="flex flex-1 min-h-0 flex-col justify-center">
              <div className="flex gap-4 items-center">
                {/* Zone image : plus grande et centrée verticalement */}
                <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 bg-white border-2 border-amber-900/20 rounded-sm overflow-hidden self-center">
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
                {/* Colonne : titre centré au-dessus du texte uniquement */}
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
            {/* Bouton retour en absolute bas droite, sans chevaucher le texte */}
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
