#!/usr/bin/env node
/**
 * Catalog pathway lesson markdown hygiene:
 * - Duplicate markdown headings (# … ######) within a section body or across the whole lesson.
 * - Internal study links `](LESSON:slug)` targeting a slug missing from the same pathway catalog.
 *
 * Filesystem catalog only (no Prisma). Chunk-friendly: filter one pathway at a time.
 *
 * Run:
 *   npx tsx scripts/audit-lesson-markdown-quality.runner.mts --pathway=us-rn-nclex-rn --warn-only
 *
 * `--lesson-links-scope=global` (default): `LESSON:slug` targets must exist somewhere in the merged catalog.
 * `--lesson-links-scope=pathway`: targets must exist on the same pathway only (stricter).
 */
import {
  getCatalogLessonsRaw,
  listCatalogPathwayIdsWithLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

const LESSON_LINK_RE = /\]\(\s*LESSON:([^)\s]+)\s*\)/gi;
const MD_HEADING_LINE_RE = /^(#{1,6})\s+(.+)$/gm;

function normalizeHeadingText(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function duplicateMdHeadings(body: string): string[] {
  const titles: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(MD_HEADING_LINE_RE.source, "gm");
  while ((m = re.exec(body)) !== null) {
    titles.push(normalizeHeadingText(m[2] ?? ""));
  }
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const t of titles) {
    if (!t) continue;
    if (seen.has(t)) dup.add(t);
    seen.add(t);
  }
  return [...dup];
}

type IssueRow = { pathwayId: string; slug: string; issues: string[] };

function auditLessonBodies(
  pathwayId: string,
  slugSet: Set<string>,
  bodies: Array<{ kind?: string; label: string; text: string }>,
): string[] {
  const issues: string[] = [];
  const globalTitles: string[] = [];

  for (const { label, text } of bodies) {
    for (const m of text.matchAll(LESSON_LINK_RE)) {
      const target = (m[1] ?? "").trim();
      if (target && !slugSet.has(target)) {
        issues.push(`broken_lesson_link(${target})`);
      }
    }
    const secDup = duplicateMdHeadings(text);
    if (secDup.length > 0) {
      issues.push(`${label}_duplicate_md_heading:${secDup.slice(0, 3).join("|")}`);
    }
    let hm: RegExpExecArray | null;
    const re = new RegExp(MD_HEADING_LINE_RE.source, "gm");
    while ((hm = re.exec(text)) !== null) {
      globalTitles.push(normalizeHeadingText(hm[2] ?? ""));
    }
  }

  const seenG = new Set<string>();
  const dupG = new Set<string>();
  for (const t of globalTitles) {
    if (!t) continue;
    if (seenG.has(t)) dupG.add(t);
    seenG.add(t);
  }
  if (dupG.size > 0) {
    issues.push(`lesson_duplicate_md_heading:${[...dupG].slice(0, 4).join("|")}`);
  }

  // Lightweight malformed tag sniff (does not parse HTML)
  const blob = bodies.map((b) => b.text).join("\n");
  if (/<script\b/i.test(blob)) issues.push("suspicious_script_tag_in_body");

  return issues;
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const warnOnly = args.has("--warn-only");
  const pathwayFilter = [...args].find((a) => a.startsWith("--pathway="))?.slice("--pathway=".length);
  const linkScope =
    [...args].find((a) => a.startsWith("--lesson-links-scope="))?.slice("--lesson-links-scope=".length) ?? "global";

  const allPathwayIds = listCatalogPathwayIdsWithLessonsSync();
  const globalSlugSet = new Set<string>();
  for (const pid of allPathwayIds) {
    for (const raw of getCatalogLessonsRaw(pid)) {
      if (typeof raw.slug === "string" && raw.slug) globalSlugSet.add(raw.slug);
    }
  }

  const ids = allPathwayIds.filter((id) => !pathwayFilter || id === pathwayFilter);
  const rows: IssueRow[] = [];
  let lessons = 0;

  for (const pathwayId of ids) {
    const rawLessons = getCatalogLessonsRaw(pathwayId);
    const pathwaySlugSet = new Set(rawLessons.map((r) => (typeof r.slug === "string" ? r.slug : "")).filter(Boolean));
    const slugSetForLinks = linkScope === "pathway" ? pathwaySlugSet : globalSlugSet;

    for (const raw of rawLessons) {
      const lesson = normalizeLesson(raw, pathwayId);
      if (!lesson.structuralQuality?.publicComplete) continue;
      lessons += 1;

      const bodies: Array<{ kind?: string; label: string; text: string }> = [];
      for (const s of lesson.sections) {
        const body = typeof s.body === "string" ? s.body : "";
        bodies.push({
          kind: typeof s.kind === "string" ? s.kind : undefined,
          label: `section_${s.kind ?? s.id ?? "unknown"}`,
          text: body,
        });
      }

      const issues = auditLessonBodies(pathwayId, slugSetForLinks, bodies);
      if (issues.length > 0) rows.push({ pathwayId, slug: lesson.slug, issues });
    }
  }

  rows.sort((a, b) => `${a.pathwayId}:${a.slug}`.localeCompare(`${b.pathwayId}:${b.slug}`));

  console.info(`[audit:lesson-markdown-quality] pathways=${ids.length} lessons_public_complete=${lessons}`);
  console.info(`[audit:lesson-markdown-quality] lessons_with_issues=${rows.length}`);

  const preview = rows.slice(0, 50);
  if (preview.length > 0) {
    console.info("[audit:lesson-markdown-quality] sample issues (max 50):");
    for (const r of preview) {
      console.info(`  ${r.pathwayId} :: ${r.slug} → ${r.issues.join(", ")}`);
    }
    if (rows.length > preview.length) {
      console.info(`  … ${rows.length - preview.length} more`);
    }
  }

  if (!warnOnly && rows.length > 0) {
    console.error(
      `[audit:lesson-markdown-quality] FAIL lessons_with_markdown_or_link_issues=${rows.length} (use --warn-only to exit 0)`,
    );
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
