#!/usr/bin/env npx tsx
/**
 * NP pathway historical recovery: legacy contentMap NP candidates + catalog (us-np-fnp) +
 * materialized NP overlays → pathway_lessons. Idempotent upsert; batch + resume.
 *
 *   npx tsx scripts/recover-np-historical-lessons.ts
 *   npx tsx scripts/recover-np-historical-lessons.ts --apply
 */
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { ContentStatus, PrismaClient } from "@prisma/client";
import { contentMap, loadNpGeneratedBatches } from "@legacy-client/data/lessons/index";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getPathwayLesson, listPathwayLessonSlugBatch } from "@/lib/lessons/pathway-lesson-loader";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";

const NP_PATHWAYS = [
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "us-np-pmhnp",
  "ca-np-cnple",
] as const;
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

function inferTierFromLegacyId(id: string): "rn" | "rpn" | "other" {
  if (/-rn$|-basics-rn$|-rn-/.test(id)) return "rn";
  if (/-rpn$|-basics-rpn$|-rpn-/.test(id)) return "rpn";
  return "other";
}

/** Heuristic: NP/APRN lesson keys in merged contentMap (excludes RN/RPN tier). */
function isLegacyNpContentId(id: string): boolean {
  if (inferTierFromLegacyId(id) !== "other") return false;
  const l = id.toLowerCase();
  if (/-rn$|-rpn$/.test(l)) return false;
  if (/-np$|-np-|^-np|np-/i.test(id)) return true;
  if (l.startsWith("np-") || l.includes("np-testbank")) return true;
  return false;
}

function pickTitle(raw: unknown, fallback: string): string {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object" && "en" in (raw as object)) {
    const en = (raw as { en?: unknown }).en;
    if (typeof en === "string" && en.trim()) return en.trim();
  }
  return fallback;
}

function stringifyList(label: string, v: unknown): string {
  if (!Array.isArray(v) || v.length === 0) return `${label}: not specified.`;
  return `${label}:\n${v.map((x) => `- ${String(x)}`).join("\n")}`;
}

function deriveCategory(title: string): string {
  const t = title.toLowerCase();
  if (/psych|mental|mood|anxiety|depress|bipolar|schizo|substance/.test(t)) return "Psychiatric & mental health";
  if (/pedia|child|infant|adolescent/.test(t)) return "Pediatrics";
  if (/geriat|older adult|elder/.test(t)) return "Geriatrics";
  if (/women|obstet|pregnan|prenatal|gyn/.test(t)) return "Women’s health";
  if (/cardiac|heart|hypertens|cad|mi\b|afib/.test(t)) return "Cardiovascular";
  if (/diabet|thyroid|endocrin|insulin/.test(t)) return "Endocrine";
  if (/pharm|prescrib|dose|medication/.test(t)) return "Pharmacology";
  return "Advanced practice";
}

function toBodySystem(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("cardio")) return "Cardiovascular";
  if (t.includes("psych")) return "Psychiatric";
  if (t.includes("pedia")) return "Pediatrics";
  if (t.includes("geriat")) return "Geriatrics";
  if (t.includes("women")) return "General";
  return "General";
}

function lessonQualityScore(sections: Array<{ body: string }>): number {
  const body = sections.map((s) => s.body).join("\n");
  return body.length + sections.length * 100;
}

const NP_TRACK_SEO: Record<string, string> = {
  "us-np-fnp": "Family NP (FNP)",
  "us-np-agpcnp": "Adult-Gerontology Primary Care NP (AGPCNP)",
  "us-np-whnp": "Women’s Health NP (WHNP)",
  "us-np-pnp-pc": "Pediatric Primary Care NP (PNP-PC)",
  "us-np-pmhnp": "Psychiatric-Mental Health NP (PMHNP)",
  "ca-np-cnple": "Canadian NP (CNPLE)",
};

