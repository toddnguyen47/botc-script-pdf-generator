import type { Jinx } from "../types";

type OfficialJinxEntry = {
  id: string;
  jinx: Array<{ id: string; reason: string }>;
};

const JSON_URL = "https://release.botc.app/resources/data/jinxes.json";
const CACHE_DURATION = 15 * 60 * 1000;

let jinxes: Jinx[] | null = null;
let cachedAt = 0;
let loading: Promise<Jinx[]> | null = null;

async function loadJinxes(): Promise<Jinx[]> {
  if (jinxes !== null && Date.now() - cachedAt < CACHE_DURATION) {
    return jinxes;
  }

  if (!loading) {
    loading = fetch(JSON_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load jinxes: ${response.status}`);
        }

        return response.json() as Promise<OfficialJinxEntry[]>;
      })
      .then((jinxesJson) => {
        jinxes = jinxesJson.flatMap(({ id: char1, jinx }) =>
          jinx.map(({ id: char2, reason }) => ({
            characters: [char1, char2] as [string, string],
            jinx: reason,
          })),
        );

        cachedAt = Date.now();

        return jinxes;
      })
      .finally(() => {
        loading = null;
      });
  }

  return loading;
}

export async function getJinxes(): Promise<Jinx[]> {
  return loadJinxes();
}
