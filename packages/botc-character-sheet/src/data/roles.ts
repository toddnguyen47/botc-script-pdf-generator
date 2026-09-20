import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ResolvedCharacter } from "../types";
import { queryClient } from "../utils/queryProvider";

export type OfficialRole = {
  id: string;
  name: string;
  team: string;
  edition: string;
  firstNightReminder?: string;
  otherNightReminder?: string;
  reminders: string[];
  setup: boolean;
  ability: string;
  flavor?: string;
};

const JSON_URL = "https://release.botc.app/resources/data/roles.json";

const rolesQuery = queryOptions({
  queryKey: ["roles"],
  queryFn: loadRoles,
  staleTime: 15 * 60 * 1000,
});

async function loadRoles(): Promise<ResolvedCharacter[]> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load roles: ${response.status}`);
  }

  const roles = (await response.json()) as OfficialRole[];

  return roles as unknown as ResolvedCharacter[];
}

export function useRoles() {
  return useQuery(rolesQuery);
}

export async function getRoles(): Promise<ResolvedCharacter[]> {
  return queryClient.query(rolesQuery);
}

export async function getRole(id: string): Promise<ResolvedCharacter | null> {
  const roles = await getRoles();

  return roles.find((role) => role.id === id) ?? null;
}
