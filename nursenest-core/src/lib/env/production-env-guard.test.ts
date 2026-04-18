import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { collectProductionEnvIssues, strictProductionEnvEnabled } from "@/lib/env/production-env-guard";

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

  it("defaults strict production env guard to log-only unless explicitly enabled", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalStrict = process.env.NN_STRICT_PRODUCTION_ENV;
    process.env.NODE_ENV = "production";
    delete process.env.NN_STRICT_PRODUCTION_ENV;
    try {
      assert.equal(strictProductionEnvEnabled(), false);
      process.env.NN_STRICT_PRODUCTION_ENV = "1";
      assert.equal(strictProductionEnvEnabled(), true);
    } finally {
      if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = originalNodeEnv;
      if (originalStrict === undefined) delete process.env.NN_STRICT_PRODUCTION_ENV;
      else process.env.NN_STRICT_PRODUCTION_ENV = originalStrict;
    }
  });
});
