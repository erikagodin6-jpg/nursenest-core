import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { collectProductionEnvIssues } from "@/lib/env/production-env-guard";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");

describe("collectProductionEnvIssues", () => {
  it("returns empty outside production", () => {
    assert.deepEqual(collectProductionEnvIssues(), []);
  });

  it("guard module documents strict mode and critical codes", () => {
    const src = readFileSync(join(root, "src", "lib", "env", "production-env-guard.ts"), "utf8");
    assert.match(src, /NN_STRICT_PRODUCTION_ENV/);
    assert.match(src, /auth_secret_missing/);
    assert.match(src, /auth_secret_short/);
    assert.match(src, /cron_secret_missing/);
    assert.match(src, /process\.exit\(1\)/);
    assert.match(src, /spaces_credentials_missing/);
    assert.match(src, /database_url_invalid_scheme/);
    assert.match(src, /auth_url_has_path/);
    assert.match(src, /strictProductionEnvEnabled/);
  });
});
