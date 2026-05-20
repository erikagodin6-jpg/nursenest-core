#!/usr/bin/env node
/**
 * Blocks new /canada/rpn/rex-pn product hrefs outside redirect allowlist.
 * Run: node nursenest-core/scripts/audit-route-canonicalization.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const appRoot = path.join(repoRoot, "nursenest-core");
const legacy = /\/canada\/rpn\/rex-pn/g;

const ALLOWLIST_SEGMENTS = [
  "next.config.mjs",
  "canada/rpn/rex-pn/",
  "rpn-route-aliases.contract.test.ts",
  "educational-graph-orchestrator.contract.test.ts",
  "seo-graph-hardening.contract.test.ts",
  "rpn-gating-regression.spec.ts",
  "rpn-student-flow.spec.ts",
  "rpn-rex-pn-authority-hub-smoke.spec.ts",
  "qa-rpn-pn-browser-journey.mjs",
  "audit-route-canonicalization.mjs",
  "audit-rn-educational-graph.mjs",
];

function walk(dir, hits = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(appRoot, p);
    if (ALLOWLIST_SEGMENTS.some((a) => rel.includes(a))) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, hits);
    } else if (/\.(ts|tsx|mjs|js|mts)$/.test(name)) {
      const text = fs.readFileSync(p, "utf8");
      if (legacy.test(text)) hits.push(rel);
    }
  }
  return hits;
}

function walkContent(dir, hits = []) {
  if (!fs.existsSync(dir)) return hits;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(appRoot, p);
    if (ALLOWLIST_SEGMENTS.some((a) => rel.includes(a))) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules") continue;
      walkContent(p, hits);
    } else if (/\.(md|mdx|json|ts|tsx|mjs|markdown)$/.test(name)) {
      const text = fs.readFileSync(p, "utf8");
      if (legacy.test(text)) hits.push(rel);
    }
  }
  return hits;
}

const hits = walk(path.join(appRoot, "src"));
const scriptHits = walk(path.join(appRoot, "scripts"));
const contentHits = walkContent(path.join(appRoot, "content"));
const blogHits = walkContent(path.join(appRoot, "src/content/blog-static-longtail"));
const seoHits = walkContent(path.join(appRoot, "src/lib/seo"));

const all = [...hits, ...scriptHits, ...contentHits, ...blogHits, ...seoHits];
if (all.length > 0) {
  console.error("[audit-route-canonicalization] Legacy hrefs found:\n", all.slice(0, 20).map((h) => `  ${h}`).join("\n"));
  if (all.length > 20) console.error(`  ...+${all.length - 20} more`);
  process.exit(1);
}

console.log(
  "[audit-route-canonicalization] OK — no legacy /canada/rpn/rex-pn in src/scripts/content/seo/blog seeds (allowlisted redirects/tests excluded)",
);
