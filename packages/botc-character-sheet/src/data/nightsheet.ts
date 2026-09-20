import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/queryProvider";

export type Nightsheet = {
  firstNight: string[];
  otherNight: string[];
};

const JSON_URL = "https://release.botc.app/resources/data/nightsheet.json";

async function loadNightsheet(): Promise<Nightsheet> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load nightsheet: ${response.status}`);
  }

  return response.json() as Promise<Nightsheet>;
}

const nightsheetQuery = {
  queryKey: ["nightsheet"],
  queryFn: loadNightsheet,
  staleTime: 15 * 60 * 1000,
};

export function useNightsheet() {
  return useQuery(nightsheetQuery);
}

export async function getNightsheet(): Promise<Nightsheet> {
  return queryClient.query(nightsheetQuery);
}

export async function getFirstNightOrder(): Promise<string[]> {
  const data = await getNightsheet();
  return data.firstNight;
}

export async function getOtherNightOrder(): Promise<string[]> {
  const data = await getNightsheet();
  return data.otherNight;
}
