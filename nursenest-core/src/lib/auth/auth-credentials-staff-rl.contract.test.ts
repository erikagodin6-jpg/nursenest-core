/**
 * Static contracts: staff credentials use an isolated Redis combo path (no new client-visible codes).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

describe("credentials staff vs public RL wiring", () => {
  it("authorize resolves staff hint before bump and passes staffAccount into consumeCredentialsLoginFailure", () => {
    const auth = readFileSync(join(dir, "..", "auth.ts"), "utf8");
    assert.match(auth, /loadStaffRoleHintForLoginIdentifier/);
    assert.match(auth, /staffCredentialsRl/);
    assert.match(auth, /consumeCredentialsLoginFailure\(ipKey, idHash, \{ staffAccount: staffCredentialsRl \}\)/);
    assert.match(auth, /isStaffRole\(staffRoleHint\)/);
  });

  it("public client errors stay generic (no staff role strings in reject paths)", () => {
    const auth = readFileSync(join(dir, "..", "auth.ts"), "utf8");
    assert.doesNotMatch(auth, /rejectCredentialsOrNull\([^)]*ADMIN/);
    assert.doesNotMatch(auth, /CredentialsSignin[^\n]*staff/i);
  });
});
