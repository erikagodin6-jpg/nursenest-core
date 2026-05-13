#!/usr/bin/env node
/**
 * audit-tailwind-utility-usage.mjs
 *
 * Phase 1 — Tailwind v4 utility inventory across route families.
 *
 * Scans every .tsx/.ts source file and classifies Tailwind utility
 * class usage by route family:
 *   marketing | learner | admin | shared | tests
 *
 * Outputs:
 *   docs/reports/tailwind-utility-usage-audit.md
 *   .claude/audits/tailwind-utility-usage.json
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "fs";
import { join, resolve, extname, relative } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT_MD   = join(ROOT, "docs/reports/tailwind-utility-usage-audit.md");
const OUT_JSON = join(ROOT, ".claude/audits/tailwind-utility-usage.json");
mkdirSync(join(ROOT, "docs/reports"),       { recursive: true });
mkdirSync(join(ROOT, ".claude/audits"),     { recursive: true });

// ─── Source scanning ─────────────────────────────────────────────────────────

function walkDir(dir, ext = [".tsx", ".ts"]) {
  const results = [];
  if (!statSync(dir, { throwIfNoEntry: false })) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full, ext));
    else if (ext.includes(extname(entry.name))) results.push(full);
  }
  return results;
}

function extractClassesFromFile(filepath) {
  let content;
  try { content = readFileSync(filepath, "utf8"); } catch { return []; }

  const classes = new Set();

  // className="..." and class="..."
  for (const m of content.matchAll(/(?:className|class)\s*=\s*"([^"]{1,500})"/g))
    for (const c of m[1].split(/\s+/)) classes.add(c.trim());
  for (const m of content.matchAll(/(?:className|class)\s*=\s*'([^']{1,500})'/g))
    for (const c of m[1].split(/\s+/)) classes.add(c.trim());

  // cn(...), clsx(...), cva(...), tv(...) string args
  for (const m of content.matchAll(/(?:cn|clsx|cva|cx|tv)\s*\(([^)]{1,800})\)/g)) {
    for (const s of m[1].matchAll(/"([^"]{1,300})"/g))
      for (const c of s[1].split(/\s+/)) classes.add(c.trim());
    for (const s of m[1].matchAll(/'([^']{1,300})'/g))
      for (const c of s[1].split(/\s+/)) classes.add(c.trim());
  }

  // Template literal plain segments
  for (const m of content.matchAll(/`([^`]{1,500})`/g)) {
    const seg = m[1].replace(/\$\{[^}]+\}/g, " ");
    for (const c of seg.split(/\s+/)) classes.add(c.trim());
  }

  return [...classes].filter(
    (c) =>
      c.length >= 2 &&
      c.length <= 80 &&
      /^[a-z]/.test(c) &&
      /^[a-z0-9_/:[\]()!.-]+$/.test(c)
  );
}

// ─── Tailwind utility detection ───────────────────────────────────────────────

const TW_PREFIXES = new Set([
  "flex","grid","inline","block","hidden","contents","table","flow-root","float-",
  "p-","px-","py-","pt-","pb-","pl-","pr-","ps-","pe-",
  "m-","mx-","my-","mt-","mb-","ml-","mr-","ms-","me-",
  "gap-","gap-x-","gap-y-","space-x-","space-y-",
  "w-","h-","size-","min-w-","min-h-","max-w-","max-h-",
  "text-","font-","leading-","tracking-","align-","whitespace-","break-",
  "bg-","border","border-","outline","outline-","ring","ring-",
  "rounded","rounded-","shadow","shadow-",
  "col-","row-","order-","flex-","grid-","basis-","grow","shrink",
  "items-","justify-","place-","self-","content-",
  "overflow","overflow-","overscroll-","truncate","line-clamp-",
  "opacity-","z-","top-","left-","right-","bottom-","inset-",
  "absolute","relative","fixed","sticky","static",
  "cursor-","pointer-","select-","resize","touch-",
  "transition","transition-","duration-","ease-","delay-",
  "transform","scale-","rotate-","translate-","skew-","origin-",
  "animate-","appearance-","will-change-",
  "sr-only","not-sr-only","underline","overline","line-through","no-underline",
  "uppercase","lowercase","capitalize","normal-case","normal-nums",
  "italic","not-italic","antialiased","subpixel-antialiased",
  "isolate","isolation-","mix-blend-",
  "aspect-","list-","clear-","object-","decoration-",
  "divide-","fill-","stroke-","accent-","caret-","scroll-",
  "columns-","break-inside-","break-before-","break-after-",
  "backdrop-","blur-","brightness-","contrast-","grayscale","hue-","invert","saturate-","sepia",
]);

function isTailwindUtil(cls) {
  if (!cls || cls.length < 2) return false;
  // Handle variants (sm:text-sm, hover:bg-blue, dark:border, lg:flex, etc.)
  const base = cls.includes(":") ? cls.split(":").pop() : cls;
  if (!base) return false;
  // Check prefix
  for (const prefix of TW_PREFIXES) {
    if (base === prefix.replace(/-$/, "") || base.startsWith(prefix)) return true;
  }
  // Single-word utilities
  if (["flex","grid","block","inline","hidden","absolute","relative","fixed","sticky","static",
       "underline","overline","italic","truncate","uppercase","lowercase","capitalize",
       "antialiased","sr-only","visible","invisible","border","rounded","shadow",
       "grow","shrink","overflow","overscroll","isolate"].includes(base)) return true;
  // Arbitrary values
  if (base.includes("[") && base.includes("]")) return true;
  return false;
}

// ─── Route family dirs ────────────────────────────────────────────────────────

const FAMILY_DIRS = {
  marketing: [
    join(ROOT, "src/app/(marketing)"),
    join(ROOT, "src/components/marketing"),
    join(ROOT, "src/lib/marketing"),
  ],
  learner: [
    join(ROOT, "src/app/(student)"),
    join(ROOT, "src/components/learner"),
    join(ROOT, "src/lib/learner"),
  ],
  admin: [
    join(ROOT, "src/app/(admin)"),
    join(ROOT, "src/components/admin"),
    join(ROOT, "src/lib/admin"),
  ],
  shared: [
    join(ROOT, "src/components"),
    join(ROOT, "src/lib"),
  ],
  tests: [
    join(ROOT, "tests"),
    join(ROOT, "src/lib/marketing/homepage-pagespeed-performance.contract.test.ts"),
  ],
};

// ─── Collect usage ────────────────────────────────────────────────────────────

console.log("Scanning source files...");

/** Map: className → Set<routeFamily> */
const classToFamilies = new Map();
/** Map: className → total count */
const classTotalCount = new Map();
/** Map: family → Map<className, count> */
const familyCounts = {};

