/**
 * Single bounded admin payload: lesson + question coverage flags, paginated slices, import hints.
 */
import { loadAdminQaIssueSnapshot } from "@/lib/admin/admin-qa-snapshot";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import {
  buildPathwayTranslationCompactForPathways,
  type PathwayTranslationCompact,
} from "@/lib/lessons/pathway-lesson-translation-diagnostics";
import { isKnownPathwayLessonContentLocale } from "@/lib/lessons/pathway-lesson-locale";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import {
  buildContentScalabilityReport,
  type ContentScalabilityReport,
} from "@/lib/scalability/build-content-scalability-report";
import { ContentStatus } from "@prisma/client";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";

const DASH_TIMEOUT_MS = 12_000;

export type AdminOperationsDashboardQuery = {
  pathwayPage?: number;
  pathwayPageSize?: number;
  questionCrossTabPage?: number;
  questionCrossTabPageSize?: number;
  topicTopPage?: number;
  topicTopPageSize?: number;
};

export const ADMIN_IMPORT_PIPELINES = [
  {
    id: "seed_pathway_lessons",
    npmScript: "npm run db:seed-pathway-lessons",
    tables: ["pathway_lessons"],
    description: "Upsert English rows from src/content/pathway-lessons/catalog.json (add other locales via separate rows).",
    dryRun: false,
  },
  {
    id: "import_nursing_ai_cache",
    npmScript: "npx tsx scripts/import-nursing-ai-cache.ts --file=<path> [--apply]",
    tables: ["exam_questions", "flashcards", "categories"],
    description: "Replit nursing export; omit --apply for dry-run.",
    dryRun: true,
  },
  {
    id: "prisma_seed",
    npmScript: "npm run db:seed",
    tables: ["content_items", "exam_questions", "users", "subscriptions", "exams"],
    description: "Dev/bootstrap sample rows — not a full production content import.",
    dryRun: false,
  },
] as const;

export const ADMIN_DIAGNOSTIC_HTTP = [
  { method: "GET", path: "/api/admin/operations-dashboard", summary: "This dashboard (paginated summary + flags)." },
  { method: "GET", path: "/api/admin/scalability-report", summary: "Pathway lesson source matrix + question totals." },
  { method: "GET", path: "/api/admin/question-bank-diagnostics", summary: "Full capped question cross-tab + pathway exam-key match." },
  {
    method: "GET",
    path: "/api/admin/question-bank-coverage",
    summary: "Exam-aligned topic taxonomy, per-pathway counts, thresholds, rationale quality (published only).",
  },
  { method: "GET", path: "/api/admin/pathway-lesson-translations", summary: "Translation gaps with sample missing slugs." },
  { method: "GET", path: "/api/admin/qa", summary: "Draft / rationale / duplicate stem_hash issue counts." },
  { method: "GET", path: "/api/admin/gaps", summary: "Low-coverage topics + lesson counts (capped lists)." },
  { method: "GET", path: "/api/admin/insights", summary: "Aggregate DB metrics." },
  { method: "GET", path: "/api/admin/lessons", summary: "Paginated lesson admin list (existing query params)." },
  { method: "GET", path: "/api/admin/questions", summary: "Paginated question admin list (existing query params)." },
] as const;

function clampPage(n: number): number {
  return Math.max(1, Math.floor(Number.isFinite(n) ? n : 1));
}

function clampPageSize(n: number, max: number): number {
  return Math.min(max, Math.max(1, Math.floor(Number.isFinite(n) ? n : 20)));
}

function paginate<T>(arr: T[], page: number, pageSize: number): { items: T[]; page: number; pageSize: number; total: number } {
  const total = arr.length;
  const p = clampPage(page);
  const ps = clampPageSize(pageSize, API_LIST_PAGE_SIZE_HARD_MAX);
  const start = (p - 1) * ps;
  return { items: arr.slice(start, start + ps), page: p, pageSize: ps, total };
}

