#!/usr/bin/env node
/**
 * Flags standalone traversal/href builders outside educational-graph/.
 * Run: node nursenest-core/scripts/audit-parallel-traversal-builders.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(appRoot, "src");

const PATTERNS = [
  { re: /function\s+build\w*Remediation\w*Chain\s*\(/, label: "standalone remediation chain builder" },
  { re: /function\s+build\w*CompetencyGraphSteps\s*\(/, label: "standalone competency graph steps (non-deprecated)" },
];

const ALLOW = [
  "lib/educational-graph/",
  "lib/lessons/marketing-lesson-remediation-chain.ts",
  "lib/learner/post-exam-coaching/competency-graph-steps.ts",
  "lib/learner/rn-coaching-intelligence/competency-graph-orchestration.ts",
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(appRoot, p);
    if (ALLOW.some((a) => rel.includes(a))) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(name)) {
      const text = fs.readFileSync(p, "utf8");
      for (const { re, label } of PATTERNS) {
        if (re.test(text) && !text.includes("@deprecated")) {
          out.push({ file: rel, label });
        }
      }
    }
  }
  return out;
}

const hits = walk(srcRoot);
if (hits.length > 0) {
  console.error("[audit-parallel-traversal-builders] Possible parallel traversal:\n");
  for (const h of hits) console.error(`  ${h.file}: ${h.label}`);
  process.exit(1);
}

console.log("[audit-parallel-traversal-builders] OK — no new parallel traversal builders outside allowlist");
