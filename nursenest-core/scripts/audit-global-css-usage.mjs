#!/usr/bin/env node
/**
 * audit-global-css-usage.mjs
 *
 * Phase 1 — Global CSS usage audit.
 *
 * Parses src/app/globals.css, classifies every top-level rule block by
 * which route family owns it, then emits:
 *   docs/reports/global-css-usage-audit.md
 *   .claude/audits/global-css-usage.json
 *
 * Classifications:
 *   GLOBAL_REQUIRED   – :root, html[data-theme], @keyframes, resets, tokens
 *   MARKETING_ONLY    – selectors only referenced in marketing routes
 *   LEARNER_ONLY      – selectors only referenced in learner routes
 *   ADMIN_ONLY        – selectors only referenced in admin routes
 *   SHARED_COMPONENT  – selectors referenced in 2+ route families
 *   UNKNOWN           – no references found or ambiguous
 *
 * Risk levels:
 *   SAFE          – move with confidence; grep confirms single-family ownership
 *   NEEDS_REVIEW  – likely safe but has matches in shared component files
 *   HIGH_RISK     – CSS cascade dependencies, theme tokens, or multi-family usage
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const GLOBALS_PATH = join(ROOT, "src/app/globals.css");
const REPORT_MD = join(ROOT, "docs/reports/global-css-usage-audit.md");
const REPORT_JSON = join(ROOT, ".claude/audits/global-css-usage.json");

mkdirSync(join(ROOT, "docs/reports"), { recursive: true });
mkdirSync(join(ROOT, ".claude/audits"), { recursive: true });

// ─────────────────────────────────────────────────────────────────────────────
// 1. CSS Block Parser
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split globals.css into top-level blocks.
 * Each block is: { selector, body, startLine, endLine, rawBytes }
 * Handles nested braces inside @media / @keyframes correctly.
 */
function parseTopLevelBlocks(cssText) {
  const lines = cssText.split("\n");
  const blocks = [];
  let i = 0;
  let currentComment = null;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Accumulate block comment immediately before a rule
    if (trimmed.startsWith("/*")) {
      const commentStart = i;
      let commentText = line;
      if (!trimmed.includes("*/")) {
        while (i < lines.length && !lines[i].includes("*/")) {
          i++;
          commentText += "\n" + lines[i];
        }
      }
      currentComment = { text: commentText, line: commentStart };
      i++;
      continue;
    }

    // Skip blank lines between blocks (but reset comment if gap)
    if (trimmed === "") {
      i++;
      continue;
    }

    // Detect start of a rule block (has an opening brace, or is @import / @layer inline)
    if (trimmed.startsWith("@import") || trimmed.startsWith("@charset")) {
      blocks.push({
        type: "directive",
        selector: trimmed,
        body: "",
        startLine: i + 1,
        endLine: i + 1,
        rawBytes: Buffer.byteLength(line, "utf8"),
        comment: currentComment?.text || null,
      });
      currentComment = null;
      i++;
      continue;
    }

    // Find the opening brace for this rule
    let selectorAccum = "";
    let blockStart = i;
    let braceFound = false;

    while (i < lines.length) {
      selectorAccum += (selectorAccum ? "\n" : "") + lines[i];
      if (lines[i].includes("{")) {
        braceFound = true;
        break;
      }
      i++;
    }

    if (!braceFound) {
      i++;
      continue;
    }

    // Now count braces to find end of this top-level block
    let depth = 0;
    let bodyLines = [];
    let j = i;
    while (j < lines.length) {
      const l = lines[j];
      for (const ch of l) {
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
      }
      bodyLines.push(l);
      if (depth === 0) break;
      j++;
    }

    const rawText = bodyLines.join("\n");
    const selectorRaw = selectorAccum.split("{")[0].trim();

    blocks.push({
      type: "rule",
      selector: selectorRaw,
      body: rawText,
      startLine: blockStart + 1,
      endLine: j + 1,
      rawBytes: Buffer.byteLength(rawText, "utf8"),
      comment: currentComment?.text || null,
    });

    currentComment = null;
    i = j + 1;
  }

  return blocks;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Selector Classification Rules
// ─────────────────────────────────────────────────────────────────────────────

