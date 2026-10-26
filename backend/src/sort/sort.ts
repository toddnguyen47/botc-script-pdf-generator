import { ResolvedCharacter } from "botc-character-sheet";

export function sortResolvedCharacters(input: ResolvedCharacter[]): ResolvedCharacter[] {
  return input.sort((a, b) => {
    // Sort by abiltiy length first
    return sortByAbilityLength(a, b);
  });
}

function sortByAbilityLength(a: ResolvedCharacter, b: ResolvedCharacter): number {
  const abilityLengthA = a.ability.length;
  const abilityLengthB = b.ability.length;
  if (abilityLengthA === abilityLengthB) {
    return sortByName(a, b);
  } else {
    return abilityLengthA - abilityLengthB;
  }
}

function sortByName(a: ResolvedCharacter, b: ResolvedCharacter): number {
  const aName = a.name;
  const bName = b.name;
  if (aName === bName) {
    return aName.localeCompare(bName);
  } else {
    return aName.length - bName.length;
  }
}