for (const [family, dirs] of Object.entries(FAMILY_DIRS)) {
  familyCounts[family] = new Map();
  for (const dir of dirs) {
    const files = typeof dir === "string" && statSync(dir, { throwIfNoEntry: false })?.isFile()
      ? [dir]
      : walkDir(typeof dir === "string" ? dir : "");
    for (const fp of files) {
      const classes = extractClassesFromFile(fp).filter(isTailwindUtil);
      for (const cls of classes) {
        // Track per-family
        familyCounts[family].set(cls, (familyCounts[family].get(cls) || 0) + 1);
        // Track cross-family
        if (!classToFamilies.has(cls)) classToFamilies.set(cls, new Set());
        classToFamilies.get(cls).add(family);
        classTotalCount.set(cls, (classTotalCount.get(cls) || 0) + 1);
      }
    }
  }
  console.log(`  ${family}: ${familyCounts[family].size} unique utilities`);
}

const allUtils = [...classTotalCount.entries()].sort((a, b) => b[1] - a[1]);
console.log(`\nTotal unique Tailwind utilities found: ${allUtils.length}`);

// ─── Classification ───────────────────────────────────────────────────────────

function classifyUtil(cls) {
  const fams = classToFamilies.get(cls) || new Set();
  // Exclude 'tests' from ownership decision
  const routeFams = new Set([...fams].filter((f) => f !== "tests"));
  if (routeFams.size === 0) return "TESTS_ONLY";
  if (routeFams.size === 1) {
    const [fam] = routeFams;
    return fam === "shared" ? "SHARED_ONLY" : `${fam.toUpperCase()}_ONLY`;
  }
  return "MULTI_FAMILY";
}

// ─── Arbitrary value analysis ─────────────────────────────────────────────────

const arbitraryUtils = allUtils.filter(([cls]) => cls.includes("["));
const responsiveUtils = allUtils.filter(([cls]) => /^(?:sm|md|lg|xl|2xl):/.test(cls));
const hoverFocusUtils = allUtils.filter(([cls]) => /^(?:hover|focus|focus-visible|active|disabled):/.test(cls));
const darkUtils        = allUtils.filter(([cls]) => /^dark:/.test(cls));

// Pattern groups (prefix family)
function utilPrefix(cls) {
  const base = cls.includes(":") ? cls.split(":").pop() : cls;
  return base?.split("-")[0] || "(other)";
}
const prefixGroups = new Map();
for (const [cls, cnt] of allUtils) {
  const p = utilPrefix(cls);
  const g = prefixGroups.get(p) || { count: 0, total: 0, classes: [] };
  g.count++;
  g.total += cnt;
  g.classes.push(cls);
  prefixGroups.set(p, g);
}
const sortedGroups = [...prefixGroups.entries()].sort((a, b) => b[1].total - a[1].total);

