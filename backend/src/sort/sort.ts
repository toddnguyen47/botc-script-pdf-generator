import { ResolvedCharacter } from "botc-character-sheet";

export interface SortFilter {
  furtherSortFilters: SortFilter[];

  sort(input: ResolvedCharacter[]): ResolvedCharacter[];
}

// export class AbilityTextLengthSort implements SortFilter {
//   constructor(public furtherSortFilters: SortFilter[]) {}

//   sort(input: ResolvedCharacter[]): ResolvedCharacter[] {
//     const sorted
//   }
// }

export class CharacterNameSort implements SortFilter {
  constructor(public furtherSortFilters: SortFilter[]) {}

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
}
