#!/usr/bin/env npx tsx
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { ContentStatus, EducationalTranslationSourceKind, LearnerNoteScope, PrismaClient } from "@prisma/client";
import catalog from "@/content/pathway-lessons/catalog.json";
import { normalizeLessonTitleForDedupe } from "@/lib/lessons/pathway-lesson-dedupe";

const prisma = new PrismaClient();

type LessonRow = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  status: ContentStatus;
  locale: string;
  sections: unknown;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
};

type ReferenceCounts = {
  progress: number;
  overlays: number;
  notesById: number;
  notesBySynthetic: number;
  total: number;
};

type DuplicateCandidate = LessonRow & {
  dedupeKey: string;
  dedupeKind: "slug" | "id" | "title";
  normalizedTitle: string;
  score: number;
  scoreBreakdown: Record<string, number>;
  references: ReferenceCounts;
};

type DuplicateGroup = {
  groupKey: string;
  pathwayId: string;
  dedupeKind: "slug" | "id" | "title";
  members: DuplicateCandidate[];
  canonicalId: string;
  duplicateIds: string[];
  ambiguous: boolean;
  reasonIfAmbiguous?: string;
};

type CliOptions = {
  apply: boolean;
  pathway?: string;
  group?: string;
  reportOnly: boolean;
  reportDir?: string;
};

type CatalogShape = {
  pathways?: Record<string, { lessons?: Array<{ slug?: string; title?: string; locale?: string }> }>;
};

function parseArgs(argv: string[]): CliOptions {
  const get = (name: string) => argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  return {
    apply: argv.includes("--apply"),
    pathway: get("pathway"),
    group: get("group"),
    reportOnly: argv.includes("--report-only"),
    reportDir: get("report-dir"),
  };
}

function nowStamp(): string {
  const iso = new Date().toISOString();
  return iso.replace(/[:.]/g, "-");
}

function syntheticProgressId(pathwayId: string, slug: string): string {
  return `pathway:${pathwayId}:${slug}`;
}

function cleanCsvCell(value: unknown): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
    return `"${s.replaceAll("\"", "\"\"")}"`;
  }
  return s;
}

function sectionsRichnessScore(sections: unknown): number {
  if (!Array.isArray(sections)) return 0;
  let bodyChars = 0;
  for (const section of sections) {
    if (!section || typeof section !== "object") continue;
    const body = (section as Record<string, unknown>).body;
    if (typeof body === "string") bodyChars += body.trim().length;
  }
  const sectionCountScore = Math.min(40, sections.length * 6);
  const bodyScore = Math.min(80, Math.floor(bodyChars / 500));
  return sectionCountScore + bodyScore;
}

function statusScore(status: ContentStatus): number {
  if (status === ContentStatus.PUBLISHED) return 200;
  if (status === ContentStatus.IN_REVIEW) return 120;
  if (status === ContentStatus.DRAFT) return 80;
  return 20;
}

function validSlugScore(slug: string): number {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug) ? 20 : 0;
}

function scoreCandidate(row: LessonRow, refs: ReferenceCounts): { score: number; breakdown: Record<string, number> } {
  const breakdown = {
    status: statusScore(row.status),
    richness: sectionsRichnessScore(row.sections),
    hasSeoTitle: row.seoTitle.trim().length > 0 ? 10 : 0,
    hasSeoDescription: row.seoDescription.trim().length > 0 ? 10 : 0,
    hasPreviewCount: row.previewSectionCount > 0 ? 5 : 0,
    validSlug: validSlugScore(row.slug),
    references: refs.total * 15,
  };
  const score = Object.values(breakdown).reduce((sum, part) => sum + part, 0);
  return { score, breakdown };
}

function keyByPriority(row: LessonRow): { key: string; kind: "slug" | "id" | "title"; normalizedTitle: string } {
  const normalizedTitle = normalizeLessonTitleForDedupe(row.title);
  const slug = row.slug.trim().toLowerCase();
  if (slug) return { key: `slug:${slug}`, kind: "slug", normalizedTitle };
  if (row.id.trim()) return { key: `id:${row.id.trim()}`, kind: "id", normalizedTitle };
  return { key: `title:${normalizedTitle}`, kind: "title", normalizedTitle };
}

