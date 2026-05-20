/**
 * Contract test: Prisma npm scripts must work **without** exporting DATABASE_URL / DIRECT_URL in the shell.
 * Env is loaded from nursenest-core `.env.local` → `.env.playwright.local` → `.env` (see `load-dotenv-for-cli.mts`),
 * then `env-bootstrap` derives DIRECT_URL when unset.
 *
 * ```
 * npm run test:prisma-cli-contract
 * ```
 *
 * Skips when no DATABASE_URL is present in those files (local dev without DB). Fails on P1012, missing env, or
 * when DIRECT_URL is not auto-resolved. `db:status` (`migrate status`) requires a reachable database.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

/** Simulate a fresh shell: no manual `export DATABASE_URL=…` / `DIRECT_URL` — only dotenv files may supply them. */
function envWithoutManualDatabaseExports(): NodeJS.ProcessEnv {
  const e = { ...process.env } as Record<string, string | undefined>;
  delete e.DATABASE_URL;
  delete e.DIRECT_URL;
  delete e.DATABASE_DIRECT_URL;
  return e as NodeJS.ProcessEnv;
}

function combinedOutput(r: ReturnType<typeof spawnSync<string>>): string {
  return `${r.stdout ?? ""}${r.stderr ?? ""}`;
}

function assertNoPrismaEnvContractViolations(text: string, context: string): void {
  assert.ok(!/\bP1012\b/i.test(text), `${context}: unexpected P1012 (Prisma schema validation error)`);
  assert.ok(
    !/Environment variable not found/i.test(text),
    `${context}: Prisma reported a missing environment variable`,
  );
  assert.ok(
    !text.includes("[db-env] DATABASE_URL is not set"),
    `${context}: database-env-assert fired (DATABASE_URL not loaded)`,
  );
}

/** `migrate status` talks to Postgres — auth/network failures are unrelated to env-file / DIRECT_URL resolution. */
function isLikelyDatabaseReachabilityOrAuthFailure(text: string): boolean {
  const t = text;
  return (
    /\bP1001\b/i.test(t) ||
    /Can't reach database server/i.test(t) ||
    /FATAL:\s*password authentication failed/i.test(t) ||
    /ECONNREFUSED/i.test(t) ||
    /ETIMEDOUT/i.test(t) ||
    /ENOTFOUND/i.test(t) ||
    /no pg_hba\.conf entry/i.test(t)
  );
}

function npmRun(script: "db:generate" | "db:status", env: NodeJS.ProcessEnv) {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  return spawnSync(npmCmd, ["run", script], {
    cwd: packageRoot,
    env,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

test("Prisma CLI: DIRECT_URL + npm run db:generate without manual DATABASE_URL/DIRECT_URL export", (t) => {
  const env = envWithoutManualDatabaseExports();

  const probe = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["tsx", "scripts/probe-prisma-cli-env.mts"],
    {
      cwd: packageRoot,
      env,
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
    },
  );
  const probeOut = combinedOutput(probe);

  if (probe.status === 10) {
    t.skip("DATABASE_URL not present in project env files (.env.local / .env) — cannot test CLI resolution");
    return;
  }
  assert.equal(
    probe.status,
    0,
    `probe-prisma-cli-env: expected DIRECT_URL to be resolved from DATABASE_URL (exit ${probe.status}): ${probeOut}`,
  );

  const gen = npmRun("db:generate", env);
  const genOut = combinedOutput(gen);
  assertNoPrismaEnvContractViolations(genOut, "npm run db:generate");
  assert.equal(
    gen.status,
    0,
    `npm run db:generate must exit 0 (status=${gen.status}). Output:\n${genOut.slice(0, 8000)}`,
  );
});

test("Prisma CLI: npm run db:status without manual DATABASE_URL/DIRECT_URL export", (t) => {
  const env = envWithoutManualDatabaseExports();

  const probe = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["tsx", "scripts/probe-prisma-cli-env.mts"],
    {
      cwd: packageRoot,
      env,
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
    },
  );
  if (probe.status === 10) {
    t.skip("DATABASE_URL not present in project env files — same as probe test");
    return;
  }
  if (probe.status !== 0) {
    assert.fail(`probe-prisma-cli-env failed (${probe.status}): ${combinedOutput(probe)}`);
  }

  const st = npmRun("db:status", env);
  const stOut = combinedOutput(st);
  assertNoPrismaEnvContractViolations(stOut, "npm run db:status");
  if (st.status !== 0 && isLikelyDatabaseReachabilityOrAuthFailure(stOut)) {
    t.skip("database unreachable or credentials rejected — not an env-resolution / P1012 failure");
    return;
  }
  assert.equal(
    st.status,
    0,
    `npm run db:status must exit 0 (status=${st.status}). Output:\n${stOut.slice(0, 8000)}`,
  );
});
