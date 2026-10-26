import { describe, expect, test } from "vitest";
import { ResolvedCharacter, ROLES_BY_ID } from "botc-character-sheet";
import {
  ABILITY_TEXT_TYPES,
  filterByAbilityPhraseType,
  filterByCharacterType,
  SaoAbilityPhrase,
  SaoCharacterType,
  sortResolvedCharacters,
  sortSao,
} from "./sort";

describe("sortSao tests", () => {
  test("GIVEN Sects & Violet unsorted THEN sort properly", () => {
    // -- GIVEN --
    const characters = getSectsAndVioletScript();
    const shuffledCharacters = shuffleArray(characters);
    // -- WHEN --
    const sorted = sortSao(shuffledCharacters);
    // -- THEN --
    expect(sorted).not.toEqual(shuffledCharacters);
    expect(sorted).toEqual([
      ROLES_BY_ID["clockmaker"],
      ROLES_BY_ID["snakecharmer"],
      ROLES_BY_ID["mathematician"],
      ROLES_BY_ID["dreamer"],
      ROLES_BY_ID["flowergirl"],
      ROLES_BY_ID["towncrier"],
      ROLES_BY_ID["oracle"],
      ROLES_BY_ID["savant"],
      ROLES_BY_ID["seamstress"],
      ROLES_BY_ID["philosopher"],
      ROLES_BY_ID["artist"],
      ROLES_BY_ID["juggler"],
      ROLES_BY_ID["sage"],
      ROLES_BY_ID["sweetheart"],
      ROLES_BY_ID["klutz"],
      ROLES_BY_ID["barber"],
      ROLES_BY_ID["mutant"],
      ROLES_BY_ID["witch"],
      ROLES_BY_ID["cerenovus"],
      ROLES_BY_ID["pithag"],
      ROLES_BY_ID["eviltwin"],
      ROLES_BY_ID["nodashii"],
      ROLES_BY_ID["vigormortis"],
      ROLES_BY_ID["vortox"],
      ROLES_BY_ID["fanggu"],
    ]);
  });
});

describe("filterByCharacterType tests", () => {
  test("GIVEN 2 of each character type THEN sort by townsfolk, outsider, minion, and demon", () => {
    // -- GIVEN --
    const input = [
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["scarletwoman"],
      ROLES_BY_ID["saint"],
      ROLES_BY_ID["imp"],
      ROLES_BY_ID["lilmonsta"],
      ROLES_BY_ID["baron"],
      ROLES_BY_ID["undertaker"],
      ROLES_BY_ID["drunk"],
    ];
    // -- WHEN --
    const filtered = filterByCharacterType(input);
    // -- THEN --
    expect(filtered).toEqual([
      new SaoCharacterType("townsfolk", [
        ROLES_BY_ID["washerwoman"],
        ROLES_BY_ID["undertaker"],
      ]),
      new SaoCharacterType("outsider", [
        ROLES_BY_ID["saint"],
        ROLES_BY_ID["drunk"],
      ]),
      new SaoCharacterType("minion", [
        ROLES_BY_ID["scarletwoman"],
        ROLES_BY_ID["baron"],
      ]),
      new SaoCharacterType("demon", [
        ROLES_BY_ID["imp"],
        ROLES_BY_ID["lilmonsta"],
      ]),
    ]);
  });
});

describe("filterByAbilityPhraseType tests", () => {
  test("GIVEN 8 characters THEN sort them correctly", () => {
    // -- GIVEN --
    const input = [
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["undertaker"],
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["monk"],
      ROLES_BY_ID["mayor"],
      ROLES_BY_ID["fortuneteller"],
      ROLES_BY_ID["slayer"],
      ROLES_BY_ID["virgin"],
    ];
    // -- WHEN --
    const filtered = filterByAbilityPhraseType(input);
    // filtered.forEach((elem, i) =>
    //   console.log(
    //     `[${i}]`,
    //     elem.flatMap((innerElem) => innerElem.id),
    //   ),
    // );
    // -- THEN --
    expect(filtered[0]).toEqual(
      new SaoAbilityPhrase(ABILITY_TEXT_TYPES[0], [
        ROLES_BY_ID["washerwoman"],
        ROLES_BY_ID["chef"],
      ]),
    );
    expect(filtered[3]).toEqual(
      new SaoAbilityPhrase(ABILITY_TEXT_TYPES[3], [
        ROLES_BY_ID["fortuneteller"],
      ]),
    );
    expect(filtered[4]).toEqual(
      new SaoAbilityPhrase(ABILITY_TEXT_TYPES[4], [
        ROLES_BY_ID["undertaker"],
        ROLES_BY_ID["monk"],
      ]),
    );
    expect(filtered[8]).toEqual(
      new SaoAbilityPhrase(ABILITY_TEXT_TYPES[8], [ROLES_BY_ID["slayer"]]),
    );
    expect(filtered[30]).toEqual(
      new SaoAbilityPhrase(ABILITY_TEXT_TYPES[30], [ROLES_BY_ID["mayor"]]),
    );
  });
});

describe("sort tests", () => {
  test("GIVEN 5 names unsorted THEN it should be sorted", () => {
    // -- GIVEN --
    const input = [
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["librarian"],
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["investigator"],
    ];
    // -- WHEN --
    const sorted = sortResolvedCharacters(input);
    // -- THEN --
    expect(sorted).toEqual([
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["investigator"],
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["librarian"],
    ]);
  });
});

function getSectsAndVioletScript(): ResolvedCharacter[] {
  const input = `[
  {
    "id": "_meta",
    "name": ""
  },
  "clockmaker",
  "snakecharmer",
  "mathematician",
  "dreamer",
  "flowergirl",
  "towncrier",
  "oracle",
  "savant",
  "seamstress",
  "philosopher",
  "artist",
  "juggler",
  "sage",
  "sweetheart",
  "klutz",
  "barber",
  "mutant",
  "witch",
  "cerenovus",
  "pithag",
  "eviltwin",
  "nodashii",
  "vigormortis",
  "vortox",
  "fanggu"
]`;
  return getCharactersFromScript(input);
}

function getCharactersFromScript(jsonString: string): ResolvedCharacter[] {
  const strings = JSON.parse(jsonString) as string[];
  return strings
    .filter((id): id is string => typeof id === "string")
    .map((id) => ROLES_BY_ID[id]);
}

// Reusable generic shuffle function <T> works for any type of array
function shuffleArray<T>(array: T[]): T[] {
  // Create a shallow copy to avoid mutating the original array
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a remaining element at random
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements using array destructuring
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
