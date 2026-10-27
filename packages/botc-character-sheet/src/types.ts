import type { ScriptCharacter, ScriptMetadata } from "botc-script-checker";

// Character types needed by the component
export type CharacterTeam =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "traveller"
  | "fabled";

export type ResolvedCharacter = ScriptCharacter & {
  edition?: string;
  isCustom?: boolean;
};

export interface GroupedCharacters {
  townsfolk: ResolvedCharacter[];
  outsider: ResolvedCharacter[];
  minion: ResolvedCharacter[];
  demon: ResolvedCharacter[];
  traveller: ResolvedCharacter[];
  fabled: ResolvedCharacter[];
  loric: ResolvedCharacter[];
}

export interface Jinx {
  characters: [string, string];
  jinx: string;
  oldJinx?: string;
}

export type NightMarker = "dawn" | "dusk" | "minioninfo" | "demoninfo";
export type NightOrderEntry = ResolvedCharacter | NightMarker;

export interface NightOrders {
  first: NightOrderEntry[];
  other: NightOrderEntry[];
}

export interface TitleStyle {
  font: string;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  backLineHeight: number;
  marginTop: number;
  marginBottom: number;
  customFontUrl: string;
}

export enum AppearanceLevel {
  Normal = "normal",
  Compact = "compact",
  SuperCompact = "super-compact",
  MegaCompact = "mega-compact",
}

export type NightOrderTextAlign = "start" | "end" | "center";

export interface ScriptOptions {
  color: string | string[];
  logo: string;
  showLogo: boolean;
  showTitle: boolean;
  showAuthor: boolean;
  showJinxes: boolean;
  useDarkGrayForAbilityText: boolean;
  nightSheetReminderTextAlign: NightOrderTextAlign;
  useOldJinxes: boolean;
  showSwirls: boolean;
  includeMargins: boolean;
  solidTitle: boolean;
  appearance: AppearanceLevel;
  overleaf: "backingSheet" | "infoSheet" | "none";
  showNightSheet: boolean;
  iconScale: number;
  formatMinorWords: boolean;
  displayNightOrder: boolean;
  displayPlayerCounts: boolean;
  numberOfCharacterSheets: number;
  inlineJinxIcons: "none" | "primary" | "both";
  iconUrlTemplate: string;
  titleStyle: TitleStyle;
  dimensions: PageDimensions;
  teensy: boolean;
  characterSheetFontSizeStepPercent: number;
}

export interface ParsedScript {
  metadata: ScriptMetadata | null;
  characters: ScriptCharacter[];
}

export interface CharacterNameReplacementData {
  replacements: CharacterNameReplacement;
}

export type NetworkPayload = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
  filename: string;
  characterNameReplacement: CharacterNameReplacement;
};

export type PageDimensions = {
  width: number;
  height: number;
  margin: number;
  bleed: number;
};

export type CharacterNameReplacement = Record<string, string>;

export const COLOR_DARK_GRAY = "#222";
export const COLOR_DARK_BROWN = "#b34d00";
