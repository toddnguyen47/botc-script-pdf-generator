import { describe, expect, test } from "vitest";
import { ROLES_BY_ID } from "botc-character-sheet";
import {
  filterByAbilityPhraseType,
  filterByCharacterType,
  sortResolvedCharacters,
} from "./sort";

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
      [ROLES_BY_ID["washerwoman"], ROLES_BY_ID["undertaker"]],
      [ROLES_BY_ID["saint"], ROLES_BY_ID["drunk"]],
      [ROLES_BY_ID["scarletwoman"], ROLES_BY_ID["baron"]],
      [ROLES_BY_ID["imp"], ROLES_BY_ID["lilmonsta"]],
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
    expect(filtered[0]).toEqual([
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["chef"],
    ]);
    expect(filtered[3]).toEqual([ROLES_BY_ID["fortuneteller"]]);
    expect(filtered[4]).toEqual([
      ROLES_BY_ID["undertaker"],
      ROLES_BY_ID["monk"],
    ]);
    expect(filtered[8]).toEqual([ROLES_BY_ID["slayer"]]);
    expect(filtered[30]).toEqual([ROLES_BY_ID["mayor"]]);
  });

  test("GIVEN just fortune teller THEN sort it into index 3", () => {
    // -- GIVEN --
    const input = [ROLES_BY_ID["fortuneteller"]];
    // -- WHEN --
    const filtered = filterByAbilityPhraseType(input);
    // -- THEN --
    expect(filtered[3]).toEqual([ROLES_BY_ID["fortuneteller"]]);
  });

  test("GIVEN Sects & Violet townsfolk THEN sort them properly", () => {
    // -- GIVEN --
    const input = [
      ROLES_BY_ID["mathematician"],
      ROLES_BY_ID["snakecharmer"],
      ROLES_BY_ID["clockmaker"],
      ROLES_BY_ID["juggler"],
      ROLES_BY_ID["sage"],
      ROLES_BY_ID["artist"],
      ROLES_BY_ID["savant"],
      ROLES_BY_ID["flowergirl"],
      ROLES_BY_ID["towncrier"],
      ROLES_BY_ID["seamstress"],
      ROLES_BY_ID["philosopher"],
      ROLES_BY_ID["oracle"],
      ROLES_BY_ID["dreamer"],
    ];
    // -- WHEN --
    const filtered = filterByAbilityPhraseType(input);
    // -- THEN --
    expect(filtered[0]).toEqual([ROLES_BY_ID["clockmaker"]]);
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
