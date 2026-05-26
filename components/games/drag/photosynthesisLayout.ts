/** Cible tactile standard (WCAG 2.5.5 / ~48dp) */
export const PHOTOSYNTHESIS_MIN_TOUCH_PX = 48;

/** Cible renforcée quand DYS et/ou audiodescription sont actifs */
export const PHOTOSYNTHESIS_ACCESSIBLE_TOUCH_PX = 56;

export interface PhotosynthesisLayoutInput {
  viewportWidth: number;
  viewportHeight: number;
  atomRowCount: number;
  isMobileOrTablet: boolean;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isDesktopSmall: boolean;
  isDesktopMedium: boolean;
  preferLargeTouchTargets?: boolean;
}

export interface PhotosynthesisLayoutMetrics {
  paddingEdge: string;
  instructionFontSize: string;
  recipeFontSize: string;
  recipeCheckSizePx: number;
  playAreaMaxHeight: number;
  panelHeightPx: number;
  leftPanelWidthPx: number;
  rightPanelWidthPx: number;
  atomGridSize: number;
  fusionSlotSize: number;
  minTouchPx: number;
  panelGapPx: number;
  atomGridGapPx: number;
  fusionSlotGapPx: number;
  fusionZoneGapPx: number;
  rightPanelGapPx: number;
  rightPanelScrollable: boolean;
}

export function getStepSidebarWidthPx(
  viewportWidth: number,
  isMobileOrTablet: boolean,
  isSmallScreen: boolean,
  isMediumScreen: boolean,
): number {
  if (isMobileOrTablet) {
    if (isSmallScreen) return 160;
    if (isMediumScreen) return 180;
    return 200;
  }
  return Math.min(250, Math.round(viewportWidth * 0.2));
}

