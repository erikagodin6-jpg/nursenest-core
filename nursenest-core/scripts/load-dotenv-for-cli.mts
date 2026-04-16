/**
 * Side-effect: load env files before Prisma / DATABASE_URL checks.
 *
 * **Path resolution:** Uses the `nursenest-core/` package directory (directory above `scripts/`), not
 * `process.cwd()`. That way `npm run` / `npx tsx` from the monorepo root or another folder still finds
 * `.env.local` / `.env` next to `package.json`.
 *
 * **Load order** (`override: false` — existing `process.env` from the shell always wins):
 * 1. `.env.local` — local developer overrides
 * 2. `.env.playwright.local` — Playwright / E2E secrets (often E2E_* only)
 * 3. `.env` — standard template / shared defaults (fills `DATABASE_URL` when not set above)
 *
 * DigitalOcean App Platform injects `DATABASE_URL` at **runtime** for the web process only; it is not
 * present when you run this script on a laptop unless you copy the URI into a gitignored file or export it.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { config } from "dotenv";
import {
  dbEnvPresence,
  envFileDeclaresKeySync,
  type DbEnvPresence,
} from "./cli-db-url-snapshot.mts";

const PREFIX = "[qa-cli-env]";

const cwd = process.cwd();
const packageRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const envLocalPath = resolve(packageRoot, ".env.local");
const envPlaywrightPath = resolve(packageRoot, ".env.playwright.local");
const envPath = resolve(packageRoot, ".env");

const preDotenv: DbEnvPresence = dbEnvPresence();
const envLocalFound = existsSync(envLocalPath);
const envPlaywrightFound = existsSync(envPlaywrightPath);
const envFound = existsSync(envPath);

if (envLocalFound) {
  config({ path: envLocalPath, override: false });
}
const afterLocal: DbEnvPresence = dbEnvPresence();

if (envPlaywrightFound) {
  config({ path: envPlaywrightPath, override: false });
}
const afterPlaywright: DbEnvPresence = dbEnvPresence();

if (envFound) {
  config({ path: envPath, override: false });
}
const afterDotenv: DbEnvPresence = dbEnvPresence();

const prismaCliUseDirect = process.env.PRISMA_CLI_USE_DIRECT_URL === "1";
const directTrimmed = process.env.DATABASE_DIRECT_URL?.trim();
let effectiveDbVariable: "DATABASE_URL" | "DATABASE_DIRECT_URL_as_DATABASE_URL" = "DATABASE_URL";

if (prismaCliUseDirect && directTrimmed) {
  process.env.DATABASE_URL = directTrimmed;
  effectiveDbVariable = "DATABASE_DIRECT_URL_as_DATABASE_URL";
} else if (prismaCliUseDirect && !directTrimmed) {
  // Flag set but nothing to copy — Prisma still uses DATABASE_URL as-is
  effectiveDbVariable = "DATABASE_URL";
}

function inferSource(
  key: "DATABASE_URL" | "DATABASE_DIRECT_URL",
  pre: DbEnvPresence,
  afterL: DbEnvPresence,
  afterP: DbEnvPresence,
  afterE: DbEnvPresence,
): string {
  const preSet = key === "DATABASE_URL" ? pre.DATABASE_URL : pre.DATABASE_DIRECT_URL;
  const afterLSet = key === "DATABASE_URL" ? afterL.DATABASE_URL : afterL.DATABASE_DIRECT_URL;
  const afterPSet = key === "DATABASE_URL" ? afterP.DATABASE_URL : afterP.DATABASE_DIRECT_URL;
  const afterESet = key === "DATABASE_URL" ? afterE.DATABASE_URL : afterE.DATABASE_DIRECT_URL;

  if (preSet) return "shell (already in process.env before dotenv files)";
  if (afterLSet && envFileDeclaresKeySync(envLocalPath, key)) {
    return ".env.local (first file to supply; shell did not set it)";
  }
  if (afterPSet && !afterLSet && envFileDeclaresKeySync(envPlaywrightPath, key)) {
    return ".env.playwright.local (shell and .env.local did not set it)";
  }
  if (afterPSet && envFileDeclaresKeySync(envPlaywrightPath, key) && !preSet) {
    return ".env.playwright.local (key present in file; order: local then playwright with override:false)";
  }
  if (afterESet && !afterPSet && envFound && envFileDeclaresKeySync(envPath, key)) {
    return ".env (standard file; filled after .env.local / .env.playwright.local did not set this key)";
  }
  if (afterLSet) return ".env.local or earlier aggregate (key provenance not matched to file scan)";
  if (afterPSet) return "dotenv aggregate (source not inferred)";
  if (afterESet) return ".env or aggregate (key provenance not matched to file scan)";
  return "unset after dotenv files";
}

const sourceDatabaseUrl = inferSource("DATABASE_URL", preDotenv, afterLocal, afterPlaywright, afterDotenv);
const sourceDirectUrl = inferSource("DATABASE_DIRECT_URL", preDotenv, afterLocal, afterPlaywright, afterDotenv);

console.log(`${PREFIX} cwd=${cwd}`);
console.log(`${PREFIX} packageRoot=${packageRoot} (env files loaded from here, not from cwd)`);
console.log(`${PREFIX} pre_dotenv: DATABASE_URL=${preDotenv.DATABASE_URL ? "set" : "unset"} DATABASE_DIRECT_URL=${preDotenv.DATABASE_DIRECT_URL ? "set" : "unset"}`);
console.log(
  `${PREFIX} files: .env.local=${envLocalFound ? "found" : "missing"} .env.playwright.local=${envPlaywrightFound ? "found" : "missing"} .env=${envFound ? "found" : "missing"}`,
);
console.log(
  `${PREFIX} file_keys: .env.local declares DATABASE_URL=${envFileDeclaresKeySync(envLocalPath, "DATABASE_URL") ? "yes" : "no"} DATABASE_DIRECT_URL=${envFileDeclaresKeySync(envLocalPath, "DATABASE_DIRECT_URL") ? "yes" : "no"}`,
);
console.log(
  `${PREFIX} file_keys: .env.playwright.local declares DATABASE_URL=${envFileDeclaresKeySync(envPlaywrightPath, "DATABASE_URL") ? "yes" : "no"} DATABASE_DIRECT_URL=${envFileDeclaresKeySync(envPlaywrightPath, "DATABASE_DIRECT_URL") ? "yes" : "no"}`,
);
console.log(
  `${PREFIX} file_keys: .env declares DATABASE_URL=${envFileDeclaresKeySync(envPath, "DATABASE_URL") ? "yes" : "no"} DATABASE_DIRECT_URL=${envFileDeclaresKeySync(envPath, "DATABASE_DIRECT_URL") ? "yes" : "no"}`,
);
console.log(
  `${PREFIX} after_dotenv_files: DATABASE_URL=${afterDotenv.DATABASE_URL ? "set" : "unset"} DATABASE_DIRECT_URL=${afterDotenv.DATABASE_DIRECT_URL ? "set" : "unset"}`,
);
console.log(`${PREFIX} inferred_source: DATABASE_URL ← ${sourceDatabaseUrl}`);
console.log(`${PREFIX} inferred_source: DATABASE_DIRECT_URL ← ${sourceDirectUrl}`);
console.log(`${PREFIX} PRISMA_CLI_USE_DIRECT_URL=${prismaCliUseDirect ? "1" : "0"}`);
if (prismaCliUseDirect) {
  console.log(
    `${PREFIX} after_PRISMA_CLI_USE_DIRECT_URL: copied_direct_to_DATABASE_URL=${Boolean(directTrimmed)} (flag without direct leaves DATABASE_URL unchanged)`,
  );
}
console.log(
  `${PREFIX} prisma_client_will_read: ${effectiveDbVariable === "DATABASE_DIRECT_URL_as_DATABASE_URL" ? "DATABASE_URL (value taken from DATABASE_DIRECT_URL for this process)" : "DATABASE_URL (value from shell/dotenv aggregate)"}`,
);

export type CliDotenvTelemetry = {
  preDotenv: DbEnvPresence;
  afterLocal: DbEnvPresence;
  afterPlaywright: DbEnvPresence;
  afterDotenv: DbEnvPresence;
  envLocalFound: boolean;
  envPlaywrightFound: boolean;
  envFound: boolean;
  packageRoot: string;
  sourceDatabaseUrl: string;
  sourceDirectUrl: string;
  prismaCliUseDirect: boolean;
  effectiveDbVariable: typeof effectiveDbVariable;
};

export const cliDotenvTelemetry: CliDotenvTelemetry = {
  preDotenv,
  afterLocal,
  afterPlaywright,
  afterDotenv,
  envLocalFound,
  envPlaywrightFound,
  envFound,
  packageRoot,
  sourceDatabaseUrl,
  sourceDirectUrl,
  prismaCliUseDirect,
  effectiveDbVariable,
};
