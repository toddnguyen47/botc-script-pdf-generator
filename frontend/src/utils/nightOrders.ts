import type { ScriptCharacter } from "botc-script-checker";
import {
  NightOrderEntry,
  NightOrders,
  ParsedScript,
  getFirstNightOrder,
  getOtherNightOrder,
} from "botc-character-sheet";

type RawCharMap = Map<string, { firstNight?: number; otherNight?: number }>;

const createRawCharMap = (characters: ScriptCharacter[]): RawCharMap => {
  const rawCharMap = new Map<
    string,
    { firstNight?: number; otherNight?: number }
  >();

  for (const char of characters) {
    if (char.firstNight !== undefined || char.otherNight !== undefined) {
      rawCharMap.set(char.id.toLowerCase(), {
        firstNight: char.firstNight,
        otherNight: char.otherNight,
      });
    }
  }

  return rawCharMap;
};

const getPosition = (
  entry: NightOrderEntry,
  nightType: "firstNight" | "otherNight",
  orderList: string[],
  rawCharMap: RawCharMap,
): number => {
  const id = typeof entry === "string" ? entry : entry.id;

  // ! Remove travellers from Night Order
  if (typeof entry !== "string" && entry.team === "traveller") return Infinity;

  const officialIndex = orderList.indexOf(id);

  if (officialIndex !== -1) {
    return officialIndex;
  }

  // Check if it's a custom character with a numeric position
  const customData = rawCharMap.get(id);
  const customValue =
    nightType === "firstNight"
      ? customData?.firstNight
      : customData?.otherNight;

  if (customValue !== undefined && customValue > 0) {
    return customValue;
  }

  return Infinity; // Characters without night actions go to the end
};

const buildNightOrder = async (
  characters: NightOrderEntry[],
  nightType: "firstNight" | "otherNight",
  rawCharMap: RawCharMap,
): Promise<NightOrderEntry[]> => {
  const orderList =
    nightType === "firstNight"
      ? await getFirstNightOrder()
      : await getOtherNightOrder();

  // Filter characters that have actions for this night
  const activeChars = characters.filter((char) => {
    const position = getPosition(char, nightType, orderList, rawCharMap);
    return position !== Infinity;
  });

  const charsAndMarkers: NightOrderEntry[] =
    nightType === "firstNight"
      ? [...activeChars, "dawn", "dusk", "minioninfo", "demoninfo"]
      : [...activeChars, "dawn", "dusk"];

  // Sort characters by position
  charsAndMarkers.sort((a, b) => {
    return (
      getPosition(a, nightType, orderList, rawCharMap) -
      getPosition(b, nightType, orderList, rawCharMap)
    );
  });

  return charsAndMarkers;
};

export const calculateNightOrders = async (
  parsedScript: ParsedScript,
): Promise<NightOrders> => {
  const rawCharMap = createRawCharMap(parsedScript.characters);

  const first = parsedScript.metadata?.firstNight?.length
    ? await parseNightOrder(
        parsedScript.metadata.firstNight,
        parsedScript.characters,
      )
    : await buildNightOrder(parsedScript.characters, "firstNight", rawCharMap);

  const other = parsedScript.metadata?.otherNight?.length
    ? await parseNightOrder(
        parsedScript.metadata.otherNight,
        parsedScript.characters,
      )
    : await buildNightOrder(parsedScript.characters, "otherNight", rawCharMap);

  return { first, other };
};

const parseNightOrder = async (
  nightOrder: string[],
  characters: ScriptCharacter[],
): Promise<NightOrderEntry[]> => {
  let nightOrderEntries: NightOrderEntry[] = [];
  for (const entry of nightOrder) {
    const foundChar = characters.find(
      (c) => c.id.toLowerCase() === entry.toLowerCase(),
    );
    const isNightMarker = ["dawn", "dusk", "minioninfo", "demoninfo"].includes(
      entry.toLowerCase(),
    );
    if (foundChar) {
      nightOrderEntries.push(foundChar);
    } else if (isNightMarker) {
      nightOrderEntries.push(entry.toLowerCase() as NightOrderEntry);
    }
  }
  return nightOrderEntries;
};
