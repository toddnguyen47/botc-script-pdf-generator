import { describe, expect, test } from "vitest";
import { CharacterNameSort, SortFilter } from "./sort";
import { ROLES_BY_ID } from "botc-character-sheet";

describe("CharacterNameSort tests", () => {
  const testee: SortFilter = new CharacterNameSort();

  test("GIVEN normal constructing THEN return no further sort", () => {
    // -- GIVEN --
    // -- WHEN --
    // -- THEN --
    expect(testee.furtherSort()).toHaveLength(0);
  });

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
