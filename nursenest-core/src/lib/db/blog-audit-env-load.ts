/**
 * Optional DATABASE_URL loading for blog audit / recovery scripts.
 * Does **not** call {@link requireDatabaseEnv} — safe when no DB is available (file-only audit).
 *
 * Load order (`override: false` — `process.env` always wins):
 * 1. Already in `process.env`
 * 2. `nursenest-core/.env.local`
 * 3. Repo-root `.env.local`
 * 4. `nursenest-core/.env`
 * 5. Repo-root `.env`
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";

export type BlogAuditDatabaseUrlSource =
  | "process"
  | "app .env.local"
  | "repo .env.local"
  | "app .env"
  | "repo .env"
  | "missing";

export type BlogAuditEnvLoadResult = {
  databaseUrlSet: boolean;
  databaseUrlSource: BlogAuditDatabaseUrlSource;
  directUrlSet: boolean;
};

function wasDatabaseUrlSet(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function wasDirectUrlSet(): boolean {
  return Boolean(process.env.DIRECT_URL?.trim() ?? process.env.DATABASE_DIRECT_URL?.trim());
}

function tryLoadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  config({ path: filePath, override: false, quiet: true });
}

/**
 * Loads env files from app + repo roots and optionally applies Prisma URL tuning
 * via `env-bootstrap` when `DATABASE_URL` becomes available.
 */
export async function loadBlogAuditEnv(options: {
  appRoot: string;
  repoRoot: string;
}): Promise<BlogAuditEnvLoadResult> {
  const { appRoot, repoRoot } = options;

  const before = wasDatabaseUrlSet();
  let databaseUrlSource: BlogAuditDatabaseUrlSource = before ? "process" : "missing";

  if (!before) {
    tryLoadEnvFile(path.join(appRoot, ".env.local"));
    if (wasDatabaseUrlSet()) databaseUrlSource = "app .env.local";
  }

  if (!wasDatabaseUrlSet()) {
    tryLoadEnvFile(path.join(repoRoot, ".env.local"));
    if (wasDatabaseUrlSet()) databaseUrlSource = "repo .env.local";
  }

  if (!wasDatabaseUrlSet()) {
    tryLoadEnvFile(path.join(appRoot, ".env"));
    if (wasDatabaseUrlSet()) databaseUrlSource = "app .env";
  }

  if (!wasDatabaseUrlSet()) {
    tryLoadEnvFile(path.join(repoRoot, ".env"));
    if (wasDatabaseUrlSet()) databaseUrlSource = "repo .env";
  }

  const databaseUrlSet = wasDatabaseUrlSet();
  if (!databaseUrlSet) {
    databaseUrlSource = "missing";
  }

  if (databaseUrlSet) {
    if (process.env.NN_LOG_DIRECT_URL === undefined) {
      process.env.NN_LOG_DIRECT_URL = "0";
    }
    await import("./env-bootstrap.ts");
  }

  const directUrlSet = wasDirectUrlSet();

  const dbLabel = databaseUrlSet ? "set" : "missing";
  console.log(`[blog-audit-env] DATABASE_URL=${dbLabel} source=${databaseUrlSource}`);
  console.log(`[blog-audit-env] DIRECT_URL=${directUrlSet ? "set" : "missing"}`);

  if (!databaseUrlSet) {
    console.log("[blog-audit-env] DATABASE_URL missing; running file-only audit");
  }

  return {
    databaseUrlSet,
    databaseUrlSource,
    directUrlSet,
  };
}
