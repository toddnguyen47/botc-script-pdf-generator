import type { Jinx } from "../types";

type OfficialJinxEntry = {
  id: string;
  jinx: Array<{ id: string; reason: string }>;
};

let jinxes: Jinx[] = [];

const JSON_URL = "https://release.botc.app/resources/data/jinxes.json";

export async function loadJinxes(): Promise<void> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load jinxes: ${response.status}`);
  }

  const jinxesJson = (await response.json()) as OfficialJinxEntry[];

  jinxes = jinxesJson.flatMap(({ id: char1, jinx }) =>
    jinx.map(({ id: char2, reason }) => ({
      characters: [char1, char2] as [string, string],
      jinx: reason,
    })),
  );
}

export function getJinxes(): Jinx[] {
  return jinxes;
}
