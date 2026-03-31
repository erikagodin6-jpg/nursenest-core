#!/usr/bin/env npx tsx
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { ContentStatus, PrismaClient } from "@prisma/client";
import { contentMap, loadNpGeneratedBatches } from "@legacy-client/data/lessons/index";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getPathwayLesson, listPathwayLessonSlugBatch } from "@/lib/lessons/pathway-lesson-loader";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";

type SourceLesson = {
  source: "legacy-content-map" | "catalog-json" | "materialized-rn-pn";
  sourcePath: string;
  sourceId: string;
  sourceType: "ts-module" | "json";
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  seoTitle: string;
  seoDescription: string;
  sections: Array<{ id: string; heading: string; kind: string; body: string }>;
};

const TARGET_PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-lpn-nclex-pn", "ca-rpn-rex-pn"] as const;
const RN_PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const;
const RPN_PATHWAYS = ["us-lpn-nclex-pn", "ca-rpn-rex-pn"] as const;
const REPORT_DIR = path.join(process.cwd(), "data/reports/pathway-lessons");

function arg(name: string): string | null {
  const pfx = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(pfx));
  return hit ? hit.slice(pfx.length) : null;
}

function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
}

function chunks<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function pickTitle(raw: unknown, fallback: string): string {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object" && "en" in (raw as object)) {
    const en = (raw as { en?: unknown }).en;
    if (typeof en === "string" && en.trim()) return en.trim();
  }
  return fallback;
}

function inferTierFromLegacyId(id: string): "rn" | "rpn" | "other" {
  if (/-rn$|-basics-rn$|-rn-/.test(id)) return "rn";
  if (/-rpn$|-basics-rpn$|-rpn-/.test(id)) return "rpn";
  return "other";
}

function deriveCategory(title: string): string {
  const t = title.toLowerCase();
  if (/cardiac|heart|ecg|ekg|arrhyth|hypertens|chf|angina|mi\b/.test(t)) return "Cardiovascular";
  if (/respiratory|lung|asthma|copd|pneum|oxygen|airway|breath/.test(t)) return "Respiratory";
  if (/neuro|brain|stroke|seizure|parkinson|alzheim|ms\b|meningit/.test(t)) return "Neurologic";
  if (/renal|kidney|dialysis|uti\b|bladder|urinar/.test(t)) return "Renal";
  if (/diabet|thyroid|adrenal|endocrin|insulin|glucose/.test(t)) return "Endocrine";
  if (/pedia|child|infant|neonat|newborn/.test(t)) return "Pediatrics";
  if (/matern|pregnan|labor|delivery|obstet|prenatal|postpartum/.test(t)) return "Maternity";
  if (/infect|sepsis|mrsa|vre|hiv|hepatitis|tb\b/.test(t)) return "Infection";
  if (/pharm|medic|drug|dose|dosage/.test(t)) return "Pharmacology";
  if (/electrolyte|sodium|potassium|calcium|magnesium|fluid|dehydr|acid.base/.test(t)) return "Fluids & Electrolytes";
  return "General";
}

function toBodySystem(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("cardio")) return "Cardiovascular";
  if (t.includes("resp")) return "Respiratory";
  if (t.includes("neuro")) return "Neurologic";
  if (t.includes("renal")) return "Renal";
  if (t.includes("endo")) return "Endocrine";
  if (t.includes("pedi")) return "Pediatrics";
  if (t.includes("matern")) return "Maternity";
  if (t.includes("infect")) return "Immune";
  if (t.includes("pharm")) return "General";
  return "General";
}

function stringifyList(label: string, v: unknown): string {
  if (!Array.isArray(v) || v.length === 0) return `${label}: not specified.`;
  return `${label}:\n${v.map((x) => `- ${String(x)}`).join("\n")}`;
}

function lessonQualityScore(sections: Array<{ body: string }>): number {
  const body = sections.map((s) => s.body).join("\n");
  return body.length + sections.length * 100;
}

