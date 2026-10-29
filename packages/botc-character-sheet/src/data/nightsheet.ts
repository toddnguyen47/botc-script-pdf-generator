import { createCache } from "./cache";
import nightsheetJson from "./nightsheet.json";

type Nightsheet = {
  firstNight: string[];
  otherNight: string[];
};

const nightsheet = nightsheetJson as Nightsheet;

export const FIRST_NIGHT_ORDER: string[] = nightsheet.firstNight;
export const OTHER_NIGHT_ORDER: string[] = nightsheet.otherNight;

const CACHE_DURATION = 15 * 60 * 1000;

const getCachedNightsheet = createCache<Nightsheet>(CACHE_DURATION);

export function getNightsheetAsync(): Promise<Nightsheet> {
  return getCachedNightsheet(async () => {
    const response = await fetch(
      "https://release.botc.app/resources/data/nightsheet.json",
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status}`);
    }

    const nightsheetJson = await response.json();
    return nightsheetJson as Nightsheet;
  });
}
