/**
 * Full local paid E2E green path (real STABLE run without DigitalOcean DB credentials in `.env.local`):
 *
 * 1. Start Docker Postgres (`docker run postgres:16-alpine` on port 55432; see `docker-compose.e2e-db.yml` for an equivalent compose file)
 * 2. `prisma migrate deploy`
 * 3. `qa-paid-test-account-reset.mts` (password from `QA_PAID_TEST_PASSWORD` or `E2E_PAID_PASSWORD` in `.env.playwright.local`)
 * 4. `npm run test:e2e:paid-setup-auth` + `npm run test:e2e:paid-fast-sanity` with `DATABASE_URL` in the environment
 *
 * Requires: Docker, `.env.playwright.local` with E2E paid email/password (same as standard paid E2E).
 *
 * Usage (from `nursenest-core/`):
 *   npm run test:e2e:paid-local-green
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

const LOCAL_DATABASE_URL =
  process.env.E2E_LOCAL_DATABASE_URL?.trim() ||
  "postgresql://nursenest_e2e:nursenest_e2e_local_dev@127.0.0.1:55432/nursenest_e2e?sslmode=disable";

function loadPlaywrightCreds(): { email: string; password: string } {
  const pwPath = resolve(packageRoot, ".env.playwright.local");
  if (!existsSync(pwPath)) {
    throw new Error(
      `Missing ${pwPath}. Add E2E_PAID_EMAIL and E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*).`,
    );
  }
  config({ path: pwPath, override: false });
  const qaE = process.env.QA_PAID_EMAIL?.trim();
  const qaP = process.env.QA_PAID_PASSWORD;
  if (qaE && qaP !== undefined && String(qaP).length > 0) {
    return { email: qaE, password: String(qaP) };
  }
  const e = process.env.E2E_PAID_EMAIL?.trim();
  const p = process.env.E2E_PAID_PASSWORD;
  if (e && p) return { email: e, password: String(p) };
  const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (c && d) return { email: c, password: String(d) };
  throw new Error(
    "No paid E2E credentials in .env.playwright.local (need QA_PAID_* or E2E_PAID_* or PLAYWRIGHT_TEST_*).",
  );
}

function run(cmd: string, env: NodeJS.ProcessEnv): void {
  execSync(cmd, {
    cwd: packageRoot,
    stdio: "inherit",
    env,
  });
}

const E2E_PG_CONTAINER = "nursenest_e2e_pg";

function whichDocker(): void {
  try {
    execSync("docker version", { stdio: "pipe" });
  } catch {
    throw new Error("Docker is required for test:e2e:paid-local-green (install Docker and ensure the daemon is running).");
  }
}

async function main(): Promise<void> {
  whichDocker();
  const { email, password } = loadPlaywrightCreds();

  console.log("[e2e-paid-local-green] Starting Postgres (docker run)...");
  try {
    execSync(`docker rm -f ${E2E_PG_CONTAINER}`, { stdio: "pipe", env: process.env });
  } catch {
    /* ignore */
  }
  run(
    [
      "docker run -d",
      `--name ${E2E_PG_CONTAINER}`,
      "-p 55432:5432",
      "-e POSTGRES_USER=nursenest_e2e",
      "-e POSTGRES_PASSWORD=nursenest_e2e_local_dev",
      "-e POSTGRES_DB=nursenest_e2e",
      "postgres:16-alpine",
    ].join(" "),
    process.env,
  );

  for (let i = 0; i < 60; i++) {
    try {
      execSync(`docker exec ${E2E_PG_CONTAINER} pg_isready -U nursenest_e2e -d nursenest_e2e`, {
        stdio: "pipe",
        env: process.env,
      });
      break;
    } catch {
      if (i === 59) throw new Error("Postgres did not become ready in time.");
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const dbEnv: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: LOCAL_DATABASE_URL,
    DIRECT_URL: LOCAL_DATABASE_URL,
  };

  /**
   * Fresh Docker DB has no migration history; this repo’s earliest migrations assume an existing schema
   * (enums/tables). `db push` syncs `schema.prisma` for a throwaway local instance (E2E only).
   */
  console.log("[e2e-paid-local-green] prisma db push (fresh local DB)...");
  run("npx prisma db push --accept-data-loss", dbEnv);

  console.log("[e2e-paid-local-green] QA paid test account reset...");
  run("npx tsx scripts/qa-paid-test-account-reset.mts", {
    ...dbEnv,
    ALLOW_QA_PAID_TEST_RESET: "1",
    QA_PAID_TEST_EMAIL: email,
    QA_PAID_TEST_PASSWORD: password,
  });

  console.log("[e2e-paid-local-green] Playwright setup-paid-auth + paid-fast-sanity...");
  run("npm run test:e2e:paid-setup-auth && npm run test:e2e:paid-fast-sanity", dbEnv);

  console.log("[e2e-paid-local-green] Done — paid E2E passed against local Docker Postgres.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
