#!/usr/bin/env node
/**
 * Static psychometric semantic audit — CI gate for LOFT/CAT leakage in learner surfaces.
 *
 * Usage: node scripts/audit-psychometric-semantics.mjs
 * Exit 1 on violations.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), "src");
const violations = [];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "legacy" || name === "node_modules") continue;
      walk(p, acc);
    } else if (/\.(tsx|ts)$/.test(name) && !/\.test\.(tsx|ts)$/.test(name)) {
      acc.push(p);
    }
  }
  return acc;
}

const LOFT_SURFACE_HINTS = [
  "cases/cnple",
  "loft-simulation",
  "cnple-case-completion",
  "LoftSimulationResultsHero",
];

const BANNED_IN_LOFT_SURFACES = [
  { pattern: /Start Another CAT/i, label: "CAT session CTA" },
  { pattern: /Review This CAT/i, label: "CAT review CTA" },
  { pattern: /Pass probability:/i, label: "pass probability display" },
  { pattern: /\badaptive readiness\b/i, label: "adaptive readiness phrase" },
];

const BANNED_COMPONENT_NAMES = [
  { pattern: /export function PostExamAdaptiveReport\b/, file: "post-exam-adaptive-report.tsx", label: "use PostExamPerformanceReport export" },
];

const files = walk(ROOT);

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const content = readFileSync(file, "utf8");

  const isLoftSurface = LOFT_SURFACE_HINTS.some((h) => rel.includes(h));
  if (isLoftSurface) {
    for (const { pattern, label } of BANNED_IN_LOFT_SURFACES) {
      if (pattern.test(content)) {
        violations.push(`${rel}: ${label} (${pattern})`);
      }
    }
  }

  if (rel.endsWith("post-exam-adaptive-report.tsx")) {
    if (!/export function PostExamPerformanceReport/.test(content)) {
      violations.push(`${rel}: missing PostExamPerformanceReport export`);
    }
    if (!/PostExamAdaptiveReport = PostExamPerformanceReport/.test(content)) {
      violations.push(`${rel}: missing deprecated PostExamAdaptiveReport alias`);
    }
  }

  if (rel.includes("case-session-analytics") && /getTestingModelAnalyticsDimensions\(/.test(content)) {
    violations.push(`${rel}: use toTestingModelPostHogFields in case analytics (avoid broken import)`);
  }
}

if (violations.length > 0) {
  console.error("Psychometric semantic audit FAILED:\n");
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
}

console.log(`Psychometric semantic audit passed (${files.length} source files scanned).`);
