#!/usr/bin/env npx tsx
/**
 * E-E-A-T content quality audit (pathway catalog + optional DB blog sample).
 * Writes repo-root data/audit/eeat-content-audit.json
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, PrismaClient } from "@prisma/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT_DIR = join(REPO_ROOT, "data/audit");
const CATALOG_PATH = join(APP_ROOT, "src/content/pathway-lessons/catalog.json");

type CatalogLesson = {
  slug: string;
  title: string;
  topic?: string;
  sections?: { kind?: string; body?: string; checkpointQuestions?: unknown[] }[];
  preTest?: unknown[];
  postTest?: unknown[];
};

type CatalogFile = {
  pathways: Record<string, { lessons: CatalogLesson[] }>;
};

function wordCount(text: string): number {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return 0;
  return t.split(/\s/).filter(Boolean).length;
}

function lessonTotalWords(lesson: CatalogLesson): number {
  let n = 0;
  for (const s of lesson.sections ?? []) {
    n += wordCount(s.body ?? "");
  }
  return n;
}

function hasCheckpoint(lesson: CatalogLesson): boolean {
  if (lesson.preTest?.length || lesson.postTest?.length) return true;
  return (lesson.sections ?? []).some((s) => (s.checkpointQuestions?.length ?? 0) > 0);
}

/**
 * Maps E-E-A-T checklist labels → pathway lesson `section.kind` values.
 * Includes premium spine kinds and legacy five-block kinds (`pathway-lesson-types.ts`).
 */
const KIND_ALIASES: Record<string, string[]> = {
  overview: ["introduction", "intro", "clinical_meaning"],
  pathophysiology: ["pathophysiology_overview", "core_concept"],
  signs_symptoms: ["signs_symptoms", "clinical_scenario"],
  nursing_interventions: ["nursing_assessment_interventions", "clinical_application", "clinical_scenario"],
  clinical_pearls: ["clinical_pearls", "takeaways"],
  exam_tips: ["exam_tips", "exam_focus", "exam_relevance", "takeaways"],
};

function kindsPresent(lesson: CatalogLesson): Set<string> {
  const k = new Set<string>();
  for (const s of lesson.sections ?? []) {
    if (s.kind) k.add(s.kind);
  }
  return k;
}