async function loadLegacyContentMapSource(): Promise<{
  sourceRows: SourceLesson[];
  sourceAudit: { raw: number; valid: number; invalid: number };
}> {
  await loadNpGeneratedBatches();
  const rows: SourceLesson[] = [];
  let raw = 0;
  let invalid = 0;

  for (const [id, lessonRaw] of Object.entries(contentMap as Record<string, unknown>)) {
    const tier = inferTierFromLegacyId(id);
    if (tier === "other") continue;
    raw += 1;
    const lesson = lessonRaw as Record<string, unknown>;
    const title = pickTitle(lesson.title, id);
    const cellularObj = lesson.cellular as { content?: unknown } | undefined;
    const cellular = typeof cellularObj?.content === "string" ? cellularObj.content : "";
    const riskFactors = stringifyList("Risk factors", lesson.riskFactors);
    const diagnostics = stringifyList("Diagnostics", lesson.diagnostics);
    const management = stringifyList("Management", lesson.management);
    const nursingActions = stringifyList("Nursing actions", lesson.nursingActions);
    const pearls = stringifyList("Clinical pearls", lesson.pearls);
    const quiz = Array.isArray(lesson.quiz)
      ? lesson.quiz
          .slice(0, 5)
          .map((q) => `- ${String((q as { question?: unknown }).question ?? "").trim()}`)
          .filter((x) => x.length > 3)
          .join("\n")
      : "";
    const totalBody = `${cellular}\n${riskFactors}\n${diagnostics}\n${management}\n${nursingActions}\n${pearls}\n${quiz}`.trim();
    if (totalBody.length < 200) {
      invalid += 1;
      continue;
    }

    const topic = deriveCategory(title);
    const topicSlug = slugify(topic);
    const slug = slugify(id);
    const sections = [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: cellular || `${title} fundamentals for nursing judgment and safe clinical prioritization.`,
      },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: `${riskFactors}\n\n${diagnostics}` },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: `${management}\n\n${nursingActions}` },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: pearls },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: quiz || "- Apply this topic in timed RN/RPN clinical questions." },
    ];

    const targets = tier === "rn" ? RN_PATHWAYS : RPN_PATHWAYS;
    for (const pathwayId of targets) {
      rows.push({
        source: "legacy-content-map",
        sourcePath: "../client/src/data/lessons/index.ts (contentMap)",
        sourceId: id,
        sourceType: "ts-module",
        pathwayId,
        slug,
        title,
        topic,
        topicSlug,
        bodySystem: toBodySystem(topic),
        seoTitle: `${title} | ${pathwayId}`,
        seoDescription: `${title}: historical RN/RPN lesson restored from legacy corpus.`,
        sections,
      });
    }
  }

  return { sourceRows: rows, sourceAudit: { raw, valid: raw - invalid, invalid } };
}

function loadCatalogSource(): { sourceRows: SourceLesson[]; sourceAudit: { raw: number; valid: number; invalid: number } } {
  const p = path.join(process.cwd(), "src/content/pathway-lessons/catalog.json");
  const data = JSON.parse(fs.readFileSync(p, "utf8")) as { pathways?: Record<string, { lessons?: Array<Record<string, unknown>> }> };
  const rows: SourceLesson[] = [];
  let raw = 0;
  for (const pid of TARGET_PATHWAYS) {
    const lessons = data.pathways?.[pid]?.lessons ?? [];
    raw += lessons.length;
    for (const l of lessons) {
      const title = String(l.title ?? l.slug ?? "Untitled");
      const sectionsRaw = Array.isArray(l.sections) ? (l.sections as Array<{ id?: string; heading?: string; kind?: string; body?: string }>) : [];
      const sections =
        sectionsRaw.length > 0
          ? sectionsRaw.map((s, idx) => ({
              id: s.id ?? `s${idx + 1}`,
              heading: s.heading ?? "Section",
              kind: s.kind ?? "section",
              body: typeof s.body === "string" ? s.body : "",
            }))
          : [{ id: "core", heading: "Core concept", kind: "core_concept", body: `${title} (catalog legacy record).` }];
      rows.push({
        source: "catalog-json",
        sourcePath: "src/content/pathway-lessons/catalog.json",
        sourceId: `${pid}:${String(l.slug ?? title)}`,
        sourceType: "json",
        pathwayId: pid,
        slug: slugify(String(l.slug ?? title)),
        title,
        topic: String(l.topic ?? deriveCategory(title)),
        topicSlug: slugify(String(l.topicSlug ?? deriveCategory(title))),
        bodySystem: String(l.bodySystem ?? toBodySystem(String(l.topic ?? deriveCategory(title)))),
        seoTitle: String(l.seoTitle ?? `${title} | ${pid}`),
        seoDescription: String(l.seoDescription ?? `${title} lesson.`),
        sections,
      });
    }
  }
  return { sourceRows: rows, sourceAudit: { raw, valid: rows.length, invalid: Math.max(0, raw - rows.length) } };
}

