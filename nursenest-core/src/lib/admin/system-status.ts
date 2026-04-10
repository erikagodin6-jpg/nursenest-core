/**
 * Admin system status probes — production-safe, bounded timeouts, no secret leakage.
 * v1: six checks (liveness, readiness, database, AI queue, content, config sanity).
 */
import { ContentStatus, DraftReviewStatus, JobStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { classifyOverallStatus } from "@/lib/admin/system-status-classify";
import {
  deriveContentHealthStatus,
  deriveQueueHealthStatus,
} from "@/lib/admin/system-status-derive";
import { buildOperationalSummaryFromChecks } from "@/lib/admin/system-status-operational-summary";
import type { SystemCheckId, SystemCheckResult, SystemStatusPayload } from "@/lib/admin/system-status-types";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { STALE_GENERATING_MS } from "@/lib/lessons/admin-ai-lesson-batch";
import { boundedSelectOne, checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { eachStripePriceMatrixRow, listMissingStripePriceEnvKeys } from "@/lib/stripe/pricing-map";
import { safePrismaCount, withPrismaReadFallback } from "@/lib/prisma/safe-reads";

const READINESS_TIMEOUT_MS = 3500;
const DB_PROBE_TIMEOUT_MS = 4000;

function isoNow() {
  return new Date().toISOString();
}

async function timed<T>(fn: () => Promise<T>): Promise<{ ms: number; value: T }> {
  const start = Date.now();
  const value = await fn();
  return { ms: Date.now() - start, value };
}

function checkBase(
  id: SystemCheckId,
  name: string,
  ms: number,
  status: SystemCheckResult["status"],
  summary: string,
  details: Record<string, unknown>,
): SystemCheckResult {
  return {
    id,
    name,
    status,
    summary,
    details,
    checkedAt: isoNow(),
    responseTimeMs: ms,
  };
}

/** Equivalent to GET /healthz — no DB. */
function probeAppLiveness(): SystemCheckResult {
  const mem = process.memoryUsage();
  return checkBase(
    "appLiveness",
    "App liveness",
    0,
    "healthy",
    "Node process is responding (same contract as GET /healthz).",
    {
      service: "nursenest-core",
      uptimeSeconds: Math.floor(process.uptime()),
      nodeEnv: process.env.NODE_ENV ?? null,
      memoryHeapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
      healthzPath: "/healthz",
    },
  );
}

/** DB-aware readiness — shared with GET /api/health/ready. */
async function probeAppReadiness(): Promise<SystemCheckResult> {
  const { ms, value: r } = await timed(() => checkDatabaseReadiness(READINESS_TIMEOUT_MS));
  if ("skipped" in r && r.skipped) {
    return checkBase(
      "appReadiness",
      "App readiness",
      ms,
      "healthy",
      "Database not configured — readiness probe skipped (dev/local).",
      { database: "not_configured", equivalentPath: "/api/health/ready" },
    );
  }
  if (r.ok && "latencyMs" in r) {
    return checkBase("appReadiness", "App readiness", ms, "healthy", "Database responded within timeout.", {
      database: "ok",
      latencyMs: r.latencyMs,
      equivalentPath: "/api/health/ready",
    });
  }
  const err = !r.ok && "error" in r ? r.error : "unknown";
  safeServerLog("admin_system_status", "readiness_probe_failed", { preview: err.slice(0, 160) });
  return checkBase("appReadiness", "App readiness", ms, "failed", "Readiness probe failed.", {
    database: "error",
    probeFailed: true,
    equivalentPath: "/api/health/ready",
  });
}

async function probeDatabase(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    if (!isDatabaseUrlConfigured()) {
      return {
        configured: false as const,
        selectLatencyMs: null as number | null,
        migrationCount: null as number | null,
        error: null as string | null,
      };
    }
    const ping = await boundedSelectOne(DB_PROBE_TIMEOUT_MS);
    if (!ping.ok) {
      safeServerLog("admin_system_status", "database_select_failed", { preview: ping.error.slice(0, 160) });
      return {
        configured: true as const,
        selectLatencyMs: null,
        migrationCount: null,
        error: ping.error,
      };
    }
    const selectLatencyMs = ping.latencyMs;
    let migrationCount: number | null = null;
    try {
      const rows = await prisma.$queryRaw<Array<{ c: bigint }>>`
        SELECT COUNT(*)::bigint AS c FROM "_prisma_migrations"
      `;
      migrationCount = Number(rows[0]?.c ?? 0);
    } catch {
      migrationCount = null;
    }
    return { configured: true as const, selectLatencyMs, migrationCount, error: null as string | null };
  });

  if (!value.configured) {
    return checkBase(
      "database",
      "Database",
      ms,
      "healthy",
      "No DATABASE_URL — Prisma not in use for this environment.",
      { configured: false },
    );
  }
  if (value.error) {
    safeServerLog("admin_system_status", "database_probe_failed", { preview: value.error.slice(0, 160) });
    return checkBase("database", "Database", ms, "failed", "Prisma query failed.", {
      configured: true,
      probeFailed: true,
    });
  }
  const degraded = value.migrationCount === null;
  return checkBase(
    "database",
    "Database",
    ms,
    degraded ? "degraded" : "healthy",
    degraded
      ? "Connected; could not read migration table (permissions or non-Postgres?)."
      : "Prisma connected; migration history readable.",
    {
      configured: true,
      selectLatencyMs: value.selectLatencyMs,
      migrationCount: value.migrationCount,
    },
  );
}

