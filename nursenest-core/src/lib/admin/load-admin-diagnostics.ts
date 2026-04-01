import { BlogPostStatus, ContentStatus } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import { safePrismaCount, withPrismaReadFallback } from "@/lib/prisma/safe-reads";

const LOW_TOPIC_THRESHOLD = 20;
const LOW_TOPIC_CAP = 40;
const PATHWAY_REGISTRY = new Map(EXAM_PATHWAYS.map((p) => [p.id, p.displayName]));

export type AdminDiagnostics = {
  generatedAt: string;
  dbHealth: {
    configured: boolean;
    status: "ok" | "skipped" | "error";
    latencyMs?: number;
    error?: string;
  };
  /** Optional HTTP probes when a public base URL is configured (dev/prod). */
  apiHealth: {
    probed: boolean;
    baseUrl: string | null;
    liveness: { path: string; ok: boolean; status?: number; error?: string };
    readiness: { path: string; ok: boolean; status?: number; error?: string };
  };
  counts: {
    questionsTotal: number;
    questionsPublished: number;
    questionsDraft: number;
    questionsPublishedMissingRationale: number;
    questionsPublishedMissingKeyTakeaway: number;
    lessonsContentItemsAll: number;
    lessonsContentItemsPublished: number;
    pathwayLessonsPublished: number;
    pathwayLessonsDraft: number;
    flashcardsPublished: number;
    flashcardDecksPublished: number;
    blogPostsTotal: number;
    blogPostsPublished: number;
  };
  countWarnings: string[];
  pathwayCounts: Array<{
    pathwayId: string;
    displayName: string;
    published: number;
    draft: number;
  }>;
  pathwayWarnings: string[];
  missingData: string[];
  weakCoverage: Array<{ topic: string | null; publishedQuestions: number }>;
  weakCoverageThreshold: number;
  questionDiagNotes: string[];
};

function internalBaseUrl(): string | null {
  const pub = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (pub) return pub.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return null;
}

async function probeGet(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 3000);
  try {
    const res = await fetch(url, { signal: ac.signal, cache: "no-store", headers: { accept: "application/json" } });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg.slice(0, 200) };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Admin-only system snapshot: counts, coverage gaps, and health signals.
 * Every Prisma touch is isolated so missing optional tables do not throw the page.
 */
