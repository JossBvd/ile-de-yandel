export interface NarrativeTypographyOptions {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isDesktopSmall?: boolean;
}

export function getNarrativeTypography({
  isSmallScreen,
  isMediumScreen,
  isDesktopSmall,
}: NarrativeTypographyOptions) {
  let bodyFontSize: string;
  let titleFontSize: string;

  if (isSmallScreen) {
    bodyFontSize = "1.125rem";
    titleFontSize = "1.25rem";
  } else if (isMediumScreen) {
    bodyFontSize = "1.25rem";
    titleFontSize = "1.375rem";
  } else if (isDesktopSmall) {
    bodyFontSize = "1.375rem";
    titleFontSize = "1.6875rem";
  } else {
    bodyFontSize = "1.5rem";
    titleFontSize = "1.875rem";
  }

  return {
    bodyFontSize,
    titleFontSize,
    lineHeight: 1.5,
  };
}
