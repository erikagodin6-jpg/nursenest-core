import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Regression: RSC `getStaffSession` must use the same identity inputs as Edge `enforceAdminProxyRoute`
 * (`loadUserRoleFromDbIdentity({ userId, email })` when either is present). Otherwise staff pass the
 * proxy but `requireAdmin` redirects to `/app` while the header can still show Admin (JWT role).
 */
test("staff-session: DB role lookup accepts email-only identity (parity with proxy enforceAdminProxyRoute)", () => {
  const staffSession = readFileSync(join(dir, "staff-session.ts"), "utf8");
  assert.match(staffSession, /if \(!userId && !emailRaw\)/);
  assert.match(staffSession, /loadUserRoleFromDbIdentity\(\{\s*userId:\s*userId\s*\?\?\s*null/);
  assert.match(staffSession, /enforceAdminProxyRoute|loadUserRoleFromDbIdentity/);

  const proxy = readFileSync(join(dir, "..", "..", "proxy.ts"), "utf8");
  assert.match(proxy, /if \(!userId && !email\)/);
  assert.match(proxy, /loadUserRoleFromDbIdentity\(\{\s*userId,\s*email\s*\}\)/);
});
