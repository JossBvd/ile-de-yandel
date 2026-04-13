"use client";

import React from "react";
import Image from "next/image";
import { Step } from "@/types/step";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

export interface StepPageNarrativeProps {
  step: Step;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isDesktopSmall: boolean;
  isDesktopMedium: boolean;
  isRotated: boolean;
  width: number;
  height: number;
  onContinue: () => void;
}

export function StepPageNarrative({
  step,
  isSmallScreen,
  isMediumScreen,
  isDesktopSmall,
  isDesktopMedium,
  isRotated,
  width,
  height,
  onContinue,
}: StepPageNarrativeProps) {
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
                  ? "1.125rem"
                  : isMediumScreen
                    ? "1.25rem"
                    : "1.5rem",
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
            onClick={onContinue}
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
