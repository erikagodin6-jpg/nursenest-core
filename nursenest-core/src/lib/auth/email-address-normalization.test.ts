import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isGmailLikeAddress, normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";

describe("isGmailLikeAddress", () => {
  it("returns true for gmail.com and googlemail.com", () => {
    assert.equal(isGmailLikeAddress("a@gmail.com"), true);
    assert.equal(isGmailLikeAddress("A@GOOGLEMAIL.COM"), true);
  });

  it("returns false for other domains", () => {
    assert.equal(isGmailLikeAddress("a@outlook.com"), false);
    assert.equal(isGmailLikeAddress("not-an-email"), false);
  });
});

describe("normalizeEmailForDedup + gmail login equivalence", () => {
  it("maps dot-local variants to the same normalized form", () => {
    assert.equal(normalizeEmailForDedup("jane.doe@gmail.com"), normalizeEmailForDedup("janedoe@gmail.com"));
  });
});
