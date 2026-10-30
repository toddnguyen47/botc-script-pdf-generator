import rolesJson from "./roles.json";
import type { ResolvedCharacter } from "../types";
import { createCache } from "./cache";

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

export const ROLES_BY_ID: Record<string, ResolvedCharacter> =
  Object.fromEntries(
    (rolesJson as OfficialRole[]).map((role) => [
      role.id,
      role as unknown as ResolvedCharacter,
    ]),
  );

const CACHE_DURATION = 15 * 60 * 1000;

const getCachedRoles =
  createCache<Record<string, ResolvedCharacter>>(CACHE_DURATION);

export function getRolesAsync(): Promise<Record<string, ResolvedCharacter>> {
  return getCachedRoles(async () => {
    const response = await fetch(
      "https://release.botc.app/resources/data/roles.json",
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status}`);
    }

    const rolesJson = await response.json();

    return Object.fromEntries(
      (rolesJson as OfficialRole[]).map((role) => [
        role.id,
        role as unknown as ResolvedCharacter,
      ]),
    );
  });
}
