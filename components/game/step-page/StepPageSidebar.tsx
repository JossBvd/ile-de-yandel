"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Step } from "@/types/step";
import { IconButton } from "@/components/ui/IconButton";
import { AudioDescriptionButton } from "@/components/ui/AudioDescriptionButton";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

export interface StepPageSidebarProps {
  step: Step;
  missionNumber: string;
  stepNumber: number;
  stepTextToRead: string;
  showQuestionContainer: boolean;
  onToggleQuestionContainer: () => void;
  instructionPrimaryIcon: string;
  onOpenHint: () => void;
  audioEnabled: boolean;
  isMobileOrTablet: boolean;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isDesktopSmall: boolean;
  isDesktopMedium: boolean;
  isRotated: boolean;
  height: number;
}

export function StepPageSidebar({
  step,
  missionNumber,
  stepNumber,
  stepTextToRead,
  showQuestionContainer,
  onToggleQuestionContainer,
  instructionPrimaryIcon,
  onOpenHint,
  audioEnabled,
  isMobileOrTablet,
  isSmallScreen,
  isMediumScreen,
  isDesktopSmall,
  isDesktopMedium,
  isRotated,
  height,
}: StepPageSidebarProps) {
  const router = useRouter();

  return (
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
                  ? "1.25rem"
                  : isMediumScreen
                    ? "1.375rem"
                    : isDesktopSmall
                      ? "1.6875rem"
                      : "1.8125rem",
              }}
            >
              Mission {missionNumber}
            </p>
            <p
              className="text-gray-700 opacity-90 font-display"
              style={{
                fontSize: isSmallScreen
                  ? "1rem"
                  : isMediumScreen
                    ? "1.125rem"
                    : "1.25rem",
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
              icon={instructionPrimaryIcon}
              alt={
                step.ui?.instructionInspectToggle
                  ? showQuestionContainer
                    ? "Masquer les panneaux du jeu pour inspecter le décor"
                    : "Afficher les panneaux du jeu (mode énigme)"
                  : showQuestionContainer
                    ? "Masquer l'instruction"
                    : "Afficher l'instruction"
              }
              onClick={onToggleQuestionContainer}
              label={
                step.ui?.instructionInspectToggle
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
                step.ui?.instructionInspectToggle
                  ? showQuestionContainer
                    ? "Inspecter. Masquer les panneaux du jeu pour voir le décor."
                    : "Énigme. Afficher les panneaux du jeu."
                  : showQuestionContainer
                    ? "Instruction. Masquer l'instruction."
                    : "Instruction. Afficher l'instruction."
              }
              ariaLabel={
                step.ui?.instructionInspectToggle
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
              onClick={onOpenHint}
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
  );
}