function chooseCanonical(members: DuplicateCandidate[]): {
  canonicalId: string;
  duplicateIds: string[];
  ambiguous: boolean;
  reasonIfAmbiguous?: string;
} {
  const sorted = [...members].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.references.total !== a.references.total) return b.references.total - a.references.total;
    if (b.updatedAt.getTime() !== a.updatedAt.getTime()) return b.updatedAt.getTime() - a.updatedAt.getTime();
    return a.id.localeCompare(b.id);
  });
  const top = sorted[0];
  const second = sorted[1];
  if (!top) {
    return { canonicalId: "", duplicateIds: [], ambiguous: true, reasonIfAmbiguous: "empty_group" };
  }
  if (
    second &&
    second.score === top.score &&
    second.references.total === top.references.total &&
    second.updatedAt.getTime() === top.updatedAt.getTime()
  ) {
    return {
      canonicalId: top.id,
      duplicateIds: sorted.slice(1).map((x) => x.id),
      ambiguous: true,
      reasonIfAmbiguous: "top_candidates_tied_on_score_references_updatedAt",
    };
  }
  return {
    canonicalId: top.id,
    duplicateIds: sorted.slice(1).map((x) => x.id),
    ambiguous: false,
  };
}

async function loadReferenceCounts(rows: LessonRow[]): Promise<Map<string, ReferenceCounts>> {
  const ids = rows.map((r) => r.id);
  const syntheticIds = rows.map((r) => syntheticProgressId(r.pathwayId, r.slug));
  const sourceIds = rows.map((r) => `${r.pathwayId}:${r.slug}`);

  const [progressGroups, overlayGroups, noteIdGroups, noteSyntheticGroups] = await Promise.all([
    prisma.progress.groupBy({
      by: ["lessonId"],
      where: { lessonId: { in: syntheticIds } },
      _count: { _all: true },
    }),
    prisma.educationalTranslationOverlay.groupBy({
      by: ["sourceId"],
      where: { sourceKind: EducationalTranslationSourceKind.PATHWAY_LESSON, sourceId: { in: sourceIds } },
      _count: { _all: true },
    }),
    prisma.learnerNote.groupBy({
      by: ["contextId"],
      where: { scope: LearnerNoteScope.PATHWAY_LESSON, contextId: { in: ids } },
      _count: { _all: true },
    }),
    prisma.learnerNote.groupBy({
      by: ["contextId"],
      where: { scope: LearnerNoteScope.PATHWAY_LESSON, contextId: { in: syntheticIds } },
      _count: { _all: true },
    }),
  ]);

  const progressMap = new Map(progressGroups.map((g) => [g.lessonId, g._count._all]));
  const overlayMap = new Map(overlayGroups.map((g) => [g.sourceId, g._count._all]));
  const noteIdMap = new Map(noteIdGroups.map((g) => [g.contextId, g._count._all]));
  const noteSyntheticMap = new Map(noteSyntheticGroups.map((g) => [g.contextId, g._count._all]));

  const out = new Map<string, ReferenceCounts>();
  for (const row of rows) {
    const progress = progressMap.get(syntheticProgressId(row.pathwayId, row.slug)) ?? 0;
    const overlays = overlayMap.get(`${row.pathwayId}:${row.slug}`) ?? 0;
    const notesById = noteIdMap.get(row.id) ?? 0;
    const notesBySynthetic = noteSyntheticMap.get(syntheticProgressId(row.pathwayId, row.slug)) ?? 0;
    out.set(row.id, {
      progress,
      overlays,
      notesById,
      notesBySynthetic,
      total: progress + overlays + notesById + notesBySynthetic,
    });
  }
  return out;
}

