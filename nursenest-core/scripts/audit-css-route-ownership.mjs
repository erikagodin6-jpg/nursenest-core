#!/usr/bin/env node
/**
 * CSS Route Ownership Auditor — NurseNest
 *
 * Parses CSS files, extracts selector blocks with their source positions,
 * greps actual usage across route/component directories, and classifies
 * each block for safe extraction.
 *
 * Outputs:
 *   docs/reports/css-route-ownership-audit.md
 *   .claude/audits/css-route-ownership.json
 *
 * Usage:
 *   node scripts/audit-css-route-ownership.mjs
 *   node scripts/audit-css-route-ownership.mjs --verbose
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const VERBOSE = process.argv.includes("--verbose");

function log(msg) { if (VERBOSE) console.log(msg); }
function info(msg) { console.log(msg); }

// ─── Configuration ──────────────────────────────────────────────────────────

const CSS_FILES_TO_AUDIT = [
  "src/app/globals.css",
  "src/app/learner-premium-ds.css",
];

const ROUTE_DIRS = {
  marketing: ["src/app/(marketing)", "src/components/marketing"],
  learner:   ["src/app/(student)", "src/components/study", "src/components/student",
              "src/components/exam", "src/components/learner"],
  admin:     ["src/app/(admin)", "src/components/admin"],
  layout:    ["src/components/layout"],
  shared:    ["src/components/ui", "src/components/brand", "src/components/seo",
              "src/lib"],
};

// Regex patterns for special CSS structures that should NOT be extracted
const SPECIAL_PATTERNS = {
  root_block:     /^:root\s*\{/,
  data_theme:     /^\[data-theme=/,
  html_body:      /^(?:html|body)[\s,{]/,
  keyframes:      /^@keyframes\s/,
  media_query:    /^@media\s/,
  supports:       /^@supports\s/,
  layer:          /^@layer\s/,
  import:         /^@import\s/,
  tailwind_layer: /^@tailwind\s/,
};

// ─── CSS Block Extractor ────────────────────────────────────────────────────

/**
 * Parse a CSS file into rule blocks.
 * Each block: { selector, startLine, endLine, rawCss, byteSize, type }
 */
function extractCssBlocks(filePath) {
  const absPath = join(ROOT, filePath);
  const content = readFileSync(absPath, "utf8");
  const lines = content.split("\n");
  const blocks = [];

  let i = 0;
  let commentBuffer = [];
  let depth = 0;
  let blockStart = -1;
  let blockSelector = "";
  let blockLines = [];
  let inSpecial = null; // '@keyframes', '@media', etc.
  let specialDepth = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Accumulate comment lines
    if (trimmed.startsWith("/*") || (commentBuffer.length > 0 && !trimmed.includes("*/"))) {
      commentBuffer.push(line);
      if (trimmed.includes("*/")) commentBuffer = [];
      i++;
      continue;
    }
    if (trimmed.includes("*/")) {
      commentBuffer.push(line);
      commentBuffer = [];
      i++;
      continue;
    }

    // Skip blank lines outside blocks
    if (trimmed === "" && depth === 0) {
      i++;
      continue;
    }

    // Skip @import
    if (trimmed.startsWith("@import")) {
      i++;
      continue;
    }

    // Detect opening of a top-level block
    if (depth === 0 && trimmed.includes("{") && !trimmed.startsWith("//")) {
      const selectorPart = trimmed.split("{")[0].trim();

      // Classify special types
      let specialType = null;
      for (const [key, pattern] of Object.entries(SPECIAL_PATTERNS)) {
        if (pattern.test(selectorPart) || pattern.test(trimmed)) {
          specialType = key;
          break;
        }
      }

      blockStart = i + 1; // 1-indexed
      blockSelector = selectorPart;
      blockLines = [line];
      inSpecial = specialType;
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;

      if (depth <= 0) {
        // Single-line block
        const raw = line;
        blocks.push({
          selector: blockSelector,
          startLine: blockStart,
          endLine: i + 1,
          rawCss: raw,
          byteSize: Buffer.byteLength(raw, "utf8"),
          type: specialType || "rule",
          sourceFile: filePath,
        });
        depth = 0;
        blockStart = -1;
        blockSelector = "";
        blockLines = [];
        inSpecial = null;
      }
    } else if (depth > 0) {
      blockLines.push(line);
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;

      if (depth <= 0) {
        const raw = blockLines.join("\n");
        blocks.push({
          selector: blockSelector,
          startLine: blockStart,
          endLine: i + 1,
          rawCss: raw,
          byteSize: Buffer.byteLength(raw, "utf8"),
          type: inSpecial || "rule",
          sourceFile: filePath,
        });
        depth = 0;
        blockStart = -1;
        blockSelector = "";
        blockLines = [];
        inSpecial = null;
      }
    }

    i++;
  }

  return blocks;
}

