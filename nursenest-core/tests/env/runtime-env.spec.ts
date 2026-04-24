/**
 * Runtime env guard (bootstrap script). Run without starting Next, from nursenest-core/:
 * PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/env/runtime-env.spec.ts --project chromium
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

import { test, expect } from "@playwright/test";

/** Playwright is expected to run with cwd = nursenest-core (see playwright.config.ts). */
const nursenestCoreRoot = process.cwd();
const bootstrapScript = path.join(nursenestCoreRoot, "scripts", "runtime-env-guard-bootstrap.mjs");

function stripAiRuntimeEnv(): Record<string, string | undefined> {
  const env = { ...process.env };
  delete env.AI_ADMIN_GENERATION_ENABLED;
  delete env.AI_INTEGRATIONS_OPENAI_API_KEY;
  delete env.OPENAI_API_KEY;
  delete env.NN_ENV_VALIDATION_MODE;
  return env;
}

test.describe("runtime-env-guard bootstrap", () => {
  test("strict mode exits non-zero and logs validation error when required env is missing", () => {
    const result = spawnSync(process.execPath, [bootstrapScript], {
      cwd: nursenestCoreRoot,
      env: {
        ...stripAiRuntimeEnv(),
        NN_ENV_VALIDATION_MODE: "strict",
      },
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    const out = `${result.stderr}\n${result.stdout}`;
    expect(out).toContain("[ENV VALIDATION ERROR]");
    expect(out).toMatch(/Missing required runtime env vars/i);
  });

  test("warn mode exits zero and logs warn when required env is missing", () => {
    const result = spawnSync(process.execPath, [bootstrapScript], {
      cwd: nursenestCoreRoot,
      env: {
        ...stripAiRuntimeEnv(),
        NN_ENV_VALIDATION_MODE: "warn",
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    const out = `${result.stderr}\n${result.stdout}`;
    expect(out).toContain("[ENV VALIDATION WARN]");
  });

  test("off mode skips throw when required env is missing", () => {
    const result = spawnSync(process.execPath, [bootstrapScript], {
      cwd: nursenestCoreRoot,
      env: {
        ...stripAiRuntimeEnv(),
        NN_ENV_VALIDATION_MODE: "off",
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    const out = `${result.stderr}\n${result.stdout}`;
    expect(out).not.toContain("[ENV VALIDATION ERROR]");
  });

  test("production exits non-zero when DATABASE_URL is missing (before AI env checks)", () => {
    const result = spawnSync(process.execPath, [bootstrapScript], {
      cwd: nursenestCoreRoot,
      env: {
        ...stripAiRuntimeEnv(),
        NODE_ENV: "production",
        NN_ENV_VALIDATION_MODE: "off",
        DATABASE_URL: "",
      },
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    const out = `${result.stderr}\n${result.stdout}`;
    expect(out).toMatch(/DATABASE_URL is missing/i);
  });

  test("production exits non-zero when DATABASE_URL is the Docker build placeholder", () => {
    const result = spawnSync(process.execPath, [bootstrapScript], {
      cwd: nursenestCoreRoot,
      env: {
        ...stripAiRuntimeEnv(),
        NODE_ENV: "production",
        NN_ENV_VALIDATION_MODE: "off",
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public",
      },
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    const out = `${result.stderr}\n${result.stdout}`;
    expect(out).toMatch(/placeholder DATABASE_URL/i);
  });

  test("production with real-looking DATABASE_URL and NN_ENV_VALIDATION_MODE=off exits zero", () => {
    const result = spawnSync(process.execPath, [bootstrapScript], {
      cwd: nursenestCoreRoot,
      env: {
        ...stripAiRuntimeEnv(),
        NODE_ENV: "production",
        NN_ENV_VALIDATION_MODE: "off",
        DATABASE_URL: "postgresql://u:p@db.ondigitalocean.com:25061/defaultdb?sslmode=require",
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    const out = `${result.stderr}\n${result.stdout}`;
    expect(out).toContain("[nn-db-startup]");
  });
});