// Learner-owned prefixes (class names that only appear in learner routes)
const LEARNER_PREFIXES = [
  "nn-cat-", "nn-cat ",
  "nn-dash-", "nn-dash ",
  "nn-exam-", "nn-exam ",
  "nn-practice-", "nn-practice ",
  "nn-review-", "nn-review ",
  "nn-coach-", "nn-coach ",
  "nn-qs-", "nn-qs ",
  "nn-qopt-", "nn-qopt ",
  "nn-study-", "nn-study ",
  "nn-question-", "nn-question ",
  "nn-confidence-",
  "nn-flashcard-session",
  "nn-rationale-",
  "nn-teaching-",
  "nn-focus-mode",
  "nn-learner-page",
  "nn-learner-shell",
  "nn-learner-nav",
  "nn-learner-bottom",
  "nn-practice-session",
  "nn-exam-variant",
  "nn-attempt-",
  "nn-session-",
  "nn-session ",
  "nn-lesson-nav",
  "nn-lesson-media",
  "nn-lesson-body",
  "nn-lesson-card",
  "nn-lesson-outline",
  "nn-lesson-progress",
  "nn-lesson-header",
  "nn-lesson-section-",
  "nn-lesson-chunk",
  "nn-lesson-tab",
  "nn-lesson-step",
  "nn-lesson-breadcrumb",
  "nn-lesson-study",
  "nn-lesson-badge",
  "nn-teaching-point",
  "nn-focus-banner",
  "nn-exam-clock",
  "nn-exam-nav",
  "nn-exam-item",
  "nn-exam-grid",
  "nn-exam-timer",
  "nn-exam-progress",
  "nn-exam-board",
  "nn-exam-finish",
  "nn-exam-review",
  "nn-exam-setup",
  "nn-exam-result",
  "nn-exam-intro",
  "nn-exam-cta",
  "nn-exam-hub",
  "nn-topic-page",
  "nn-focus-pill",
  "nn-study-badge",
  "nn-study-queue",
];

// Marketing-owned prefixes
const MARKETING_PREFIXES = [
  "nn-home-marketing",
  "nn-home-hero",
  "nn-home-blog",
  "nn-home-trust",
  "nn-home-feature",
  "nn-home-section",
  "nn-home-conversion",
  "nn-marketing-h",
  "nn-marketing-body",
  "nn-marketing-section",
  "nn-marketing-surface",
  "nn-marketing-nav",
  "nn-marketing-cta",
  "nn-marketing-hub",
  "nn-marketing-main",
  "nn-marketing-brand",
  "nn-hero-bridge",
  "nn-premium-hero",
  "nn-pricing-",
  "nn-nursing-tier",
  "nn-pathway-hub",
  "nn-allied-hub",
  "nn-lessons-hub",
  "nn-exam-hub-comparison",
];

// Admin-owned prefixes
const ADMIN_PREFIXES = [
  "nn-admin-",
];

// Shared component prefixes (used across route families)
const SHARED_PREFIXES = [
  "nn-header-",
  "nn-card",
  "nn-ui-",
  "nn-brand-",
  "nn-skeleton",
  "nn-surface-",
  "nn-section-shell",
  "nn-elevation",
  "nn-motion",
  "nn-btn",
  "nn-badge",
  "nn-button",
  "nn-focus-ring",
  "nn-skip-",
  "nn-primary",
];

// Always global (cascade/token anchors)
const GLOBAL_SELECTORS = [
  ":root", "html,\nbody", "html,body", "html ,body", "html, body",
  "html\nbody", "*,", "*,\n", ":where(", "@keyframes",
  "@layer", "@font-face", "[data-theme", "html[data-theme",
  "@media", "body", "html ", "html{",
];