async function probeQueueHealth(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    if (!isDatabaseUrlConfigured()) {
      return { skipped: true as const, reason: "no_database" as const };
    }

    const statusCounts = await withPrismaReadFallback(
      "ai_job_status_group",
      () =>
        prisma.aiGenerationJob.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
      [],
    );

    const byStatus: Partial<Record<JobStatus, number>> = {};
    for (const row of statusCounts.value) {
      byStatus[row.status] = row._count._all;
    }

    const pending = byStatus.PENDING ?? 0;
    const running = byStatus.RUNNING ?? 0;
    const failed = byStatus.FAILED ?? 0;
    const active = pending + running;

    const staleBefore = new Date(Date.now() - STALE_GENERATING_MS);
    const stuckGen = await safePrismaCount("lesson_batch_stuck_generating", () =>
      prisma.lessonBatchQueueItem.count({
        where: {
          status: "GENERATING",
          startedAt: { lt: staleBefore },
        },
      }),
    );
    const generatingItems = await safePrismaCount("lesson_batch_generating_total", () =>
      prisma.lessonBatchQueueItem.count({ where: { status: "GENERATING" } }),
    );

    const oldestRow = await withPrismaReadFallback(
      "ai_oldest_pending",
      () =>
        prisma.aiGenerationJob.findFirst({
          where: { status: JobStatus.PENDING },
          orderBy: { createdAt: "asc" },
          select: { createdAt: true },
        }),
      null,
    );
    const oldestPendingAgeMinutes =
      oldestRow.value?.createdAt != null
        ? Math.round((Date.now() - oldestRow.value.createdAt.getTime()) / 60000)
        : null;

    const warnings = [statusCounts.warning, stuckGen.warning, oldestRow.warning, generatingItems.warning].filter(
      Boolean,
    ) as string[];

    return {
      skipped: false as const,
      byStatus,
      activeJobs: active,
      pendingJobs: pending,
      /** `AiGenerationJob` rows in RUNNING (work in flight). */
      runningJobs: running,
      failedJobs: failed,
      lessonBatchItemsGenerating: generatingItems.value,
      lessonBatchStuckGenerating: stuckGen.value,
      oldestPendingJobAgeMinutes: oldestPendingAgeMinutes,
      staleThresholdMinutes: Math.round(STALE_GENERATING_MS / 60000),
      prismaWarnings: warnings,
    };
  });

  if ("skipped" in value && value.skipped) {
    return checkBase("queueHealth", "AI queue health", ms, "healthy", "No database — queue metrics skipped.", {
      skipped: true,
      reason: value.reason,
    });
  }

  const v = value as {
    byStatus: Partial<Record<JobStatus, number>>;
    activeJobs: number;
    pendingJobs: number;
    runningJobs: number;
    failedJobs: number;
    lessonBatchItemsGenerating: number;
    lessonBatchStuckGenerating: number;
    oldestPendingJobAgeMinutes: number | null;
    staleThresholdMinutes: number;
    prismaWarnings: string[];
  };

  const qStatus = deriveQueueHealthStatus({
    stuckLessonBatchGenerating: v.lessonBatchStuckGenerating,
    prismaWarningCount: v.prismaWarnings.length,
  });

  let status: SystemCheckResult["status"] = qStatus;
  let summary = "Aggregated `AiGenerationJob` and lesson batch queue counts.";
  if (v.lessonBatchStuckGenerating > 0) {
    summary = `${v.lessonBatchStuckGenerating} lesson batch item(s) stuck in GENERATING past ${v.staleThresholdMinutes}m — see batch admin tools.`;
  } else if (v.prismaWarnings.length > 0) {
    summary = "Queue metrics partially degraded (Prisma safe-read warnings).";
    status = "degraded";
  }
  if (v.oldestPendingJobAgeMinutes != null && v.oldestPendingJobAgeMinutes > 120 && status === "healthy") {
    status = "degraded";
    summary = `Oldest PENDING AI job is ~${v.oldestPendingJobAgeMinutes} minutes old.`;
  }

  return checkBase("queueHealth", "AI queue health", ms, status, summary, {
    aiJobsByStatus: v.byStatus,
    activeJobs: v.activeJobs,
    pendingJobs: v.pendingJobs,
    runningJobs: v.runningJobs,
    failedJobs: v.failedJobs,
    lessonBatchItemsGenerating: v.lessonBatchItemsGenerating,
    lessonBatchStuckGenerating: v.lessonBatchStuckGenerating,
    oldestPendingJobAgeMinutes: v.oldestPendingJobAgeMinutes,
    staleGeneratingThresholdMinutes: v.staleThresholdMinutes,
    prismaWarnings: v.prismaWarnings,
  });
}

