#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const srcRoot = path.join(packageRoot, "src");

function read(relPath) {
  return fs.readFileSync(path.join(packageRoot, relPath), "utf8");
}

function listFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(fullPath));
      continue;
    }
    out.push(fullPath);
  }
  return out;
}

function rel(absPath) {
  return path.relative(packageRoot, absPath);
}

const failures = [];

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

const instrumentationFile = "src/instrumentation.ts";
const homePerfDiagFile = "src/lib/observability/home-perf-diag.ts";
const marketingMessagesFile = "src/lib/marketing-i18n/load-marketing-messages.ts";
const mergeShardsFile = "src/lib/i18n/merge-next-public-i18n-shards.ts";
const nextConfigFile = "next.config.mjs";

const instrumentationSrc = read(instrumentationFile);
const homePerfDiagSrc = read(homePerfDiagFile);
const marketingMessagesSrc = read(marketingMessagesFile);
const mergeShardsSrc = read(mergeShardsFile);
const nextConfigSrc = read(nextConfigFile);

if (/\bprocess\.pid\b/.test(instrumentationSrc)) {
  addFailure(instrumentationFile, "contains direct process.pid");
}

if (/\bprocess\.pid\b/.test(homePerfDiagSrc)) {
  addFailure(homePerfDiagFile, "contains direct process.pid");
}

for (const absPath of listFiles(path.join(srcRoot, "lib", "observability"))) {
  if (!absPath.endsWith(".ts")) continue;
  const fileSrc = fs.readFileSync(absPath, "utf8");
  if (/\bprocess\.pid\b/.test(fileSrc)) {
    addFailure(rel(absPath), "contains direct process.pid");
  }
}

if (/require\s*\(\s*file\s*\)/.test(marketingMessagesSrc)) {
  addFailure(marketingMessagesFile, "contains require(file)");
}

if (/require\s*\(\s*[A-Za-z_$][\w$]*\s*\)/.test(marketingMessagesSrc)) {
  addFailure(marketingMessagesFile, "contains variable require(...)");
}

for (const absPath of listFiles(srcRoot)) {
  const fileSrc = fs.readFileSync(absPath, "utf8");
  if (/from\s+["'][^"']*next\.config(?:\.[mc]?js|\.ts)?["']/.test(fileSrc)) {
    addFailure(rel(absPath), "imports next.config from src runtime code");
  }
  if (/require\s*\(\s*["'][^"']*next\.config(?:\.[mc]?js|\.ts)?["']\s*\)/.test(fileSrc)) {
    addFailure(rel(absPath), "requires next.config from src runtime code");
  }
}

if (/path\.join\(adminRoot,\s*locale\)/.test(mergeShardsSrc)) {
  addFailure(mergeShardsFile, "contains path.join(adminRoot, locale)");
}

if (/path\.join\(process\.cwd\(\),\s*"nursenest-core",\s*"i18n-admin-only"\)/.test(mergeShardsSrc)) {
  addFailure(mergeShardsFile, "contains repo-coupled admin i18n root");
}

if (/^\s*eslint\s*:/m.test(nextConfigSrc)) {
  addFailure(nextConfigFile, "contains unsupported eslint config key");
}

if (failures.length > 0) {
  console.error("[verify-turbopack-build-safety] FAIL");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[verify-turbopack-build-safety] OK");