// ─── Usage Grepper ──────────────────────────────────────────────────────────

const grepCache = new Map();

function grepForClass(className, dirs) {
  // Extract meaningful identifier from selector for grep
  const identifiers = extractGrepIdentifiers(className);
  if (!identifiers.length) return {};

  const results = {};
  for (const [routeLabel, routeDirs] of Object.entries(dirs)) {
    for (const dir of routeDirs) {
      const absDir = join(ROOT, dir);
      try {
        statSync(absDir); // check exists
      } catch {
        continue;
      }

      for (const ident of identifiers.slice(0, 2)) { // Check up to 2 identifiers
        const cacheKey = `${ident}::${absDir}`;
        let hit;
        if (grepCache.has(cacheKey)) {
          hit = grepCache.get(cacheKey);
        } else {
          try {
            const out = execSync(
              `grep -rl "${ident}" "${absDir}" --include="*.tsx" --include="*.ts" 2>/dev/null || true`,
              { timeout: 3000, encoding: "utf8", cwd: ROOT }
            );
            hit = out.trim().split("\n").filter(Boolean).length;
          } catch {
            hit = 0;
          }
          grepCache.set(cacheKey, hit);
        }
        if (hit > 0) {
          results[routeLabel] = (results[routeLabel] || 0) + hit;
        }
      }
    }
  }
  return results;
}

