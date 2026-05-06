#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseDotenv } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const APP_ROOT = resolve(__dirname, "..");
export const REPO_ROOT = resolve(APP_ROOT, "..");

const ENV_FILE_ORDER = [
  { label: "nursenest-core/.env.local", path: resolve(APP_ROOT, ".env.local") },
  { label: "nursenest-core/.env", path: resolve(APP_ROOT, ".env") },
  { label: "repo-root/.env.local", path: resolve(REPO_ROOT, ".env.local") },
  { label: "repo-root/.env", path: resolve(REPO_ROOT, ".env") },
];

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function loadEnvFile(file, loadedKeys, keySources) {
  if (!existsSync(file.path)) return { ...file, exists: false };
  const parsed = parseDotenv(readFileSync(file.path, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (!hasValue(process.env[key])) {
      process.env[key] = value;
      loadedKeys.add(key);
      keySources.set(key, file.label);
    }
  }
  return { ...file, exists: true };
}

export function loadScriptEnv(options = {}) {
  const { requireDatabaseUrl = false, log = options.quiet === true ? false : true, prefix = "[script-env]" } = options;
  const beforeSources = new Set(
    Object.entries(process.env)
      .filter(([, value]) => hasValue(value))
      .map(([key]) => key),
  );
  const loadedKeys = new Set();
  const keySources = new Map();
  const files = ENV_FILE_ORDER.map((file) => loadEnvFile(file, loadedKeys, keySources));

  if (!hasValue(process.env.DIRECT_URL) && hasValue(process.env.DATABASE_DIRECT_URL)) {
    process.env.DIRECT_URL = process.env.DATABASE_DIRECT_URL;
    keySources.set("DIRECT_URL", beforeSources.has("DATABASE_DIRECT_URL") ? "process.env:DATABASE_DIRECT_URL" : "DATABASE_DIRECT_URL");
  }

  const databaseUrlSet = hasValue(process.env.DATABASE_URL);
  const directUrlSet = hasValue(process.env.DIRECT_URL);
  const sourceFor = (key) => {
    if (beforeSources.has(key)) return "process.env";
    return keySources.get(key) ?? "unset";
  };

  const telemetry = {
    cwd: process.cwd(),
    appRoot: APP_ROOT,
    repoRoot: REPO_ROOT,
    files: files.map(({ label, path, exists }) => ({ label, path, exists })),
    databaseUrlSet,
    directUrlSet,
    databaseUrlSource: sourceFor("DATABASE_URL"),
    directUrlSource: sourceFor("DIRECT_URL"),
  };

  if (log) {
    console.log(`${prefix} cwd=${telemetry.cwd}`);
    console.log(`${prefix} appRoot=${telemetry.appRoot}`);
    console.log(
      `${prefix} envFiles=${telemetry.files.map((file) => `${file.label}:${file.exists ? "found" : "missing"}`).join(", ")}`,
    );
    console.log(`${prefix} DATABASE_URL=${databaseUrlSet ? "set" : "missing"} source=${telemetry.databaseUrlSource}`);
    console.log(`${prefix} DIRECT_URL=${directUrlSet ? "set" : "missing"} source=${telemetry.directUrlSource}`);
  }

  if (requireDatabaseUrl && !databaseUrlSet) {
    throw new Error(
      `DATABASE_URL is missing for this DB script. Checked nursenest-core/.env.local, nursenest-core/.env, repo-root/.env.local, and repo-root/.env. ` +
        `Export DATABASE_URL or add it to a gitignored env file before running Prisma/DB maintenance scripts.`,
    );
  }

  return telemetry;
}

export function formatScriptEnvDiagnostics(telemetry) {
  return [
    `[env:check] current working directory: ${telemetry.cwd}`,
    `[env:check] detected app root: ${telemetry.appRoot}`,
    `[env:check] detected repo root: ${telemetry.repoRoot}`,
    "[env:check] env files:",
    ...telemetry.files.map((file) => `  - ${file.label}: ${file.exists ? "found" : "missing"}`),
    `[env:check] DATABASE_URL set: ${telemetry.databaseUrlSet ? "yes" : "no"}`,
    `[env:check] DIRECT_URL set: ${telemetry.directUrlSet ? "yes" : "no"}`,
  ].join("\n");
}

export function requireScriptDatabaseUrl(options = {}) {
  return loadScriptEnv({ ...options, requireDatabaseUrl: true });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  loadScriptEnv({ requireDatabaseUrl: process.argv.includes("--require-database-url") });
}
