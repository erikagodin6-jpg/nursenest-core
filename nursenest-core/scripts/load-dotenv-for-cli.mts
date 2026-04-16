/**
 * Side-effect: load `.env.local` before Prisma / DATABASE_URL checks in CLI scripts.
 * Does not override variables already set in the environment.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

const p = resolve(process.cwd(), ".env.local");
if (existsSync(p)) {
  config({ path: p, override: false });
}

/**
 * One-off Prisma / tsx scripts: use direct Postgres URL when set (e.g. bypass pooler for migrate or
 * hosts that reject certain query params). App runtime should leave this unset so `DATABASE_URL`
 * stays the canonical pooler URL.
 */
if (process.env.PRISMA_CLI_USE_DIRECT_URL === "1") {
  const direct = process.env.DATABASE_DIRECT_URL?.trim();
  if (direct) {
    process.env.DATABASE_URL = direct;
  }
}
