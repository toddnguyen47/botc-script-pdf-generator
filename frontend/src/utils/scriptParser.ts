import { ParsedScript, ResolvedCharacter, getRole } from "botc-character-sheet";
import { toTitleCase } from "./stringUtils";
import { ScriptMetadata, Script, ScriptCharacter } from "botc-script-checker";

export async function parseScript(json: unknown): Promise<ParsedScript> {
  if (!Array.isArray(json)) {
    throw new Error("Script must be an array");
  }

  const script = json as Script;
  let metadata: ScriptMetadata | null = null;
  const characters: ScriptCharacter[] = [];

  for (const element of script) {
    if (typeof element === "string") {
      // Official character ID
      const resolved = await resolveOfficialCharacter(element);
      if (resolved) {
        characters.push(resolved);
      }
    } else if (typeof element === "object" && element !== null) {
      if ("id" in element) {
        if (element.id === "_meta") {
          // Metadata element
          metadata = element as ScriptMetadata;
        } else if ("team" in element && "ability" in element) {
          // Custom character with full definition
          const custom = element as ScriptCharacter;
          characters.push(resolveCustomCharacter(custom));
        } else {
          // Possibly old format or official character object — preserve any inline firstNight/otherNight override.
          const id = (element as { id: string }).id;
          const resolved = await resolveOfficialCharacter(id);
          if (resolved) {
            const raw = element as {
              firstNight?: unknown;
              otherNight?: unknown;
            };
            characters.push({
              ...resolved,
              ...(typeof raw.firstNight === "number"
                ? { firstNight: raw.firstNight }
                : {}),
              ...(typeof raw.otherNight === "number"
                ? { otherNight: raw.otherNight }
                : {}),
            });
          }
        }
      }
    }
  }

  // If the script metadata includes bootlegger rules but the character isn't
  // present in the script, add it.
  const bootleggerInCharacters = characters.find(
    (c) => typeof c.id === "string" && c.id.toLowerCase() === "bootlegger",
  );
  if (metadata?.bootlegger?.length && !bootleggerInCharacters) {
    const bootleggerChar = await resolveOfficialCharacter("bootlegger");
    bootleggerChar && characters.push(bootleggerChar);
  }

  return { metadata, characters };
}

async function resolveOfficialCharacter(
  id: string,
): Promise<ResolvedCharacter | null> {
  const lowerId = id.toLowerCase().replace("_", "");
  const char = getRole(lowerId);

  if (!char) {
    console.warn(`Character not found: ${id}`);
    return null;
  }

  return char;
}

function resolveCustomCharacter(char: ScriptCharacter): ResolvedCharacter {
  return {
    ...char,
    team: (char.team as any) === "traveler" ? "traveller" : char.team,
    // Malformed names (non-string) are left as-is here and excluded during
    // sanitizeScript — toTitleCase() requires a string and must not be
    // called speculatively on untrusted input.
    name: typeof char.name === "string" ? toTitleCase(char.name) : char.name,
    isCustom: true,
  };
}