async function buildDuplicateGroups(pathwayFilter?: string): Promise<{
  rows: LessonRow[];
  groups: DuplicateGroup[];
  titleCollisionSignals: Array<{ pathwayId: string; locale: string; normalizedTitle: string; ids: string[]; slugs: string[]; titles: string[] }>;
}> {
  const rows = await prisma.pathwayLesson.findMany({
    where: pathwayFilter ? { pathwayId: pathwayFilter } : undefined,
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      status: true,
      locale: true,
      sections: true,
      previewSectionCount: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ pathwayId: "asc" }, { slug: "asc" }, { updatedAt: "desc" }],
  });

  const refs = await loadReferenceCounts(rows);
  const byPathwaySlug = new Map<string, LessonRow[]>();
  for (const row of rows) {
    const key = `${row.pathwayId}::${row.slug.toLowerCase()}`;
    const bucket = byPathwaySlug.get(key) ?? [];
    bucket.push(row);
    byPathwaySlug.set(key, bucket);
  }

  const duplicateRowIds = new Set<string>();
  const groups: DuplicateGroup[] = [];

  for (const [key, members] of byPathwaySlug) {
    if (members.length < 2) continue;
    members.forEach((m) => duplicateRowIds.add(m.id));
    const candidates: DuplicateCandidate[] = members.map((row) => {
      const dedupe = keyByPriority(row);
      const rowRefs = refs.get(row.id) ?? { progress: 0, overlays: 0, notesById: 0, notesBySynthetic: 0, total: 0 };
      const scored = scoreCandidate(row, rowRefs);
      return {
        ...row,
        dedupeKey: dedupe.key,
        dedupeKind: "slug",
        normalizedTitle: dedupe.normalizedTitle,
        score: scored.score,
        scoreBreakdown: scored.breakdown,
        references: rowRefs,
      };
    });
    const chosen = chooseCanonical(candidates);
    groups.push({
      groupKey: `${members[0]!.pathwayId}|slug:${members[0]!.slug.toLowerCase()}`,
      pathwayId: members[0]!.pathwayId,
      dedupeKind: "slug",
      members: candidates,
      canonicalId: chosen.canonicalId,
      duplicateIds: chosen.duplicateIds,
      ambiguous: chosen.ambiguous,
      reasonIfAmbiguous: chosen.reasonIfAmbiguous,
    });
  }

  const unresolved = rows.filter((r) => !duplicateRowIds.has(r.id));
  const byPathwayTitle = new Map<string, LessonRow[]>();
  for (const row of unresolved) {
    const normalizedTitle = normalizeLessonTitleForDedupe(row.title);
    if (!normalizedTitle) continue;
    const key = `${row.pathwayId}::${normalizedTitle}`;
    const bucket = byPathwayTitle.get(key) ?? [];
    bucket.push(row);
    byPathwayTitle.set(key, bucket);
  }

  const titleCollisionSignals: Array<{ pathwayId: string; locale: string; normalizedTitle: string; ids: string[]; slugs: string[]; titles: string[] }> = [];
  for (const [key, members] of byPathwayTitle) {
    if (members.length < 2) continue;
    const normalizedTitle = key.split("::")[1] ?? "";
    const localeSet = new Set(members.map((m) => m.locale));
    for (const locale of localeSet) {
      const sameLocale = members.filter((m) => m.locale === locale);
      if (sameLocale.length < 2) continue;
      titleCollisionSignals.push({
        pathwayId: sameLocale[0]!.pathwayId,
        locale,
        normalizedTitle,
        ids: sameLocale.map((m) => m.id),
        slugs: sameLocale.map((m) => m.slug),
        titles: sameLocale.map((m) => m.title),
      });
      const candidates: DuplicateCandidate[] = sameLocale.map((row) => {
        const dedupe = keyByPriority({ ...row, slug: "" });
        const rowRefs = refs.get(row.id) ?? { progress: 0, overlays: 0, notesById: 0, notesBySynthetic: 0, total: 0 };
        const scored = scoreCandidate(row, rowRefs);
        return {
          ...row,
          dedupeKey: dedupe.key,
          dedupeKind: "title",
          normalizedTitle: dedupe.normalizedTitle,
          score: scored.score,
          scoreBreakdown: scored.breakdown,
          references: rowRefs,
        };
      });
      const chosen = chooseCanonical(candidates);
      groups.push({
        groupKey: `${sameLocale[0]!.pathwayId}|title:${normalizedTitle}`,
        pathwayId: sameLocale[0]!.pathwayId,
        dedupeKind: "title",
        members: candidates,
        canonicalId: chosen.canonicalId,
        duplicateIds: chosen.duplicateIds,
        ambiguous: chosen.ambiguous,
        reasonIfAmbiguous: chosen.reasonIfAmbiguous,
      });
    }
  }

  return { rows, groups, titleCollisionSignals };
}

