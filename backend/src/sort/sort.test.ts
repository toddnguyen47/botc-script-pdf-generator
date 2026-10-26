import { describe, expect, test } from "vitest";
import { ROLES_BY_ID } from "botc-character-sheet";
import { filterByCharacterType, sortResolvedCharacters } from "./sort";

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
