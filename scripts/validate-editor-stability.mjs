#!/usr/bin/env node
/**
 * Guard: editor/Cursor SSH stability config must stay in place.
 * Tooling only — does not touch app runtime, schema, or deploy scripts.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
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
const stabilityReport = join(repoRoot, "reports", "cursor-remote-stability.md");

/** @param {string} line */
function looksLikeUnsafeRootWorkspaceAdvice(line) {
  const t = line.trim();
  if (!t || t.startsWith("```")) return false;
  const lower = t.toLowerCase();
  if (!lower.includes("/root")) return false;
  // Safe lines: warn against /root or prescribe clone path
  if (/nursenest-core|do not|don't|never|avoid|wrong|instead|not\s+the|home\s+directory|never\s+open/i.test(t)) {
    return false;
  }
  // Positive-but-unsafe: suggests using /root alone as the folder to open
  if (/\bopen\b.*`\/root`\b/i.test(t)) return true;
  if (/\bworkspace\b.*\/root\/?[`')\s]/i.test(t) && !lower.includes("nursenest-core")) return true;
  if (/\bfolder\b.*\/root\/?[`')\s]/i.test(t) && !lower.includes("nursenest-core")) return true;
  return false;
}

/** @param {string} dirAbs @param {string[]} outRel */
function collectMarkdownRecursive(dirAbs, outRel) {
  if (!existsSync(dirAbs)) return;
  let names;
  try {
    names = readdirSync(dirAbs);
  } catch {
    return;
  }
  for (const name of names) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const abs = join(dirAbs, name);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      collectMarkdownRecursive(abs, outRel);
    } else if (name.endsWith(".md")) {
      outRel.push(relative(repoRoot, abs).replace(/\\/g, "/"));
    }
  }
}

function scanDocsForUnsafeRootAssumptions() {
  const roots = [join(repoRoot, "reports"), join(repoRoot, "docs")];
  /** @type {string[]} */
  const files = [];
  for (const r of roots) {
    collectMarkdownRecursive(r, files);
  }
  const offenders = [];
  for (const rel of files) {
    const abs = join(repoRoot, rel);
    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (looksLikeUnsafeRootWorkspaceAdvice(line)) {
        offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
  assert(
    "no docs suggest opening /root alone as workspace",
    offenders.length === 0,
    offenders.slice(0, 5).join(" | "),
  );
}

console.log("Validating editor / Cursor SSH stability config…\n");

assert(".cursorignore exists", existsSync(cursorIgnore));

/** @type {string} */
let ciBody = "";
if (existsSync(cursorIgnore)) {
  ciBody = readFileSync(cursorIgnore, "utf8");
  for (const frag of [
    "node_modules",
    ".next",
    ".turbo",
    ".cache",
    ".tmp",
    "coverage",
    "dist",
    "playwright-report",
    "test-results",
    "reports",
    "i18n",
    "generated-indexes",
    "prisma/migrations",
    "logs",
    ".prisma",
  ]) {
    assert(`.cursorignore mentions "${frag}"`, ciBody.includes(frag));
  }
  assert(".cursorignore mentions log patterns", ciBody.includes(".log") || ciBody.includes("*.log"));
}

assert("reports/cursor-remote-stability.md exists", existsSync(stabilityReport));
if (existsSync(stabilityReport)) {
  const rep = readFileSync(stabilityReport, "utf8");
  assert("stability doc mentions clone path", /nursenest-core/i.test(rep));
  assert("stability doc warns about /root", /\/root/i.test(rep) && /(never|do not|don't|avoid)/i.test(rep));
}

scanDocsForUnsafeRootAssumptions();

assert(".vscode/settings.json exists", existsSync(settingsPath));
if (existsSync(settingsPath)) {
  let settings;
  try {
    settings = JSON.parse(readFileSync(settingsPath, "utf8"));
  } catch (e) {
    assert("settings.json parses", false, /** @type {Error} */ (e).message);
    process.exit(process.exitCode ?? 1);
  }

  assert("git.autorefresh disabled", settings["git.autorefresh"] === false);
  assert("git.decorations.disabled", settings["git.decorations.enabled"] === false);

  const we = settings["files.watcherExclude"];
  const se = settings["search.exclude"];
  const fe = settings["files.exclude"];

  assert("files.watcherExclude present", we && typeof we === "object");
  assert("search.exclude present", se && typeof se === "object");
  assert("files.exclude present", fe && typeof fe === "object");

  const weJson = JSON.stringify(we ?? {});
  const seJson = JSON.stringify(se ?? {});
  const feJson = JSON.stringify(fe ?? {});

  const required = [
    "node_modules",
    ".next",
    ".turbo",
    ".cache",
    ".tmp",
    "coverage",
    "dist",
    "playwright-report",
    "test-results",
    "reports",
    "i18n",
    "generated-indexes",
    "prisma/migrations",
    "logs",
    ".log",
    ".prisma",
  ];
  /** Not in files.exclude: keep `reports/*.md` visible (e.g. this guide). */
  const filesExcludeSkip = new Set(["reports"]);

  for (const tok of required) {
    assert(`watcher excludes "${tok}"`, weJson.includes(tok));
    assert(`search excludes "${tok}"`, seJson.includes(tok));
    if (!filesExcludeSkip.has(tok)) {
      assert(`files.exclude hides "${tok}"`, feJson.includes(tok));
    }
  }

  assert("typescript.tsserver.maxTsServerMemory set", typeof settings["typescript.tsserver.maxTsServerMemory"] === "number");
  assert(
    "tsserver max memory <= 8192 MB",
    settings["typescript.tsserver.maxTsServerMemory"] <= 8192,
    String(settings["typescript.tsserver.maxTsServerMemory"]),
  );

  // Build output: at least one explicit build path (avoid blanket **/build matching source)
  assert("watcher excludes build outputs", /build/i.test(weJson));
  assert("search excludes build outputs", /build/i.test(seJson));
  assert("files.exclude hides build outputs", /build/i.test(feJson));
}

assert("recover script exists", existsSync(join(repoRoot, "scripts", "recover-cursor-remote.sh")));

if (process.exitCode) {
  console.error("\nValidation failed — see reports/cursor-remote-stability.md\n");
} else {
  console.log("\nAll editor-stability checks passed.\n");
}