export async function loadAdminDiagnostics(): Promise<AdminDiagnostics> {
  const generatedAt = new Date().toISOString();
  const countWarnings: string[] = [];
  const pathwayWarnings: string[] = [];
  const missingData: string[] = [];

  const readiness = await checkDatabaseReadiness(4000);
  const dbHealth =
    "skipped" in readiness && readiness.skipped
      ? { configured: false, status: "skipped" as const }
      : readiness.ok && "latencyMs" in readiness
        ? { configured: true, status: "ok" as const, latencyMs: readiness.latencyMs }
        : {
            configured: isDatabaseUrlConfigured(),
            status: "error" as const,
            error: !readiness.ok && "error" in readiness ? readiness.error : "unknown",
          };

  const base = internalBaseUrl();
  let liveness = { path: "/api/health", ok: false as boolean, status: undefined as number | undefined, error: undefined as string | undefined };
  let readinessProbe = { path: "/api/health/ready", ok: false as boolean, status: undefined as number | undefined, error: undefined as string | undefined };
  if (base) {
    const l = await probeGet(`${base}/api/health`);
    liveness = { path: "/api/health", ok: l.ok, status: l.status, error: l.error };
    const r = await probeGet(`${base}/api/health/ready`);
    readinessProbe = { path: "/api/health/ready", ok: r.ok, status: r.status, error: r.error };
  }

  const qTotal = await safePrismaCount("exam_questions_total", () => prisma.examQuestion.count());
  if (qTotal.warning) countWarnings.push(qTotal.warning);
  const qPub = await safePrismaCount("exam_questions_published", () =>
    prisma.examQuestion.count({ where: { status: DB_PUBLISHED } }),
  );
  if (qPub.warning) countWarnings.push(qPub.warning);
  const qDraft = await safePrismaCount("exam_questions_draft", () =>
    prisma.examQuestion.count({ where: { status: "draft" } }),
  );
  if (qDraft.warning) countWarnings.push(qDraft.warning);
  const qNoRat = await safePrismaCount("exam_questions_published_no_rationale", () =>
    prisma.examQuestion.count({ where: { status: DB_PUBLISHED, rationale: null } }),
  );
  if (qNoRat.warning) countWarnings.push(qNoRat.warning);
  const qNoTakeaway = await safePrismaCount("exam_questions_published_no_key_takeaway", () =>
    prisma.examQuestion.count({
      where: {
        status: DB_PUBLISHED,
        OR: [{ keyTakeaway: null }, { keyTakeaway: "" }],
      },
    }),
  );
  if (qNoTakeaway.warning) countWarnings.push(qNoTakeaway.warning);

  const lessonsAll = await safePrismaCount("content_items_lessons", () =>
    prisma.contentItem.count({ where: { type: "lesson" } }),
  );
  if (lessonsAll.warning) countWarnings.push(lessonsAll.warning);
  const lessonsPub = await safePrismaCount("content_items_lessons_published", () =>
    prisma.contentItem.count({ where: { type: "lesson", status: DB_PUBLISHED } }),
  );
  if (lessonsPub.warning) countWarnings.push(lessonsPub.warning);

  const pathPub = await safePrismaCount("pathway_lessons_published", () =>
    prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
  );
  if (pathPub.warning) countWarnings.push(pathPub.warning);
  const pathDraft = await safePrismaCount("pathway_lessons_draft", () =>
    prisma.pathwayLesson.count({ where: { status: ContentStatus.DRAFT } }),
  );
  if (pathDraft.warning) countWarnings.push(pathDraft.warning);

  const fcPub = await safePrismaCount("flashcards_published", () =>
    prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
  );
  if (fcPub.warning) countWarnings.push(fcPub.warning);
  const deckPub = await safePrismaCount("flashcard_decks_published", () =>
    prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }),
  );
  if (deckPub.warning) countWarnings.push(deckPub.warning);

  const blogTotal = await safePrismaCount("blog_posts_total", () => prisma.blogPost.count());
  if (blogTotal.warning) countWarnings.push(blogTotal.warning);
  const blogPub = await safePrismaCount("blog_posts_published", () =>
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
  );
  if (blogPub.warning) countWarnings.push(blogPub.warning);

  const pathwayAgg = await withPrismaReadFallback(
    "pathway_lessons_group",
    () =>
      prisma.$queryRaw<Array<{ pathwayId: string; status: ContentStatus; cnt: bigint }>>`
        SELECT pathway_id AS "pathwayId", status, COUNT(*)::bigint AS cnt
        FROM pathway_lessons
        GROUP BY pathway_id, status
      `,
    [],
  );
  if (pathwayAgg.warning) pathwayWarnings.push(pathwayAgg.warning);

  const byPath = new Map<string, { published: number; draft: number }>();
  for (const row of pathwayAgg.value) {
    const cur = byPath.get(row.pathwayId) ?? { published: 0, draft: 0 };
    if (row.status === ContentStatus.PUBLISHED) cur.published += Number(row.cnt);
    if (row.status === ContentStatus.DRAFT) cur.draft += Number(row.cnt);
    byPath.set(row.pathwayId, cur);
  }

  const pathwayCounts = [...byPath.entries()]
    .map(([pathwayId, v]) => ({
      pathwayId,
      displayName: PATHWAY_REGISTRY.get(pathwayId) ?? pathwayId,
      published: v.published,
      draft: v.draft,
    }))
    .sort((a, b) => b.published + b.draft - (a.published + a.draft));

  const weakRows = await withPrismaReadFallback(
    "weak_topics",
    () =>
      prisma.$queryRaw<Array<{ topic: string | null; cnt: bigint }>>`
        SELECT topic, COUNT(*)::bigint AS cnt
        FROM exam_questions
        WHERE status = 'published' AND topic IS NOT NULL
        GROUP BY topic
        HAVING COUNT(*) < ${LOW_TOPIC_THRESHOLD}
        ORDER BY COUNT(*) ASC
        LIMIT ${LOW_TOPIC_CAP}
      `,
    [],
  );
  if (weakRows.warning) countWarnings.push(weakRows.warning);

  const weakCoverage = weakRows.value.map((r) => ({
    topic: r.topic,
    publishedQuestions: Number(r.cnt),
  }));

  let questionDiagNotes: string[] = [];
  try {
    const report = await buildQuestionBankCoverageReport();
    questionDiagNotes = report.notes.slice(0, 6);
  } catch {
    questionDiagNotes = ["Question bank diagnostics unavailable."];
  }

  if (!isDatabaseUrlConfigured()) {
    missingData.push("DATABASE_URL is not set; counts and coverage are not loaded.");
  } else if (dbHealth.status === "error") {
    missingData.push("Database probe failed; verify connectivity and migrations.");
  }
  if (qPub.value === 0 && isDatabaseUrlConfigured() && dbHealth.status === "ok") {
    missingData.push("No published exam questions in database.");
  }
  if (pathPub.value === 0 && !pathPub.warning) {
    missingData.push("No published pathway lessons (pathway_lessons).");
  }
  if (fcPub.value === 0 && !fcPub.warning) {
    missingData.push("No published flashcards.");
  }
  if (qNoRat.value > 0) {
    missingData.push(`${qNoRat.value} published questions have empty rationale.`);
  }
  if (lessonsPub.value === 0 && !lessonsPub.warning) {
    missingData.push("No published content-item lessons.");
  }

  return {
    generatedAt,
    dbHealth,
    apiHealth: {
      probed: Boolean(base),
      baseUrl: base,
      liveness,
      readiness: readinessProbe,
    },
    counts: {
      questionsTotal: qTotal.value,
      questionsPublished: qPub.value,
      questionsDraft: qDraft.value,
      questionsPublishedMissingRationale: qNoRat.value,
      questionsPublishedMissingKeyTakeaway: qNoTakeaway.value,
      lessonsContentItemsAll: lessonsAll.value,
      lessonsContentItemsPublished: lessonsPub.value,
      pathwayLessonsPublished: pathPub.value,
      pathwayLessonsDraft: pathDraft.value,
      flashcardsPublished: fcPub.value,
      flashcardDecksPublished: deckPub.value,
      blogPostsTotal: blogTotal.value,
      blogPostsPublished: blogPub.value,
    },
    countWarnings,
    pathwayCounts,
    pathwayWarnings,
    missingData,
    weakCoverage,
    weakCoverageThreshold: LOW_TOPIC_THRESHOLD,
    questionDiagNotes,
  };
}