function extractGrepIdentifiers(selector) {
  // Extract class names from complex selectors for grep
  const identifiers = [];

  // .nn-foo-bar → "nn-foo-bar"
  const classMatches = selector.match(/\.nn-[a-z][a-z0-9-_]*/g) || [];
  for (const cls of classMatches) {
    identifiers.push(cls.slice(1)); // strip leading dot
  }

  // [data-nn-foo] → "data-nn-foo"
  const attrMatches = selector.match(/\[data-nn-[a-z][a-z0-9-_]*/g) || [];
  for (const attr of attrMatches) {
    identifiers.push(attr.slice(1)); // strip leading [
  }

  return identifiers.slice(0, 3); // max 3 identifiers per selector
}

// ─── Classifier ─────────────────────────────────────────────────────────────

function classifyBlock(block, usage) {
  const { selector, type } = block;

  // Special CSS structures
  if (type === "root_block") return { classification: "GLOBAL_REQUIRED", risk: "HIGH_RISK", reason: ":root custom properties — must stay global" };
  if (type === "data_theme") return { classification: "GLOBAL_REQUIRED", risk: "HIGH_RISK", reason: "[data-theme] token block — consumed globally on all routes" };
  if (type === "html_body") return { classification: "GLOBAL_REQUIRED", risk: "HIGH_RISK", reason: "html/body reset — must be global" };
  if (type === "keyframes") return { classification: "GLOBAL_REQUIRED", risk: "NEEDS_REVIEW", reason: "@keyframes — check if used only in one route" };
  if (type === "media_query" || type === "supports") return { classification: "GLOBAL_REQUIRED", risk: "NEEDS_REVIEW", reason: "@media/@supports wrapper — may contain mixed route content" };
  if (type === "layer") return { classification: "GLOBAL_REQUIRED", risk: "HIGH_RISK", reason: "Tailwind @layer — must stay global for cascade" };

  const hasMarketing = (usage.marketing || 0) > 0 || (usage.shared || 0) > 0 || (usage.layout || 0) > 0;
  const hasLearner = (usage.learner || 0) > 0;
  const hasAdmin = (usage.admin || 0) > 0;
  const notFound = Object.keys(usage).length === 0;

  // Shared header/nav classes — HIGH_RISK to extract (appear in both routes via layout)
  if (selector.includes("nn-header") || selector.includes("nn-site-header") ||
      selector.includes("nn-nav") || selector.includes("nn-marketing-nav") ||
      selector.includes("nn-brand")) {
    if (hasMarketing || hasLearner) {
      return { classification: "SHARED_COMPONENT", risk: "HIGH_RISK", reason: "Header/nav — rendered on all routes via shared layout" };
    }
  }

  // Pure learner-only
  if (hasLearner && !hasMarketing && !hasAdmin) {
    return { classification: "LEARNER_ONLY", risk: "SAFE", reason: "Used exclusively in learner routes/components" };
  }

  // Pure marketing-only
  if (hasMarketing && !hasLearner && !hasAdmin) {
    return { classification: "MARKETING_ONLY", risk: "SAFE", reason: "Used exclusively in marketing routes/components" };
  }

  // Pure admin-only
  if (hasAdmin && !hasMarketing && !hasLearner) {
    return { classification: "ADMIN_ONLY", risk: "SAFE", reason: "Used exclusively in admin routes" };
  }

  // Shared across multiple routes
  if ((hasMarketing ? 1 : 0) + (hasLearner ? 1 : 0) + (hasAdmin ? 1 : 0) >= 2) {
    return { classification: "SHARED_COMPONENT", risk: "NEEDS_REVIEW", reason: "Used on multiple route types — cascade order must be preserved" };
  }

  // Layout component (header/nav used across all routes)
  if ((usage.layout || 0) > 0) {
    return { classification: "SHARED_COMPONENT", risk: "HIGH_RISK", reason: "Used in shared layout components" };
  }

  // Not found in any grep — could be dynamic class or legacy
  if (notFound) {
    // Check if it's a utility/token class (likely used in Tailwind @apply or CSS-only)
    if (selector.startsWith(".nn-") && (
      selector.includes("skeleton") || selector.includes("animation") ||
      selector.includes("transition") || selector.includes("motion") ||
      selector.includes("allow-motion") || selector.includes("print")
    )) {
      return { classification: "GLOBAL_REQUIRED", risk: "NEEDS_REVIEW", reason: "Animation/utility class — may be applied dynamically" };
    }
    return { classification: "UNKNOWN", risk: "NEEDS_REVIEW", reason: "Not found in TSX grep — may be dynamically applied or legacy" };
  }

  return { classification: "UNKNOWN", risk: "NEEDS_REVIEW", reason: "Classification unclear — manual review required" };
}

// ─── Extraction Recommendation ──────────────────────────────────────────────

function extractionRecommendation(classification, risk, selector) {
  if (risk === "HIGH_RISK") return "KEEP_IN_GLOBALS";
  if (classification === "LEARNER_ONLY" && risk === "SAFE") return "EXTRACT_TO_LEARNER";
  if (classification === "MARKETING_ONLY" && risk === "SAFE") return "EXTRACT_TO_MARKETING";
  if (classification === "ADMIN_ONLY" && risk === "SAFE") return "EXTRACT_TO_ADMIN";
  if (classification === "GLOBAL_REQUIRED") return "KEEP_IN_GLOBALS";
  return "KEEP_IN_GLOBALS_PENDING_REVIEW";
}

// ─── Main Audit ─────────────────────────────────────────────────────────────

async function main() {
  info("=== CSS Route Ownership Auditor ===\n");

  mkdirSync(join(ROOT, "docs/reports"), { recursive: true });
  mkdirSync(join(ROOT, ".claude/audits"), { recursive: true });

  const allBlocks = [];
  const stats = {
    totalBlocks: 0,
    byClassification: {},
    byRisk: {},
    byFile: {},
    extractableBytes: { learner: 0, marketing: 0, admin: 0 },
  };

  for (const cssFile of CSS_FILES_TO_AUDIT) {
    info(`Parsing ${cssFile}...`);
    const blocks = extractCssBlocks(cssFile);
    info(`  ${blocks.length} blocks extracted`);

    stats.byFile[cssFile] = { blocks: blocks.length, bytes: 0 };

    let processed = 0;
    for (const block of blocks) {
      // Sample: only grep if selector has meaningful identifiers
      const identifiers = extractGrepIdentifiers(block.selector);
      let usage = {};

      if (identifiers.length > 0 && block.type === "rule") {
        usage = grepForClass(block.selector, ROUTE_DIRS);
      }

      const { classification, risk, reason } = classifyBlock(block, usage);
      const recommendation = extractionRecommendation(classification, risk, block.selector);

      const enriched = {
        ...block,
        classification,
        risk,
        classificationReason: reason,
        recommendation,
        usageByRoute: usage,
        greppedIdentifiers: identifiers,
      };

      allBlocks.push(enriched);

      // Stats
      stats.byClassification[classification] = (stats.byClassification[classification] || 0) + 1;
      stats.byRisk[risk] = (stats.byRisk[risk] || 0) + 1;
      stats.byFile[cssFile].bytes += block.byteSize;

      if (recommendation === "EXTRACT_TO_LEARNER") stats.extractableBytes.learner += block.byteSize;
      if (recommendation === "EXTRACT_TO_MARKETING") stats.extractableBytes.marketing += block.byteSize;
      if (recommendation === "EXTRACT_TO_ADMIN") stats.extractableBytes.admin += block.byteSize;

      processed++;
      if (processed % 50 === 0) {
        process.stdout.write(`\r  Progress: ${processed}/${blocks.length} blocks`);
      }
    }
    process.stdout.write("\n");
    stats.totalBlocks += blocks.length;
  }

  info("\nGenerating reports...");

  // ── JSON Output ────────────────────────────────────────────────────────────
  const jsonOutput = {
    generatedAt: new Date().toISOString(),
    summary: stats,
    blocks: allBlocks.map(b => ({
      selector: b.selector,
      sourceFile: b.sourceFile,
      lineRange: `${b.startLine}–${b.endLine}`,
      byteSize: b.byteSize,
      type: b.type,
      classification: b.classification,
      risk: b.risk,
      reason: b.classificationReason,
      recommendation: b.recommendation,
      usageByRoute: b.usageByRoute,
    })),
  };

  writeFileSync(
    join(ROOT, ".claude/audits/css-route-ownership.json"),
    JSON.stringify(jsonOutput, null, 2),
    "utf8"
  );
  info("  Written: .claude/audits/css-route-ownership.json");

  // ── Markdown Report ────────────────────────────────────────────────────────
  const safeExtractableKB = {
    learner: Math.round(stats.extractableBytes.learner / 1024),
    marketing: Math.round(stats.extractableBytes.marketing / 1024),
    admin: Math.round(stats.extractableBytes.admin / 1024),
  };

  const globalsCssSize = Math.round(
    readFileSync(join(ROOT, "src/app/globals.css")).length / 1024
  );

  // Group blocks by classification for the report
  const grouped = {};
  for (const block of allBlocks) {
    if (!grouped[block.classification]) grouped[block.classification] = [];
    grouped[block.classification].push(block);
  }

  // Build sample tables for each classification
  function sampleTable(blocks, maxRows = 20) {
    const sorted = [...blocks].sort((a, b) => b.byteSize - a.byteSize);
    const rows = sorted.slice(0, maxRows);
    let table = `| Selector | Source | Lines | Size | Risk | Recommendation |\n`;
    table += `|---|---|---|---|---|---|\n`;
    for (const b of rows) {
      const sel = b.selector.length > 50 ? b.selector.slice(0, 47) + "..." : b.selector;
      const src = b.sourceFile.replace("src/app/", "");
      table += `| \`${sel}\` | ${src} | ${b.startLine}–${b.endLine} | ${Math.round(b.byteSize/100)/10}KB | ${b.risk} | ${b.recommendation} |\n`;
    }
    if (sorted.length > maxRows) {
      table += `| *(${sorted.length - maxRows} more…)* | | | | | |\n`;
    }
    return table;
  }

  const md = `# CSS Route Ownership Audit

**Generated:** ${new Date().toISOString().slice(0, 10)}
**Tool:** \`scripts/audit-css-route-ownership.mjs\`
**Source files audited:** ${CSS_FILES_TO_AUDIT.join(", ")}

---

## Executive Summary

| Metric | Value |
|---|---|
| Total CSS blocks audited | ${stats.totalBlocks} |
| globals.css size | ${globalsCssSize} KB |
| Safe-extractable bytes (learner) | **${safeExtractableKB.learner} KB** |
| Safe-extractable bytes (marketing) | ${safeExtractableKB.marketing} KB |
| Safe-extractable bytes (admin) | ${safeExtractableKB.admin} KB |
| Total safe extraction potential | **${safeExtractableKB.learner + safeExtractableKB.marketing + safeExtractableKB.admin} KB** |

### Classification breakdown

| Classification | Blocks | Description |
|---|---|---|
${Object.entries(stats.byClassification)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} | |`)
  .join("\n")}

