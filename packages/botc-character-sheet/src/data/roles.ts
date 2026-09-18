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
const CACHE_DURATION = 15 * 60 * 1000;

let rolesById: Record<string, ResolvedCharacter> = {};
let cachedAt = 0;
let loading: Promise<void> | null = null;

async function loadRoles(): Promise<void> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load roles: ${response.status}`);
  }

  const rolesJson = (await response.json()) as OfficialRole[];

  rolesById = Object.fromEntries(
    rolesJson.map((role) => [role.id, role as unknown as ResolvedCharacter]),
  );

  cachedAt = Date.now();
}

export async function getRole(id: string): Promise<ResolvedCharacter | null> {
  const cacheExpired = Date.now() - cachedAt >= CACHE_DURATION;

  if (cacheExpired) {
    if (!loading) {
      loading = loadRoles().finally(() => {
        loading = null;
      });
    }

    await loading;
  }

  return rolesById[id] ?? null;
}
