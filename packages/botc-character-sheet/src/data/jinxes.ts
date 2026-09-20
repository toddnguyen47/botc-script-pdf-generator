import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/queryProvider";

import type { Jinx } from "../types";

type OfficialJinxEntry = {
  id: string;
  jinx: Array<{ id: string; reason: string }>;
};

const JSON_URL = "https://release.botc.app/resources/data/jinxes.json";

async function loadJinxes(): Promise<Jinx[]> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load jinxes: ${response.status}`);
  }

  const jinxesJson = (await response.json()) as OfficialJinxEntry[];

  return jinxesJson.flatMap(({ id: char1, jinx }) =>
    jinx.map(({ id: char2, reason }) => ({
      characters: [char1, char2] as [string, string],
      jinx: reason,
    })),
  );
}

const jinxesQuery = {
  queryKey: ["jinxes"],
  queryFn: loadJinxes,
  staleTime: 15 * 60 * 1000,
};

export function useJinxes() {
  return useQuery(jinxesQuery);
}

export async function getJinxes(): Promise<Jinx[]> {
  return queryClient.query(jinxesQuery);
}