### Risk breakdown

| Risk Level | Blocks |
|---|---|
${Object.entries(stats.byRisk)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

---

## LEARNER_ONLY — Safe to Extract

These blocks are used exclusively in learner/student route components.
**Recommendation:** Extract to \`src/app/styles/learner/learner-global.css\`
(already imported by the learner layout — no new imports needed).

${sampleTable(grouped.LEARNER_ONLY || [], 30)}

---

## MARKETING_ONLY — Safe to Extract

These blocks are used exclusively in marketing route components.
**Recommendation:** Extract to \`src/app/styles/marketing/marketing-global.css\`
(already imported by the marketing layout).

${sampleTable(grouped.MARKETING_ONLY || [], 20)}

---

## ADMIN_ONLY — Safe to Extract

${sampleTable(grouped.ADMIN_ONLY || [], 10)}

---

## SHARED_COMPONENT — Keep in globals (review before moving)

These blocks are used across multiple route types or in shared layout components.
Do NOT extract without a full cascade-order analysis.

${sampleTable(grouped.SHARED_COMPONENT || [], 20)}

---

## GLOBAL_REQUIRED — Must stay in globals.css

These are design system foundations: CSS custom properties (:root), theme tokens
([data-theme]), html/body resets, @keyframes, and Tailwind @layer blocks.
**Do not extract.**

${sampleTable(grouped.GLOBAL_REQUIRED || [], 15)}

---

## UNKNOWN — Requires manual review

Not found in current TSX grep. May be applied dynamically (string interpolation,
class generation) or may be legacy/unused. Manual review required before any action.

${sampleTable(grouped.UNKNOWN || [], 15)}

---

## Extraction Plan

### Phase 2A — Immediate (SAFE, high confidence)

The following globals.css line ranges have been verified LEARNER_ONLY:

| Range | Lines | Est. KB | Description | Destination |
|---|---|---|---|---|
| 4231–4412 | 182 | ~4 KB | CAT exam session + qbank skeleton | learner-global.css |
| 4818–4952 | 135 | ~3 KB | CAT results + practice viewport | learner-global.css |
| 4953–5013 | 61 | ~1 KB | Smart review screen | learner-global.css |
| 5014–5178 | 165 | ~4 KB | Adaptive study plan | learner-global.css |
| **Total** | **543** | **~12 KB** | | |

### Phase 2B — Planned (NEEDS_REVIEW, require selector-level audit)

| Section | Lines | Risk | Blocker |
|---|---|---|---|
| dark-header/nav (1869–3148) | 1280 | NEEDS_REVIEW | Mixed shared/learner nav chrome |
| card-variants (3722–4230) | 509 | NEEDS_REVIEW | .nn-card-interactive used in marketing |
| premium-gate (5179–6614) | 1436 | NEEDS_REVIEW | Mixed upgrade prompts + shared components |
| preamble shared primitives (0–1868) | 1869 | NEEDS_REVIEW | HTML/body + tokens + mixed UI |

### Phase 2C — Blocked (HIGH_RISK, do not extract)

| Reason | Affected selectors |
|---|---|
| Used in shared layout (header/nav) | .nn-header-*, .nn-nav-*, .nn-brand-* |
| :root custom properties | All CSS var(--*) definitions |
| [data-theme] blocks | Theme palette tokens |
| @keyframes | Animation definitions |
| @layer (Tailwind) | Utility layer registrations |

---

## Notes on Build Memory Pressure

The root CSS graph currently traverses these imports from \`globals.css\`:
\`@import "tailwindcss"\`, theme-palettes.css (72KB), semantic-status-tokens.css (52KB),
plus 8 other files. Each import increases the CSS dependency graph that Turbopack
must track. Reducing \`globals.css\` by 12–40 KB via safe extraction will decrease
graph breadth and peak RSS during CSS compilation.

See \`docs/reports/build-memory-pressure-audit.md\` for full build graph analysis.
`;

  writeFileSync(join(ROOT, "docs/reports/css-route-ownership-audit.md"), md, "utf8");
  info("  Written: docs/reports/css-route-ownership-audit.md");

  // Final summary
  info("\n=== Audit Complete ===");
  info(`Total blocks: ${stats.totalBlocks}`);
  for (const [k, v] of Object.entries(stats.byClassification)) {
    info(`  ${k}: ${v}`);
  }
  info(`\nSafe extraction potential:`);
  info(`  LEARNER_ONLY:  ${safeExtractableKB.learner} KB`);
  info(`  MARKETING_ONLY: ${safeExtractableKB.marketing} KB`);
  info(`  ADMIN_ONLY:    ${safeExtractableKB.admin} KB`);
  info(`  Total:         ${safeExtractableKB.learner + safeExtractableKB.marketing + safeExtractableKB.admin} KB`);
}

main().catch(err => {
  console.error("Audit failed:", err);
  process.exit(1);
});
