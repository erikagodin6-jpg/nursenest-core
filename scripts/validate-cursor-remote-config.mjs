#!/usr/bin/env node
/**
 * Fails CI/local check if Cursor remote stability excludes are removed accidentally.
 * Editor/tooling only — no production impact.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** @param {string} name @param {boolean} ok @param {string} [detail] */
function assert(name, ok, detail = "") {
  const line = ok ? `ok  ${name}` : `FAIL ${name}${detail ? ` — ${detail}` : ""}`;
  console.log(line);
  if (!ok) process.exitCode = 1;
}

const cursorIgnore = join(repoRoot, ".cursorignore");
const settingsPath = join(repoRoot, ".vscode", "settings.json");

console.log("Validating Cursor remote stability config…\n");

assert(".cursorignore exists", existsSync(cursorIgnore));
let ciBody = "";
if (existsSync(cursorIgnore)) {
  ciBody = readFileSync(cursorIgnore, "utf8");
  for (const frag of [
    "node_modules",
    ".next",
    ".turbo",
    "prisma/migrations",
    "i18n",
    ".vercel",
    ".cache",
    "playwright-report",
    "test-results",
  ]) {
    assert(`.cursorignore mentions "${frag}"`, ciBody.includes(frag));
  }
}

assert(".vscode/settings.json exists", existsSync(settingsPath));
if (existsSync(settingsPath)) {
  let settings;
  try {
    settings = JSON.parse(readFileSync(settingsPath, "utf8"));
  } catch (e) {
    assert("settings.json parses", false, /** @type {Error} */ (e).message);
    process.exit(process.exitCode ?? 1);
  }
  const we = settings["files.watcherExclude"];
  const se = settings["search.exclude"];
  assert("files.watcherExclude present", we && typeof we === "object");
  assert("search.exclude present", se && typeof se === "object");
  const weKeys = we ? Object.keys(we) : [];
  const seKeys = se ? Object.keys(se) : [];
  assert("watcherExclude has multiple rules", weKeys.length >= 8, `only ${weKeys.length}`);
  assert("search.exclude has multiple rules", seKeys.length >= 8, `only ${seKeys.length}`);
  const weJson = JSON.stringify(we ?? {});
  const seJson = JSON.stringify(se ?? {});
  assert("watcher excludes node_modules", weJson.includes("node_modules"));
  assert("watcher excludes .next", weJson.includes(".next"));
  assert("search excludes node_modules", seJson.includes("node_modules"));
  assert("search excludes .next", seJson.includes(".next"));
  assert("tsserver memory capped", typeof settings["typescript.tsserver.maxTsServerMemory"] === "number");
  assert(
    "tsserver max memory <= 8192 MB (reasonable remote cap)",
    settings["typescript.tsserver.maxTsServerMemory"] <= 8192,
    String(settings["typescript.tsserver.maxTsServerMemory"]),
  );
  assert("git.autorefresh disabled", settings["git.autorefresh"] === false);
}

if (process.exitCode) {
  console.error("\nValidation failed — restore excludes per reports/cursor-remote-stability.md\n");
} else {
  console.log("\nAll checks passed.\n");
}
