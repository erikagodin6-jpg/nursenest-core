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