export function computePhotosynthesisLayout(
  input: PhotosynthesisLayoutInput,
): PhotosynthesisLayoutMetrics {
  const {
    viewportWidth,
    viewportHeight,
    atomRowCount,
    isMobileOrTablet,
    isSmallScreen,
    isMediumScreen,
    isDesktopSmall,
    isDesktopMedium,
    preferLargeTouchTargets = false,
  } = input;

  const isVeryShortViewport = isMobileOrTablet && viewportHeight < 440;
  const minTouchPx = preferLargeTouchTargets
    ? PHOTOSYNTHESIS_ACCESSIBLE_TOUCH_PX
    : PHOTOSYNTHESIS_MIN_TOUCH_PX;
  const atomSizeCap = isMobileOrTablet
    ? preferLargeTouchTargets
      ? 104
      : 96
    : preferLargeTouchTargets
      ? 120
      : 116;

  const paddingEdge = isMobileOrTablet
    ? isSmallScreen
      ? "8px 10px"
      : isMediumScreen
        ? "10px 12px"
        : "12px 14px"
    : isDesktopSmall
      ? "12px 16px"
      : isDesktopMedium
        ? "16px 20px"
        : "20px 24px";

  const paddingHorizontalPx = isMobileOrTablet
    ? isSmallScreen
      ? 20
      : isMediumScreen
        ? 24
        : 28
    : isDesktopSmall
      ? 24
      : isDesktopMedium
        ? 32
        : 40;

  const paddingVerticalPx = isMobileOrTablet
    ? isSmallScreen
      ? 8
      : isMediumScreen
        ? 10
        : 12
    : 20;

  const instructionFontSize = isMobileOrTablet
    ? isSmallScreen
      ? "clamp(0.8125rem, 3.2vh, 0.9375rem)"
      : "clamp(0.875rem, 3vh, 1rem)"
    : isDesktopSmall
      ? "1.0625rem"
      : isDesktopMedium
        ? "1.125rem"
        : "1.25rem";

  const recipeFontSize = isMobileOrTablet
    ? isSmallScreen
      ? "0.9375rem"
      : "1rem"
    : isDesktopSmall
      ? "1.25rem"
      : isDesktopMedium
        ? "1.375rem"
        : "1.5rem";

  const recipeCheckSizePx = isMobileOrTablet
    ? isSmallScreen
      ? 36
      : 40
    : isDesktopSmall
      ? 56
      : isDesktopMedium
        ? 64
        : 72;

  const playAreaMaxHeight = Math.max(
    minTouchPx * 5,
    viewportHeight - paddingVerticalPx * 2 - (isMobileOrTablet ? 6 : 12),
  );

  const panelGapPx = isMobileOrTablet
    ? isVeryShortViewport
      ? 8
      : isSmallScreen
        ? 10
        : 12
    : isDesktopSmall
      ? 28
      : 36;

  const atomGridGapPx = isMobileOrTablet
    ? isVeryShortViewport
      ? 8
      : isSmallScreen
        ? 10
        : 12
    : isDesktopSmall
      ? 22
      : 26;

  const fusionSlotGapPx = isMobileOrTablet
    ? isVeryShortViewport
      ? 8
      : 10
    : isDesktopSmall
      ? 22
      : 26;

  const fusionZoneGapPx = isMobileOrTablet ? 12 : isDesktopSmall ? 28 : 32;

  const rightPanelGapPx = isMobileOrTablet
    ? isVeryShortViewport
      ? 10
      : 12
    : isDesktopSmall
      ? 20
      : 24;

  const sidebarWidthPx = getStepSidebarWidthPx(
    viewportWidth,
    isMobileOrTablet,
    isSmallScreen,
    isMediumScreen,
  );
  const gameAreaWidth = Math.max(
    280,
    viewportWidth - sidebarWidthPx - paddingHorizontalPx,
  );

  const panelInnerPaddingPx = isMobileOrTablet ? 16 : 28;
  const fusionButtonHeightPx = isMobileOrTablet
    ? preferLargeTouchTargets
      ? 38
      : 34
    : 44;
  const panelVerticalChromePx = isMobileOrTablet ? 20 : 32;

  const leftPanelWidthPx = isMobileOrTablet
    ? Math.floor((gameAreaWidth - panelGapPx) * 0.52)
    : Math.floor((gameAreaWidth - panelGapPx) * 0.48);
  const rightPanelWidthPx =
    gameAreaWidth - leftPanelWidthPx - panelGapPx;

  const atomFromWidth = Math.floor(
    (leftPanelWidthPx - panelInnerPaddingPx * 2 - atomGridGapPx * 2) / 3,
  );

  const atomFromHeight = Math.floor(
    (playAreaMaxHeight -
      panelVerticalChromePx -
      fusionButtonHeightPx -
      fusionZoneGapPx -
      atomGridGapPx) /
      (atomRowCount + 1),
  );

  let atomGridSize = Math.max(
    minTouchPx,
    Math.min(atomFromWidth, atomFromHeight, atomSizeCap),
  );

  if (preferLargeTouchTargets) {
    atomGridSize = Math.max(
      minTouchPx,
      Math.min(
        Math.round(atomGridSize * (isMobileOrTablet ? 1.04 : 1.06)),
        atomFromWidth,
        atomFromHeight,
        atomSizeCap,
      ),
    );
  }

  let fusionSlotSize = Math.max(
    minTouchPx,
    isMobileOrTablet
      ? Math.min(Math.round(atomGridSize * 1.04), atomFromHeight)
      : atomGridSize,
  );

  const measureLeftPanelHeight = (
    atomSize: number,
    fusionSize: number,
  ) =>
    panelVerticalChromePx +
    atomRowCount * atomSize +
    (atomRowCount - 1) * atomGridGapPx +
    fusionZoneGapPx +
    fusionSize +
    atomGridGapPx +
    fusionButtonHeightPx;

  while (
    atomGridSize > minTouchPx &&
    measureLeftPanelHeight(atomGridSize, fusionSlotSize) > playAreaMaxHeight
  ) {
    atomGridSize -= 1;
    fusionSlotSize = Math.max(
      minTouchPx,
      Math.min(Math.round(atomGridSize * 1.04), atomGridSize),
    );
  }

  const leftPanelContentHeight = measureLeftPanelHeight(
    atomGridSize,
    fusionSlotSize,
  );
  const panelHeightPx = Math.min(leftPanelContentHeight, playAreaMaxHeight);

  return {
    paddingEdge,
    instructionFontSize,
    recipeFontSize,
    recipeCheckSizePx,
    playAreaMaxHeight,
    panelHeightPx,
    leftPanelWidthPx,
    rightPanelWidthPx,
    atomGridSize,
    fusionSlotSize,
    minTouchPx,
    panelGapPx,
    atomGridGapPx,
    fusionSlotGapPx,
    fusionZoneGapPx,
    rightPanelGapPx,
    rightPanelScrollable: true,
  };
}
