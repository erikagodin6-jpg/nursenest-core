#!/usr/bin/env node
/**
 * Aesthetic regression aggregator.
 *
 * Reads per-test shards from `.aesthetic-audit/shards/*.json` (written by
 * `tests/e2e/helpers/aesthetic-regression.ts`) and emits:
 *   - docs/reports/aesthetic-regression-report.md
 *   - docs/reports/aesthetic-regression-report.json
 *   - docs/reports/ui-surface-inventory.md
 *
 * CI gating is decided here, never by the Playwright specs themselves, so a
 * single run can be re-graded by re-running this script with a different
 * AESTHETIC_AUDIT_GATE.
 *
 *   AESTHETIC_AUDIT_GATE = off | warn | moderate | major | critical   (default: warn)
 *     off       — never returns non-zero exit
 *     warn      — never returns non-zero exit, but lists everything
 *     moderate  — non-zero when any moderate, major, or critical issue exists
 *     major     — non-zero when any major or critical issue exists
 *     critical  — non-zero when any critical issue exists
 *
 * Usage:
 *   node scripts/aesthetic-audit-aggregate-report.mjs
 *   node scripts/aesthetic-audit-aggregate-report.mjs --gate=critical
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const SHARDS_DIR = path.join(APP_ROOT, ".aesthetic-audit", "shards");
const ROUTE_CATALOG_PATH = path.join(APP_ROOT, "tests", "e2e", "helpers", "aesthetic-audit-route-catalog.json");
const REPORTS_DIR = path.join(REPO_ROOT, "docs", "reports");
const REPORT_MD = path.join(REPORTS_DIR, "aesthetic-regression-report.md");
const REPORT_JSON = path.join(REPORTS_DIR, "aesthetic-regression-report.json");
const INVENTORY_MD = path.join(REPORTS_DIR, "ui-surface-inventory.md");
const SCREENSHOTS_ROOT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026");
const BASELINE_ROOT = path.join(SCREENSHOTS_ROOT, "baselines");
const FIGMA_ROOT = path.join(SCREENSHOTS_ROOT, "figma");

const SEVERITY_ORDER = { cosmetic: 0, moderate: 1, major: 2, critical: 3 };
const SEVERITIES = ["critical", "major", "moderate", "cosmetic"];

function parseArgs() {
  const out = {};
  for (const arg of process.argv.slice(2)) {
    const m = arg.match(/^--([\w-]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
    else if (arg.startsWith("--")) out[arg.slice(2)] = true;
  }
  return out;
}

function resolveGate() {
  const args = parseArgs();
  const raw = String(args.gate ?? process.env.AESTHETIC_AUDIT_GATE ?? "warn").trim().toLowerCase();
  if (["off", "warn", "moderate", "major", "critical"].includes(raw)) return raw;
  return "warn";
}

function readRouteCatalog() {
  if (!existsSync(ROUTE_CATALOG_PATH)) return [];
  try {
    const j = JSON.parse(readFileSync(ROUTE_CATALOG_PATH, "utf8"));
    const routes = j.routes;
    return Array.isArray(routes) ? routes.map(String) : [];
  } catch {
    return [];
  }
}

function readShards() {
  if (!existsSync(SHARDS_DIR)) return [];
  const files = readdirSync(SHARDS_DIR).filter((f) => f.endsWith(".json"));
  const out = [];
  for (const f of files) {
    try {
      const raw = readFileSync(path.join(SHARDS_DIR, f), "utf8");
      out.push(JSON.parse(raw));
    } catch (err) {
      console.error(`[aesthetic-audit] Failed to parse ${f}: ${err.message}`);
    }
  }
  return out;
}

function severityMax(severities) {
  let max = null;
  for (const s of severities) {
    if (max == null || SEVERITY_ORDER[s] > SEVERITY_ORDER[max]) max = s;
  }
  return max;
}

function countBySeverity(shards) {
  const counts = { critical: 0, major: 0, moderate: 0, cosmetic: 0 };
  for (const s of shards) {
    for (const issue of s.issues ?? []) {
      counts[issue.severity] = (counts[issue.severity] || 0) + 1;
    }
  }
  return counts;
}

function gateViolated(gate, counts) {
  if (gate === "off" || gate === "warn") return false;
  if (gate === "critical") return counts.critical > 0;
  if (gate === "major") return counts.critical > 0 || counts.major > 0;
  if (gate === "moderate") {
    return counts.critical > 0 || counts.major > 0 || counts.moderate > 0;
  }
  return false;
}

function groupByRoute(shards) {
  const groups = new Map();
  for (const s of shards) {
    const list = groups.get(s.route) ?? [];
    list.push(s);
    groups.set(s.route, list);
  }
  return groups;
}

function topIssuesForReport(shards, limit = 25) {
  const flat = [];
  for (const s of shards) {
    for (const issue of s.issues ?? []) {
      flat.push({ ...issue, route: s.route, theme: s.theme, viewport: s.viewport });
    }
  }
  flat.sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]);
  return flat.slice(0, limit);
}

function fmtDiff(metrics) {
  if (!metrics) return "—";
  return `${metrics.changedPercent.toFixed(2)}% (${metrics.changedPixels}/${metrics.totalPixels})`;
}

function writeJsonReport(payload) {
  mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  writeFileSync(REPORT_JSON, JSON.stringify(payload, null, 2) + "\n");
}

function writeMarkdownReport(shards, counts, gate, gateViolatedFlag, catalogRoutes, missingCatalogRoutes) {
  mkdirSync(path.dirname(REPORT_MD), { recursive: true });
  const lines = [];
  lines.push("# Aesthetic regression report");
  lines.push("");
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push(`**Gate:** \`${gate}\` ${gateViolatedFlag ? "**(FAILED)**" : "(passing)"}`);
  lines.push(`**Captured shards:** ${shards.length}`);
  if (catalogRoutes?.length) {
    lines.push(`**Catalog expected routes:** ${catalogRoutes.length}`);
    lines.push(`**Catalog missing (no shard this run):** ${missingCatalogRoutes?.length ?? 0}`);
  }
  lines.push("");
  lines.push("## Severity summary");
  lines.push("");
  lines.push("| Severity | Count |");
  lines.push("|----------|-------|");
  for (const s of SEVERITIES) {
    lines.push(`| ${s} | ${counts[s] || 0} |`);
  }
  lines.push("");

  if (missingCatalogRoutes?.length) {
    lines.push("## Catalog gaps (expected routes with no shard this run)");
    lines.push("");
    for (const r of missingCatalogRoutes) lines.push(`- \`${r}\``);
    lines.push("");
  }

  const topIssues = topIssuesForReport(shards);
  if (topIssues.length > 0) {
    lines.push("## Top issues (ordered by severity)");
    lines.push("");
    lines.push("| Severity | Category | Rule | Route | Theme | Viewport | Message |");
    lines.push("|----------|----------|------|-------|-------|----------|---------|");
    for (const i of topIssues) {
      const message = (i.message || "").replace(/\|/g, "\\|").slice(0, 220);
      lines.push(`| ${i.severity} | ${i.category} | ${i.ruleId} | ${i.route} | ${i.theme} | ${i.viewport} | ${message} |`);
    }
    lines.push("");
  }

  const groups = groupByRoute(shards);
  lines.push("## Per-route detail");
  lines.push("");
  const sortedRoutes = [...groups.keys()].sort();
  for (const route of sortedRoutes) {
    const list = groups.get(route);
    lines.push(`### \`${route}\``);
    lines.push("");
    lines.push("| Theme | Viewport | Status | Baseline diff | Figma drift | Max severity | Issues |");
    lines.push("|-------|----------|--------|---------------|-------------|--------------|--------|");
    for (const s of list) {
      const severities = (s.issues || []).map((i) => i.severity);
      const maxSev = severityMax(severities) ?? "—";
      const issueCount = (s.issues || []).length;
      lines.push(
        `| ${s.theme} | ${s.viewport} | ${s.status} | ${fmtDiff(s.baselineDiff)} | ${fmtDiff(s.figmaDiff)} | ${maxSev} | ${issueCount} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Screenshots");
  lines.push("");
  lines.push(
    `Captures live under \`docs/screenshots/aesthetic-audit-2026/\`. Baselines under \`baselines/\`. Optional Figma exports under \`figma/\`. With \`AESTHETIC_AUDIT_WRITE_DIFF_PNG=1\`, baseline overlays are written to \`diffs/\`.`,
  );
  lines.push("");
  lines.push("## Regenerating");
  lines.push("");
  lines.push("```bash");
  lines.push("cd nursenest-core");
  lines.push("npm run test:e2e:aesthetic-audit");
  lines.push("npm run aesthetic-audit:report");
  lines.push("```");
  lines.push("");

  writeFileSync(REPORT_MD, lines.join("\n"));
}

function listScreenshotFiles(root) {
  if (!existsSync(root)) return new Set();
  const out = new Set();
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for (const sub of readdirSync(path.join(root, entry.name))) {
        out.add(`${entry.name}/${sub}`);
      }
    } else if (entry.isFile()) {
      out.add(entry.name);
    }
  }
  return out;
}

function writeInventoryReport(shards, catalogRoutes) {
  mkdirSync(path.dirname(INVENTORY_MD), { recursive: true });
  const lines = [];
  const groups = groupByRoute(shards);
  const sortedRoutes = [...groups.keys()].sort();
  const baselineFiles = listScreenshotFiles(BASELINE_ROOT);
  const figmaFiles = listScreenshotFiles(FIGMA_ROOT);
  const catalogSet = new Set(catalogRoutes);

  lines.push("# UI surface inventory");
  lines.push("");
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push(`**Total audited routes (from shards):** ${sortedRoutes.length}`);
  if (catalogRoutes.length) {
    lines.push(`**Expected routes (catalog):** ${catalogRoutes.length}`);
  }
  lines.push("");
  lines.push("Coverage matrix — `✓` indicates a capture exists for this slice; `—` means the matrix slice has no recorded shard (either the route was skipped or the audit hasn't run for it). **Baseline** / **Figma** use shard metadata when present, else fall back to a filename heuristic under `baselines/` / `figma/`.");
  lines.push("");
  lines.push(
    "| Route | Mobile | Authenticated | Ocean | Blossom | Midnight | Sunset | Aurora | Baseline | Figma |",
  );
  lines.push(
    "|-------|--------|---------------|-------|---------|----------|--------|--------|----------|-------|",
  );

  for (const route of sortedRoutes) {
    const list = groups.get(route);
    const themes = new Set(list.map((s) => s.theme));
    const viewports = new Set(list.map((s) => s.viewport));
    const authenticated = /^auth-|^learner-/.test(route);
    const hasMobile = viewports.has("mobile");

    const hasBaselineFromShards = list.some((s) => Boolean(s.baselineRelPath));
    const hasFigmaFromShards = list.some((s) => Boolean(s.figmaRelPath));
    const slug = route.replace(/^(public|auth|learner)-/, "");
    const hasBaselineHeuristic = [...baselineFiles].some((name) => name.includes(slug));
    const hasFigmaHeuristic = [...figmaFiles].some((name) => name.includes(slug));
    const hasBaseline = hasBaselineFromShards || hasBaselineHeuristic;
    const hasFigma = hasFigmaFromShards || hasFigmaHeuristic;

    const cell = (b) => (b ? "✓" : "—");
    lines.push(
      `| ${route} | ${cell(hasMobile)} | ${cell(authenticated)} | ${cell(themes.has("ocean"))} | ${cell(themes.has("blossom"))} | ${cell(themes.has("midnight"))} | ${cell(themes.has("sunset"))} | ${cell(themes.has("aurora"))} | ${cell(hasBaseline)} | ${cell(hasFigma)} |`,
    );
  }
  lines.push("");

  if (catalogRoutes.length) {
    const missing = catalogRoutes.filter((r) => !groups.has(r)).sort();
    const extra = sortedRoutes.filter((r) => !catalogSet.has(r));
    lines.push("## Catalog coverage");
    lines.push("");
    if (missing.length) {
      lines.push("### Missing routes (in catalog, no shard in this run)");
      lines.push("");
      for (const r of missing) lines.push(`- \`${r}\``);
      lines.push("");
    } else {
      lines.push("All catalog routes produced at least one shard in this aggregation.");
      lines.push("");
    }
    if (extra.length) {
      lines.push("### Shards not listed in catalog (consider adding to `aesthetic-audit-route-catalog.json`)");
      lines.push("");
      for (const r of extra) lines.push(`- \`${r}\``);
      lines.push("");
    }
  }
  lines.push("");
  lines.push("## Routes captured by category");
  lines.push("");
  const cats = { public: [], authenticated: [], learner: [] };
  for (const route of sortedRoutes) {
    if (route.startsWith("public-")) cats.public.push(route);
    else if (route.startsWith("auth-")) cats.authenticated.push(route);
    else if (route.startsWith("learner-")) cats.learner.push(route);
  }
  for (const [name, list] of Object.entries(cats)) {
    lines.push(`### ${name} (${list.length})`);
    lines.push("");
    for (const r of list) lines.push(`- \`${r}\``);
    lines.push("");
  }

  lines.push("## Known gaps");
  lines.push("");
  lines.push("- Routes with **no Figma baseline** rely on the implementation as source of truth — populate `FIGMA_FRAME_MAP` in `tests/e2e/helpers/aesthetic-audit-config.ts` once frames are approved.");
  lines.push("- Routes with **no pixel baseline** under `docs/screenshots/aesthetic-audit-2026/baselines/` cannot fail the diff gate; promote a clean capture to baseline with `cp docs/screenshots/aesthetic-audit-2026/<surface>/<name>.png docs/screenshots/aesthetic-audit-2026/baselines/<name>.png`.");
  lines.push("- Learner session routes are flagged `optional` and skip gracefully when seeded fixtures are missing; refresh seeds via `npm run seed:auth-qa`.");
  lines.push("");

  writeFileSync(INVENTORY_MD, lines.join("\n"));
}

function main() {
  const gate = resolveGate();
  const shards = readShards();
  const catalogRoutes = readRouteCatalog();
  const counts = countBySeverity(shards);
  const gateViolatedFlag = gateViolated(gate, counts);

  const groups = groupByRoute(shards);
  const missingCatalogRoutes = catalogRoutes.filter((r) => !groups.has(r)).sort();

  const payload = {
    generatedAt: new Date().toISOString(),
    gate,
    gateViolated: gateViolatedFlag,
    severityCounts: counts,
    totalShards: shards.length,
    catalogExpectedRoutes: catalogRoutes,
    catalogMissingRoutes: missingCatalogRoutes,
    shards,
  };

  writeJsonReport(payload);
  writeMarkdownReport(shards, counts, gate, gateViolatedFlag, catalogRoutes, missingCatalogRoutes);
  writeInventoryReport(shards, catalogRoutes);

  // Console summary — stable output for CI logs.
  const fmt = (s) => `${s}=${counts[s] || 0}`;
  console.log(
    `[aesthetic-audit] shards=${shards.length} ${SEVERITIES.map(fmt).join(" ")} gate=${gate} ${gateViolatedFlag ? "FAIL" : "OK"}`,
  );
  console.log(`[aesthetic-audit] report: ${path.relative(process.cwd(), REPORT_MD)}`);
  console.log(`[aesthetic-audit] json:   ${path.relative(process.cwd(), REPORT_JSON)}`);
  console.log(`[aesthetic-audit] inventory: ${path.relative(process.cwd(), INVENTORY_MD)}`);

  if (gateViolatedFlag) {
    console.error(`[aesthetic-audit] Gate "${gate}" violated — failing run.`);
    process.exit(1);
  }
}

main();
