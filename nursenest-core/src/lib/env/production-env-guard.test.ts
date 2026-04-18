import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { collectProductionEnvIssues, runProductionEnvGuard, strictProductionEnvEnabled } from "@/lib/env/production-env-guard";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");

function withEnv<T>(overrides: Record<string, string | undefined>, run: () => T): T {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(overrides)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return run();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

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

  it("flags invalid auth env combinations that break runtime auth callbacks", () => {
    const issues = withEnv(
      {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/nursenest",
        AUTH_URL: "https://www.nursenest.ca/api/auth",
        NEXTAUTH_URL: undefined,
        AUTH_SECRET: undefined,
        NEXTAUTH_SECRET: undefined,
        NEXT_PUBLIC_APP_URL: "https://www.nursenest.ca",
        STRIPE_SECRET_KEY: "sk_live_1234567890",
        STRIPE_WEBHOOK_SECRET: "whsec_1234567890",
        SPACES_KEY: "spaces-key",
        SPACES_SECRET: "spaces-secret",
        CRON_SECRET: "cron-secret",
      },
      () => collectProductionEnvIssues(),
    );

    assert.ok(issues.some((issue) => issue.code === "auth_secret_missing"));
    assert.ok(issues.some((issue) => issue.code === "auth_url_has_path"));
  });

  it("fails fast in strict production mode when critical auth config is invalid", () => {
    const originalExit = process.exit;
    const exitCalls: number[] = [];
    const exitSentinel = new Error("process.exit");

    try {
      process.exit = ((code?: number) => {
        exitCalls.push(code ?? 0);
        throw exitSentinel;
      }) as typeof process.exit;

      assert.throws(
        () =>
          withEnv(
            {
              NODE_ENV: "production",
              NN_STRICT_PRODUCTION_ENV: "1",
              DATABASE_URL: "postgresql://user:pass@localhost:5432/nursenest",
              AUTH_URL: "https://www.nursenest.ca/api/auth",
              NEXTAUTH_URL: undefined,
              AUTH_SECRET: "12345678901234567890123456789012",
              NEXTAUTH_SECRET: undefined,
              NEXT_PUBLIC_APP_URL: "https://www.nursenest.ca",
              STRIPE_SECRET_KEY: "sk_live_1234567890",
              STRIPE_WEBHOOK_SECRET: "whsec_1234567890",
              SPACES_KEY: "spaces-key",
              SPACES_SECRET: "spaces-secret",
              CRON_SECRET: "cron-secret",
            },
            () => runProductionEnvGuard(),
          ),
        exitSentinel,
      );
      assert.deepEqual(exitCalls, [1]);
    } finally {
      process.exit = originalExit;
    }
  });
});
