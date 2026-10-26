import { ResolvedCharacter } from "botc-character-sheet";

export function filterByCharacterType(
  input: ResolvedCharacter[],
): ResolvedCharacter[][] {
  const townsfolk: ResolvedCharacter[] = [];
  const outsiders: ResolvedCharacter[] = [];
  const minions: ResolvedCharacter[] = [];
  const demons: ResolvedCharacter[] = [];
  input.forEach((resolvedCharacter) => {
    switch (resolvedCharacter.team) {
      case "townsfolk":
        townsfolk.push(resolvedCharacter)
        break;
      case "outsider":
        outsiders.push(resolvedCharacter)
        break;
      case "minion":
        minions.push(resolvedCharacter)
        break;
      case "demon":
        demons.push(resolvedCharacter)
        break;
    }
  });
  return [townsfolk, outsiders, minions, demons];
}

export function sortResolvedCharacters(
  input: ResolvedCharacter[],
): ResolvedCharacter[] {
  return input.sort((a, b) => {
    // Sort by abiltiy length first
    return sortByAbilityLength(a, b);
  });
}

function sortByAbilityLength(
  a: ResolvedCharacter,
  b: ResolvedCharacter,
): number {
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