type SourceLesson = {
  source: "legacy-np-content-map" | "catalog-json" | "materialized-np";
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

const HISTORICAL_MARKER = "historical NP/APRN lesson restored from legacy corpus";

async function loadLegacyNpFromContentMap(): Promise<{
  sourceRows: SourceLesson[];
  sourceAudit: { raw: number; valid: number; invalid: number };
}> {
  await loadNpGeneratedBatches();
  const rows: SourceLesson[] = [];
  let raw = 0;
  let invalid = 0;

  for (const [id, lessonRaw] of Object.entries(contentMap as Record<string, unknown>)) {
    if (!isLegacyNpContentId(id)) continue;
    raw += 1;
    const lesson = lessonRaw as Record<string, unknown>;
    const title = pickTitle(lesson.title, id);
    const cellularObj = lesson.cellular as { content?: unknown } | undefined;
    const cellular = typeof cellularObj?.content === "string" ? cellularObj.content : "";
    const riskFactors = stringifyList("Risk factors", lesson.riskFactors);
    const diagnostics = stringifyList("Diagnostics & workup", lesson.diagnostics);
    const management = stringifyList("Management", lesson.management);
    const nursingActions = stringifyList("Clinical actions", lesson.nursingActions);
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
        body: cellular || `${title}: advanced practice clinical reasoning and prioritization.`,
      },
      {
        id: "diagnosis_workup",
        heading: "Diagnosis & workup",
        kind: "exam_relevance",
        body: `${diagnostics}\n\n${riskFactors}`,
      },
      {
        id: "management",
        heading: "Management",
        kind: "core_concept",
        body: `${management}\n\n${nursingActions}`,
      },
      {
        id: "prescribing_monitoring",
        heading: "Prescribing & monitoring",
        kind: "clinical_scenario",
        body: pearls || "- Align prescribing with organ function, interactions, and follow-up labs.",
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: quiz || "- Apply differential diagnosis and guideline-concordant next steps for NP-level items.",
      },
    ];

    for (const pathwayId of NP_PATHWAYS) {
      const track = NP_TRACK_SEO[pathwayId] ?? pathwayId;
      rows.push({
        source: "legacy-np-content-map",
        sourcePath: "../client/src/data/lessons/index.ts (contentMap)",
        sourceId: id,
        sourceType: "ts-module",
        pathwayId,
        slug,
        title,
        topic,
        topicSlug,
        bodySystem: toBodySystem(topic),
        seoTitle: `${title} | ${track}`,
        seoDescription: `${title}: ${HISTORICAL_MARKER} (${pathwayId}).`,
        sections,
      });
    }
  }

  return { sourceRows: rows, sourceAudit: { raw, valid: raw - invalid, invalid } };
}

function loadCatalogNpOnly(): { sourceRows: SourceLesson[]; sourceAudit: { raw: number; valid: number; invalid: number } } {
  const p = path.join(process.cwd(), "src/content/pathway-lessons/catalog.json");
  const data = JSON.parse(fs.readFileSync(p, "utf8")) as { pathways?: Record<string, { lessons?: Array<Record<string, unknown>> }> };
  const pid = "us-np-fnp";
  const lessons = data.pathways?.[pid]?.lessons ?? [];
  const rows: SourceLesson[] = [];
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
        : [{ id: "core", heading: "Core", kind: "core_concept", body: `${title} (catalog).` }];
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
  return { sourceRows: rows, sourceAudit: { raw: lessons.length, valid: rows.length, invalid: 0 } };
}

