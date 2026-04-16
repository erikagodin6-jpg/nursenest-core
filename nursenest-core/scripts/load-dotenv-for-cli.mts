/**
 * Side-effect: load `.env.local` then `.env.playwright.local` before Prisma / DATABASE_URL checks.
 * Does not override variables already set in the environment (`override: false` — shell wins).
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import {
  dbEnvPresence,
  envFileDeclaresKeySync,
  type DbEnvPresence,
} from "./cli-db-url-snapshot.mts";

const PREFIX = "[qa-cli-env]";

const cwd = process.cwd();
const envLocalPath = resolve(cwd, ".env.local");
const envPlaywrightPath = resolve(cwd, ".env.playwright.local");

const preDotenv: DbEnvPresence = dbEnvPresence();
const envLocalFound = existsSync(envLocalPath);
const envPlaywrightFound = existsSync(envPlaywrightPath);

if (envLocalFound) {
  config({ path: envLocalPath, override: false });
}
const afterLocal: DbEnvPresence = dbEnvPresence();

if (envPlaywrightFound) {
  config({ path: envPlaywrightPath, override: false });
}
const afterPlaywright: DbEnvPresence = dbEnvPresence();

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
): string {
  const preSet = key === "DATABASE_URL" ? pre.DATABASE_URL : pre.DATABASE_DIRECT_URL;
  const afterLSet = key === "DATABASE_URL" ? afterL.DATABASE_URL : afterL.DATABASE_DIRECT_URL;
  const afterPSet = key === "DATABASE_URL" ? afterP.DATABASE_URL : afterP.DATABASE_DIRECT_URL;

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
  if (afterLSet) return ".env.local or earlier aggregate (key provenance not matched to file scan)";
  if (afterPSet) return "dotenv aggregate (source not inferred)";
  return "unset after dotenv files";
}

const sourceDatabaseUrl = inferSource("DATABASE_URL", preDotenv, afterLocal, afterPlaywright);
const sourceDirectUrl = inferSource("DATABASE_DIRECT_URL", preDotenv, afterLocal, afterPlaywright);

console.log(`${PREFIX} pre_dotenv: DATABASE_URL=${preDotenv.DATABASE_URL ? "set" : "unset"} DATABASE_DIRECT_URL=${preDotenv.DATABASE_DIRECT_URL ? "set" : "unset"}`);
console.log(`${PREFIX} files: .env.local=${envLocalFound ? "found" : "missing"} .env.playwright.local=${envPlaywrightFound ? "found" : "missing"}`);
console.log(
  `${PREFIX} file_keys: .env.local declares DATABASE_URL=${envFileDeclaresKeySync(envLocalPath, "DATABASE_URL") ? "yes" : "no"} DATABASE_DIRECT_URL=${envFileDeclaresKeySync(envLocalPath, "DATABASE_DIRECT_URL") ? "yes" : "no"}`,
);
console.log(
  `${PREFIX} file_keys: .env.playwright.local declares DATABASE_URL=${envFileDeclaresKeySync(envPlaywrightPath, "DATABASE_URL") ? "yes" : "no"} DATABASE_DIRECT_URL=${envFileDeclaresKeySync(envPlaywrightPath, "DATABASE_DIRECT_URL") ? "yes" : "no"}`,
);
console.log(
  `${PREFIX} after_dotenv_files: DATABASE_URL=${afterPlaywright.DATABASE_URL ? "set" : "unset"} DATABASE_DIRECT_URL=${afterPlaywright.DATABASE_DIRECT_URL ? "set" : "unset"}`,
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
  envLocalFound: boolean;
  envPlaywrightFound: boolean;
  sourceDatabaseUrl: string;
  sourceDirectUrl: string;
  prismaCliUseDirect: boolean;
  effectiveDbVariable: typeof effectiveDbVariable;
};

export const cliDotenvTelemetry: CliDotenvTelemetry = {
  preDotenv,
  afterLocal,
  afterPlaywright,
  envLocalFound,
  envPlaywrightFound,
  sourceDatabaseUrl,
  sourceDirectUrl,
  prismaCliUseDirect,
  effectiveDbVariable,
};
