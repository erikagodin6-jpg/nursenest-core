#!/usr/bin/env npx tsx
/**
 * Audit programmatic SEO titles/descriptions for CTR-risk patterns (bare topics, truncation, weak meta).
 * Does not call Google APIs — run alongside GSC exports (`verify-gsc-csv.ts`).
 *
 * Usage:
 *   npx tsx scripts/seo/audit-clinical-serp-quality.mts
 *   npx tsx scripts/seo/audit-clinical-serp-quality.mts --priority-only
 *   npx tsx scripts/seo/audit-clinical-serp-quality.mts --slug=hyperkalemia-nclex-review
 *   npx tsx scripts/seo/audit-clinical-serp-quality.mts --json
 */
import { getAllProgrammaticSeoPages } from "@/lib/seo/programmatic-registry";
import {
  auditProgrammaticSerpPage,
  slugMatchesCtrPriorityHint,
  type SerpAuditFinding,
} from "@/lib/seo/clinical-serp-quality-audit";
import { normalizeClinicalTitle } from "@/lib/seo/clinical-title-patterns";
import { normalizeMetaDescription } from "@/lib/seo/clinical-meta-description-patterns";

function parseArgs(argv: string[]) {
  let priorityOnly = false;
  let slugFilter: string | null = null;
  let json = false;
  for (const a of argv) {
    if (a === "--priority-only") priorityOnly = true;
    else if (a === "--json") json = true;
    else if (a.startsWith("--slug=")) slugFilter = a.slice("--slug=".length).trim() || null;
  }
  return { priorityOnly, slugFilter, json };
}

function aggregateDuplicates(
  pages: Array<{ slug: string; value: string }>,
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const { slug, value } of pages) {
    const k = value.toLowerCase();
    if (!k) continue;
    const arr = map.get(k) ?? [];
    arr.push(slug);
    map.set(k, arr);
  }
  return map;
}

async function main() {
  const { priorityOnly, slugFilter, json } = parseArgs(process.argv.slice(2));
  const pages = await getAllProgrammaticSeoPages();

  const filtered = pages.filter((p) => {
    if (slugFilter && p.slug !== slugFilter) return false;
    if (priorityOnly && !slugMatchesCtrPriorityHint(p.slug)) return false;
    return true;
  });

  const allFindings: SerpAuditFinding[] = [];
  for (const p of filtered) {
    allFindings.push(...auditProgrammaticSerpPage(p));
  }

  const titleDup = aggregateDuplicates(
    pages.map((p) => ({ slug: p.slug, value: normalizeClinicalTitle(p.title ?? "") })),
  );
  const descDup = aggregateDuplicates(
    pages.map((p) => ({ slug: p.slug, value: normalizeMetaDescription(p.description ?? "") })),
  );

  const duplicateTitles = [...titleDup.entries()].filter(([, slugs]) => slugs.length > 1);
  const duplicateDescriptions = [...descDup.entries()].filter(([, slugs]) => slugs.length > 1);

  const summary = {
    pages_scanned: filtered.length,
    pages_total: pages.length,
    findings_by_severity: {
      error: allFindings.filter((f) => f.severity === "error").length,
      warn: allFindings.filter((f) => f.severity === "warn").length,
      info: allFindings.filter((f) => f.severity === "info").length,
    },
    duplicate_title_groups: duplicateTitles.length,
    duplicate_description_groups: duplicateDescriptions.length,
    priority_slug_hints_matched: filtered.filter((p) => slugMatchesCtrPriorityHint(p.slug)).length,
  };

  if (json) {
    console.log(
      JSON.stringify(
        {
          summary,
          findings: allFindings,
          duplicate_titles: duplicateTitles.slice(0, 80),
          duplicate_descriptions: duplicateDescriptions.slice(0, 80),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log("[audit-clinical-serp-quality] summary\n", JSON.stringify(summary, null, 2));

  if (duplicateTitles.length > 0) {
    console.log("\n[duplicate titles] sample (first 15 groups):");
    for (const [title, slugs] of duplicateTitles.slice(0, 15)) {
      console.log(`  "${title.slice(0, 72)}${title.length > 72 ? "…" : ""}" → ${slugs.length} slugs`);
      console.log(`    ${slugs.slice(0, 8).join(", ")}${slugs.length > 8 ? " …" : ""}`);
    }
  }

  const warns = allFindings.filter((f) => f.severity === "warn" || f.severity === "error");
  if (warns.length > 0) {
    console.log("\n[warnings/errors] first 40:");
    for (const f of warns.slice(0, 40)) {
      console.log(`  ${f.severity.toUpperCase()} ${f.slug} [${f.code}] ${f.message}`);
    }
    if (warns.length > 40) console.log(`  … ${warns.length - 40} more`);
  }

  console.log(
    "\nNote: Figma SERP preview frames should gate bulk metadata rewrites — see docs/reports/clinical-serp-ctr-optimization.md",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
