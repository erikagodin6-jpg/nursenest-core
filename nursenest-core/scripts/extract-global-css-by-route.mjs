#!/usr/bin/env node
/**
 * extract-global-css-by-route.mjs
 *
 * Phase 2 — Route-scoped CSS extraction.
 *
 * Reads the audit JSON produced by audit-global-css-usage.mjs, then:
 *   1. Extracts LEARNER_ONLY blocks → src/app/styles/learner/learner-global.css
 *   2. Extracts MARKETING_ONLY blocks → src/app/styles/marketing/marketing-global.css
 *   3. Writes the pruned globals.css
 *
 * Rules:
 *   - Never moves HIGH_RISK blocks (keeps them in globals.css)
 *   - Moves both SAFE and NEEDS_REVIEW for clearly-named learner/marketing prefixes
 *   - Preserves cascade order within each output file
 *   - Includes preceding blank lines and block comments
 *   - Leaves UNKNOWN, SHARED_COMPONENT, GLOBAL_REQUIRED in globals.css
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const AUDIT_JSON = join(ROOT, ".claude/audits/global-css-usage.json");
const GLOBALS_SRC = join(ROOT, "src/app/globals.css");
const GLOBALS_DST = GLOBALS_SRC; // overwrite in place
const LEARNER_DST = join(ROOT, "src/app/styles/learner/learner-global.css");
const MARKETING_DST = join(ROOT, "src/app/styles/marketing/marketing-global.css");

mkdirSync(join(ROOT, "src/app/styles/learner"), { recursive: true });
mkdirSync(join(ROOT, "src/app/styles/marketing"), { recursive: true });

// ─── Load audit ─────────────────────────────────────────────────────────────
const audit = JSON.parse(readFileSync(AUDIT_JSON, "utf8"));
const cssLines = readFileSync(GLOBALS_SRC, "utf8").split("\n");
const totalLines = cssLines.length;

console.log(`Loaded audit: ${audit.blocks.length} blocks`);
console.log(`globals.css: ${totalLines} lines`);

// ─── Build per-line destination map ─────────────────────────────────────────
// Each line gets tagged: 'LEARNER' | 'MARKETING' | 'KEEP' | 'BLANK'
const lineDestination = new Array(totalLines).fill("KEEP");

let learnerLines = 0, learnerBytes = 0;
let marketingLines = 0, marketingBytes = 0;
let movedBlocks = 0;

for (const block of audit.blocks) {
  if (block.type === "directive") continue;
  if (block.risk === "HIGH_RISK") continue;

  const dest =
    block.classification === "LEARNER_ONLY" ? "LEARNER" :
    block.classification === "MARKETING_ONLY" ? "MARKETING" : null;

  if (!dest) continue;

  // startLine and endLine are 1-indexed from the CSS parser
  const from = block.startLine - 1;  // 0-indexed
  const to   = block.endLine   - 1;  // 0-indexed (inclusive)

  if (from < 0 || to >= totalLines) continue;

  for (let i = from; i <= to; i++) {
    lineDestination[i] = dest;
  }

  if (dest === "LEARNER") {
    learnerLines += (to - from + 1);
    learnerBytes += block.bytes;
  } else {
    marketingLines += (to - from + 1);
    marketingBytes += block.bytes;
  }
  movedBlocks++;
}

console.log(`\nBlocks to move: ${movedBlocks}`);
console.log(`  → Learner:    ~${(learnerBytes/1024).toFixed(1)} KB (${learnerLines} lines)`);
console.log(`  → Marketing:  ~${(marketingBytes/1024).toFixed(1)} KB (${marketingLines} lines)`);

// ─── Also tag comment lines that immediately precede an extracted block ──────
// Walk forward: if a line is KEEP and the NEXT non-blank line is LEARNER/MARKETING,
// include this comment/blank run with the extraction.
// Strategy: for each extracted block, look backwards from its start for preceding
// comment lines that belong to it.
for (let i = totalLines - 1; i >= 0; i--) {
  if (lineDestination[i] === "LEARNER" || lineDestination[i] === "MARKETING") {
    // Scan backward for a comment block preceding this
    const targetDest = lineDestination[i];
    let j = i - 1;
    // Skip preceding blank lines
    while (j >= 0 && cssLines[j].trim() === "") {
      j--;
    }
    // Check if there's a block comment immediately before
    if (j >= 0) {
      const prevLine = cssLines[j].trim();
      if (prevLine.endsWith("*/") || prevLine === "*/") {
        // Find the start of this comment block
        while (j >= 0 && !cssLines[j].trim().startsWith("/*")) {
          j--;
        }
        // Tag the comment lines with the same destination IF they're currently KEEP
        // and not part of a different block's territory
        if (j >= 0 && lineDestination[j] === "KEEP") {
          // Check if the comment is short (only a few lines) — section dividers
          const commentLen = i - 1 - j;
          if (commentLen <= 8) {
            for (let k = j; k < i; k++) {
              if (lineDestination[k] === "KEEP") {
                lineDestination[k] = targetDest + "_COMMENT";
              }
            }
          }
        }
      }
    }
  }
}

