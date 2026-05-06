import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  getAuthSecretEnvPresenceReport,
  reportAuthSecretStartupStatus,
  resetAuthSecretStartupDedupeForTests,
  resolveAuthSecretFromEnv,
} from "@/lib/auth/auth-secret";

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

describe("resolveAuthSecretFromEnv", () => {
  it("prefers AUTH_SECRET over NEXTAUTH_SECRET", () => {
    withEnv({ AUTH_SECRET: "alpha", NEXTAUTH_SECRET: "beta" }, () => {
      assert.deepEqual(resolveAuthSecretFromEnv(), { secret: "alpha", source: "AUTH_SECRET" });
    });
  });

  it("falls back to NEXTAUTH_SECRET when AUTH_SECRET is unset", () => {
    withEnv({ AUTH_SECRET: undefined, NEXTAUTH_SECRET: "legacy-only" }, () => {
      assert.deepEqual(resolveAuthSecretFromEnv(), { secret: "legacy-only", source: "NEXTAUTH_SECRET" });
    });
  });

  it("treats empty trimmed values as missing", () => {
    withEnv({ AUTH_SECRET: "   ", NEXTAUTH_SECRET: "" }, () => {
      assert.deepEqual(resolveAuthSecretFromEnv(), { secret: null, source: null });
    });
  });

  it("returns missing when neither is set", () => {
    withEnv({ AUTH_SECRET: undefined, NEXTAUTH_SECRET: undefined }, () => {
      assert.deepEqual(resolveAuthSecretFromEnv(), { secret: null, source: null });
    });
  });
});

describe("getAuthSecretEnvPresenceReport", () => {
  it("reports yes/no without embedding secret values", () => {
    withEnv({ AUTH_SECRET: "super-secret-value", NEXTAUTH_SECRET: undefined }, () => {
      const r = getAuthSecretEnvPresenceReport();
      assert.equal(r.AUTH_SECRET, "yes");
      assert.equal(r.NEXTAUTH_SECRET, "no");
      assert.equal(r.resolvedFrom, "AUTH_SECRET");
      assert.equal(JSON.stringify(r).includes("super-secret"), false);
    });
  });
});

describe("reportAuthSecretStartupStatus dedupe", () => {
  const originalError = console.error;
  let errorLines: string[] = [];

  beforeEach(() => {
    resetAuthSecretStartupDedupeForTests();
    errorLines = [];
    console.error = (...args: unknown[]) => {
      errorLines.push(
        args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" "),
      );
      originalError.apply(console, args as []);
    };
  });

  afterEach(() => {
    console.error = originalError;
    resetAuthSecretStartupDedupeForTests();
  });

  it("logs missing_auth_secret_build at most once per process in build context", () => {
    withEnv(
      {
        AUTH_SECRET: undefined,
        NEXTAUTH_SECRET: undefined,
        NODE_ENV: "production",
        NEXT_PHASE: "phase-production-build",
      },
      () => {
        reportAuthSecretStartupStatus("test-surface");
        reportAuthSecretStartupStatus("test-surface");
        const buildEvents = errorLines.filter((l) => l.includes("missing_auth_secret_build"));
        assert.equal(buildEvents.length, 1);
        const joined = errorLines.join("\n");
        assert.equal(/AUTH_SECRET[=:]\s*\S{4,}/.test(joined), false, "log must not echo env-style secret assignment");
      },
    );
  });

  it("does not log when a secret is configured", () => {
    withEnv(
      {
        AUTH_SECRET: "configured-secret-do-not-log",
        NEXTAUTH_SECRET: undefined,
        NODE_ENV: "production",
        NEXT_PHASE: "phase-production-build",
      },
      () => {
        reportAuthSecretStartupStatus("test-surface");
        assert.equal(errorLines.length, 0);
      },
    );
  });
});
