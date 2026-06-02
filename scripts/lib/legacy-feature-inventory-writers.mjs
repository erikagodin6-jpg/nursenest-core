/**
 * Writes legacy-feature-inventory.md, .json, and legacy-feature-gap-map.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PRI_ORDER = { critical: 0, high: 1, medium: 2, low: 3, unknown: 4 };

function countBy(items, key) {
  const m = Object.create(null);
  for (const it of items) {
    const v = it[key] ?? "unknown";
    m[v] = (m[v] ?? 0) + 1;
  }
  return m;
}

export function writeLegacyFeatureReports(repoRoot, payload) {
  const reportsDir = join(repoRoot, "reports");
  mkdirSync(reportsDir, { recursive: true });

  const jsonPath = join(reportsDir, "legacy-feature-inventory.json");
  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const md = buildInventoryMarkdown(payload);
  writeFileSync(join(reportsDir, "legacy-feature-inventory.md"), md, "utf8");

  const gap = buildGapMapMarkdown(payload);
  writeFileSync(join(reportsDir, "legacy-feature-gap-map.md"), gap, "utf8");

  return { jsonPath, mdPath: join(reportsDir, "legacy-feature-inventory.md"), gapPath: join(reportsDir, "legacy-feature-gap-map.md") };
}

function buildInventoryMarkdown(p) {
  const lines = [
    "# Legacy feature inventory",
    "",
    `Generated: **${p.generatedAt}**`,
    "",
    "## Summary",
    "",
    "| Metric | Value |",
    "|--------|-------|",
    `| Total items | ${p.summary.totalItems} |`,
    "",
    "### By category",
    "",
    "| Category | Count |",
    "|----------|-------|",
  ];
  for (const [k, v] of Object.entries(p.summary.byCategory).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("", "### By migration status", "", "| Status | Count |", "|--------|-------|");
  for (const [k, v] of Object.entries(p.summary.byStatus).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("", "### By priority", "", "| Priority | Count |", "|----------|-------|");
  for (const [k, v] of Object.entries(p.summary.byPriority).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }

  lines.push("", "---", "", "## Items by category (detail)", "");
  const byCat = Object.create(null);
  for (const it of p.items) {
    (byCat[it.category] ??= []).push(it);
  }
  for (const cat of Object.keys(byCat).sort()) {
    lines.push(`### ${cat}`, "");
    for (const it of byCat[cat].slice(0, 200)) {
      lines.push(`- **${it.title || it.id}** \`(${it.migrationStatus})\` — priority: ${it.priority}`, "");
      lines.push(`  - legacy: ${(it.legacySourcePaths ?? []).join(", ") || "—"}`, "");
      lines.push(`  - current files: ${(it.currentSourcePaths ?? []).join(", ") || "—"}`, "");
      lines.push(`  - learner: ${(it.currentLearnerRoutes ?? []).join(", ") || "—"} | public: ${(it.currentPublicRoutes ?? []).join(", ") || "—"}`, "");
      lines.push(`  - admin: ${(it.adminRoutes ?? []).join(", ") || "—"}`, "");
      lines.push(`  - action: **${it.recommendedAction}** — ${it.reasonForStatus ?? ""}`, "");
    }
    if (byCat[cat].length > 200) lines.push(`_… ${byCat[cat].length - 200} more in JSON_`, "");
  }

  lines.push("", "## Skipped / oversized files", "");
  if ((p.skippedLargeFiles ?? []).length === 0) lines.push("_None_", "");
  else for (const s of p.skippedLargeFiles) lines.push(`- ${s.path} (${s.bytes} bytes)`, "");

  return lines.join("\n");
}

function buildGapMapMarkdown(p) {
  const items = [...p.items].sort((a, b) => {
    const pa = PRI_ORDER[a.priority] ?? 9;
    const pb = PRI_ORDER[b.priority] ?? 9;
    if (pa !== pb) return pa - pb;
    const sa = a.migrationStatus === "not_migrated" ? 0 : a.migrationStatus === "partially_migrated" ? 1 : 2;
    const sb = b.migrationStatus === "not_migrated" ? 0 : b.migrationStatus === "partially_migrated" ? 1 : 2;
    return sa - sb;
  });

  const top20 = items.filter((i) => i.migrationStatus !== "migrated").slice(0, 20);

  const lines = [
    "# Legacy → Next gap map",
    "",
    `Generated: **${p.generatedAt}**`,
    "",
    "## Top 20 migration priorities",
    "",
    "| # | Priority | Status | Category | Title | Action |",
    "|---|----------|--------|----------|-------|--------|",
  ];
  top20.forEach((it, i) => {
    const title = (it.title ?? it.id).replace(/\|/g, "\\|").slice(0, 60);
    lines.push(
      `| ${i + 1} | ${it.priority} | ${it.migrationStatus} | ${it.category} | ${title} | ${it.recommendedAction} |`,
    );
  });

  lines.push(
    "",
    "## Quick wins",
    "",
    "- Items already on Next with admin APIs: finish **verify** + remove duplicate legacy authoring.",
    "- OSCE: finish DB population + cut legacy fallback once `osce_stations` is authoritative.",
    "- Med math: run `migrate:med-math:*` dry-run, then staged writes per pathway.",
    "",
    "## Source-of-truth risks",
    "",
    "- Any **learner** route still importing `@legacy-client` without a migration flag.",
    "- Catalog JSON + DB both claiming authority for the same slug.",
    "- Generated blog or lesson indexes not rebuilt after admin publish.",
    "",
    "## Paid learner feature gaps",
    "",
    "- Legacy-only flows under `client/` with no `nursenest-core/src/app/(student)` equivalent.",
    "- Admin edit surfaces without matching `CONTENT_REGISTRY` verification (see content-source-of-truth).",
    "",
    "## SEO opportunities",
    "",
    "- Legacy marketing pages not represented in Next `src/app/(marketing)` sitemap manifests.",
    "",
    "## Admin publishing gaps",
    "",
    "- Content visible on `/app` but no `/admin` + `/api/admin` write path (inventory flags `partially_migrated`).",
    "",
    "## Do not regenerate (already exists in Next)",
    "",
    "- Pathway lessons authored in **PathwayLesson** + pathway-lesson admin.",
    "- **BlogPost** pipeline for live blogs (regenerate only via controlled jobs).",
    "",
  );

  return lines.join("\n");
}
