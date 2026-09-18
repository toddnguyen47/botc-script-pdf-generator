import type { ResolvedCharacter } from "../types";

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

let rolesById: Record<string, ResolvedCharacter> = {};

export async function loadRoles(): Promise<void> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load roles: ${response.status}`);
  }

  const rolesJson = (await response.json()) as OfficialRole[];

  rolesById = Object.fromEntries(
    rolesJson.map((role) => [role.id, role as unknown as ResolvedCharacter]),
  );
}

export function getRole(id: string): ResolvedCharacter | null {
  return rolesById[id] ?? null;
}
