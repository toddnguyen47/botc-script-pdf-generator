import { ResolvedCharacter, GroupedCharacters } from "../types";

export function groupCharactersByTeam(
  characters: ResolvedCharacter[],
): GroupedCharacters {
  const grouped: GroupedCharacters = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
    loric: [],
  };

  for (const char of characters) {
    try {
      grouped[char.team].push(char);
    } catch {
      console.error("Unknown team for:", char);
    }
  }

  return grouped;
}

export function resolveIconUrl(
  template: string,
  character: ResolvedCharacter,
): string | null {
  if (!template) return null;
  const iconTemplate = template + TEMPLATE_ICONS;
  const defaultAlignment = getDefaultAlignment(character);
  let iconUrl = iconTemplate
    .replace("{edition}", character.edition ?? "")
    .replace("{id}", character.id);
  if (defaultAlignment !== "") {
    iconUrl = iconUrl + "_" + defaultAlignment;
  }
  return iconUrl + TEMPLATE_EXTENSION;
}

export function getGenericIconUrl(team: string): string {
  return `/images/icons/generic_${team}.webp`;
}

export const getImageUrl = (
  character: ResolvedCharacter,
  iconUrlTemplate?: string,
) => {
  // Use custom image if provided on the character
  if (character.image) {
    if (typeof character.image === "string") {
      return character.image;
    }
    return character.image[0];
  }
  // Fall back to icon URL template
  if (iconUrlTemplate) {
    return resolveIconUrl(iconUrlTemplate, character);
  }
  return null;
};

const TEMPLATE_ICONS = "{edition}/{id}";
const TEMPLATE_EXTENSION = ".webp";

const DEFAULT_ALIGNMENT: Record<string, string> = {
  townsfolk: "g",
  outsider: "g",
  minion: "e",
  demon: "e",
};

function getDefaultAlignment(character: ResolvedCharacter): string {
  const team = character.team.toLocaleLowerCase();
  if (team in DEFAULT_ALIGNMENT) {
    return DEFAULT_ALIGNMENT[team];
  } else {
    return "";
  }
}