async function reassignReferencesAndArchive(group: DuplicateGroup): Promise<void> {
  const canonical = group.members.find((m) => m.id === group.canonicalId);
  if (!canonical) throw new Error(`canonical_missing:${group.groupKey}`);
  if (group.duplicateIds.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const duplicateId of group.duplicateIds) {
      const duplicate = group.members.find((m) => m.id === duplicateId);
      if (!duplicate) throw new Error(`duplicate_missing:${group.groupKey}:${duplicateId}`);
      const oldSynthetic = syntheticProgressId(duplicate.pathwayId, duplicate.slug);
      const newSynthetic = syntheticProgressId(canonical.pathwayId, canonical.slug);
      const oldSourceId = `${duplicate.pathwayId}:${duplicate.slug}`;
      const newSourceId = `${canonical.pathwayId}:${canonical.slug}`;

      if (oldSynthetic !== newSynthetic) {
        await tx.progress.updateMany({
          where: { lessonId: oldSynthetic },
          data: { lessonId: newSynthetic },
        });
        await tx.learnerNote.updateMany({
          where: { scope: LearnerNoteScope.PATHWAY_LESSON, contextId: oldSynthetic },
          data: { contextId: newSynthetic },
        });
      }

      await tx.learnerNote.updateMany({
        where: { scope: LearnerNoteScope.PATHWAY_LESSON, contextId: duplicate.id },
        data: { contextId: canonical.id },
      });

      if (oldSourceId !== newSourceId) {
        const oldOverlays = await tx.educationalTranslationOverlay.findMany({
          where: { sourceKind: EducationalTranslationSourceKind.PATHWAY_LESSON, sourceId: oldSourceId },
          select: { id: true, locale: true },
        });
        for (const overlay of oldOverlays) {
          const conflict = await tx.educationalTranslationOverlay.findFirst({
            where: {
              sourceKind: EducationalTranslationSourceKind.PATHWAY_LESSON,
              sourceId: newSourceId,
              locale: overlay.locale,
              NOT: { id: overlay.id },
            },
            select: { id: true },
          });
          if (conflict) {
            throw new Error(
              `overlay_conflict:${group.groupKey}:duplicate=${duplicate.id}:locale=${overlay.locale}`,
            );
          }
        }
        await tx.educationalTranslationOverlay.updateMany({
          where: { sourceKind: EducationalTranslationSourceKind.PATHWAY_LESSON, sourceId: oldSourceId },
          data: { sourceId: newSourceId },
        });
      }

      await tx.pathwayLesson.update({
        where: { id: duplicate.id },
        data: { status: ContentStatus.ARCHIVED },
      });
    }
  });
}

function reportDirForRun(cli: CliOptions): string {
  if (cli.reportDir?.trim()) {
    return path.resolve(process.cwd(), cli.reportDir.trim());
  }
  return path.resolve(process.cwd(), "reports", "lesson-dedupe", nowStamp());
}

function writeReports(
  dir: string,
  data: {
    rowsScanned: number;
    duplicateGroups: DuplicateGroup[];
    titleCollisionSignals: Array<{ pathwayId: string; locale: string; normalizedTitle: string; ids: string[]; slugs: string[]; titles: string[] }>;
    catalogSignals: Array<{ pathwayId: string; normalizedTitle: string; slugs: string[]; titles: string[] }>;
    applied: boolean;
  },
): { jsonPath: string; csvPath: string; mdPath: string } {
  fs.mkdirSync(dir, { recursive: true });
  const jsonPath = path.join(dir, "duplicate-report.json");
  const csvPath = path.join(dir, "duplicate-report.csv");
  const mdPath = path.join(dir, "summary.md");

  const jsonPayload = {
    generatedAt: new Date().toISOString(),
    rowsScanned: data.rowsScanned,
    duplicateGroupCount: data.duplicateGroups.length,
    duplicateGroups: data.duplicateGroups.map((g) => ({
      groupKey: g.groupKey,
      pathwayId: g.pathwayId,
      dedupeKind: g.dedupeKind,
      canonicalId: g.canonicalId,
      duplicateIds: g.duplicateIds,
      ambiguous: g.ambiguous,
      reasonIfAmbiguous: g.reasonIfAmbiguous,
      members: g.members.map((m) => ({
        id: m.id,
        pathwayId: m.pathwayId,
        slug: m.slug,
        title: m.title,
        status: m.status,
        locale: m.locale,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        normalizedTitle: m.normalizedTitle,
        score: m.score,
        scoreBreakdown: m.scoreBreakdown,
        references: m.references,
      })),
    })),
    titleCollisionSignals: data.titleCollisionSignals,
    catalogSignals: data.catalogSignals,
    applied: data.applied,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(jsonPayload, null, 2), "utf8");

  const csvLines = [
    [
      "group_key",
      "pathway_id",
      "dedupe_kind",
      "member_id",
      "member_slug",
      "member_title",
      "member_status",
      "member_locale",
      "member_score",
      "member_total_references",
      "canonical_id",
      "is_canonical",
      "ambiguous",
    ].join(","),
  ];
  for (const group of data.duplicateGroups) {
    for (const member of group.members) {
      csvLines.push(
        [
          cleanCsvCell(group.groupKey),
          cleanCsvCell(group.pathwayId),
          cleanCsvCell(group.dedupeKind),
          cleanCsvCell(member.id),
          cleanCsvCell(member.slug),
          cleanCsvCell(member.title),
          cleanCsvCell(member.status),
          cleanCsvCell(member.locale),
          cleanCsvCell(member.score),
          cleanCsvCell(member.references.total),
          cleanCsvCell(group.canonicalId),
          cleanCsvCell(member.id === group.canonicalId ? "yes" : "no"),
          cleanCsvCell(group.ambiguous ? "yes" : "no"),
        ].join(","),
      );
    }
  }
  fs.writeFileSync(csvPath, `${csvLines.join("\n")}\n`, "utf8");

  const ambiguousCount = data.duplicateGroups.filter((g) => g.ambiguous).length;
  const md = [
    "# Pathway Lesson Dedupe Summary",
    "",
    `- Rows scanned: ${data.rowsScanned}`,
    `- Duplicate groups: ${data.duplicateGroups.length}`,
    `- Ambiguous groups: ${ambiguousCount}`,
    `- Apply mode: ${data.applied ? "yes" : "no (dry-run)"}`,
    `- Title collision signals (same pathway+locale+normalized title): ${data.titleCollisionSignals.length}`,
    `- Catalog merge collision signals: ${data.catalogSignals.length}`,
    "",
    "## Top duplicate groups",
    "",
    ...data.duplicateGroups.slice(0, 25).flatMap((g) => [
      `- \`${g.groupKey}\` (${g.members.length} rows, canonical: \`${g.canonicalId}\`${g.ambiguous ? ", AMBIGUOUS" : ""})`,
    ]),
    "",
  ].join("\n");
  fs.writeFileSync(mdPath, md, "utf8");

  return { jsonPath, csvPath, mdPath };
}

