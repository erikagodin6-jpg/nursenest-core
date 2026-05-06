#!/usr/bin/env node
/**
 * Cursor / VS Code remote SSH diagnostics: memory, node processes, ignore config sanity.
 * Does not touch production runtime. Safe to run locally or on a remote dev host.
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

function topNodeProcesses() {
  console.log("\n--- Top node-related processes (by RSS) ---");
  try {
    const out = execFileSync(
      "ps",
      ["-eo", "pid,pcpu,rss,args", "--sort=-rss"],
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
    );
    const lines = out.split("\n");
    const header = lines[0] ?? "";
    const rows = lines
      .slice(1)
      .filter((l) => /\bnode\b|cursor|code-server|vscode/i.test(l))
      .slice(0, 12);
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
    const must = [".next", "node_modules", ".turbo", "prisma/migrations", "i18n"];
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
  const hasWe = Object.keys(we).length > 0;
  const hasSe = Object.keys(se).length > 0;
  console.log(`files.watcherExclude keys: ${hasWe ? Object.keys(we).length : 0}`);
  console.log(`search.exclude keys: ${hasSe ? Object.keys(se).length : 0}`);
  const weStr = JSON.stringify(we);
  const seStr = JSON.stringify(se);
  for (const token of ["node_modules", ".next", "prisma/migrations", "i18n"]) {
    console.log(`  watcher mentions "${token}": ${weStr.includes(token) ? "yes" : "no"}`);
  }
  for (const token of ["node_modules", ".next"]) {
    console.log(`  search mentions "${token}": ${seStr.includes(token) ? "yes" : "no"}`);
  }
  return hasWe && hasSe;
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
      `\n⚠️  WARNING: cwd (${resolvedCwd}) is not the repo root (${resolvedRoot}). Run this script from the repo root for accurate checks (cd into nursenest-core clone first).\n`,
    );
  } else {
    console.log("cwd matches repo root — good for npm scripts and relative tooling.");
  }
}

function main() {
  console.log("Cursor / VS Code remote diagnostics");
  console.log(`Host: ${os.hostname()}  Platform: ${os.platform()} ${os.release()}`);
  printMemory();
  topNodeProcesses();
  checkCursorIgnore();
  checkVscodeSettings();
  workspaceHints();
  console.log("\n--- Next steps ---");
  console.log("If excludes are missing: npm run cursor:validate-remote-config");
  console.log("Recovery guide: reports/cursor-remote-stability.md");
  console.log("");
}

main();
