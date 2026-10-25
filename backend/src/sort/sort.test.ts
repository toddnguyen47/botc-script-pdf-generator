import { describe, expect, test } from "vitest";
import { AbilityTextLengthSort, CharacterNameSort, SortFilter } from "./sort";
import { ROLES_BY_ID } from "botc-character-sheet";

describe("AbilityTextLengthSort tests", () => {
  const characterNameSort: SortFilter = new CharacterNameSort([]);
  const testee: SortFilter = new AbilityTextLengthSort([characterNameSort])

  test("GIVEN 5 names unsorted THEN it should be sorted", () => {
    // -- GIVEN --
    const input = [
      ROLES_BY_ID["dreamer"],
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["librarian"],
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["monk"],
    ];
    // -- WHEN --
    const sorted = testee.sort(input);
    // -- THEN --
    expect(sorted).toEqual([
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["monk"],
      ROLES_BY_ID["dreamer"],
      ROLES_BY_ID["librarian"],
      ROLES_BY_ID["washerwoman"],
    ]);
  });
});

describe("CharacterNameSort tests", () => {
  const testee: SortFilter = new CharacterNameSort([]);

  test("GIVEN 5 names unsorted THEN it should be sorted", () => {
    // -- GIVEN --
    const input = [
      ROLES_BY_ID["dreamer"],
      ROLES_BY_ID["washerwoman"],
      ROLES_BY_ID["librarian"],
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["monk"],
    ];
    // -- WHEN --
    const sorted = testee.sort(input);
    // -- THEN --
    expect(sorted).toEqual([
      ROLES_BY_ID["chef"],
      ROLES_BY_ID["monk"],
      ROLES_BY_ID["dreamer"],
      ROLES_BY_ID["librarian"],
      ROLES_BY_ID["washerwoman"],
    ]);
  });
});
