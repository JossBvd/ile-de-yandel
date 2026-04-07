"use client";

import React from "react";
import Image from "next/image";
import { Step, BackgroundHintZone } from "@/types/step";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { DefeatModal } from "@/components/ui/DefeatModal";
import { MissionCompleteModal } from "@/components/ui/MissionCompleteModal";

export interface StepPageModalsProps {
  step: Step | undefined;
  isRotated: boolean;
  width: number;
  height: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  audioEnabled: boolean;
  readAudio: (text: string) => void;
  showDefeatModal: boolean;
  onDefeatRetry: () => void;
  onDefeatGoBack: () => void;
  raftObjectModalImage: string | null;
  onRaftObjectModalClose: () => void;
  hintModal: BackgroundHintZone | null;
  onCloseHintModal: () => void;
  generalHintModal: { title: string; hint: string } | null;
  onCloseGeneralHintModal: () => void;
  showMissionCompleteModal: boolean;
  missionId: string;
  completionText: string | undefined;
  onMissionCompleteJournal: () => void;
  onMissionCompleteRaft: () => void;
  onMissionCompleteMap: () => void;
}

export function StepPageModals({
  step,
  isRotated,
  width,
  height,
  isSmallScreen,
  isMediumScreen,
  audioEnabled,
  readAudio,
  showDefeatModal,
  onDefeatRetry,
  onDefeatGoBack,
  raftObjectModalImage,
  onRaftObjectModalClose,
  hintModal,
  onCloseHintModal,
  generalHintModal,
  onCloseGeneralHintModal,
  showMissionCompleteModal,
  missionId,
  completionText,
  onMissionCompleteJournal,
  onMissionCompleteRaft,
  onMissionCompleteMap,
}: StepPageModalsProps) {
  return (
    <>
      <DefeatModal
        isOpen={showDefeatModal}
        onRetry={onDefeatRetry}
        onGoBack={onDefeatGoBack}
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
                  step?.raftObject?.readAloudText ??
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
                onClick={onRaftObjectModalClose}
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
          onClick={() => onCloseHintModal()}
          role="dialog"
          aria-modal="true"
          aria-label="Indice"
        >
          {hintModal.image && !hintModal.hint ? (
            <div
              className="relative w-full max-w-4xl rounded-3xl p-4 shadow-2xl"
              style={{
                height: isRotated ? `${height * 0.9}px` : "90dvh",
                maxHeight: isRotated ? `${height * 0.9}px` : "90dvh",
              }}
              onClick={() => onCloseHintModal()}
            >
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  backgroundImage: "url(/backgrounds/paper_texture.webp)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "3px solid #8B4513",
                }}
                aria-hidden
              />
              <div className="relative z-10 w-full h-full overflow-hidden rounded-2xl">
                <Image
                  src={hintModal.image}
                  alt={hintModal.title ?? "Indice visuel"}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain pointer-events-none"
                  sizes="(max-width: 640px) 100vw, 80vw"
                />
              </div>
              <div
                className="absolute top-6 right-6 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <ReadAloudButton
                  text={
                    (hintModal.image
                      ? (hintModal.readAloudText ??
                        step?.backgroundHintZones?.find(
                          (z) => z.image === hintModal.image,
                        )?.readAloudText ??
                        (step?.hint?.image === hintModal.image
                          ? step.hint.readAloudText
                          : undefined))
                      : hintModal.readAloudText) ??
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
                        aria-label="Décrire l&apos;image à voix haute"
                      >
                        Décrire l&apos;image
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCloseHintModal()}
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
          onClick={() => onCloseGeneralHintModal()}
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
              onClick={() => onCloseGeneralHintModal()}
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
        completionText={completionText}
        onJournalClick={onMissionCompleteJournal}
        onRaftClick={onMissionCompleteRaft}
        onMapClick={onMissionCompleteMap}
      />
    </>
  );
}
