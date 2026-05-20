import { describe, expect, it } from "vitest";
import { learnerInvalidatePredicate, queryRoots } from "./query-keys.js";

describe("query keys", () => {
  it("roots include pathway scope for learner fetches", () => {
    expect(queryRoots.personalProfile("us-rn-nclex-rn")).toEqual(["learner", "personal-profile", "us-rn-nclex-rn"]);
  });

  it("invalidation predicate matches learner + flashcards scoped queries", () => {
    const pred = learnerInvalidatePredicate("us-rn-nclex-rn", "ca-rn-nclex-rn");
    expect(pred(["learner", "personal-profile", "us-rn-nclex-rn"])).toBe(true);
    expect(pred(["flashcards", "due-summary", "ca-rn-nclex-rn"])).toBe(true);
    expect(pred(["session"])).toBe(false);
  });
});
