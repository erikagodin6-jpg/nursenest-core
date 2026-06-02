#!/usr/bin/env node
/**
 * Phase 1: report large "use client" TSX files (warn-only; exit 0).
 * Thresholds are intentionally conservative — tighten in Phase 2 if desired.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(coreRoot, "src");

const WARN_LINES = Number(process.env.NN_CLIENT_COMPONENT_WARN_LINES ?? 900);
const FAIL_LINES = Number(process.env.NN_CLIENT_COMPONENT_FAIL_LINES ?? 1400);

const TRACKED_SUBSTRINGS = [
  "practice-test-runner-client.tsx",
  "admin-blog-control-panel-client.tsx",
  "question-bank-practice-client.tsx",
  "practice-tests-hub-client.tsx",
  "site-header.tsx",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walk(p, out);
    } else if (ent.isFile() && ent.name.endsWith(".tsx")) {
      out.push(p);
    }
  }
  return out;
}

function isUseClientFile(absPath) {
  const head = fs.readFileSync(absPath, "utf8").slice(0, 4000);
  return /^\s*["']use client["']\s*;/m.test(head);
}

function main() {
  const files = walk(srcRoot);
  const rows = [];
  for (const abs of files) {
    if (!isUseClientFile(abs)) continue;
    const raw = fs.readFileSync(abs, "utf8");
    const lines = raw.split(/\r?\n/).length;
    const rel = path.relative(coreRoot, abs);
    rows.push({ rel, lines });
  }
  rows.sort((a, b) => b.lines - a.lines);

  const tracked = rows.filter((r) => TRACKED_SUBSTRINGS.some((s) => r.rel.endsWith(s) || r.rel.includes(s)));
  const warn = rows.filter((r) => r.lines >= WARN_LINES && r.lines < FAIL_LINES);
  const critical = rows.filter((r) => r.lines >= FAIL_LINES);

  console.log("[audit:large-client-components] scanned use-client TSX:", rows.length);
  console.log("[audit:large-client-components] tracked hotspots:");
  for (const t of TRACKED_SUBSTRINGS) {
    const hit = rows.find((r) => r.rel.endsWith(t) || r.rel.includes(`/${t}`));
    console.log(`  - ${t}: ${hit ? `${hit.lines} lines (${hit.rel})` : "not found"}`);
  }
  console.log(`[audit:large-client-components] warn (>=${WARN_LINES} lines):`, warn.length);
  for (const r of warn.slice(0, 40)) {
    console.log(`  ${r.lines}\t${r.rel}`);
    console.error(
      `[nursenest-core] audit_large_client_component_warn ${JSON.stringify({
        rel: r.rel,
        lines: r.lines,
        warnThreshold: WARN_LINES,
      })}`,
    );
  }
  if (warn.length > 40) console.log(`  … ${warn.length - 40} more`);
  console.log(`[audit:large-client-components] future-ci threshold (>=${FAIL_LINES} lines):`, critical.length);
  for (const r of critical.slice(0, 20)) {
    console.log(`  ${r.lines}\t${r.rel}`);
  }
  console.log("[audit:large-client-components] done (exit 0 — Phase 1 warn-only)");
  console.log(
    "[audit:large-client-components] Phase 9: learner route file sizes + per-route use-client counts → npm run report:mobile-route-payloads",
  );
}

main();