export type AdminOperationsDashboard = {
  generatedAt: string;
  databaseConfigured: boolean;
  tooling: {
    importPipelines: typeof ADMIN_IMPORT_PIPELINES;
    diagnosticHttp: typeof ADMIN_DIAGNOSTIC_HTTP;
    cliScripts: Array<{ script: string; summary: string }>;
  };
  flags: {
    pathwayIdsEmpty: string[];
    pathwayIdsCatalogFallback: string[];
    pathwayIdsMissingDbDespiteCatalog: string[];
    pathwayIdsWithTranslationGaps: string[];
    unknownPathwayLessonLocaleKeys: string[];
    examQuestionsPublishedZero: boolean;
    examQuestionsTotalNegative: boolean;
    contentAppLessonsPublishedZero: boolean;
    pathwayLessonsPublishedZero: boolean;
  };
  counts: {
    contentItemsLessonPublished: number;
    pathwayLessonsPublished: number;
    examQuestionsTotal: number;
    examQuestionsPublished: number;
    registryPathwayCount: number;
  };
  quality: Awaited<ReturnType<typeof loadAdminQaIssueSnapshot>>;
  questions: {
    byStatus: Array<{ status: string | null; count: number }>;
    byExamTop: Array<{ exam: string | null; count: number }>;
    byTierTop: Array<{ tier: string; count: number }>;
    crossTabPage: {
      items: Array<{
        exam: string | null;
        tier: string;
        countryCode: string | null;
        status: string | null;
        count: number;
      }>;
      page: number;
      pageSize: number;
      total: number;
    };
    topicTopPage: {
      items: Array<{ topic: string; count: number }>;
      page: number;
      pageSize: number;
      total: number;
    };
    pathwayQuestionMatchPage: {
      items: Array<{
        pathwayId: string;
        displayName: string;
        publishedCount: number;
        contentExamKeys: string[];
      }>;
      page: number;
      pageSize: number;
      total: number;
    };
    capsNote: string;
  };
  pathways: {
    items: Array<
      ContentScalabilityReport["pathwayLessons"]["rows"][number] & {
        translation: PathwayTranslationCompact;
        questionBankPublishedForExamKeys: number;
      }
    >;
    page: number;
    pageSize: number;
    total: number;
  };
  recommendations: string[];
};