function collectCatalogCollisionSignals(): Array<{ pathwayId: string; normalizedTitle: string; slugs: string[]; titles: string[] }> {
  const out: Array<{ pathwayId: string; normalizedTitle: string; slugs: string[]; titles: string[] }> = [];
  const data = catalog as unknown as CatalogShape;
  for (const [pathwayId, bucket] of Object.entries(data.pathways ?? {})) {
    const byTitle = new Map<string, Array<{ slug: string; title: string }>>();
    for (const lesson of bucket.lessons ?? []) {
      const title = String(lesson.title ?? "").trim();
      const normalized = normalizeLessonTitleForDedupe(title);
      if (!normalized) continue;
      const list = byTitle.get(normalized) ?? [];
      list.push({ slug: String(lesson.slug ?? ""), title });
      byTitle.set(normalized, list);
    }
    for (const [normalizedTitle, rows] of byTitle) {
      if (rows.length < 2) continue;
      out.push({
        pathwayId,
        normalizedTitle,
        slugs: rows.map((r) => r.slug),
        titles: rows.map((r) => r.title),
      });
    }
  }
  return out;
}

async function main() {
  const cli = parseArgs(process.argv.slice(2));
  const { rows, groups, titleCollisionSignals } = await buildDuplicateGroups(cli.pathway);

  const filteredGroups = groups.filter((g) => {
    if (cli.pathway && g.pathwayId !== cli.pathway) return false;
    if (cli.group && g.groupKey !== cli.group) return false;
    return true;
  });
  const ambiguousGroups = filteredGroups.filter((g) => g.ambiguous);
  const actionableGroups = filteredGroups.filter((g) => !g.ambiguous && g.duplicateIds.length > 0);

  console.log(
    `[lessons-dedupe] scanned=${rows.length} groups=${filteredGroups.length} actionable=${actionableGroups.length} ambiguous=${ambiguousGroups.length} mode=${cli.apply ? "APPLY" : "DRY_RUN"}`,
  );

  if (cli.apply && ambiguousGroups.length > 0) {
    throw new Error(
      `Refusing apply: ${ambiguousGroups.length} ambiguous group(s). Resolve manually or pass --group=<single_non_ambiguous_group>.`,
    );
  }

  if (cli.apply && !cli.reportOnly) {
    for (const group of actionableGroups) {
      console.log(`[apply] ${group.groupKey} canonical=${group.canonicalId} archive=${group.duplicateIds.length}`);
      await reassignReferencesAndArchive(group);
    }
  }

  const reportDir = reportDirForRun(cli);
  const catalogSignals = collectCatalogCollisionSignals();
  const written = writeReports(reportDir, {
    rowsScanned: rows.length,
    duplicateGroups: filteredGroups,
    titleCollisionSignals,
    catalogSignals,
    applied: cli.apply && !cli.reportOnly,
  });

  console.log(`[lessons-dedupe] JSON: ${written.jsonPath}`);
  console.log(`[lessons-dedupe] CSV: ${written.csvPath}`);
  console.log(`[lessons-dedupe] MD : ${written.mdPath}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
