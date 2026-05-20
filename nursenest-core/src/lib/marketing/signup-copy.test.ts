import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeSignupFieldCopy } from "@/lib/marketing/signup-copy";

describe("safeSignupFieldCopy", () => {
  it("blocks placeholder-prefixed auth copy from reaching visible inputs", () => {
    assert.equal(safeSignupFieldCopy("Placeholder First Name", "First name"), "First name");
    assert.equal(safeSignupFieldCopy("Placeholder Last Name", "Last name"), "Last name");
    assert.equal(safeSignupFieldCopy("pages.signup.placeholderFirstName", "First name"), "First name");
  });

  it("preserves real translated field copy", () => {
    assert.equal(safeSignupFieldCopy("First name", "First name"), "First name");
    assert.equal(safeSignupFieldCopy("Given name", "First name"), "Given name");
  });
});
