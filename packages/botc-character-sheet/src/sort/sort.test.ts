import { describe, expect, test } from "vitest";
import { ROLES_BY_ID } from "botc-character-sheet";
import {
  ABILITY_TEXT_TYPES,
  filterByAbilityPhraseType,
  SaoAbilityPhrase,
  sortResolvedCharacters,
  sortSao,
} from "./sort";
import { Script } from "botc-script-checker";

describe("sortSao tests", () => {
  test("GIVEN Sects & Violet unsorted THEN sort properly", () => {
    // -- GIVEN --
    const characters = getSectsAndVioletScript();
    [characters[0], characters[characters.length - 1]] = [
      characters[characters.length - 1],
      characters[0],
    ];
    const shuffledCharacters = shuffleArray(characters);
    // -- WHEN --
    const sorted = sortSao(shuffledCharacters);
    // -- THEN --
    expect(sorted).not.toEqual(shuffledCharacters);
    expect(sorted).toEqual([
      {
        id: "_meta",
        name: "Sects & Violet",
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
      "fanggu",
    ]);
  });

  test("GIVEN Catfishing unsorted THEN sort properly", () => {
    // -- GIVEN --
    const characters = getCatfishingScript();
    [characters[0], characters[characters.length - 1]] = [
      characters[characters.length - 1],
      characters[0],
    ];
    const shuffledCharacters = shuffleArray(characters);
    // -- WHEN --
    const sorted = sortSao(shuffledCharacters);
    // -- THEN --
    expect(sorted).not.toEqual(shuffledCharacters);
    expect(sorted).toEqual([
      {
        id: "_meta",
        name: "Catfishing",
        author: "Emily",
      },
      "chef",
      "investigator",
      "grandmother",
      "balloonist",
      "snakecharmer",
      "dreamer",
      "fortuneteller",
      "gambler",
      "savant",
      "philosopher",
      "cannibal",
      "amnesiac",
      "ravenkeeper",
      "lunatic",
      "drunk",
      "recluse",
      "sweetheart",
      "mutant",
      "godfather",
      "cerenovus",
      "pithag",
      "widow",
      "imp",
      "vigormortis",
      "fanggu",
      "barista",
      "harlot",
      "bonecollector",
      "apprentice",
      "beggar",
    ]);
  });

  test("GIVEN No Rolls Barred unsorted THEN sort properly", () => {
    // -- GIVEN --
    const characters = getNoRollsBarredScript();
    [characters[0], characters[characters.length - 1]] = [
      characters[characters.length - 1],
      characters[0],
    ];
    const shuffledCharacters = shuffleArray(characters);
    // -- WHEN --
    const sorted = sortSao(shuffledCharacters);
    // -- THEN --
    expect(sorted).not.toEqual(shuffledCharacters);
    expect(sorted).toEqual([
      {
        id: "_meta",
        name: "No Rolls Barred",
        author: "Andrew Pichot",
      },
      "noble",
      "pixie",
      "bountyhunter",
      "empath",
      "balloonist",
      "snakecharmer",
      "gossip",
      "philosopher",
      "huntsman",
      "artist",
      "alchemist",
      "amnesiac",
      "poppygrower",
      "goon",
      "drunk",
      "mutant",
      "damsel",
      "godfather",
      "poisoner",
      "fearmonger",
      "goblin",
      "boomdandy",
      "lilmonsta",
      "vortox",
      "legion",
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

function getSectsAndVioletScript(): Script {
  const input = `
[
  {
    "id": "_meta",
    "name": "Sects & Violet"
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
  return JSON.parse(input);
}

function getCatfishingScript(): Script {
  const input = `
[
  {
    "id": "_meta",
    "name": "Catfishing",
    "author": "Emily"
  },
  "chef",
  "investigator",
  "grandmother",
  "balloonist",
  "snakecharmer",
  "dreamer",
  "fortuneteller",
  "gambler",
  "savant",
  "philosopher",
  "cannibal",
  "amnesiac",
  "ravenkeeper",
  "lunatic",
  "drunk",
  "recluse",
  "sweetheart",
  "mutant",
  "godfather",
  "cerenovus",
  "pithag",
  "widow",
  "imp",
  "vigormortis",
  "fanggu",
  "barista",
  "harlot",
  "bonecollector",
  "apprentice",
  "beggar"
]`;
  return JSON.parse(input);
}

function getNoRollsBarredScript(): Script {
  const input = `
[
  {
    "id": "_meta",
    "name": "No Rolls Barred",
    "author": "Andrew Pichot"
  },
  "noble",
  "pixie",
  "bountyhunter",
  "empath",
  "balloonist",
  "snakecharmer",
  "gossip",
  "philosopher",
  "huntsman",
  "artist",
  "alchemist",
  "amnesiac",
  "poppygrower",
  "goon",
  "drunk",
  "mutant",
  "damsel",
  "godfather",
  "poisoner",
  "fearmonger",
  "goblin",
  "boomdandy",
  "lilmonsta",
  "vortox",
  "legion"
]`;
  return JSON.parse(input);
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