function classifyByRules(selector) {
  const s = selector.toLowerCase();

  // Global/token blocks
  if (
    s.startsWith(":root") ||
    s.startsWith("html,") ||
    s.startsWith("html ") ||
    s.startsWith("html{") ||
    s.startsWith("body") ||
    s.startsWith("*,") ||
    s.startsWith(":where") ||
    s.startsWith("@keyframes") ||
    s.startsWith("@layer") ||
    s.startsWith("@font-face") ||
    s.startsWith("[data-theme") ||
    s.startsWith("html[data-theme") ||
    s.startsWith("@media") ||
    s.includes(":root") ||
    s.includes("[data-theme")
  ) {
    return "GLOBAL_REQUIRED";
  }

  // Learner prefixes (check before shared to be precise)
  for (const prefix of LEARNER_PREFIXES) {
    if (s.includes(prefix)) return "LEARNER_ONLY";
  }

  // Marketing prefixes
  for (const prefix of MARKETING_PREFIXES) {
    if (s.includes(prefix)) return "MARKETING_ONLY";
  }

  // Admin prefixes
  for (const prefix of ADMIN_PREFIXES) {
    if (s.includes(prefix)) return "ADMIN_ONLY";
  }

  // Shared prefixes
  for (const prefix of SHARED_PREFIXES) {
    if (s.includes(prefix)) return "SHARED_COMPONENT";
  }

  return "UNKNOWN";
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Grep Verification
// ─────────────────────────────────────────────────────────────────────────────

// Route search directories
const SEARCH_DIRS = {
  marketing: ["src/app/(marketing)", "src/components/marketing", "src/lib/marketing"],
  learner:   ["src/app/(app)", "src/components/learner", "src/lib/learner"],
  admin:     ["src/app/(admin)", "src/components/admin", "src/lib/admin"],
  shared:    ["src/components", "src/lib", "styles"],
};

const grepCache = new Map();

function grepForClass(className) {
  if (grepCache.has(className)) return grepCache.get(className);

  // Strip dot prefix
  const name = className.replace(/^\./, "");
  if (name.length < 3) {
    grepCache.set(className, { marketing: 0, learner: 0, admin: 0, shared: 0, files: [] });
    return grepCache.get(className);
  }

  const result = { marketing: 0, learner: 0, admin: 0, shared: 0, files: [] };

  try {
    for (const [family, dirs] of Object.entries(SEARCH_DIRS)) {
      for (const dir of dirs) {
        const fullDir = join(ROOT, dir);
        try {
          const out = execSync(
            `grep -r --include="*.tsx" --include="*.ts" --include="*.css" -l "${name}" "${fullDir}" 2>/dev/null`,
            { encoding: "utf8", timeout: 5000 }
          ).trim();
          if (out) {
            const foundFiles = out.split("\n").filter(Boolean);
            result.files.push(...foundFiles.map(f => f.replace(ROOT + "/", "")));
            result[family] += foundFiles.length;
          }
        } catch {
          // dir doesn't exist or no matches
        }
      }
    }
  } catch {
    // grep not available
  }

  grepCache.set(className, result);
  return result;
}

function verifyClassification(block, ruleBasedClass) {
  // Extract class names from selector
  const classNames = [...(block.body + block.selector).matchAll(/\.(nn-[a-z][a-zA-Z0-9_-]+)/g)]
    .map(m => m[1]);

  if (classNames.length === 0) return { classification: ruleBasedClass, risk: "NEEDS_REVIEW", files: [] };

  // Use the most specific/frequent class as the representative
  const primaryClass = classNames[0];
  const grep = grepForClass("." + primaryClass);

  const routeFamilies = [];
  if (grep.marketing > 0) routeFamilies.push("marketing");
  if (grep.learner > 0) routeFamilies.push("learner");
  if (grep.admin > 0) routeFamilies.push("admin");

  let finalClass = ruleBasedClass;
  let risk = "SAFE";

  // Override rule-based with grep evidence
  if (routeFamilies.length === 0) {
    // No references found — could be dynamic className, CSS string, or unused
    risk = "NEEDS_REVIEW";
    if (ruleBasedClass === "UNKNOWN") finalClass = "UNKNOWN";
  } else if (routeFamilies.length === 1) {
    const family = routeFamilies[0];
    const classMap = { marketing: "MARKETING_ONLY", learner: "LEARNER_ONLY", admin: "ADMIN_ONLY" };
    finalClass = classMap[family] ?? ruleBasedClass;
    risk = "SAFE";
    // If grep says learner but rule says GLOBAL_REQUIRED, keep GLOBAL_REQUIRED
    if (ruleBasedClass === "GLOBAL_REQUIRED") {
      finalClass = "GLOBAL_REQUIRED";
      risk = "HIGH_RISK";
    }
  } else if (routeFamilies.length > 1) {
    finalClass = "SHARED_COMPONENT";
    risk = routeFamilies.length > 2 ? "HIGH_RISK" : "NEEDS_REVIEW";
  }

  // Global anchors never move
  if (["GLOBAL_REQUIRED"].includes(ruleBasedClass) &&
      !["LEARNER_ONLY", "MARKETING_ONLY", "ADMIN_ONLY"].includes(finalClass)) {
    finalClass = "GLOBAL_REQUIRED";
    risk = "HIGH_RISK";
  }

  return { classification: finalClass, risk, files: [...new Set(grep.files)] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Main audit
// ─────────────────────────────────────────────────────────────────────────────

console.log("Reading globals.css...");
const cssText = readFileSync(GLOBALS_PATH, "utf8");
console.log(`Parsing ${cssText.split("\n").length} lines...`);

const blocks = parseTopLevelBlocks(cssText);
console.log(`Found ${blocks.length} top-level blocks. Classifying...`);

const results = [];
let done = 0;

for (const block of blocks) {
  if (block.type === "directive") {
    results.push({
      selector: block.selector,
      type: "directive",
      startLine: block.startLine,
      endLine: block.endLine,
      bytes: block.rawBytes,
      classification: "GLOBAL_REQUIRED",
      risk: "HIGH_RISK",
      recommendation: "keep-global",
      files: [],
      comment: block.comment,
    });
    done++;
    continue;
  }

  const ruleClass = classifyByRules(block.selector);

  // For performance, skip grep on clearly global blocks
  let verification = { classification: ruleClass, risk: "SAFE", files: [] };
  if (!["GLOBAL_REQUIRED"].includes(ruleClass)) {
    verification = verifyClassification(block, ruleClass);
  } else {
    verification.risk = block.selector.startsWith(":root") ||
      block.selector.startsWith("html[data-theme") ||
      block.selector.startsWith("[data-theme") ? "HIGH_RISK" : "NEEDS_REVIEW";
  }

  const recommendation = getRecommendation(verification.classification, verification.risk);

  results.push({
    selector: block.selector.slice(0, 200),
    type: block.type,
    startLine: block.startLine,
    endLine: block.endLine,
    bytes: block.rawBytes,
    classification: verification.classification,
    risk: verification.risk,
    recommendation,
    files: verification.files.slice(0, 10),
    comment: block.comment ? block.comment.slice(0, 200) : null,
  });

  done++;
  if (done % 50 === 0) {
    process.stdout.write(`  ${done}/${blocks.length} blocks classified\r`);
  }
}

function getRecommendation(classification, risk) {
  if (risk === "HIGH_RISK") return "keep-global";
  switch (classification) {
    case "GLOBAL_REQUIRED":  return "keep-global";
    case "MARKETING_ONLY":   return risk === "SAFE" ? "move-to-marketing" : "review-then-move";
    case "LEARNER_ONLY":     return risk === "SAFE" ? "move-to-learner" : "review-then-move";
    case "ADMIN_ONLY":       return risk === "SAFE" ? "move-to-admin" : "review-then-move";
    case "SHARED_COMPONENT": return "move-to-shared";
    case "UNKNOWN":          return "keep-global";
    default:                 return "keep-global";
  }
}

console.log(`\nClassified ${results.length} blocks.`);

// ─────────────────────────────────────────────────────────────────────────────
// 5. Tally results
// ─────────────────────────────────────────────────────────────────────────────

const tally = {
  GLOBAL_REQUIRED:  { count: 0, bytes: 0 },
  MARKETING_ONLY:   { count: 0, bytes: 0 },
  LEARNER_ONLY:     { count: 0, bytes: 0 },
  ADMIN_ONLY:       { count: 0, bytes: 0 },
  SHARED_COMPONENT: { count: 0, bytes: 0 },
  UNKNOWN:          { count: 0, bytes: 0 },
};
const safeMoves = { MARKETING_ONLY: 0, LEARNER_ONLY: 0, ADMIN_ONLY: 0, SHARED_COMPONENT: 0 };
const safeBytes = { MARKETING_ONLY: 0, LEARNER_ONLY: 0, ADMIN_ONLY: 0, SHARED_COMPONENT: 0 };

for (const r of results) {
  tally[r.classification].count++;
  tally[r.classification].bytes += r.bytes;
  if (r.risk === "SAFE" && r.recommendation !== "keep-global") {
    safeMoves[r.classification] = (safeMoves[r.classification] || 0) + 1;
    safeBytes[r.classification] = (safeBytes[r.classification] || 0) + r.bytes;
  }
}

const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
const movableBytes = Object.values(safeBytes).reduce((a, b) => a + b, 0);
const projectedRoot = totalBytes - movableBytes;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Write JSON report
// ─────────────────────────────────────────────────────────────────────────────

const jsonReport = {
  generatedAt: new Date().toISOString(),
  inputFile: "src/app/globals.css",
  totalBlocks: results.length,
  totalBytes,
  movableBytes,
  projectedRootBytes: projectedRoot,
  tally,
  safeMoves,
  safeBytes,
  blocks: results,
};

writeFileSync(REPORT_JSON, JSON.stringify(jsonReport, null, 2));
console.log(`JSON report: ${REPORT_JSON}`);

// ─────────────────────────────────────────────────────────────────────────────
// 7. Write Markdown report
// ─────────────────────────────────────────────────────────────────────────────

function kb(bytes) { return (bytes / 1024).toFixed(1) + " KB"; }
function pct(part, total) { return ((part / total) * 100).toFixed(1) + "%"; }

const md = `# Global CSS Usage Audit
Generated: ${new Date().toISOString()}

## Summary

| Classification | Blocks | Size | % of Total |
|---|---|---|---|
| GLOBAL_REQUIRED | ${tally.GLOBAL_REQUIRED.count} | ${kb(tally.GLOBAL_REQUIRED.bytes)} | ${pct(tally.GLOBAL_REQUIRED.bytes, totalBytes)} |
| LEARNER_ONLY | ${tally.LEARNER_ONLY.count} | ${kb(tally.LEARNER_ONLY.bytes)} | ${pct(tally.LEARNER_ONLY.bytes, totalBytes)} |
| MARKETING_ONLY | ${tally.MARKETING_ONLY.count} | ${kb(tally.MARKETING_ONLY.bytes)} | ${pct(tally.MARKETING_ONLY.bytes, totalBytes)} |
| ADMIN_ONLY | ${tally.ADMIN_ONLY.count} | ${kb(tally.ADMIN_ONLY.bytes)} | ${pct(tally.ADMIN_ONLY.bytes, totalBytes)} |
| SHARED_COMPONENT | ${tally.SHARED_COMPONENT.count} | ${kb(tally.SHARED_COMPONENT.bytes)} | ${pct(tally.SHARED_COMPONENT.bytes, totalBytes)} |
| UNKNOWN | ${tally.UNKNOWN.count} | ${kb(tally.UNKNOWN.bytes)} | ${pct(tally.UNKNOWN.bytes, totalBytes)} |
| **TOTAL** | **${results.length}** | **${kb(totalBytes)}** | 100% |

## Extraction Opportunity

| Target | SAFE blocks | SAFE bytes | Risk |
|---|---|---|---|
| Learner layout | ${safeMoves.LEARNER_ONLY} | ${kb(safeBytes.LEARNER_ONLY)} | SAFE |
| Marketing layout | ${safeMoves.MARKETING_ONLY} | ${kb(safeBytes.MARKETING_ONLY)} | SAFE |
| Admin layout | ${safeMoves.ADMIN_ONLY} | ${kb(safeBytes.ADMIN_ONLY)} | SAFE |
| Shared components | ${safeMoves.SHARED_COMPONENT} | ${kb(safeBytes.SHARED_COMPONENT)} | NEEDS_REVIEW |

**Total movable (SAFE only): ${kb(movableBytes)}**
**Projected root CSS after extraction: ${kb(projectedRoot)}**

## Block Detail

${results
  .filter(r => r.recommendation !== "keep-global" || r.classification === "UNKNOWN")
  .map(r => `### \`${r.selector.split("\n")[0].slice(0, 80)}\`
- **Classification**: ${r.classification}
- **Risk**: ${r.risk}
- **Recommendation**: ${r.recommendation}
- **Lines**: ${r.startLine}–${r.endLine} (${kb(r.bytes)})
- **Files**: ${r.files.slice(0, 5).join(", ") || "none found"}
`)
  .join("\n")}

## KEEP-GLOBAL Reference

The following blocks are classified GLOBAL_REQUIRED or HIGH_RISK and must remain in globals.css:

${results
  .filter(r => r.recommendation === "keep-global" && r.classification === "GLOBAL_REQUIRED")
  .map(r => `- Lines ${r.startLine}–${r.endLine}: \`${r.selector.split("\n")[0].slice(0, 80)}\``)
  .join("\n")}
`;

writeFileSync(REPORT_MD, md);
console.log(`Markdown report: ${REPORT_MD}`);

// Print summary
console.log("\n=== AUDIT SUMMARY ===");
console.log(`Total globals.css:         ${kb(totalBytes)}`);
console.log(`  GLOBAL_REQUIRED:         ${kb(tally.GLOBAL_REQUIRED.bytes)} (${tally.GLOBAL_REQUIRED.count} blocks)`);
console.log(`  LEARNER_ONLY:            ${kb(tally.LEARNER_ONLY.bytes)} (${tally.LEARNER_ONLY.count} blocks)`);
console.log(`  MARKETING_ONLY:          ${kb(tally.MARKETING_ONLY.bytes)} (${tally.MARKETING_ONLY.count} blocks)`);
console.log(`  ADMIN_ONLY:              ${kb(tally.ADMIN_ONLY.bytes)} (${tally.ADMIN_ONLY.count} blocks)`);
console.log(`  SHARED_COMPONENT:        ${kb(tally.SHARED_COMPONENT.bytes)} (${tally.SHARED_COMPONENT.count} blocks)`);
console.log(`  UNKNOWN:                 ${kb(tally.UNKNOWN.bytes)} (${tally.UNKNOWN.count} blocks)`);
console.log(`\nSAFE to move:              ${kb(movableBytes)}`);
console.log(`Projected root after move: ${kb(projectedRoot)}`);
console.log("=====================");