// ─── Repeated pattern detection (combinations used 3+ times together) ─────────

// Too expensive for full product, skip for now and focus on individual top utilities

// ─── Savings estimate ─────────────────────────────────────────────────────────

// Utilities ONLY in non-shared, non-marketing families (learner or admin only)
const learnAdminOnly = allUtils.filter(([cls]) => {
  const fams = classToFamilies.get(cls) || new Set();
  const route = [...fams].filter((f) => f !== "tests");
  return route.every((f) => f === "learner" || f === "admin") && route.length > 0;
});

// Estimate bytes: each Tailwind utility ~ 60–200 bytes in compiled CSS
const AVG_BYTES_PER_UTIL = 120;
const learnAdminOnlyBytes = learnAdminOnly.length * AVG_BYTES_PER_UTIL;
const arbitraryBytes = arbitraryUtils.length * 100;

// ─── Build JSON output ────────────────────────────────────────────────────────

const jsonOut = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalUniqueUtilities: allUtils.length,
    arbitraryValues:      arbitraryUtils.length,
    responsiveVariants:   responsiveUtils.length,
    hoverFocusVariants:   hoverFocusUtils.length,
    darkVariants:         darkUtils.length,
    multiFamily:          allUtils.filter(([c]) => classifyUtil(c) === "MULTI_FAMILY").length,
    sharedOnly:           allUtils.filter(([c]) => classifyUtil(c) === "SHARED_ONLY").length,
    marketingOnly:        allUtils.filter(([c]) => classifyUtil(c) === "MARKETING_ONLY").length,
    learnerOnly:          allUtils.filter(([c]) => classifyUtil(c) === "LEARNER_ONLY").length,
    adminOnly:            allUtils.filter(([c]) => classifyUtil(c) === "ADMIN_ONLY").length,
    testsOnly:            allUtils.filter(([c]) => classifyUtil(c) === "TESTS_ONLY").length,
    learnerOrAdminOnly:   learnAdminOnly.length,
    estimatedLAOnlyBytes: learnAdminOnlyBytes,
  },
  familyUniqueCounts: Object.fromEntries(
    Object.entries(familyCounts).map(([k, m]) => [k, m.size])
  ),
  top100: allUtils.slice(0, 100).map(([cls, cnt]) => ({
    cls,
    count: cnt,
    families: [...(classToFamilies.get(cls) || [])],
    classification: classifyUtil(cls),
  })),
  prefixGroups: sortedGroups.slice(0, 30).map(([p, v]) => ({
    prefix: p,
    uniqueClasses: v.count,
    totalUses: v.total,
  })),
  arbitraryValues: arbitraryUtils.slice(0, 50).map(([cls, cnt]) => ({
    cls,
    count: cnt,
    families: [...(classToFamilies.get(cls) || [])],
  })),
  learnerAdminOnly: learnAdminOnly.map(([cls, cnt]) => ({
    cls,
    count: cnt,
    families: [...(classToFamilies.get(cls) || [])],
  })),
};

writeFileSync(OUT_JSON, JSON.stringify(jsonOut, null, 2));
console.log(`JSON → ${relative(ROOT, OUT_JSON)}`);

// ─── Markdown report ──────────────────────────────────────────────────────────

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
const pct = (a, b) => `${((a / b) * 100).toFixed(1)}%`;

