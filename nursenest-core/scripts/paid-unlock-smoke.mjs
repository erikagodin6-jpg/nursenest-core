#!/usr/bin/env node
/**
 * Credential-gated paid learner smoke: delegates to Playwright spec.
 * Exits 0 with a clear SKIP message when E2E_PAID_SMOKE_EMAIL / E2E_PAID_SMOKE_PASSWORD are unset.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const email = process.env.E2E_PAID_SMOKE_EMAIL?.trim();
const password = process.env.E2E_PAID_SMOKE_PASSWORD?.trim();

if (!email || !password) {
  console.error(
    "[paid-unlock-smoke] SKIP (exit 0): set E2E_PAID_SMOKE_EMAIL and E2E_PAID_SMOKE_PASSWORD to run post-login inventory checks.",
  );
  process.exit(0);
}

const result = spawnSync(
  "npx",
  ["playwright", "test", "tests/e2e/paid-user/paid-unlock-smoke.spec.ts", "-c", "playwright.config.ts"],
  { cwd: root, stdio: "inherit", env: process.env },
);

process.exit(result.status ?? 1);
