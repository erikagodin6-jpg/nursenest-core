#!/usr/bin/env node
/**
 * Cursor / VS Code remote SSH diagnostics: memory, disk, heavy dirs, node processes, config sanity.
 * Does not touch production runtime.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cursorIgnorePath = join(repoRoot, ".cursorignore");
const vscodeSettingsPath = join(repoRoot, ".vscode", "settings.json");

function readLinuxMeminfo() {
  try {
    const txt = readFileSync("/proc/meminfo", "utf8");
    const pick = (key) => {
      const line = txt.split("\n").find((l) => l.startsWith(key));
      if (!line) return null;
      const kb = Number(line.replace(/\D/g, ""));
      return Number.isFinite(kb) ? kb : null;
    };
    const totalKb = pick("MemTotal:");
    const availKb = pick("MemAvailable:") ?? pick("MemFree:");
    if (totalKb == null || availKb == null) return null;
    const gb = (kb) => (kb / 1024 / 1024).toFixed(2);
    return {
      source: "/proc/meminfo",
      memTotalGb: gb(totalKb),
      memAvailableGb: gb(availKb),
      memUsedApproxGb: gb(totalKb - availKb),
    };
  } catch {
    return null;
  }
}

function formatBytes(n) {
  const gb = n / 1024 ** 3;
  return `${gb.toFixed(2)} GiB`;
}

function printMemory() {
  console.log("\n--- Memory ---");
  const linux = readLinuxMeminfo();
  if (linux) {
    console.log(`Source: ${linux.source}`);
    console.log(`MemTotal (approx): ${linux.memTotalGb} GiB`);
    console.log(`MemAvailable: ${linux.memAvailableGb} GiB`);
    console.log(`MemUsed (approx, total - avail): ${linux.memUsedApproxGb} GiB`);
  } else {
    const total = os.totalmem();
    const free = os.freemem();
    console.log("Source: os.totalmem / os.freemem (non-Linux or /proc unreadable)");
    console.log(`Total: ${formatBytes(total)}`);
    console.log(`Free: ${formatBytes(free)}`);
    console.log(`Used (approx): ${formatBytes(total - free)}`);
  }
}

function printDisk() {
  console.log("\n--- Disk (repo mount) ---");
  try {
    const out = execFileSync("df", ["-h", repoRoot], { encoding: "utf8", maxBuffer: 1024 * 1024 });
    console.log(out.trimEnd());
  } catch (e) {
    console.log(`df unavailable: ${/** @type {Error} */ (e).message}`);
  }
}

function duSh(rel) {
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) return null;
  try {
    const out = execFileSync("du", ["-sh", abs], { encoding: "utf8", maxBuffer: 1024 * 1024 });
    return out.split(/\s+/)[0]?.trim() ?? "?";
  } catch {
    return "(du failed)";
  }
}

function printHeavyDirsAndExcludes() {
  console.log("\n--- Heavy on-disk paths (if present) + exclude intent ---");
  const paths = [
    "node_modules",
    "nursenest-core/node_modules",
    ".next",
    "nursenest-core/.next",
    ".turbo",
    "coverage",
    "dist",
    "nursenest-core/build",
    "playwright-report",
    "test-results",
    "reports",
    "nursenest-core/public/i18n",
    "nursenest-core/prisma/migrations",
  ];
  let settingsText = "";
  if (existsSync(vscodeSettingsPath)) {
    try {
      settingsText = readFileSync(vscodeSettingsPath, "utf8");
    } catch {
      settingsText = "";
    }
  }
  for (const p of paths) {
    const abs = join(repoRoot, p);
    const exists = existsSync(abs);
    const size = exists ? duSh(p) : "—";
    const inSettings = settingsText.includes(p.replace(/\\/g, "/"));
    console.log(`  ${exists ? "✓" : "·"} ${p.padEnd(38)} ${String(size).padStart(10)}  (substring in settings.json: ${inSettings ? "yes" : "no"})`);
  }
  console.log("  (Substring check is heuristic; globs may still cover these paths.)");
}

function topNodeProcesses(sortKey) {
  const sort = sortKey === "cpu" ? "-pcpu" : "-rss";
  console.log(`\n--- Top node-related processes (by ${sortKey === "cpu" ? "CPU%" : "RSS"}) ---`);
  try {
    const out = execFileSync(
      "ps",
      ["-eo", "pid,pcpu,rss,args", `--sort=${sort}`],
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
    );
    const lines = out.split("\n");
    const header = lines[0] ?? "";
    const rows = lines
      .slice(1)
      .filter((l) => /\bnode\b|cursor|code-server|vscode/i.test(l))
      .slice(0, 14);
    console.log(header.trimEnd());
    for (const r of rows) console.log(r.trimEnd());
    if (rows.length === 0) console.log("(no matching rows — ps output may differ on this OS)");
  } catch (e) {
    console.log(`Could not run ps: ${/** @type {Error} */ (e).message}`);
  }
}

function checkCursorIgnore() {
  console.log("\n--- .cursorignore ---");
  const ok = existsSync(cursorIgnorePath);
  console.log(ok ? `Present: ${cursorIgnorePath}` : `MISSING: ${cursorIgnorePath}`);
  if (ok) {
    const body = readFileSync(cursorIgnorePath, "utf8");
    const must = [".next", "node_modules", ".turbo", "prisma/migrations", "i18n", "reports", "generated-indexes"];
    for (const m of must) {
      const hit = body.includes(m);
      console.log(`  contains "${m}": ${hit ? "yes" : "NO"}`);
    }
  }
  return ok;
}

function checkVscodeSettings() {
  console.log("\n--- .vscode/settings.json ---");
  if (!existsSync(vscodeSettingsPath)) {
    console.log(`MISSING: ${vscodeSettingsPath}`);
    return false;
  }
  let json;
  try {
    json = JSON.parse(readFileSync(vscodeSettingsPath, "utf8"));
  } catch (e) {
    console.log(`Invalid JSON: ${/** @type {Error} */ (e).message}`);
    return false;
  }
  const we = json["files.watcherExclude"] ?? {};
  const se = json["search.exclude"] ?? {};
  const fe = json["files.exclude"] ?? {};
  console.log(`files.watcherExclude keys: ${Object.keys(we).length}`);
  console.log(`search.exclude keys: ${Object.keys(se).length}`);
  console.log(`files.exclude keys: ${Object.keys(fe).length}`);
  const weStr = JSON.stringify(we);
  const seStr = JSON.stringify(se);
  for (const token of ["node_modules", ".next", "prisma/migrations", "i18n", "reports"]) {
    console.log(`  watcher "${token}": ${weStr.includes(token) ? "yes" : "no"}`);
  }
  for (const token of ["node_modules", ".next"]) {
    console.log(`  search "${token}": ${seStr.includes(token) ? "yes" : "no"}`);
  }
  return Object.keys(we).length > 0 && Object.keys(se).length > 0;
}

function workspaceHints() {
  console.log("\n--- Workspace / cwd hints ---");
  const cwd = process.cwd();
  const resolvedCwd = resolve(cwd);
  const resolvedRoot = resolve(repoRoot);
  console.log(`process.cwd(): ${cwd}`);
  console.log(`Script repo root: ${resolvedRoot}`);
  if (resolvedCwd === "/root" || resolvedCwd === "/root/") {
    console.warn(
      "\n⚠️  WARNING: cwd is /root. Open Cursor Remote on the repo folder (e.g. /root/nursenest-core), not the home directory, or watchers may scan enormous trees.\n",
    );
  } else if (resolvedCwd !== resolvedRoot) {
    console.warn(
      `\n⚠️  WARNING: cwd (${resolvedCwd}) is not the repo root (${resolvedRoot}). cd into the clone before comparing paths.\n`,
    );
  } else {
    console.log("cwd matches repo root — good for npm scripts and relative tooling.");
  }
}

function main() {
  console.log("Cursor / VS Code remote diagnostics");
  console.log(`Host: ${os.hostname()}  Platform: ${os.platform()} ${os.release()}`);
  printMemory();
  printDisk();
  printHeavyDirsAndExcludes();
  topNodeProcesses("cpu");
  topNodeProcesses("ram");
  checkCursorIgnore();
  checkVscodeSettings();
  workspaceHints();
  console.log("\n--- Next steps ---");
  console.log("  npm run validate:editor-stability");
  console.log("  npm run cursor:recover        # if extensionHost/fileWatcher are runaway (then Reload Window)");
  console.log("  reports/cursor-remote-stability.md");
  console.log("");
}

main();
