import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Regression: `/app/*` must honor readable session JWTs when Edge `auth` is empty,
 * matching admin/internal — otherwise signed-in learners get redirected to `/login`.
 */
test("auth-middleware: protected learner paths use JWT fallback when signedInFromAuth is false", () => {
  const src = readFileSync(join(dir, "..", "auth-middleware.ts"), "utf8");
  assert.match(src, /isProtectedLearnerAuthPath/);
  assert.match(src, /if \(signedInFromAuth\) return true/);
  assert.match(src, /return hasReadableSessionJwt\(request as NextRequest\)/);
});
