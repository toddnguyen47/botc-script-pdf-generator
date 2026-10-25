import { ResolvedCharacter } from "botc-character-sheet";

export interface SortFilter {
  sort(input: ResolvedCharacter[]): ResolvedCharacter[];
  furtherSort(): SortFilter[];
}

export class CharacterNameSort implements SortFilter {
  sort(input: ResolvedCharacter[]): ResolvedCharacter[] {
    return input.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;
      if (aName === bName) {
        return aName.localeCompare(bName);
      } else {
        return aName.length - bName.length;
      }
    });
  }

  furtherSort(): SortFilter[] {
    return [];
  }
}
