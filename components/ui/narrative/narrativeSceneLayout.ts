import type { NarrativeTypographyOptions } from "./narrativeTypography";

type SceneLayoutOptions = NarrativeTypographyOptions & {
  isMobileOrTablet: boolean;
};

export interface NarrativeSceneLayout {
  sceneHeight: string;
  yandelWidth: string;
  bubbleLeft: string;
  bubbleTop: string;
  bubbleWidth: string;
  bubbleHeight: string;
  bubblePadding: string;
  readAloudTop: string;
  readAloudRight: string;
}

const YANDEL_WIDTH = 0.38;
const MOUTH_X_IN_YANDEL = 0.62;
const BUBBLE_LEFT = YANDEL_WIDTH * MOUTH_X_IN_YANDEL - 0.02;
const BUBBLE_WIDTH = 1 - BUBBLE_LEFT + 0.03;

export function getNarrativeSceneLayout({
  isSmallScreen,
  isMediumScreen,
  isMobileOrTablet,
}: SceneLayoutOptions): NarrativeSceneLayout {
  const yandelWidth = `${YANDEL_WIDTH * 100}%`;
  const bubbleLeft = `${BUBBLE_LEFT * 100}%`;
  const bubbleWidth = `${BUBBLE_WIDTH * 100}%`;

  if (isSmallScreen) {
    return {
      sceneHeight: "100dvh",
      yandelWidth,
      bubbleLeft,
      bubbleTop: "1%",
      bubbleWidth,
      bubbleHeight: "96%",
      bubblePadding: "8% 8% 8% 26%",
      readAloudTop: "8%",
      readAloudRight: "8%",
    };
  }

  if (isMediumScreen && isMobileOrTablet) {
    return {
      sceneHeight: "100dvh",
      yandelWidth,
      bubbleLeft,
      bubbleTop: "3%",
      bubbleWidth,
      bubbleHeight: "93%",
      bubblePadding: "10% 9% 10% 27%",
      readAloudTop: "10%",
      readAloudRight: "8%",
    };
  }

  return {
    sceneHeight: "100dvh",
    yandelWidth,
    bubbleLeft,
    bubbleTop: "6%",
    bubbleWidth,
    bubbleHeight: "88%",
    bubblePadding: "12% 10% 12% 28%",
    readAloudTop: "12%",
    readAloudRight: "8%",
  };
}
