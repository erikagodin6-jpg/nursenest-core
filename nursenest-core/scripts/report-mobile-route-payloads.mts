#!/usr/bin/env npx tsx
/**
 * Phase 9 — read-only **mobile route payload** heuristics for learner `src/app` trees.
 * Warn-only (exit 0). Complements `report-large-client-components.mjs` (global use-client TSX scan).
 *
 *   cd nursenest-core && npx tsx scripts/report-mobile-route-payloads.mts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const learnerRoot = path.join(coreRoot, "src", "app", "(student)", "app", "(learner)");
const TARGET_SUFFIXES = [".tsx", ".ts"] as const;

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walk(p, out);
    } else if (ent.isFile() && TARGET_SUFFIXES.some((s) => ent.name.endsWith(s))) {
      out.push(p);
    }
  }
  return out;
}

function countUseClient(src: string): number {
  const head = src.slice(0, 12_000);
  const re = /^\s*["']use client["']\s*;/gm;
  return (head.match(re) ?? []).length;
}

function isRouteishFile(rel: string): boolean {
  return (
    rel.endsWith(`${path.sep}page.tsx`) ||
    rel.endsWith(`${path.sep}layout.tsx`) ||
    rel.endsWith(`${path.sep}page.ts`) ||
    rel.endsWith(`${path.sep}layout.ts`) ||
    rel.endsWith(`${path.sep}loading.tsx`) ||
    rel.endsWith(`${path.sep}template.tsx`)
  );
}

function main(): void {
  /** Learner subtree only — avoids double-counting `(learner)` paths under `(student)/app`. */
  const roots = [learnerRoot].filter((r) => fs.existsSync(r));
  const byAbs = new Map<string, { rel: string; bytes: number; useClient: number }>();
  for (const root of roots) {
    for (const abs of walk(root)) {
      const key = path.normalize(abs);
      const rel = path.relative(coreRoot, abs);
      if (!isRouteishFile(rel)) continue;
      const st = fs.statSync(abs);
      const raw = fs.readFileSync(abs, "utf8");
      byAbs.set(key, { rel, bytes: st.size, useClient: countUseClient(raw) });
    }
  }
  const rows = [...byAbs.values()].sort((a, b) => b.bytes - a.bytes);

  console.log("[report:mobile-route-payloads] roots:", roots.map((r) => path.relative(coreRoot, r)).join(", "));
  console.log("[report:mobile-route-payloads] route-ish files:", rows.length);
  console.log("[report:mobile-route-payloads] top by file size (warn-only):");
  for (const r of rows.slice(0, 35)) {
    console.log(`  ${r.bytes}\tuseClient×${r.useClient}\t${r.rel.replaceAll("\\", "/")}`);
  }
  const heavy = rows.filter((r) => r.bytes >= 45_000);
  console.log(`[report:mobile-route-payloads] files >= 45000 bytes: ${heavy.length}`);
  const multiClient = rows.filter((r) => r.useClient > 1);
  if (multiClient.length) {
    console.log("[report:mobile-route-payloads] WARN: multiple use client directives in:", multiClient.length);
    for (const r of multiClient.slice(0, 15)) {
      console.log(`  ${r.rel.replaceAll("\\", "/")}`);
    }
  }
  console.log("[report:mobile-route-payloads] done (exit 0)");
}

main();