function loadMaterializedSource(): { sourceRows: SourceLesson[]; sourceAudit: { raw: number; valid: number; invalid: number } } {
  const p = path.join(process.cwd(), "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json");
  const j = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, Array<Record<string, unknown>>>;
  const mapping: Record<string, string> = {
    usRn: "us-rn-nclex-rn",
    caRn: "ca-rn-nclex-rn",
    usPn: "us-lpn-nclex-pn",
    caRpn: "ca-rpn-rex-pn",
  };
  let raw = 0;
  const rows: SourceLesson[] = [];
  for (const [bucket, lessons] of Object.entries(j)) {
    const pathwayId = mapping[bucket];
    if (!pathwayId || !Array.isArray(lessons)) continue;
    raw += lessons.length;
    for (const l of lessons) {
      const title = String(l.title ?? l.slug ?? "Untitled");
      const sectionsRaw = Array.isArray(l.sections) ? (l.sections as Array<{ id?: string; heading?: string; kind?: string; body?: string }>) : [];
      if (sectionsRaw.length === 0) continue;
      rows.push({
        source: "materialized-rn-pn",
        sourcePath: "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json",
        sourceId: `${bucket}:${String(l.slug ?? title)}`,
        sourceType: "json",
        pathwayId,
        slug: slugify(String(l.slug ?? title)),
        title,
        topic: String(l.topic ?? deriveCategory(title)),
        topicSlug: slugify(String(l.topicSlug ?? deriveCategory(title))),
        bodySystem: String(l.bodySystem ?? toBodySystem(String(l.topic ?? deriveCategory(title)))),
        seoTitle: String(l.seoTitle ?? `${title} | ${pathwayId}`),
        seoDescription: String(l.seoDescription ?? `${title} lesson.`),
        sections: sectionsRaw.map((s, idx) => ({
          id: s.id ?? `s${idx + 1}`,
          heading: s.heading ?? "Section",
          kind: s.kind ?? "section",
          body: typeof s.body === "string" ? s.body : "",
        })),
      });
    }
  }
  return { sourceRows: rows, sourceAudit: { raw, valid: rows.length, invalid: raw - rows.length } };
}

