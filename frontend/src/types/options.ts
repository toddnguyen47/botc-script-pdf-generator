import {
  ScriptOptions,
  TitleStyle,
  AppearanceLevel,
} from "botc-character-sheet";

export type OverleafType = "none" | "backingSheet" | "infoSheet";
export type PaperType = "A4" | "Letter";

// Re-export types from botc-character-sheet for convenience
export type { PageDimensions, TitleStyle } from "botc-character-sheet";

export const randomColor = () => {
  const r = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const g = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const b = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");

  const hex = `#${r}${g}${b}`;
  return hex;
};

export const TITLE_FONT_DEFAULTS: Record<
  string,
  Omit<TitleStyle, "font" | "customFontUrl">
> = {
  "Alice in Wonderland": {
    fontSize: 32,
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 0,
  },
  Anglican: {
    fontSize: 32,
    letterSpacing: -0.2,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 26,
    marginTop: -2,
    marginBottom: 0,
  },
  "Canterbury Regular": {
    fontSize: 32,
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 22,
    marginTop: -1,
    marginBottom: 0,
  },
  Dumbledor: {
    fontSize: 32,
    letterSpacing: -0.2,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 0,
  },
  "Utm Agin": {
    fontSize: 32,
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 2,
  },
  "Waters Gothic": {
    fontSize: 32,
    letterSpacing: 0,
    wordSpacing: 0,
    lineHeight: 17,
    backLineHeight: 28,
    marginTop: -2,
    marginBottom: -3,
  },
};

export const DEFAULT_OPTIONS: ScriptOptions = {
  color: randomColor(),
  logo: "",
  showLogo: true,
  showTitle: true,
  showAuthor: true,
  showJinxes: true,
  useOldJinxes: false,
  showSwirls: true,
  includeMargins: false,
  solidTitle: false,
  appearance: AppearanceLevel.Normal,
  overleaf: "backingSheet",
  showNightSheet: true,
  iconScale: 1.7,
  formatMinorWords: false,
  displayNightOrder: true,
  displayPlayerCounts: true,
  numberOfCharacterSheets: 1,
  inlineJinxIcons: "primary",
  iconUrlTemplate: "/images/icons/{id}.webp",
  titleStyle: {
    font: "Utm Agin",
    fontSize: 32,
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 0,
    customFontUrl: "",
  },
  dimensions: { width: 210, height: 297, margin: 0, bleed: 0 },
  teensy: false,
};
