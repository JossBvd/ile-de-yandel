"use client";



import Image from "next/image";

import { ReadAloudButton } from "@/components/ui/ReadAloudButton";

import { useResponsive } from "@/hooks/useResponsive";

import { getNarrativeSceneLayout } from "./narrativeSceneLayout";
import { NarrativeYandelCharacter } from "./NarrativeYandelCharacter";
import { getNarrativeTypography } from "./narrativeTypography";



export interface NarrativeDialogueLayoutProps {

  title?: string;

  displayedText: string;

  isTyping: boolean;

  readAloudText: string;

  onNext: () => void;

  nextAriaLabel: string;

}



export function NarrativeDialogueLayout({

  title,

  displayedText,

  isTyping,

  readAloudText,

  onNext,

  nextAriaLabel,

}: NarrativeDialogueLayoutProps) {

  const { isSmallScreen, isMediumScreen, isDesktopSmall, isMobileOrTablet } =

    useResponsive();

  const { bodyFontSize, titleFontSize, lineHeight } = getNarrativeTypography({

    isSmallScreen,

    isMediumScreen,

    isDesktopSmall,

  });

  const scene = getNarrativeSceneLayout({

    isSmallScreen,

    isMediumScreen,

    isMobileOrTablet,

  });



  const titleMarginBottom = isSmallScreen

    ? "4px"

    : isMediumScreen

      ? "8px"

      : "12px";



  return (

    <div

      className="fixed inset-0 z-50 overflow-hidden"

      style={{

        backgroundImage: "url(/intro/background_sensi_intro.webp)",

        backgroundSize: "cover",

        backgroundPosition: "center",

      }}

    >

      <div

        className="mx-auto flex h-dvh w-full items-end justify-center"

        style={{ padding: "0 3% 0 0" }}

      >

        <div

          className="relative w-full max-w-[1600px]"

          style={{ height: scene.sceneHeight }}

        >

          <NarrativeYandelCharacter yandelWidth={scene.yandelWidth} />



          <div

            className="absolute flex flex-col"

            style={{

              left: scene.bubbleLeft,

              top: scene.bubbleTop,

              width: scene.bubbleWidth,

              height: scene.bubbleHeight,

            }}

          >

            {title ? (

              <h2

                id="narrative-title"

                className="font-display shrink-0 text-center text-gray-900"

                style={{

                  fontSize: titleFontSize,

                  lineHeight: 1.3,

                  textShadow: "0 1px 3px rgba(255,255,255,0.8)",

                  marginBottom: titleMarginBottom,

                  paddingLeft: "28%",

                  paddingRight: "10%",

                  wordBreak: "normal",

                  overflowWrap: "break-word",

                  hyphens: "none",

                }}

              >

                {title}

              </h2>

            ) : null}



            <div

              role="region"

              aria-labelledby={title ? "narrative-title" : undefined}

              aria-describedby="narrative-text-body"

              className="relative min-h-0 w-full flex-1"

            >

              <div className="relative h-full w-full">

                <Image

                  src="/intro/bullebd.webp"

                  alt=""

                  aria-hidden="true"

                  fill

                  style={{ objectFit: "fill" }}

                  priority

                />



                <div

                  className="absolute inset-0"

                  style={{ padding: scene.bubblePadding }}

                >

                  <div className="flex h-full w-full min-h-0 items-center justify-center">

                    <p

                      id="narrative-text-body"

                      lang="fr"

                      className="font-display m-0 w-full max-h-full overflow-y-auto scrollbar-hide text-center text-gray-900"

                      style={{

                        fontSize: bodyFontSize,

                        lineHeight,

                        wordBreak: "normal",

                        overflowWrap: "break-word",

                        hyphens: "none",

                      }}

                    >

                      {displayedText}

                      {isTyping ? (

                        <span

                          className="inline-block animate-pulse"

                          aria-hidden="true"

                        >

                          ▍

                        </span>

                      ) : null}

                    </p>

                  </div>

                </div>

              </div>



              <div

                className="absolute z-10"

                style={{

                  top: scene.readAloudTop,

                  right: scene.readAloudRight,

                }}

              >

                <ReadAloudButton

                  text={readAloudText}

                  ariaLabel="Lire le texte"

                />

              </div>

            </div>

          </div>

        </div>

      </div>



      <button

        type="button"

        onClick={onNext}

        className="absolute touch-manipulation transition-transform hover:scale-110"

        style={{

          bottom: "clamp(12px, 3vh, 28px)",

          right: "clamp(12px, 3vw, 28px)",

          width: "clamp(56px, 8vw, 96px)",

          height: "clamp(56px, 8vw, 96px)",

        }}

        aria-label={nextAriaLabel}

      >

        <div className="relative h-full w-full">

          <Image

            src="/ui/icon_next.webp"

            alt="Suivant"

            fill

            style={{ objectFit: "contain" }}

          />

        </div>

      </button>

    </div>

  );

}

