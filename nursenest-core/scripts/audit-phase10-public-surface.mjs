#!/usr/bin/env node
/**
 * Ensures Phase 10 ecosystem contracts and the Phase 10B admin registry stay off public app routes.
 * Admin-only code must live under `src/app/(admin)/` or `src/app/api/admin/`.
 *
 * Run: `npm run audit:phase10-public-surface`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "src", "app");

const FORBIDDEN = [
  "admin-ecosystem-readiness-registry",
  "loadAdminEcosystemReadinessRegistry",
  "@/lib/platform/phase10",
  "lib/platform/phase10",
];

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, acc);
    } else if (/\.(tsx|ts|mts|jsx|js)$/.test(ent.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function isPublicRouteFile(absPath) {
  const norm = absPath.replace(/\\/g, "/");
  if (norm.includes("/src/app/(admin)/")) return false;
  if (norm.includes("/src/app/api/admin/")) return false;
  return true;
}

const hits = [];
for (const f of walk(APP)) {
  if (!isPublicRouteFile(f)) continue;
  const src = fs.readFileSync(f, "utf8");
  for (const token of FORBIDDEN) {
    if (src.includes(token)) {
      hits.push(`${path.relative(ROOT, f)}: contains "${token}"`);
    }
  }
}

if (hits.length) {
  console.error("audit:phase10-public-surface FAILED\n");
  for (const h of hits) console.error(` - ${h}`);
  process.exit(1);
}

console.log("audit:phase10-public-surface OK (no Phase 10 / admin registry imports on public app routes)");