async function probeContentHealth(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    if (!isDatabaseUrlConfigured()) {
      return { skipped: true as const };
    }
    const lessons = await safePrismaCount("pathway_lessons_total", () => prisma.pathwayLesson.count());
    const questions = await safePrismaCount("exam_questions_total", () => prisma.examQuestion.count());
    const lessonDrafts = await safePrismaCount("generated_lesson_drafts", () => prisma.generatedLessonDraft.count());
    const questionDrafts = await safePrismaCount("generated_question_drafts", () =>
      prisma.generatedQuestionDraft.count(),
    );
    const publishedLessons = await safePrismaCount("pathway_lessons_published", () =>
      prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
    );
    const publishedQuestions = await safePrismaCount("exam_questions_published", () =>
      prisma.examQuestion.count({ where: { status: DB_PUBLISHED } }),
    );
    const lessonDraftsPendingReview = await safePrismaCount("lesson_drafts_pending_review", () =>
      prisma.generatedLessonDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
    );
    const questionDraftsPendingReview = await safePrismaCount("question_drafts_pending_review", () =>
      prisma.generatedQuestionDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
    );
    const warnings = [
      lessons.warning,
      questions.warning,
      lessonDrafts.warning,
      questionDrafts.warning,
      lessonDraftsPendingReview.warning,
      questionDraftsPendingReview.warning,
    ].filter(Boolean) as string[];
    return {
      skipped: false as const,
      lessonCount: lessons.value,
      questionCount: questions.value,
      generatedLessonDrafts: lessonDrafts.value,
      generatedQuestionDrafts: questionDrafts.value,
      pathwayLessonsPublished: publishedLessons.value,
      examQuestionsPublished: publishedQuestions.value,
      lessonDraftsPendingReview: lessonDraftsPendingReview.value,
      questionDraftsPendingReview: questionDraftsPendingReview.value,
      warnings,
    };
  });

  if ("skipped" in value && value.skipped) {
    return checkBase("contentHealth", "Content health", ms, "healthy", "No database — content counts skipped.", {
      skipped: true,
    });
  }

  const v = value as {
    lessonCount: number;
    questionCount: number;
    generatedLessonDrafts: number;
    generatedQuestionDrafts: number;
    pathwayLessonsPublished: number;
    examQuestionsPublished: number;
    lessonDraftsPendingReview: number;
    questionDraftsPendingReview: number;
    warnings: string[];
  };

  const cStatus = deriveContentHealthStatus({
    lessonCount: v.lessonCount,
    questionCount: v.questionCount,
    prismaWarningCount: v.warnings.length,
    nodeEnv: process.env.NODE_ENV,
  });

  let summary = "Count queries only — pathway lessons, exam questions, AI drafts.";
  if (cStatus === "degraded" && v.warnings.length > 0) {
    summary = "Some counts returned warnings (optional tables / safe mode).";
  } else if (cStatus === "degraded") {
    summary = "Production environment reports zero lessons and zero questions — verify database routing.";
  }

  return checkBase("contentHealth", "Content health", ms, cStatus, summary, {
    lessonCount: v.lessonCount,
    questionCount: v.questionCount,
    generatedLessonDrafts: v.generatedLessonDrafts,
    generatedQuestionDrafts: v.generatedQuestionDrafts,
    lessonDraftsPendingReview: v.lessonDraftsPendingReview,
    questionDraftsPendingReview: v.questionDraftsPendingReview,
    pathwayLessonsPublished: v.pathwayLessonsPublished,
    examQuestionsPublished: v.examQuestionsPublished,
    prismaWarnings: v.warnings,
  });
}