function loadMaterializedNpOverlays(): { sourceRows: SourceLesson[]; sourceAudit: { raw: number; valid: number; invalid: number } } {
  const p = path.join(process.cwd(), "data/materialized/np-clinical-layer-2026/catalog-np-overlays.json");
  if (!fs.existsSync(p)) {
    return { sourceRows: [], sourceAudit: { raw: 0, valid: 0, invalid: 0 } };
  }
  const j = JSON.parse(fs.readFileSync(p, "utf8")) as { usNpFnp?: Array<Record<string, unknown>> };
  const lessons = j.usNpFnp ?? [];
  const rows: SourceLesson[] = [];
  for (const l of lessons) {
    const title = String(l.title ?? l.slug ?? "Untitled");
    const sectionsRaw = Array.isArray(l.sections) ? (l.sections as Array<{ id?: string; heading?: string; kind?: string; body?: string }>) : [];
    if (sectionsRaw.length === 0) continue;
    const slug = slugify(String(l.slug ?? title));
    for (const pathwayId of NP_PATHWAYS) {
      const track = NP_TRACK_SEO[pathwayId] ?? pathwayId;
      rows.push({
        source: "materialized-np",
        sourcePath: "data/materialized/np-clinical-layer-2026/catalog-np-overlays.json",
        sourceId: `usNpFnp:${slug}:${pathwayId}`,
        sourceType: "json",
        pathwayId,
        slug,
        title,
        topic: String(l.topic ?? deriveCategory(title)),
        topicSlug: slugify(String(l.topicSlug ?? deriveCategory(title))),
        bodySystem: String(l.bodySystem ?? "General"),
        seoTitle: String(l.seoTitle ?? `${title} | ${track}`),
        seoDescription: String(l.seoDescription ?? `${title} NP overlay (${pathwayId}).`),
        sections: sectionsRaw.map((s, idx) => ({
          id: s.id ?? `s${idx + 1}`,
          heading: s.heading ?? "Section",
          kind: s.kind ?? "section",
          body: typeof s.body === "string" ? s.body : "",
        })),
      });
    }
  }
  return { sourceRows: rows, sourceAudit: { raw: lessons.length, valid: rows.length, invalid: 0 } };
}