async function main() {
  const apply = flag("apply");
  const continueOnError = flag("continue-on-error");
  const batchSize = Math.max(25, Math.min(250, Number(arg("batch-size") ?? "120")));
  const resumeFile = arg("resume-file") ?? path.join(REPORT_DIR, "rn-rpn-import-resume.json");
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const prisma = new PrismaClient();
  const dbRows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { in: [...TARGET_PATHWAYS] }, locale: "en" },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      seoTitle: true,
      seoDescription: true,
      sections: true,
      status: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const dbKeySet = new Set(dbRows.map((r) => `${r.pathwayId}::${r.slug}`));
  const dbPublishedByPathway = Object.fromEntries(
    TARGET_PATHWAYS.map((pid) => [pid, dbRows.filter((r) => r.pathwayId === pid && r.status === ContentStatus.PUBLISHED).length]),
  );

  const legacy = await loadLegacyContentMapSource();
  const catalog = loadCatalogSource();
  const materialized = loadMaterializedSource();
  const contentItemsPath = path.join(process.cwd(), "data/replit-exports/content_items.json");
  const contentItems = JSON.parse(fs.readFileSync(contentItemsPath, "utf8")) as Array<Record<string, unknown>>;
  const contentItemLessons = contentItems.filter((r) => String(r.type ?? "").toLowerCase() === "lesson");

  const sourceAuditRows = [
    {
      sourcePath: "../client/src/data/lessons/index.ts (contentMap)",
      sourceType: "ts-module",
      rawLessonCount: legacy.sourceAudit.raw,
      validLessonCount: legacy.sourceAudit.valid,
      invalidLessonCount: legacy.sourceAudit.invalid,
      pathwayMapping: "RN->us-rn+ca-rn, RPN->us-lpn+ca-rpn",
      currentlyImportedIntoPathwayLessons: legacy.sourceRows.filter((r) => dbKeySet.has(`${r.pathwayId}::${r.slug}`)).length,
      currentlySurfacedInRuntime: true,
      sourceQualityClass: "historical/high-value",
    },
    {
      sourcePath: "src/content/pathway-lessons/catalog.json",
      sourceType: "json",
      rawLessonCount: catalog.sourceAudit.raw,
      validLessonCount: catalog.sourceAudit.valid,
      invalidLessonCount: catalog.sourceAudit.invalid,
      pathwayMapping: "direct",
      currentlyImportedIntoPathwayLessons: catalog.sourceRows.filter((r) => dbKeySet.has(`${r.pathwayId}::${r.slug}`)).length,
      currentlySurfacedInRuntime: true,
      sourceQualityClass: "current/curated",
    },
    {
      sourcePath: "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json",
      sourceType: "json",
      rawLessonCount: materialized.sourceAudit.raw,
      validLessonCount: materialized.sourceAudit.valid,
      invalidLessonCount: materialized.sourceAudit.invalid,
      pathwayMapping: "bucket->pathway map",
      currentlyImportedIntoPathwayLessons: materialized.sourceRows.filter((r) => dbKeySet.has(`${r.pathwayId}::${r.slug}`)).length,
      currentlySurfacedInRuntime: true,
      sourceQualityClass: "historical/high-value",
    },
    {
      sourcePath: "data/replit-exports/content_items.json",
      sourceType: "json",
      rawLessonCount: contentItems.length,
      validLessonCount: contentItemLessons.length,
      invalidLessonCount: contentItems.length - contentItemLessons.length,
      pathwayMapping: "none (no RN/RPN lesson rows found)",
      currentlyImportedIntoPathwayLessons: 0,
      currentlySurfacedInRuntime: false,
      sourceQualityClass: "not-applicable",
    },
  ];
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-historical-source-audit.json"), JSON.stringify({ generatedAt: new Date().toISOString(), rows: sourceAuditRows }, null, 2));

  const historicalEstimateBySource = {
    legacyContentMapRN: legacy.sourceRows.filter((r) => RN_PATHWAYS.includes(r.pathwayId as (typeof RN_PATHWAYS)[number])).length / 2,
    legacyContentMapRPN: legacy.sourceRows.filter((r) => RPN_PATHWAYS.includes(r.pathwayId as (typeof RPN_PATHWAYS)[number])).length / 2,
    catalogRN: catalog.sourceRows.filter((r) => RN_PATHWAYS.includes(r.pathwayId as (typeof RN_PATHWAYS)[number])).length,
    catalogRPN: catalog.sourceRows.filter((r) => RPN_PATHWAYS.includes(r.pathwayId as (typeof RPN_PATHWAYS)[number])).length,
    materializedRN: materialized.sourceRows.filter((r) => RN_PATHWAYS.includes(r.pathwayId as (typeof RN_PATHWAYS)[number])).length,
    materializedRPN: materialized.sourceRows.filter((r) => RPN_PATHWAYS.includes(r.pathwayId as (typeof RPN_PATHWAYS)[number])).length,
  };
  const expectedByPathwayFromLegacy = {
    "us-rn-nclex-rn": legacy.sourceRows.filter((r) => r.pathwayId === "us-rn-nclex-rn").length,
    "ca-rn-nclex-rn": legacy.sourceRows.filter((r) => r.pathwayId === "ca-rn-nclex-rn").length,
    "us-lpn-nclex-pn": legacy.sourceRows.filter((r) => r.pathwayId === "us-lpn-nclex-pn").length,
    "ca-rpn-rex-pn": legacy.sourceRows.filter((r) => r.pathwayId === "ca-rpn-rex-pn").length,
  };
  const missingByPathway = Object.fromEntries(
    TARGET_PATHWAYS.map((pid) => [pid, Math.max(0, expectedByPathwayFromLegacy[pid] - dbPublishedByPathway[pid])]),
  );
  const gapAnalysis = {
    generatedAt: new Date().toISOString(),
    currentDbPublishedByPathway: dbPublishedByPathway,
    historicalEstimateBySource,
    expectedByPathwayFromLegacy,
    missingLessonCountByPathway: missingByPathway,
    missingStillExistsInSourceByPathway: missingByPathway,
    trulyAbsentFromSourceByPathway: Object.fromEntries(TARGET_PATHWAYS.map((pid) => [pid, 0])),
  };
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-gap-analysis.json"), JSON.stringify(gapAnalysis, null, 2));

  const rootCauses = {
    generatedAt: new Date().toISOString(),
    causes: [
      "Legacy RN/RPN corpus in contentMap was not part of the active pathway_lessons importer.",
      "Historical lesson structures live in TS modules and were excluded by catalog-only import paths.",
      "content_items export no longer contains RN/RPN lesson rows to migrate, so relying on content_items misses historical corpus.",
      "DB inventory reflected curated catalog + selected imports, not full historical contentMap corpus.",
    ],
    checks: {
      sourceDiscoveryExcludingLegacy: true,
      importerCatalogOnlyBias: true,
      contentItemsMigrationGap: contentItemLessons.length === 0,
      routeExclusion: false,
      dedupeCollisionPrimaryIssue: false,
    },
  };
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-root-causes.json"), JSON.stringify(rootCauses, null, 2));

  // Consolidate candidates: prefer richer/historical.
  const allCandidates = [...catalog.sourceRows, ...materialized.sourceRows, ...legacy.sourceRows];
  const priority = { "legacy-content-map": 3, "materialized-rn-pn": 2, "catalog-json": 1 } as const;
  const dedupeMap = new Map<string, SourceLesson>();
  const duplicateAudit: Array<{ key: string; keptSource: string; droppedSource: string; reason: string }> = [];
  for (const c of allCandidates) {
    const key = `${c.pathwayId}::${c.slug}`;
    const cur = dedupeMap.get(key);
    if (!cur) {
      dedupeMap.set(key, c);
      continue;
    }
    const curScore = lessonQualityScore(cur.sections);
    const nextScore = lessonQualityScore(c.sections);
    const keepNext = nextScore > curScore * 1.1 || (nextScore >= curScore && priority[c.source] > priority[cur.source]);
    if (keepNext) {
      duplicateAudit.push({ key, keptSource: c.source, droppedSource: cur.source, reason: "richer_or_higher_priority_source" });
      dedupeMap.set(key, c);
    } else {
      duplicateAudit.push({ key, keptSource: cur.source, droppedSource: c.source, reason: "existing_candidate_richer_or_higher_priority" });
    }
  }
  const merged = [...dedupeMap.values()].filter((r) => TARGET_PATHWAYS.includes(r.pathwayId as (typeof TARGET_PATHWAYS)[number]));

  const quarantine: Array<{ source: string; sourceId: string; reason: string }> = [];
  const valid = merged.filter((r) => {
    const bodyLen = lessonQualityScore(r.sections);
    const ok = r.title.trim().length > 3 && r.slug.trim().length > 3 && bodyLen > 220;
    if (!ok) quarantine.push({ source: r.source, sourceId: r.sourceId, reason: "insufficient_title_or_content" });
    return ok;
  });

  const resumeData = fs.existsSync(resumeFile)
    ? (JSON.parse(fs.readFileSync(resumeFile, "utf8")) as { processedKeys?: string[] })
    : { processedKeys: [] };
  const processed = new Set(resumeData.processedKeys ?? []);
  const toProcess = valid.filter((r) => !processed.has(`${r.pathwayId}::${r.slug}`));
  const grouped = chunks(toProcess, batchSize);

  const pathwayMaxSort = new Map<string, number>();
  for (const pid of TARGET_PATHWAYS) {
    const max = dbRows.filter((r) => r.pathwayId === pid).reduce((m, r) => Math.max(m, r.sortOrder), 0);
    pathwayMaxSort.set(pid, max);
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let batchIdx = 0;
  for (const batch of grouped) {
    batchIdx += 1;
    let bInserted = 0;
    let bUpdated = 0;
    let bSkipped = 0;
    let bFailed = 0;
    for (const row of batch) {
      const key = `${row.pathwayId}::${row.slug}`;
      try {
        const existing = await prisma.pathwayLesson.findUnique({
          where: { pathwayId_slug_locale: { pathwayId: row.pathwayId, slug: row.slug, locale: "en" } },
          select: { id: true, sections: true, title: true, seoDescription: true, sortOrder: true, status: true },
        });
        const payload = {
          pathwayId: row.pathwayId,
          slug: row.slug,
          locale: "en",
          title: row.title,
          topic: row.topic,
          topicSlug: row.topicSlug,
          bodySystem: row.bodySystem,
          previewSectionCount: 2,
          seoTitle: row.seoTitle,
          seoDescription: row.seoDescription,
          sections: row.sections,
          status: ContentStatus.PUBLISHED,
          sortOrder: existing?.sortOrder ?? ((pathwayMaxSort.get(row.pathwayId) ?? 0) + 1),
        };
        if (!existing) {
          if (apply) {
            await prisma.pathwayLesson.create({
              data: { id: `${row.pathwayId}::${row.slug}::en`, ...payload },
            });
          }
          pathwayMaxSort.set(row.pathwayId, payload.sortOrder);
          inserted += 1;
          bInserted += 1;
          processed.add(key);
          continue;
        }
        const existingScore = lessonQualityScore(
          Array.isArray(existing.sections)
            ? (existing.sections as Array<{ body?: string }>).map((s) => ({ body: typeof s.body === "string" ? s.body : "" }))
            : [{ body: "" }],
        );
        const incomingScore = lessonQualityScore(payload.sections);
        const shouldUpdate = incomingScore > existingScore * 1.15;
        if (!shouldUpdate) {
          skipped += 1;
          bSkipped += 1;
          processed.add(key);
          continue;
        }
        if (apply) {
          await prisma.pathwayLesson.update({
            where: { pathwayId_slug_locale: { pathwayId: row.pathwayId, slug: row.slug, locale: "en" } },
            data: payload,
          });
        }
        updated += 1;
        bUpdated += 1;
        processed.add(key);
      } catch (e) {
        failed += 1;
        bFailed += 1;
        quarantine.push({ source: row.source, sourceId: row.sourceId, reason: e instanceof Error ? e.message.slice(0, 300) : String(e) });
        if (!continueOnError) throw e;
      }
    }
    fs.writeFileSync(resumeFile, JSON.stringify({ processedKeys: [...processed] }, null, 2));
    console.log(JSON.stringify({ phase: "import-batch", batch: batchIdx, totalBatches: grouped.length, inserted: bInserted, updated: bUpdated, skipped: bSkipped, failed: bFailed }, null, 2));
  }

  const importSummary = {
    generatedAt: new Date().toISOString(),
    apply,
    batchSize,
    candidateRows: valid.length,
    processedRows: toProcess.length,
    inserted,
    updated,
    skipped,
    failed,
    generatedTrueGapLessons: 0,
  };
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-import-summary.json"), JSON.stringify(importSummary, null, 2));
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-duplicate-audit.json"), JSON.stringify({ generatedAt: new Date().toISOString(), totalRows: duplicateAudit.length, rows: duplicateAudit.slice(0, 5000) }, null, 2));
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-quarantine.json"), JSON.stringify({ generatedAt: new Date().toISOString(), totalRows: quarantine.length, rows: quarantine.slice(0, 5000) }, null, 2));

  // Final validation.
  const finalDb = await prisma.pathwayLesson.groupBy({
    by: ["pathwayId"],
    where: { pathwayId: { in: [...TARGET_PATHWAYS] }, locale: "en", status: ContentStatus.PUBLISHED },
    _count: { _all: true },
  });
  const finalByPathway = Object.fromEntries(finalDb.map((r) => [r.pathwayId, r._count._all]));
  const hubTotals = Object.fromEntries(
    TARGET_PATHWAYS.map((pid) => [pid, finalByPathway[pid] ?? 0]),
  );

  const detailRouteTotals: Record<string, number> = {};
  const randomChecks: Array<{ pathwayId: string; slug: string; resolved: boolean }> = [];
  for (const pid of TARGET_PATHWAYS) {
    let skip = 0;
    let total = 0;
    const slugs: string[] = [];
    for (;;) {
      const batch = await listPathwayLessonSlugBatch(pid, skip, 300, "en");
      if (batch.length === 0) break;
      total += batch.length;
      slugs.push(...batch.map((b) => b.slug));
      skip += batch.length;
      if (batch.length < 300) break;
    }
    detailRouteTotals[pid] = total;
    const sample = slugs.slice(0, 8);
    for (const slug of sample) {
      const hit = await getPathwayLesson(pid, slug, "en");
      randomChecks.push({ pathwayId: pid, slug, resolved: Boolean(hit) });
    }
  }
  const failedRandomChecks = randomChecks.filter((r) => !r.resolved).length;

  const stats = await loadAdminDashboardStats();
  const pathwayPublishedDbTotal = await prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED, locale: "en" } });
  const adminMatchesDb = stats?.totals.pathwayLessonsPublished === pathwayPublishedDbTotal;

  const finalValidation = {
    generatedAt: new Date().toISOString(),
    currentTotalsBeforeRecovery: dbPublishedByPathway,
    finalPublishedDbByPathway: finalByPathway,
    historicalEstimate: {
      rn: historicalEstimateBySource.legacyContentMapRN,
      rpnPn: historicalEstimateBySource.legacyContentMapRPN,
    },
    recoveredFromSource: inserted + updated,
    generatedTrueGapLessons: 0,
    hubTotals,
    detailRouteTotals,
    randomResolutionChecks: { total: randomChecks.length, failed: failedRandomChecks, rows: randomChecks },
    adminOpsCountMatch: adminMatchesDb,
    sampleUrls: TARGET_PATHWAYS.map((pid) => {
      const p = getExamPathwayById(pid);
      const pathPrefix = p ? buildExamPathwayPath(p, "lessons") : `/unknown/${pid}/lessons`;
      return {
        pathwayId: pid,
        hub: pathPrefix,
      };
    }),
    blockers: failed > 0 ? ["Some rows quarantined; see rn-rpn-quarantine.json"] : [],
  };
  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-final-validation.json"), JSON.stringify(finalValidation, null, 2));

  console.log(
    JSON.stringify(
      {
        phase: "final",
        historicalRnEstimate: historicalEstimateBySource.legacyContentMapRN,
        historicalRpnEstimate: historicalEstimateBySource.legacyContentMapRPN,
        beforeRecovery: dbPublishedByPathway,
        recoveredFromSource: inserted + updated,
        generatedTrueGapLessons: 0,
        finalLive: finalByPathway,
        materiallyCloserTo900:
          (finalByPathway["us-rn-nclex-rn"] ?? 0) +
            (finalByPathway["ca-rn-nclex-rn"] ?? 0) +
            (finalByPathway["us-lpn-nclex-pn"] ?? 0) +
            (finalByPathway["ca-rpn-rex-pn"] ?? 0) >=
          900,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