// ─── Build output buffers ────────────────────────────────────────────────────
const keepLines = [];
const learnerOut = [];
const marketingOut = [];

// Track consecutive blank lines to avoid excessive whitespace in output
function appendWithSingleBlank(arr, line) {
  if (line.trim() === "" && arr.length > 0 && arr[arr.length - 1].trim() === "") {
    return; // skip duplicate blank
  }
  arr.push(line);
}

for (let i = 0; i < totalLines; i++) {
  const dest = lineDestination[i];
  const line = cssLines[i];

  if (dest === "LEARNER" || dest === "LEARNER_COMMENT") {
    appendWithSingleBlank(learnerOut, line);
  } else if (dest === "MARKETING" || dest === "MARKETING_COMMENT") {
    appendWithSingleBlank(marketingOut, line);
  } else {
    appendWithSingleBlank(keepLines, line);
  }
}

// ─── Write learner-global.css ────────────────────────────────────────────────
const learnerHeader = `/* =========================================================================
   learner-global.css
   Learner-route-specific CSS extracted from globals.css.
   Imported by: src/app/(app)/app/(learner)/layout.tsx
   DO NOT import this file from marketing or admin layouts.

   Contains: CAT exam, practice session, lesson detail, dashboard,
             review session, coach, study queue, question/option rendering,
             confidence controls, and learner-shell overrides.
   ========================================================================= */

`;

writeFileSync(LEARNER_DST, learnerHeader + learnerOut.join("\n").trimEnd() + "\n");
console.log(`\nWrote: ${LEARNER_DST}`);
console.log(`  Lines: ${learnerOut.length}  Bytes: ${Buffer.byteLength(learnerHeader + learnerOut.join("\n"), "utf8").toLocaleString()}`);

// ─── Write marketing-global.css ──────────────────────────────────────────────
const marketingHeader = `/* =========================================================================
   marketing-global.css
   Marketing-route-specific CSS extracted from globals.css.
   Imported by: src/app/(marketing)/layout.tsx (via marketing-styles.css)
   DO NOT import this file from learner or admin layouts.

   Contains: marketing surface/shell, hero patterns, home sections,
             marketing hub layouts, section typography, and marketing CTAs.
   ========================================================================= */

`;

writeFileSync(MARKETING_DST, marketingHeader + marketingOut.join("\n").trimEnd() + "\n");
console.log(`\nWrote: ${MARKETING_DST}`);
console.log(`  Lines: ${marketingOut.length}  Bytes: ${Buffer.byteLength(marketingHeader + marketingOut.join("\n"), "utf8").toLocaleString()}`);

// ─── Write pruned globals.css ─────────────────────────────────────────────────
// Trim leading/trailing extra blanks but preserve @imports at top
const prunedContent = keepLines.join("\n").trimEnd() + "\n";
writeFileSync(GLOBALS_DST, prunedContent);
console.log(`\nWrote: ${GLOBALS_DST}`);
console.log(`  Lines: ${keepLines.length}  Bytes: ${Buffer.byteLength(prunedContent, "utf8").toLocaleString()}`);

const savedBytes = learnerBytes + marketingBytes;
const remainingBytes = Buffer.byteLength(prunedContent, "utf8");
console.log(`\nSummary:`);
console.log(`  Extracted:  ~${(savedBytes/1024).toFixed(1)} KB`);
console.log(`  Remaining:  ${(remainingBytes/1024).toFixed(1)} KB`);
console.log(`  Reduction:  ${((savedBytes / (savedBytes + remainingBytes)) * 100).toFixed(1)}%`);