export async function buildAdminOperationsDashboard(
  raw: AdminOperationsDashboardQuery = {},
): Promise<AdminOperationsDashboard> {
  const pathwayPage = clampPage(raw.pathwayPage ?? 1);
  const pathwayPageSize = clampPageSize(raw.pathwayPageSize ?? 12, API_LIST_PAGE_SIZE_HARD_MAX);
  const questionCrossTabPage = clampPage(raw.questionCrossTabPage ?? 1);
  const questionCrossTabPageSize = clampPageSize(raw.questionCrossTabPageSize ?? 30, API_LIST_PAGE_SIZE_HARD_MAX);
  const topicTopPage = clampPage(raw.topicTopPage ?? 1);
  const topicTopPageSize = clampPageSize(raw.topicTopPageSize ?? 25, API_LIST_PAGE_SIZE_HARD_MAX);

  const generatedAt = new Date().toISOString();
  const databaseConfigured = isDatabaseUrlConfigured();

  const [
    scalability,
    questionReport,
    qaSnapshot,
    lessonPublishedCount,
    pathwayPublishedCount,
    unknownLocales,
    allTranslationCompact,
  ] = await Promise.all([
      buildContentScalabilityReport(),
      buildQuestionBankCoverageReport(),
      loadAdminQaIssueSnapshot(),
      databaseConfigured
        ? withDatabaseFallback(
            () =>
              prisma.contentItem.count({
                where: { type: "lesson", status: DB_PUBLISHED },
              }),
            -1,
          )
        : Promise.resolve(-1),
      databaseConfigured
        ? withDatabaseFallback(
            () =>
              prisma.pathwayLesson.count({
                where: { status: ContentStatus.PUBLISHED },
              }),
            -1,
          )
        : Promise.resolve(-1),
      databaseConfigured
        ? withDatabaseFallbackTimeout(
            async () => {
              const g = await prisma.pathwayLesson.groupBy({
                by: ["locale"],
                where: { status: ContentStatus.PUBLISHED },
                _count: { _all: true },
              });
              return g.map((x) => x.locale).filter((loc) => !isKnownPathwayLessonContentLocale(loc));
            },
            [],
            DASH_TIMEOUT_MS,
          )
        : Promise.resolve([] as string[]),
      buildPathwayTranslationCompactForPathways(EXAM_PATHWAYS.map((p) => p.id)),
    ]);

  const rows = scalability.pathwayLessons.rows;
  const paged = paginate(rows, pathwayPage, pathwayPageSize);
  const transById = new Map(allTranslationCompact.map((t) => [t.pathwayId, t]));
  const qMatchById = new Map(questionReport.pathwayPublishedMatch.map((q) => [q.pathwayId, q]));

  const emptyTranslation: PathwayTranslationCompact = {
    pathwayId: "",
    englishPublishedSlugCount: 0,
    localesPresent: [],
    missingVersusEnglish: [],
  };

  const pathwayItems = paged.items.map((row) => ({
    ...row,
    translation: transById.get(row.pathwayId) ?? { ...emptyTranslation, pathwayId: row.pathwayId },
    questionBankPublishedForExamKeys: qMatchById.get(row.pathwayId)?.publishedCount ?? -1,
  }));

  const pathwayIdsEmpty = rows.filter((r) => r.runtimeSource === "none").map((r) => r.pathwayId);
  const pathwayIdsCatalogFallback = rows.filter((r) => r.runtimeSource === "catalog").map((r) => r.pathwayId);
  const pathwayIdsMissingDbDespiteCatalog = rows
    .filter((r) => r.dbPublishedTotal === 0 && r.catalogCount > 0)
    .map((r) => r.pathwayId);

  const pathwayIdsWithTranslationGaps = allTranslationCompact
    .filter((t) => t.missingVersusEnglish.length > 0)
    .map((t) => t.pathwayId);

  const crossTabPaged = paginate(
    questionReport.crossTabExamTierCountryStatus,
    questionCrossTabPage,
    questionCrossTabPageSize,
  );
  const topicPaged = paginate(questionReport.topicTopPublished, topicTopPage, topicTopPageSize);

  const pathwayQPage = paginate(questionReport.pathwayPublishedMatch, pathwayPage, pathwayPageSize);

  const rec: string[] = [];
  if (pathwayIdsMissingDbDespiteCatalog.length > 0) {
    rec.push(`Run npm run db:seed-pathway-lessons for catalog-only pathways: ${pathwayIdsMissingDbDespiteCatalog.join(", ")}`);
  }
  if (pathwayIdsEmpty.length > 0) {
    rec.push(`Empty pathways (no DB, no catalog): ${pathwayIdsEmpty.join(", ")} — add catalog.json entries or DB rows.`);
  }
  if (questionReport.totals.publishedRows === 0 && databaseConfigured) {
    rec.push("No published exam_questions — run nursing import with --apply or promote drafts.");
  }
  if (lessonPublishedCount === 0 && databaseConfigured) {
    rec.push("No published content_items lessons — seed or import app lessons.");
  }
  if (unknownLocales.length > 0) {
    rec.push(`Unknown pathway_lessons.locale values vs marketing list: ${unknownLocales.join(", ")}`);
  }

  return {
    generatedAt,
    databaseConfigured,
    tooling: {
      importPipelines: ADMIN_IMPORT_PIPELINES,
      diagnosticHttp: ADMIN_DIAGNOSTIC_HTTP,
      cliScripts: [
        { script: "npm run ops:pathway-lesson-sources", summary: "JSON: DB vs catalog per registry pathway." },
        { script: "npm run ops:pathway-lesson-translations", summary: "JSON: translation gaps with slug samples." },
        { script: "npm run ops:question-bank-diagnostics", summary: "JSON: question bank coverage." },
      { script: "npm run ops:question-bank-coverage", summary: "JSON: exam-aligned taxonomy + thresholds + quality." },
        { script: "npm run db:verify-indexes", summary: "Required DB indexes for scale." },
      ],
    },
    flags: {
      pathwayIdsEmpty,
      pathwayIdsCatalogFallback,
      pathwayIdsMissingDbDespiteCatalog,
      pathwayIdsWithTranslationGaps,
      unknownPathwayLessonLocaleKeys: [...unknownLocales].sort((a, b) => a.localeCompare(b)),
      examQuestionsPublishedZero: databaseConfigured && questionReport.totals.publishedRows === 0,
      examQuestionsTotalNegative: questionReport.totals.allRows < 0,
      contentAppLessonsPublishedZero: databaseConfigured && lessonPublishedCount === 0,
      pathwayLessonsPublishedZero: databaseConfigured && pathwayPublishedCount === 0,
    },
    counts: {
      contentItemsLessonPublished: lessonPublishedCount,
      pathwayLessonsPublished: pathwayPublishedCount,
      examQuestionsTotal: questionReport.totals.allRows,
      examQuestionsPublished: questionReport.totals.publishedRows,
      registryPathwayCount: EXAM_PATHWAYS.length,
    },
    quality: qaSnapshot,
    questions: {
      byStatus: questionReport.byStatus,
      byExamTop: questionReport.byExam.slice(0, 20),
      byTierTop: questionReport.byTier.slice(0, 20),
      crossTabPage: {
        ...crossTabPaged,
        items: crossTabPaged.items.map((r) => ({
          exam: r.exam,
          tier: r.tier,
          countryCode: r.countryCode,
          status: r.status,
          count: r.count,
        })),
      },
      topicTopPage: {
        items: topicPaged.items,
        page: topicPaged.page,
        pageSize: topicPaged.pageSize,
        total: topicPaged.total,
      },
      pathwayQuestionMatchPage: {
        items: pathwayQPage.items.map((r) => ({
          pathwayId: r.pathwayId,
          displayName: r.displayName,
          publishedCount: r.publishedCount,
          contentExamKeys: r.contentExamKeys,
        })),
        page: pathwayQPage.page,
        pageSize: pathwayQPage.pageSize,
        total: pathwayQPage.total,
      },
      capsNote: `Cross-tab capped at ${questionReport.caps.crossTabRows} rows in full report; topics capped at ${questionReport.caps.topicSamples}. This response paginates slices only.`,
    },
    pathways: {
      items: pathwayItems,
      page: paged.page,
      pageSize: paged.pageSize,
      total: paged.total,
    },
    recommendations: rec,
  };
}