function eeatSectionCoverage(lesson: CatalogLesson): Record<string, boolean> {
  const present = kindsPresent(lesson);
  const out: Record<string, boolean> = {};
  for (const [label, aliases] of Object.entries(KIND_ALIASES)) {
    out[label] = aliases.some((a) => present.has(a));
  }
  out.practice_question = hasCheckpoint(lesson);
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();

  const raw = await readFile(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(raw) as CatalogFile;

  const titleIndex = new Map<string, string[]>();
  const lessonRows: Array<{
    pathwayId: string;
    slug: string;
    title: string;
    totalWords: number;
    sectionCount: number;
    thin: boolean;
    eeatCoverage: Record<string, boolean>;
    missingEeatLabels: string[];
  }> = [];

  let totalLessons = 0;
  for (const [pathwayId, bundle] of Object.entries(catalog.pathways ?? {})) {
    for (const lesson of bundle.lessons ?? []) {
      totalLessons += 1;
      const key = (lesson.title ?? "").trim().toLowerCase();
      if (key) {
        const arr = titleIndex.get(key) ?? [];
        arr.push(pathwayId);
        titleIndex.set(key, arr);
      }
      const totalWords = lessonTotalWords(lesson);
      const sectionCount = lesson.sections?.length ?? 0;
      const cov = eeatSectionCoverage(lesson);
      const missingEeatLabels = Object.entries(cov)
        .filter(([, ok]) => !ok)
        .map(([lab]) => lab);
      /** Heuristic: bundled catalog rows are often shorter than DB “premium” rows; tune separately for imports. */
      const thin = totalWords < 400 || sectionCount < 3;
      lessonRows.push({
        pathwayId,
        slug: lesson.slug,
        title: lesson.title,
        totalWords,
        sectionCount,
        thin,
        eeatCoverage: cov,
        missingEeatLabels,
      });
    }
  }

  const duplicateTitles = [...titleIndex.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([title, pathwayIds]) => ({ normalizedTitle: title, pathwayIds: [...new Set(pathwayIds)] }));

  const thinLessons = lessonRows.filter((r) => r.thin);
  const incompleteEeat = lessonRows.filter((r) => r.missingEeatLabels.length > 0);

  const { getAllProgrammaticSlugs } = await import("@/lib/seo/programmatic-registry");
  const seoProgrammatic = {
    slugCount: getAllProgrammaticSlugs().length,
    note: "Programmatic SEO pages are registry-backed; validate depth with npm run validate:programmatic-seo where applicable.",
  };

  let blogAudit: Record<string, unknown> = { status: "skipped", reason: "DATABASE_URL unset or query failed" };
  try {
    if (!process.env.DATABASE_URL) {
      blogAudit = { status: "skipped", reason: "DATABASE_URL not set" };
    } else {
      const prisma = new PrismaClient();
      const published = await prisma.blogPost.count({
        where: { postStatus: BlogPostStatus.PUBLISHED },
      });
      const withAuthor = await prisma.blogPost.count({
        where: {
          postStatus: BlogPostStatus.PUBLISHED,
          authorDisplayName: { not: null },
        },
      });
      const withReviewer = await prisma.blogPost.count({
        where: {
          postStatus: BlogPostStatus.PUBLISHED,
          medicalReviewerName: { not: null },
        },
      });
      await prisma.$disconnect();
      blogAudit = {
        status: "ok",
        publishedCount: published,
        publishedWithAuthorDisplayName: withAuthor,
        publishedWithMedicalReviewer: withReviewer,
        authorCoveragePct: published ? Math.round((withAuthor / published) * 1000) / 10 : 100,
      };
    }
  } catch (e) {
    blogAudit = {
      status: "error",
      message: e instanceof Error ? e.message : String(e),
    };
  }

  const payload = {
    generatedAt,
    scope: {
      pathwayCatalogFile: "nursenest-core/src/content/pathway-lessons/catalog.json",
      note:
        "DB-backed pathway lessons not fully enumerated here; production uses pathway_lessons + loader. Section-kind checklist maps both premium spine kinds and legacy five-block kinds (e.g. clinical_meaning → overview). Re-run after major imports.",
    },
    summary: {
      pathwayCount: Object.keys(catalog.pathways ?? {}).length,
      catalogLessonCount: totalLessons,
      thinContentFlagged: thinLessons.length,
      duplicateTitleGroups: duplicateTitles.length,
      lessonsMissingAnyEeatSection: incompleteEeat.length,
      seoProgrammaticSlugCount: seoProgrammatic.slugCount,
    },
    lessons: {
      thin: thinLessons.slice(0, 200),
      thinTotal: thinLessons.length,
      duplicateTitles,
      eeatIncompleteSample: incompleteEeat.slice(0, 150),
      eeatIncompleteTotal: incompleteEeat.length,
    },
    blog: blogAudit,
    seoPages: seoProgrammatic,
    internalLinking: {
      recommendation:
        "Use MarketingStudyCrossLinks on blog/lessons; run npm run audit:internal-links when script exists; verify relatedLessonPaths on posts.",
    },
    paywallSeo: {
      marketingLessonDetail:
        "Public lesson URLs index only when structuralQuality.publicComplete; incomplete premium may use noindex when PATHWAY_LESSON_STRICT_PUBLIC_QUALITY=1. Subscriber app /app uses robots noindex.",
      referenceImplementation:
        "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx generateMetadata",
    },
  };

  const outFile = join(OUT_DIR, "eeat-content-audit.json");
  await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outFile}`);
  console.log("For consolidated page scores + eeat-final-status.json, run: npm run audit:eeat-system");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
