import { describe, expect, test } from "vitest";
import { getRolesAsync } from "botc-character-sheet";
import {
  ABILITY_TEXT_TYPES,
  filterByAbilityPhraseType,
  SaoAbilityPhrase,
  sortResolvedCharacters,
  sortSao,
} from "./sort";
import { Script } from "botc-script-checker";

describe("tests", async () => {
  const roles = await getRolesAsync();

  describe("sortSao tests", async () => {
    test("GIVEN Sects & Violet unsorted THEN sort properly", async () => {
      // -- GIVEN --
      const characters = getSectsAndVioletScript();
      [characters[0], characters[characters.length - 1]] = [
        characters[characters.length - 1],
        characters[0],
      ];
      const shuffledCharacters = shuffleArray(characters);
      // -- WHEN --
      const sorted = await sortSao(shuffledCharacters);
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

    test("GIVEN Catfishing unsorted THEN sort properly", async () => {
      // -- GIVEN --
      const characters = getCatfishingScript();
      [characters[0], characters[characters.length - 1]] = [
        characters[characters.length - 1],
        characters[0],
      ];
      const shuffledCharacters = shuffleArray(characters);
      // -- WHEN --
      const sorted = await sortSao(shuffledCharacters);
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

    test("GIVEN No Rolls Barred unsorted THEN sort properly", async () => {
      // -- GIVEN --
      const characters = getNoRollsBarredScript();
      [characters[0], characters[characters.length - 1]] = [
        characters[characters.length - 1],
        characters[0],
      ];
      const shuffledCharacters = shuffleArray(characters);
      // -- WHEN --
      const sorted = await sortSao(shuffledCharacters);
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

  describe("filterByAbilityPhraseType tests", async () => {
    test("GIVEN 8 characters THEN sort them correctly", async () => {
      // -- GIVEN --
      const input = [
        roles["washerwoman"],
        roles["undertaker"],
        roles["chef"],
        roles["monk"],
        roles["mayor"],
        roles["fortuneteller"],
        roles["slayer"],
        roles["virgin"],
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
          roles["washerwoman"],
          roles["chef"],
        ]),
      );
      expect(filtered[3]).toEqual(
        new SaoAbilityPhrase(ABILITY_TEXT_TYPES[3], [roles["fortuneteller"]]),
      );
      expect(filtered[4]).toEqual(
        new SaoAbilityPhrase(ABILITY_TEXT_TYPES[4], [
          roles["undertaker"],
          roles["monk"],
        ]),
      );
      expect(filtered[8]).toEqual(
        new SaoAbilityPhrase(ABILITY_TEXT_TYPES[8], [roles["slayer"]]),
      );
      expect(filtered[30]).toEqual(
        new SaoAbilityPhrase(ABILITY_TEXT_TYPES[30], [roles["mayor"]]),
      );
    });
  });

  describe("sort tests", async () => {
    test("GIVEN 5 names unsorted THEN it should be sorted", async () => {
      // -- GIVEN --
      const input = [
        roles["washerwoman"],
        roles["librarian"],
        roles["chef"],
        roles["investigator"],
      ];
      // -- WHEN --
      const sorted = sortResolvedCharacters(input);
      // -- THEN --
      expect(sorted).toEqual([
        roles["chef"],
        roles["investigator"],
        roles["washerwoman"],
        roles["librarian"],
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
});

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