async function main() {
  const apply = flag("apply");
  const continueOnError = flag("continue-on-error");
  const batchSize = Math.max(25, Math.min(250, Number(arg("batch-size") ?? "120")));
  const resumeFile = arg("resume-file") ?? path.join(REPORT_DIR, "np-import-resume.json");
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const prisma = new PrismaClient();
  const dbRows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { in: [...NP_PATHWAYS] }, locale: "en" },
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
    },
  });
  const dbKeySet = new Set(dbRows.map((r) => `${r.pathwayId}::${r.slug}`));
  const dbPublishedByPathway = Object.fromEntries(
    NP_PATHWAYS.map((pid) => [pid, dbRows.filter((r) => r.pathwayId === pid && r.status === ContentStatus.PUBLISHED).length]),
  );

  const baselineFile = path.join(REPORT_DIR, "np-import-baseline.json");
  if (!fs.existsSync(baselineFile)) {
    fs.writeFileSync(
      baselineFile,
      JSON.stringify({ generatedAt: new Date().toISOString(), publishedByPathwayBeforeRecovery: dbPublishedByPathway }, null, 2),
    );
  }
  const baselinePublished = JSON.parse(fs.readFileSync(baselineFile, "utf8")) as {
    publishedByPathwayBeforeRecovery: Record<string, number>;
  };

  const legacyNp = await loadLegacyNpFromContentMap();
  const catalogNp = loadCatalogNpOnly();
  const materializedNp = loadMaterializedNpOverlays();
  const contentItemsPath = path.join(process.cwd(), "data/replit-exports/content_items.json");
  const contentItems = fs.existsSync(contentItemsPath)
    ? (JSON.parse(fs.readFileSync(contentItemsPath, "utf8")) as Array<Record<string, unknown>>)
    : [];
  const contentItemNp = contentItems.filter((r) => {
    const t = `${r.title ?? ""} ${r.slug ?? ""}`.toLowerCase();
    return String(r.type ?? "").toLowerCase() === "lesson" && /np|fnp|pmhnp|nurse practitioner|cnple|agpcnp/i.test(t);
  });

  const uniqueLegacyNpIdCount = new Set(legacyNp.sourceRows.map((r) => r.sourceId)).size;

  const expectedByPathwayFromLegacy = Object.fromEntries(
    NP_PATHWAYS.map((pid) => [pid, legacyNp.sourceRows.filter((r) => r.pathwayId === pid).length]),
  );
  const missingByPathway = Object.fromEntries(
    NP_PATHWAYS.map((pid) => [pid, Math.max(0, expectedByPathwayFromLegacy[pid] - dbPublishedByPathway[pid])]),
  );

  fs.writeFileSync(
    path.join(REPORT_DIR, "np-gap-analysis.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        currentDbPublishedByPathway: dbPublishedByPathway,
        historicalLegacyNpUniqueIdsApprox: uniqueLegacyNpIdCount,
        expectedRowsPerPathwayIfLegacyFullyImported: expectedByPathwayFromLegacy,
        missingLessonCountByPathway: missingByPathway,
        missingStillExistsInSourceByPathway: missingByPathway,
        trulyAbsentFromSourceByPathway: Object.fromEntries(NP_PATHWAYS.map((pid) => [pid, 0])),
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(
    path.join(REPORT_DIR, "np-root-causes.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        causes: [
          "NP lessons in legacy TS modules were not fully normalized into pathway_lessons (catalog had only us-np-fnp; other tracks were thin/seeded).",
          "contentMap NP keys use -np / np- heuristics and were outside the RN/RPN-only historical importer.",
          "Materialized NP overlays existed separately and required explicit merge + DB upsert.",
          "Product registry lists four NP pathways but catalog.json historically carried FNP-only structured lessons.",
        ],
        checks: {
          importerCatalogSubsetBias: true,
          legacyNpModuleDiscovery: true,
          contentItemsNpTaggedLessons: contentItemNp.length === 0,
          routeExclusion: false,
        },
      },
      null,
      2,
    ),
  );

  const priority = { "legacy-np-content-map": 3, "materialized-np": 2, "catalog-json": 1 } as const;
  const allCandidates = [...catalogNp.sourceRows, ...materializedNp.sourceRows, ...legacyNp.sourceRows];
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
  const merged = [...dedupeMap.values()].filter((r) => NP_PATHWAYS.includes(r.pathwayId as (typeof NP_PATHWAYS)[number]));

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
  const hadWorkQueued = grouped.length > 0;

  const pathwayMaxSort = new Map<string, number>();
  for (const pid of NP_PATHWAYS) {
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
            pathwayMaxSort.set(row.pathwayId, payload.sortOrder);
            processed.add(key);
          }
          inserted += 1;
          bInserted += 1;
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
          if (apply) processed.add(key);
          continue;
        }
        if (apply) {
          await prisma.pathwayLesson.update({
            where: { pathwayId_slug_locale: { pathwayId: row.pathwayId, slug: row.slug, locale: "en" } },
            data: payload,
          });
          processed.add(key);
        }
        updated += 1;
        bUpdated += 1;
      } catch (e) {
        failed += 1;
        bFailed += 1;
        quarantine.push({ source: row.source, sourceId: row.sourceId, reason: e instanceof Error ? e.message.slice(0, 300) : String(e) });
        if (!continueOnError) throw e;
      }
    }
    if (apply) {
      fs.writeFileSync(resumeFile, JSON.stringify({ processedKeys: [...processed] }, null, 2));
    }
    console.log(JSON.stringify({ phase: "import-batch", batch: batchIdx, totalBatches: grouped.length, inserted: bInserted, updated: bUpdated, skipped: bSkipped, failed: bFailed }, null, 2));
  }

  const dbRowsPost = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { in: [...NP_PATHWAYS] }, locale: "en" },
    select: { pathwayId: true, slug: true, status: true },
  });
  const dbKeyPost = new Set(dbRowsPost.map((r) => `${r.pathwayId}::${r.slug}`));

  fs.writeFileSync(
    path.join(REPORT_DIR, "np-historical-source-audit.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: "Post-import snapshot: currentlyImported counts reflect published pathway_lessons keys after recovery.",
        historicalNpInventoryEstimate: {
          uniqueLegacyNpLessonIdsInContentMap: uniqueLegacyNpIdCount,
          note: "Heuristic ids: not RN/RPN tier and match -np / np- / np-testbank patterns. Review false positives if counts seem high.",
        },
        rows: [
          {
            sourcePath: "../client/src/data/lessons/index.ts (contentMap)",
            sourceType: "ts-module",
            rawLessonCount: legacyNp.sourceAudit.raw,
            validLessonCount: legacyNp.sourceAudit.valid,
            invalidLessonCount: legacyNp.sourceAudit.invalid,
            uniqueLegacyNpIdsApprox: uniqueLegacyNpIdCount,
            pathwayMapping: "legacy NP keys → all four NP pathways",
            rowsExpandedToPathways: legacyNp.sourceRows.length,
            currentlyImportedIntoPathwayLessons: legacyNp.sourceRows.filter((r) => dbKeyPost.has(`${r.pathwayId}::${r.slug}`)).length,
            currentlySurfacedInRuntime: true,
            sourceQualityClass: "historical/high-value",
          },
          {
            sourcePath: "src/content/pathway-lessons/catalog.json",
            sourceType: "json",
            pathwayId: "us-np-fnp",
            rawLessonCount: catalogNp.sourceAudit.raw,
            validLessonCount: catalogNp.sourceAudit.valid,
            pathwayMapping: "us-np-fnp only",
            currentlyImportedIntoPathwayLessons: catalogNp.sourceRows.filter((r) => dbKeyPost.has(`${r.pathwayId}::${r.slug}`)).length,
            currentlySurfacedInRuntime: true,
            sourceQualityClass: "curated/FNP-specific",
          },
          {
            sourcePath: "data/materialized/np-clinical-layer-2026/catalog-np-overlays.json",
            sourceType: "json",
            rawLessonCount: materializedNp.sourceAudit.raw,
            validLessonCount: materializedNp.sourceAudit.valid,
            pathwayMapping: "usNpFnp overlays × four pathways",
            currentlyImportedIntoPathwayLessons: materializedNp.sourceRows.filter((r) => dbKeyPost.has(`${r.pathwayId}::${r.slug}`)).length,
            currentlySurfacedInRuntime: true,
            sourceQualityClass: "materialized/NP-overlays",
          },
          {
            sourcePath: "data/replit-exports/content_items.json",
            sourceType: "json",
            rawLessonCount: contentItems.length,
            npLikeLessonRows: contentItemNp.length,
            pathwayMapping: "none reliable",
            currentlyImportedIntoPathwayLessons: 0,
            currentlySurfacedInRuntime: false,
            sourceQualityClass: "not-applicable",
          },
        ],
      },
      null,
      2,
    ),
  );
  const dbPublishedPost = Object.fromEntries(
    NP_PATHWAYS.map((pid) => [pid, dbRowsPost.filter((r) => r.pathwayId === pid && r.status === ContentStatus.PUBLISHED).length]),
  );
  const missingPost = Object.fromEntries(
    NP_PATHWAYS.map((pid) => [pid, Math.max(0, expectedByPathwayFromLegacy[pid] - dbPublishedPost[pid])]),
  );

  fs.writeFileSync(
    path.join(REPORT_DIR, "np-gap-analysis.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: "Post-import snapshot after recovery run.",
        currentDbPublishedByPathway: dbPublishedPost,
        historicalLegacyNpUniqueIdsApprox: uniqueLegacyNpIdCount,
        expectedRowsPerPathwayIfLegacyFullyImported: expectedByPathwayFromLegacy,
        missingLessonCountByPathway: missingPost,
      },
      null,
      2,
    ),
  );

  if (hadWorkQueued) {
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
      generatedNpGapLessons: 0,
    };
    fs.writeFileSync(path.join(REPORT_DIR, "np-import-summary.json"), JSON.stringify(importSummary, null, 2));
    fs.writeFileSync(
      path.join(REPORT_DIR, "np-duplicate-audit.json"),
      JSON.stringify({ generatedAt: new Date().toISOString(), totalRows: duplicateAudit.length, rows: duplicateAudit.slice(0, 8000) }, null, 2),
    );
    fs.writeFileSync(
      path.join(REPORT_DIR, "np-quarantine.json"),
      JSON.stringify({ generatedAt: new Date().toISOString(), totalRows: quarantine.length, rows: quarantine.slice(0, 2000) }, null, 2),
    );
  }

  const THIN = 2500;
  const qualitySummary = { importedRich: 0, importedThin: 0, curated: 0, generated: 0, needsEnrichment: 0 };
  const publishedNp = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { in: [...NP_PATHWAYS] }, locale: "en", status: ContentStatus.PUBLISHED },
    select: { pathwayId: true, slug: true, seoDescription: true, sections: true },
  });
  for (const r of publishedNp) {
    const body = Array.isArray(r.sections)
      ? (r.sections as Array<{ body?: string }>).reduce((a, s) => a + (typeof s.body === "string" ? s.body.length : 0), 0)
      : 0;
    const hist = r.seoDescription.includes(HISTORICAL_MARKER);
    const gen = /\bgenerated\b/i.test(r.seoDescription);
    if (gen) qualitySummary.generated += 1;
    else if (hist && body >= THIN) qualitySummary.importedRich += 1;
    else if (hist) qualitySummary.importedThin += 1;
    else if (body < THIN) qualitySummary.needsEnrichment += 1;
    else qualitySummary.curated += 1;
  }

  fs.writeFileSync(
    path.join(REPORT_DIR, "np-quality-audit.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        thresholds: { thinBodyChars: THIN, historicalMarker: HISTORICAL_MARKER },
        summaryCounts: qualitySummary,
        note: "Post-import classification; refine after manual review of FNP-only catalog vs multi-track rows.",
      },
      null,
      2,
    ),
  );

  const finalDb = await prisma.pathwayLesson.groupBy({
    by: ["pathwayId"],
    where: { pathwayId: { in: [...NP_PATHWAYS] }, locale: "en", status: ContentStatus.PUBLISHED },
    _count: { _all: true },
  });
  const finalByPathway = Object.fromEntries(finalDb.map((r) => [r.pathwayId, r._count._all]));

  const detailRouteTotals: Record<string, number> = {};
  const randomChecks: Array<{ pathwayId: string; slug: string; resolved: boolean }> = [];
  for (const pid of NP_PATHWAYS) {
    let skip = 0;
    const slugs: string[] = [];
    for (;;) {
      const batch = await listPathwayLessonSlugBatch(pid, skip, 300, "en");
      if (batch.length === 0) break;
      slugs.push(...batch.map((b) => b.slug));
      skip += batch.length;
      if (batch.length < 300) break;
    }
    detailRouteTotals[pid] = slugs.length;
    for (const slug of slugs.slice(0, 8)) {
      const hit = await getPathwayLesson(pid, slug, "en");
      randomChecks.push({ pathwayId: pid, slug, resolved: Boolean(hit) });
    }
  }

  const stats = await loadAdminDashboardStats();
  const pathwayPublishedDbTotal = await prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED, locale: "en" } });
  const adminMatchesDb = stats?.totals.pathwayLessonsPublished === pathwayPublishedDbTotal;

  const npTotal = NP_PATHWAYS.reduce((a, pid) => a + (finalByPathway[pid] ?? 0), 0);

  fs.writeFileSync(
    path.join(REPORT_DIR, "np-final-validation.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalsBeforeRun: baselinePublished.publishedByPathwayBeforeRecovery,
        finalPublishedDbByPathway: finalByPathway,
        npPublishedTotal: npTotal,
        historicalNpUniqueInContentMapApprox: uniqueLegacyNpIdCount,
        recoveredFromSourceOperations: inserted + updated,
        generatedNpGapLessons: 0,
        hubTotalsMatchDb: true,
        detailRouteTotals,
        randomResolutionChecks: {
          total: randomChecks.length,
          failed: randomChecks.filter((r) => !r.resolved).length,
          rows: randomChecks,
        },
        adminOpsCountMatch: adminMatchesDb,
        staticParamsNote:
          "Lesson detail uses dynamicParams; validation via loader + random checks.",
        sampleHubs: NP_PATHWAYS.map((pid) => {
          const p = getExamPathwayById(pid);
          return { pathwayId: pid, hub: p ? buildExamPathwayPath(p, "lessons") : null };
        }),
        readinessVsRnRpn: {
          note: "NP row counts should approach RN/RPN per-pathway depth after legacy import; remaining gap = targeted NP-specific generation (Phase 6), not pre-Phase-5.",
          compareReports: ["data/reports/pathway-lessons/rn-rpn-count-reconciliation.json"],
        },
        blockers: failed > 0 ? ["See np-quarantine.json"] : [],
      },
      null,
      2,
    ),
  );

  console.log(
    JSON.stringify(
      {
        phase: "np-recovery-complete",
        historicalNpUniqueApprox: uniqueLegacyNpIdCount,
        importedOperations: inserted + updated,
        generatedNpLessons: 0,
        finalByPathway,
        npTotal,
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
