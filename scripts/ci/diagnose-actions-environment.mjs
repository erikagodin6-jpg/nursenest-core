#!/usr/bin/env node
/**
 * CI diagnostics: cwd, Node, lockfile, package.json, required npm scripts, env presence (booleans only).
 * Safe for logs — never prints secret values.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const argPkg = process.argv.find((a) => a.startsWith("--package-root="));
const overrideRoot = argPkg ? argPkg.split("=", 2)[1] : null;

function defaultPackageRoot() {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "nursenest-core", "package.json"))) {
    return path.join(cwd, "nursenest-core");
  }
  if (existsSync(path.join(cwd, "package.json"))) {
    return cwd;
  }
  if (existsSync(path.join(repoRoot, "nursenest-core", "package.json"))) {
    return path.join(repoRoot, "nursenest-core");
  }
  return cwd;
}

const packageRoot = path.resolve(process.cwd(), overrideRoot ?? defaultPackageRoot());

function hasScript(pkg, name) {
  return Boolean(pkg.scripts && typeof pkg.scripts[name] === "string" && pkg.scripts[name].trim());
}

function envSet(name) {
  const v = process.env[name];
  return v != null && String(v).trim() !== "";
}

const pkgPath = path.join(packageRoot, "package.json");
const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, "utf8")) : {};

const requiredScripts = (process.env.CI_DIAGNOSE_REQUIRED_SCRIPTS ?? "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const secretHints = (process.env.CI_DIAGNOSE_SECRET_NAMES ?? "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const nonSecretHints = (process.env.CI_DIAGNOSE_ENV_NAMES ?? "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

console.log("[ci:diagnose] cwd=" + process.cwd());
console.log("[ci:diagnose] node=" + process.version);
console.log("[ci:diagnose] packageRoot=" + packageRoot);
console.log("[ci:diagnose] package.json=" + (existsSync(pkgPath) ? pkgPath : "MISSING"));

const lockNpm = path.join(packageRoot, "package-lock.json");
const lockYarn = path.join(packageRoot, "yarn.lock");
const lockPnpm = path.join(packageRoot, "pnpm-lock.yaml");
let lock = "none";
if (existsSync(lockNpm)) lock = "npm:package-lock.json";
else if (existsSync(lockYarn)) lock = "yarn:yarn.lock";
else if (existsSync(lockPnpm)) lock = "pnpm:pnpm-lock.yaml";
console.log("[ci:diagnose] lockfile=" + lock);

for (const name of requiredScripts) {
  console.log("[ci:diagnose] script[" + name + "]=" + (hasScript(pkg, name) ? "present" : "MISSING"));
  if (!hasScript(pkg, name)) process.exitCode = 2;
}

for (const name of nonSecretHints) {
  console.log("[ci:diagnose] env[" + name + "]=" + (envSet(name) ? "set" : "unset"));
}

for (const name of secretHints) {
  console.log("[ci:diagnose] secret[" + name + "]=" + (envSet(name) ? "set" : "unset"));
}

if (process.exitCode === 2) {
  console.error("[ci:diagnose] FATAL: one or more required npm scripts are missing from package.json");
  process.exit(2);
}

console.log("[ci:diagnose] ok");