async function probeConfigSanity(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    const databaseUrlPresent = isDatabaseUrlConfigured();
    const authSecret =
      Boolean(process.env.AUTH_SECRET?.trim()) || Boolean(process.env.NEXTAUTH_SECRET?.trim());
    const authUrlPresent = Boolean(process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim());
    const openaiKeyPresent = Boolean(process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim());
    const stripeSecretPresent = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
    const stripeWebhookPresent = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
    const spacesCredsPresent =
      Boolean(process.env.SPACES_KEY?.trim()) && Boolean(process.env.SPACES_SECRET?.trim());
    const spacesBucketPresent = Boolean(process.env.SPACES_BUCKET?.trim());
    const spacesRegionPresent = Boolean(process.env.SPACES_REGION?.trim());

    let sessionLoadable = false;
    try {
      await auth();
      sessionLoadable = true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      safeServerLog("admin_system_status", "auth_init_threw", { preview: msg.slice(0, 160) });
    }

    const adminAi = isAdminAiGenerationEnabled();
    const rows = eachStripePriceMatrixRow();
    const missingPrices = listMissingStripePriceEnvKeys();

    const deploy = {
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.trim() || process.env.GITHUB_SHA?.trim() || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF?.trim() || process.env.GITHUB_REF_NAME?.trim() || null,
      vercelEnv: process.env.VERCEL_ENV?.trim() || null,
      buildTime:
        process.env.NURSE_NEST_DEPLOYED_AT?.trim() ||
        process.env.NURSE_NEST_BUILD_TIME?.trim() ||
        process.env.NEXT_PUBLIC_BUILD_TIME?.trim() ||
        null,
    };

    return {
      databaseUrlPresent,
      authSecretPresent: authSecret,
      authUrlPresent,
      openaiIntegrationKeyPresent: openaiKeyPresent,
      stripeSecretPresent,
      stripeWebhookSecretPresent: stripeWebhookPresent,
      spacesCredentialsPresent: spacesCredsPresent,
      spacesBucketPresent,
      spacesRegionPresent,
      sessionHandlerLoadable: sessionLoadable,
      adminAiGenerationEnabled: adminAi,
      stripePriceCellsConfigured: rows.filter((r) => r.priceId).length,
      stripePriceCellsTotal: rows.length,
      stripeMissingPriceEnvCount: missingPrices.length,
      deploy,
    };
  });

  const prod = process.env.NODE_ENV === "production";
  let status: SystemCheckResult["status"] = "healthy";
  let summary = "Presence checks only — no secret values.";

  if (!value.sessionHandlerLoadable) {
    return checkBase("configSanity", "Auth & config sanity", ms, "failed", "NextAuth handler threw — auth layer not loadable.", {
      ...value,
    });
  }
  if (prod && !value.authSecretPresent) {
    return checkBase("configSanity", "Auth & config sanity", ms, "failed", "AUTH_SECRET / NEXTAUTH_SECRET missing in production.", value);
  }
  if (value.adminAiGenerationEnabled && !value.openaiIntegrationKeyPresent) {
    return checkBase(
      "configSanity",
      "Auth & config sanity",
      ms,
      "failed",
      "AI_ADMIN_GENERATION_ENABLED but OpenAI integration key is not set.",
      value,
    );
  }

  if (prod && !value.authUrlPresent) {
    status = "degraded";
    summary = "AUTH_URL / NEXTAUTH_URL unset in production — links may be wrong.";
  } else if (!value.databaseUrlPresent) {
    status = "degraded";
    summary = "DATABASE_URL not configured — app may be static/export only.";
  } else if (prod && !value.stripeSecretPresent) {
    status = "degraded";
    summary = "STRIPE_SECRET_KEY not set — billing unavailable.";
  } else if (value.stripeMissingPriceEnvCount > 0) {
    status = "degraded";
    summary = `${value.stripeMissingPriceEnvCount} STRIPE_PRICE_* env(s) missing — some checkout cells unavailable.`;
  } else if (!value.spacesCredentialsPresent || !value.spacesBucketPresent || !value.spacesRegionPresent) {
    status = "degraded";
    summary = "Spaces configuration incomplete — uploads/CDN may be degraded.";
  }

  return checkBase("configSanity", "Auth & config sanity", ms, status, summary, value);
}

/**
 * Run all probes fresh (no HTTP caching). Safe for Route handlers and server components.
 */
export async function runSystemStatusProbes(): Promise<SystemStatusPayload> {
  const wallStart = Date.now();
  const checkedAt = isoNow();

  const [appReadiness, database, queueHealth, contentHealth, configSanity] = await Promise.all([
    probeAppReadiness(),
    probeDatabase(),
    probeQueueHealth(),
    probeContentHealth(),
    probeConfigSanity(),
  ]);

  const appLiveness = probeAppLiveness();

  const checks: SystemCheckResult[] = [appLiveness, appReadiness, database, queueHealth, contentHealth, configSanity].sort(
    (a, b) => a.id.localeCompare(b.id),
  );

  const overall = classifyOverallStatus(checks);

  return {
    ok: true,
    overall,
    checkedAt,
    totalResponseTimeMs: Date.now() - wallStart,
    checks,
    summary: buildOperationalSummaryFromChecks(checks),
  };
}
