import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const source = readFileSync(join(__dirname, "account-delete-danger-zone.tsx"), "utf8");

describe("AccountDeleteDangerZone", () => {
  it("requires typed confirmation and permanent checkbox before enabling deletion", () => {
    assert.match(source, /confirmationValid && checked && !submitting/);
    assert.match(source, /normalized === ACCOUNT_DELETION_CONFIRMATION_PHRASE/);
    assert.match(source, /normalized\.toLowerCase\(\) === userEmail\.trim\(\)\.toLowerCase\(\)/);
    assert.match(source, /disabled=\{!canSubmit\}/);
    assert.match(source, /Permanently delete account/);
  });

  it("shows subscription warning copy inside the in-app flow", () => {
    assert.match(source, /ACCOUNT_DELETION_BILLING_WARNING/);
    assert.match(source, /Manage billing/);
    assert.match(source, /billingHref/);
  });
});