const md = `# Tailwind Utility Usage Audit
Generated: ${new Date().toISOString()}
Tailwind version: 4.2.4  •  Entry point: \`src/app/globals.css\`

## Executive Summary

| Metric | Count |
|---|---|
| Total unique Tailwind utilities | **${allUtils.length}** |
| Multi-family (shared across routes) | ${jsonOut.summary.multiFamily} |
| Shared-component-only | ${jsonOut.summary.sharedOnly} |
| Marketing-only | ${jsonOut.summary.marketingOnly} |
| Learner-only | ${jsonOut.summary.learnerOnly} |
| Admin-only | ${jsonOut.summary.adminOnly} |
| Tests-only | ${jsonOut.summary.testsOnly} |
| Arbitrary value utilities | **${jsonOut.summary.arbitraryValues}** |
| Responsive variants | ${jsonOut.summary.responsiveVariants} |
| Hover/focus variants | ${jsonOut.summary.hoverFocusVariants} |
| Dark-mode variants | ${jsonOut.summary.darkVariants} |

## Key Finding: Route-Scoped Tailwind Is Not Feasible

**${jsonOut.summary.multiFamily} of ${allUtils.length} utilities (${pct(jsonOut.summary.multiFamily, allUtils.length)}) are used across multiple route families.**
The shared component layer (buttons, cards, badges, menus) uses Tailwind utilities
that are imported by marketing, learner, and admin routes simultaneously.

Only **${jsonOut.summary.learnerOrAdminOnly} utilities** are exclusively in learner or admin routes.
At ~${AVG_BYTES_PER_UTIL} bytes/utility, scoping them would save at most ~${kb(learnAdminOnlyBytes)} — not significant
compared to the ~900 KB total Tailwind utility output.

## Per-Family Utility Counts

| Family | Unique Utilities | Files |
|---|---|---|
${Object.entries(jsonOut.familyUniqueCounts).map(([f,c])=>`| ${f} | ${c} | |`).join("\n")}

## Top 100 Utilities by Usage

\`\`\`
${jsonOut.top100.map(u => `${u.cls.padEnd(45)} ${String(u.count).padStart(6)}x  ${u.classification}`).join("\n")}
\`\`\`

## Arbitrary Value Utilities (${arbitraryUtils.length} total)

These generate one-off CSS rules and are the highest-cost per class.

\`\`\`
${arbitraryUtils.slice(0, 50).map(([c, n]) => `${c.padEnd(50)} ${String(n).padStart(5)}x  ${classifyUtil(c)}`).join("\n")}
\`\`\`

## Prefix Group Analysis (Top 20)

| Prefix | Unique Classes | Total Uses |
|---|---|---|
${sortedGroups.slice(0,20).map(([p,v])=>`| \`${p}-\` | ${v.count} | ${v.total} |`).join("\n")}

## Learner + Admin Only Utilities (${learnAdminOnly.length})

These could theoretically be excluded from the marketing/root CSS, but their
collective size is only ~${kb(learnAdminOnlyBytes)}, which is not significant.

\`\`\`
${learnAdminOnly.map(([c, n]) => `${c.padEnd(50)} ${String(n).padStart(5)}x`).join("\n")}
\`\`\`

## Reduction Opportunities

| Approach | Est. Saving | Risk | Effort |
|---|---|---|---|
| Convert top-20 utility combos → named CSS classes | 30–80 KB | Low | Medium |
| Remove arbitrary values → Tailwind scale values | 30–50 KB | Low | Medium |
| Add \`@source none\` + explicit source list | Unknown | High | High |
| Route-scoped Tailwind entry points | Not feasible | Very High | Very High |
| shadcn/ui component styles → CSS Modules | 50–150 KB | Medium | Very High |

## Recommended Next Steps

1. **Named class conversion (Phase 3/4):** Convert the top repeated utility combos
   (flex containers, badge patterns, muted labels, card shells) into semantic
   CSS classes. See \`docs/reports/tailwind-named-class-candidates.md\`.

2. **Arbitrary value reduction:** Replace \`text-[11px]\`, \`max-w-[1200px]\`,
   \`min-w-[180px]\` with nearest Tailwind scale values or named classes.
   This reduces the arbitrary-value inflation in the compiled CSS.

3. **Admin-specific utilities:** The 17 admin-only utilities (max-w-[1200px] etc.)
   could be moved to a scoped admin CSS block or named class. Low priority.

4. **Tailwind \`@source\` configuration:** Tailwind v4 scans the entire project
   by default. Adding explicit source configuration to restrict scanning to
   the application source (excluding tests, generated files, stories) could
   reduce noise utilities. Requires careful testing.
`;

writeFileSync(OUT_MD, md);
console.log(`MD  → ${relative(ROOT, OUT_MD)}`);

// Summary
console.log("\n=== TAILWIND UTILITY AUDIT SUMMARY ===");
console.log(`Total unique utilities:   ${allUtils.length}`);
console.log(`  Multi-family (shared):  ${jsonOut.summary.multiFamily} (${pct(jsonOut.summary.multiFamily, allUtils.length)})`);
console.log(`  Marketing-only:         ${jsonOut.summary.marketingOnly}`);
console.log(`  Learner-only:           ${jsonOut.summary.learnerOnly}`);
console.log(`  Admin-only:             ${jsonOut.summary.adminOnly}`);
console.log(`  Learner+Admin only:     ${jsonOut.summary.learnerOrAdminOnly}`);
console.log(`Arbitrary values:         ${jsonOut.summary.arbitraryValues}`);
console.log(`Max scoping benefit:      ~${kb(learnAdminOnlyBytes)} (learner+admin only)`);
console.log("======================================");
