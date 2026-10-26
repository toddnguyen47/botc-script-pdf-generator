/**
 * Blood on the Clocktower SAO (The Sort Order) sorting.
 * Obtained from https://bloodontheclocktower.com/blogs/news/sort-order-sao-update
 */

import { OfficialCharacterID, Script } from "botc-script-checker";
import { ROLES_BY_ID } from "../data/roles";
import { ResolvedCharacter } from "../types";
import { groupCharactersByTeam } from "../utils/scriptUtils";

export function sortSao(input: Script): Script {
  const inputResolvedChaaracters = input
    .filter((elem) => typeof elem === "string")
    .map((elem) => ROLES_BY_ID[elem]);

  const result: Script = input.filter((elem) => typeof elem !== "string");

  const groupedCharacters = groupCharactersByTeam(inputResolvedChaaracters);

  const handlePerGroup = (resolvedCharacters: ResolvedCharacter[]) => {
    sortGroupedCharacters(resolvedCharacters).forEach((id) => result.push(id));
  };

  handlePerGroup(groupedCharacters.townsfolk);
  handlePerGroup(groupedCharacters.outsider);
  handlePerGroup(groupedCharacters.minion);
  handlePerGroup(groupedCharacters.demon);
  handlePerGroup(groupedCharacters.traveller);
  handlePerGroup(groupedCharacters.fabled);
  handlePerGroup(groupedCharacters.loric);

  return result;
}

export function filterByAbilityPhraseType(
  input: ResolvedCharacter[],
): SaoAbilityPhrase[] {
  const result: SaoAbilityPhrase[] = ABILITY_TEXT_TYPES.map(
    (phrase) => new SaoAbilityPhrase(phrase, []),
  );
  // Adding a last element for any other ability type
  result.push(new SaoAbilityPhrase("", []));
  input.forEach((elem) => {
    let indexRange: number[] = [...Array(ABILITY_TEXT_TYPES.length).keys()];
    const abilityPhraseType = getAppropriateAbilityPhraseType(elem, indexRange);
    typeof abilityPhraseType === "number"
      ? result[abilityPhraseType].characters.push(elem)
      : result[ABILITY_TEXT_TYPES.length].characters.push(elem);
  });
  return result;
}

export function sortResolvedCharacters(
  input: ResolvedCharacter[],
): ResolvedCharacter[] {
  return input.sort((a, b) => {
    // Sort by abiltiy length first
    return sortByAbilityLength(a, b);
  });
}

export const ABILITY_TEXT_TYPES: string[] = [
  "You start knowing", // 0
  "At night", // 1
  "Each dusk*", // 2
  "Each night", // 3
  "Each night*", // 4
  "Each day", // 5
  "Once per game, at night", // 6
  "Once per game, at night*", // 7
  "Once per game, during the day", // 8
  "Once per game", // 9
  "On your 1st night", // 10
  "On your 1st day", // 11

  "You think", // 12
  "You are", // 13
  "You have", // 14
  "You do not know", // 15
  "You might", // 16
  "You", // 17

  "When you die", // 18
  "When you learn that you died", // 19
  "When", // 20

  "If you die", // 21
  "If you died", // 22
  "If you are “mad”", // 23
  "If you", // 24
  "If the Demon dies", // 25
  "If the Demon kills", // 26
  "If the Demon", // 27
  "If both", // 28
  "If there are 5 or more players alive", // 29
  "If", // 30

  "All players", // 31
  "All", // 32

  "The 1st time", // 33
  "The", // 34

  "Good", // 35
  "Evil", // 36
  "Players", // 37
  "Minions", // 38
];

export class SaoAbilityPhrase {
  constructor(
    public readonly phrase: string,
    public readonly characters: ResolvedCharacter[],
  ) {}
}

function sortGroupedCharacters(
  resolvedCharacters: ResolvedCharacter[],
): OfficialCharacterID[] {
  return filterByAbilityPhraseType(resolvedCharacters)
    .filter(({ characters }) => characters.length > 0)
    .flatMap(({ characters }) => sortResolvedCharacters(characters))
    .map((character) => character.id);
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

function getAppropriateAbilityPhraseType(
  resolvedCharacter: ResolvedCharacter,
  indexRange: number[],
): number | undefined {
  const abilityTokens = splitIntoTokens(resolvedCharacter.ability);
  return indexRange.find((index) => {
    const phrase = ABILITY_TEXT_TYPES[index];
    const phraseTokens = splitIntoTokens(phrase);
    const abilityTokensSliced = abilityTokens.slice(0, phraseTokens.length);
    return containsAbilityPhrase(abilityTokensSliced, phraseTokens);
  });
}

function containsAbilityPhrase(
  abilityTokens: string[],
  phraseTokens: string[],
): boolean {
  let counter = 0;
  for (let i = 0; i < abilityTokens.length; i++) {
    if (
      abilityTokens[i].toLocaleLowerCase() ===
      phraseTokens[0].toLocaleLowerCase()
    ) {
      for (let j = 0; j < phraseTokens.length; j++) {
        if (i + j >= abilityTokens.length) {
          break;
        }
        if (
          abilityTokens[i + j].toLocaleLowerCase() ===
          phraseTokens[j].toLocaleLowerCase()
        ) {
          counter += 1;
        }
      }

      if (counter === phraseTokens.length) {
        break;
      } else {
        // Reset counter; matching must be consecutive
        counter = 0;
      }
    }
  }
  return counter === phraseTokens.length;
}

/**
 * Split on whitespace and commas. Commas are captured as its own token.
 * @param input input string
 * @returns tokens
 */
function splitIntoTokens(input: string): string[] {
  return input.split(/(\s+|,)/).filter((token) => token.trim() !== "");
}
