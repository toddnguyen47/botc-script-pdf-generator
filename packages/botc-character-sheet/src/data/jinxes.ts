import jinxesJson from "./jinxes.json";
import type { Jinx } from "../types";
import { createCache } from "./cache";

type OfficialJinxEntry = {
  id: string;
  jinx: Array<{ id: string; reason: string }>;
};

export const JINXES: Jinx[] = (jinxesJson as OfficialJinxEntry[]).flatMap(
  ({ id: char1, jinx }) =>
    jinx.map(({ id: char2, reason }) => ({
      characters: [char1, char2] as [string, string],
      jinx: reason,
    })),
);

const CACHE_DURATION = 15 * 60 * 1000;

const getCachedJinxes = createCache<Jinx[]>(CACHE_DURATION);

export function getJinxesAsync(): Promise<Jinx[]> {
  return getCachedJinxes(async () => {
    const response = await fetch(
      "https://release.botc.app/resources/data/jinxes.json",
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch jinxes: ${response.status}`);
    }

    const jinxesJson = await response.json();

    return (jinxesJson as OfficialJinxEntry[]).flatMap(({ id: char1, jinx }) =>
      jinx.map(({ id: char2, reason }) => ({
        characters: [char1, char2] as [string, string],
        jinx: reason,
      })),
    );
  });
}
