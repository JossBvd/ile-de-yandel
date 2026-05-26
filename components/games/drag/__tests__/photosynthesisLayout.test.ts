import {
  computePhotosynthesisLayout,
  PHOTOSYNTHESIS_ACCESSIBLE_TOUCH_PX,
  PHOTOSYNTHESIS_MIN_TOUCH_PX,
} from "../photosynthesisLayout";

describe("computePhotosynthesisLayout", () => {
  const baseMobile = {
    atomRowCount: 2,
    isMobileOrTablet: true,
    isSmallScreen: true,
    isMediumScreen: false,
    isDesktopSmall: false,
    isDesktopMedium: false,
  };

  it("dimensionne les atomes selon la zone de jeu (sidebar incluse)", () => {
    const layout = computePhotosynthesisLayout({
      ...baseMobile,
      viewportWidth: 844,
      viewportHeight: 390,
    });

    expect(layout.atomGridSize).toBeGreaterThanOrEqual(PHOTOSYNTHESIS_MIN_TOUCH_PX);
    expect(layout.leftPanelWidthPx + layout.rightPanelWidthPx).toBeLessThan(
      844 - 160,
    );
    expect(layout.panelHeightPx).toBeLessThanOrEqual(layout.playAreaMaxHeight);
  });

  it("utilise toute la hauteur sans bandeau de consigne séparé", () => {
    const layout = computePhotosynthesisLayout({
      ...baseMobile,
      viewportWidth: 667,
      viewportHeight: 375,
    });

    expect(layout.playAreaMaxHeight).toBeGreaterThan(300);
    expect(layout.panelHeightPx).toBeLessThanOrEqual(layout.playAreaMaxHeight);
  });

  it("privilégie le panneau gauche (atomes) en largeur", () => {
    const layout = computePhotosynthesisLayout({
      atomRowCount: 2,
      viewportWidth: 1280,
      viewportHeight: 800,
      isMobileOrTablet: false,
      isSmallScreen: false,
      isMediumScreen: false,
      isDesktopSmall: true,
      isDesktopMedium: false,
    });

    expect(layout.leftPanelWidthPx).toBeGreaterThan(
      layout.rightPanelWidthPx * 0.8,
    );
    expect(layout.atomGridSize).toBeGreaterThan(76);
  });

  it("agrandit les cibles DnD quand DYS ou audiodescription est actif", () => {
    const accessible = computePhotosynthesisLayout({
      ...baseMobile,
      viewportWidth: 844,
      viewportHeight: 390,
      preferLargeTouchTargets: true,
    });

    expect(accessible.minTouchPx).toBe(PHOTOSYNTHESIS_ACCESSIBLE_TOUCH_PX);
    expect(accessible.atomGridSize).toBeGreaterThanOrEqual(
      PHOTOSYNTHESIS_ACCESSIBLE_TOUCH_PX,
    );
  });
});
