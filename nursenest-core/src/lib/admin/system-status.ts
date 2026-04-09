/**
 * Admin system status probes — production-safe, bounded timeouts, no secret leakage.
 * Reuses DB readiness and Stripe pricing helpers where possible.
 */
import { ContentStatus, JobStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { classifyOverallStatus } from "@/lib/admin/system-status-classify";
import type {
  SystemCheckId,
  SystemCheckResult,
  SystemStatusPayload,
} from "@/lib/admin/system-status-types";
import {
  eachStripePriceMatrixRow,
  listMissingStripePriceEnvKeys,
} from "@/lib/stripe/pricing-map";
import { safePrismaCount, withPrismaReadFallback } from "@/lib/prisma/safe-reads";
import { NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL } from "@/config/marketing-cdn.catalog";

const READINESS_TIMEOUT_MS = 3500;
const DB_PROBE_TIMEOUT_MS = 4000;
const HEAD_TIMEOUT_MS = 3000;

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
  const ms = 0;
  return checkBase(
    "appLiveness",
    "App liveness",
    ms,
    "healthy",
    "Node process is running; same guarantees as GET /healthz.",
    {
      service: "nursenest-core",
      uptimeSeconds: Math.floor(process.uptime()),
      nodeEnv: process.env.NODE_ENV ?? null,
      memoryHeapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
      equivalentPath: "/healthz",
    },
  );
}

/** Same probe as GET /api/health/ready (DB ping or skipped). */
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
    return checkBase("appReadiness", "App readiness", ms, "healthy", "Database responded to SELECT 1 within timeout.", {
      database: "ok",
      latencyMs: r.latencyMs,
      equivalentPath: "/api/health/ready",
    });
  }
  const err = !r.ok && "error" in r ? r.error : "unknown";
  return checkBase("appReadiness", "App readiness", ms, "failed", "Readiness probe failed — traffic should be drained if this persists.", {
    database: "error",
    error: err.slice(0, 200),
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
    const started = Date.now();
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise<never>((_, rej) => {
          setTimeout(() => rej(new Error("database_probe_timeout")), DB_PROBE_TIMEOUT_MS);
        }),
      ]);
      const selectLatencyMs = Date.now() - started;
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        configured: true as const,
        selectLatencyMs: null,
        migrationCount: null,
        error: msg.slice(0, 240),
      };
    }
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
    return checkBase("database", "Database", ms, "failed", "Prisma query failed.", {
      configured: true,
      error: value.error,
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

async function probeAuth(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    const hasSecret =
      Boolean(process.env.AUTH_SECRET?.trim()) || Boolean(process.env.NEXTAUTH_SECRET?.trim());
    const hasUrl = Boolean(process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim());
    let sessionLoadable = false;
    let sessionError: string | null = null;
    try {
      await auth();
      sessionLoadable = true;
    } catch (e) {
      sessionError = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
    }
    return { hasSecret, hasUrl, sessionLoadable, sessionError };
  });

  const prod = process.env.NODE_ENV === "production";
  if (prod && !value.hasSecret) {
    return checkBase("auth", "Authentication", ms, "failed", "AUTH_SECRET / NEXTAUTH_SECRET missing in production.", {
      hasAuthSecret: false,
      hasAuthUrl: value.hasUrl,
      sessionModuleLoadable: value.sessionLoadable,
    });
  }
  if (!value.sessionLoadable) {
    return checkBase("auth", "Authentication", ms, "failed", "NextAuth `auth()` threw — session layer not loadable.", {
      hasAuthSecret: value.hasSecret,
      hasAuthUrl: value.hasUrl,
      sessionModuleLoadable: false,
      error: value.sessionError,
    });
  }
  const degraded = !value.hasUrl && prod;
  return checkBase(
    "auth",
    "Authentication",
    ms,
    degraded ? "degraded" : "healthy",
    degraded ? "AUTH_URL / NEXTAUTH_URL unset in production — URLs may be wrong in emails/links." : "Auth secrets present; session handler loadable.",
    {
      hasAuthSecret: value.hasSecret,
      hasAuthUrl: value.hasUrl,
      sessionModuleLoadable: true,
    },
  );
}

async function probeOpenAI(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    const adminEnabled = isAdminAiGenerationEnabled();
    const hasIntegrationKey = Boolean(process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim());
    const model =
      process.env.AI_OPENAI_MODEL?.trim() || process.env.AI_ADMIN_MODEL?.trim() || "gpt-4o-mini";
    return { adminEnabled, hasIntegrationKey, model };
  });

  let status: SystemCheckResult["status"] = "healthy";
  let summary = value.hasIntegrationKey
    ? "AI_INTEGRATIONS_OPENAI_API_KEY present; admin AI policy evaluated."
    : "No OpenAI integration key configured.";
  if (value.adminEnabled && !value.hasIntegrationKey) {
    status = "failed";
    summary = "AI_ADMIN_GENERATION_ENABLED=true but AI_INTEGRATIONS_OPENAI_API_KEY is missing.";
  } else if (!value.hasIntegrationKey) {
    status = "degraded";
    summary = "No AI_INTEGRATIONS_OPENAI_API_KEY — admin and learner AI features cannot call OpenAI.";
  }

  return checkBase("openai", "OpenAI / admin AI", ms, status, summary, {
    adminGenerationEnabled: value.adminEnabled,
    integrationKeyPresent: value.hasIntegrationKey,
    modelDefault: value.model,
  });
}

async function probeStripe(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    const secret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
    const webhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
    const rows = eachStripePriceMatrixRow();
    const missing = listMissingStripePriceEnvKeys();
    return {
      secret,
      webhook,
      pricedCellsTotal: rows.length,
      pricedCellsConfigured: rows.filter((r) => r.priceId).length,
      missingPriceEnvCount: missing.length,
      missingPriceEnvSample: missing.slice(0, 8),
    };
  });

  let status: SystemCheckResult["status"] = "healthy";
  let summary = "Stripe secret configured; pricing env coverage summarized.";
  if (!value.secret) {
    status = process.env.NODE_ENV === "production" ? "degraded" : "degraded";
    summary = "STRIPE_SECRET_KEY not set — checkout and webhooks unavailable.";
  } else if (value.missingPriceEnvCount > 0) {
    status = "degraded";
    summary = `${value.missingPriceEnvCount} STRIPE_PRICE_* env(s) missing — some plan cells cannot checkout.`;
  }

  return checkBase("stripe", "Stripe", ms, status, summary, {
    secretKeyPresent: value.secret,
    webhookSecretPresent: value.webhook,
    pricedCellsConfigured: value.pricedCellsConfigured,
    pricedCellsTotal: value.pricedCellsTotal,
    missingPriceEnvCount: value.missingPriceEnvCount,
  });
}

async function probeSpaces(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    const key = Boolean(process.env.SPACES_KEY?.trim());
    const secret = Boolean(process.env.SPACES_SECRET?.trim());
    const region = process.env.SPACES_REGION?.trim() || null;
    const bucket = process.env.SPACES_BUCKET?.trim() || null;
    let headOk: boolean | null = null;
    let headStatus: number | undefined;
    let headError: string | undefined;
    const url = `${NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL.replace(/\/$/, "")}/screenshot1.png`;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), HEAD_TIMEOUT_MS);
    try {
      const res = await fetch(url, { method: "HEAD", signal: ac.signal, cache: "no-store" });
      headOk = res.ok;
      headStatus = res.status;
    } catch (e) {
      headOk = false;
      headError = e instanceof Error ? e.message.slice(0, 160) : String(e).slice(0, 160);
    } finally {
      clearTimeout(t);
    }
    return { key, secret, region, bucket, headOk, headStatus, headError, probeUrl: url };
  });

  const creds = value.key && value.secret;
  let status: SystemCheckResult["status"] = "healthy";
  let summary = "Spaces credentials configured; public CDN HEAD probe summarized.";
  if (!creds) {
    status = "degraded";
    summary = "SPACES_KEY/SPACES_SECRET not both set — admin uploads/proxy may be unavailable.";
  }
  if (value.headOk === false) {
    status = creds ? "degraded" : status;
    summary = "Public marketing CDN HEAD did not return success — verify CDN or network.";
  }

  return checkBase("spaces", "DigitalOcean Spaces", ms, status, summary, {
    keyPresent: value.key,
    secretPresent: value.secret,
    region: value.region,
    bucket: value.bucket,
    publicCdnHeadOk: value.headOk,
    publicCdnHeadStatus: value.headStatus,
    headError: value.headError ?? null,
    probeUrlHost: new URL(value.probeUrl).hostname,
  });
}

async function probeQueueHealth(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    if (!isDatabaseUrlConfigured()) {
      return { skipped: true as const, reason: "no_database" as const };
    }
    const stuckThreshold = new Date(Date.now() - 30 * 60 * 1000);
    const statusCounts = await withPrismaReadFallback(
      "ai_job_status_group",
      () =>
        prisma.aiGenerationJob.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
      [],
    );
    const stuckRunning = await safePrismaCount("ai_job_stuck", () =>
      prisma.aiGenerationJob.count({
        where: { status: JobStatus.RUNNING, updatedAt: { lt: stuckThreshold } },
      }),
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

    const blogBatchByStatus = await withPrismaReadFallback(
      "blog_draft_batch_items_group",
      () =>
        prisma.blogDraftGenerationBatchItem.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
      [],
    );

    const byStatus: Record<string, number> = {};
    for (const row of statusCounts.value) {
      byStatus[row.status] = row._count._all;
    }

    const blogDraftBatchItemsByStatus: Record<string, number> = {};
    for (const row of blogBatchByStatus.value) {
      blogDraftBatchItemsByStatus[row.status] = row._count._all;
    }

    return {
      skipped: false as const,
      byStatus,
      stuckRunningCount: stuckRunning.value,
      oldestPendingAgeMinutes,
      blogDraftBatchItemsByStatus,
      warnings: [
        statusCounts.warning,
        stuckRunning.warning,
        oldestRow.warning,
        blogBatchByStatus.warning,
      ].filter(Boolean) as string[],
    };
  });

  if ("skipped" in value && value.skipped) {
    return checkBase("queueHealth", "AI job queue", ms, "healthy", "No database — queue metrics skipped.", {
      skipped: true,
      reason: value.reason,
    });
  }

  const v = value as {
    byStatus: Record<string, number>;
    stuckRunningCount: number;
    oldestPendingAgeMinutes: number | null;
    blogDraftBatchItemsByStatus: Record<string, number>;
    warnings: string[];
  };
  const stuck = v.stuckRunningCount;
  const oldPending = v.oldestPendingAgeMinutes ?? 0;
  const degraded = stuck > 0 || oldPending > 120 || v.warnings.length > 0;

  return checkBase(
    "queueHealth",
    "AI job queue",
    ms,
    degraded ? "degraded" : "healthy",
    degraded
      ? "Queue needs attention (stuck RUNNING >30m, very old PENDING, or read warnings)."
      : "AiGenerationJob counts retrieved.",
    {
      jobStatusCounts: v.byStatus,
      stuckRunningOlderThan30Min: stuck,
      oldestPendingAgeMinutes: v.oldestPendingAgeMinutes,
      blogDraftBatchItemsByStatus: v.blogDraftBatchItemsByStatus,
      prismaWarnings: v.warnings,
    },
  );
}

async function probeContentHealth(): Promise<SystemCheckResult> {
  const { ms, value } = await timed(async () => {
    if (!isDatabaseUrlConfigured()) {
      return { skipped: true as const };
    }
    const eq = await safePrismaCount("exam_questions_total", () => prisma.examQuestion.count());
    const eqPub = await safePrismaCount("exam_questions_published", () =>
      prisma.examQuestion.count({ where: { status: DB_PUBLISHED } }),
    );
    const plPub = await safePrismaCount("pathway_lessons_published", () =>
      prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
    );
    const plDraft = await safePrismaCount("pathway_lessons_draft", () =>
      prisma.pathwayLesson.count({ where: { status: ContentStatus.DRAFT } }),
    );
    const lessonDrafts = await safePrismaCount("generated_lesson_drafts", () =>
      prisma.generatedLessonDraft.count(),
    );
    const questionDrafts = await safePrismaCount("generated_question_drafts", () =>
      prisma.generatedQuestionDraft.count(),
    );
    const warnings = [eq.warning, eqPub.warning, plPub.warning, plDraft.warning, lessonDrafts.warning, questionDrafts.warning].filter(
      Boolean,
    ) as string[];
    return {
      skipped: false as const,
      examQuestionsTotal: eq.value,
      examQuestionsPublished: eqPub.value,
      pathwayLessonsPublished: plPub.value,
      pathwayLessonsDraft: plDraft.value,
      generatedLessonDrafts: lessonDrafts.value,
      generatedQuestionDrafts: questionDrafts.value,
      warnings,
    };
  });

  if ("skipped" in value && value.skipped) {
    return checkBase("contentHealth", "Content inventory", ms, "healthy", "No database — content counts skipped.", {
      skipped: true,
    });
  }

  const v = value as {
    examQuestionsTotal: number;
    examQuestionsPublished: number;
    pathwayLessonsPublished: number;
    pathwayLessonsDraft: number;
    generatedLessonDrafts: number;
    generatedQuestionDrafts: number;
    warnings: string[];
  };

  const degraded = v.warnings.length > 0;
  return checkBase(
    "contentHealth",
    "Content inventory",
    ms,
    degraded ? "degraded" : "healthy",
    degraded ? "Some counts returned warnings (optional tables / safe mode)." : "Core content row counts retrieved.",
    {
      examQuestionsTotal: v.examQuestionsTotal,
      examQuestionsPublished: v.examQuestionsPublished,
      pathwayLessonsPublished: v.pathwayLessonsPublished,
      pathwayLessonsDraft: v.pathwayLessonsDraft,
      generatedLessonDrafts: v.generatedLessonDrafts,
      generatedQuestionDrafts: v.generatedQuestionDrafts,
      prismaWarnings: v.warnings,
    },
  );
}

function probeDeployInfo(): SystemCheckResult {
  const { ms, value } = (() => {
    const start = Date.now();
    /** Optional CI/build injection — not required; safe ISO or opaque string only. */
    const deployedAtOrBuildTime =
      process.env.NURSE_NEST_DEPLOYED_AT?.trim() ||
      process.env.NURSE_NEST_BUILD_TIME?.trim() ||
      process.env.NEXT_PUBLIC_BUILD_TIME?.trim() ||
      process.env.BUILD_TIME?.trim() ||
      null;
    const v = {
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.trim() || process.env.GITHUB_SHA?.trim() || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF?.trim() || process.env.GITHUB_REF_NAME?.trim() || null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID?.trim() || null,
      vercelEnv: process.env.VERCEL_ENV?.trim() || null,
      nodeEnv: process.env.NODE_ENV ?? null,
      deployedAtOrBuildTime,
      sentryRelease: process.env.SENTRY_RELEASE?.trim() || null,
    };
    return { ms: Date.now() - start, value: v };
  })();

  return checkBase("deployInfo", "Deploy metadata", ms, "healthy", "Process environment identifiers (no secrets).", value);
}

function probeEnvSanity(): SystemCheckResult {
  const { ms, value } = (() => {
    const start = Date.now();
    const keys = [
      "DATABASE_URL",
      "PROD_DATABASE_URL",
      "AUTH_SECRET",
      "NEXTAUTH_SECRET",
      "AUTH_URL",
      "NEXTAUTH_URL",
      "NEXT_PUBLIC_APP_URL",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "AI_INTEGRATIONS_OPENAI_API_KEY",
      "AI_ADMIN_GENERATION_ENABLED",
      "SPACES_KEY",
      "SPACES_SECRET",
      "SPACES_BUCKET",
      "SPACES_REGION",
    ] as const;
    const presence = Object.fromEntries(keys.map((k) => [k, Boolean(process.env[k]?.trim())])) as Record<string, boolean>;
    return { ms: Date.now() - start, value: presence };
  })();

  return checkBase("envSanity", "Environment sanity", ms, "healthy", "Critical env keys — presence only, not values.", {
    keys: value,
  });
}

/**
 * Run all probes fresh (no HTTP caching). Safe to call from Route handlers and server components.
 */
export async function runSystemStatusProbes(): Promise<SystemStatusPayload> {
  const wallStart = Date.now();
  const checkedAt = isoNow();

  const [
    appReadiness,
    database,
    authCheck,
    openai,
    stripe,
    spaces,
    queueHealth,
    contentHealth,
  ] = await Promise.all([
    probeAppReadiness(),
    probeDatabase(),
    probeAuth(),
    probeOpenAI(),
    probeStripe(),
    probeSpaces(),
    probeQueueHealth(),
    probeContentHealth(),
  ]);

  const appLiveness = probeAppLiveness();
  const deployInfo = probeDeployInfo();
  const envSanity = probeEnvSanity();

  const checks: SystemCheckResult[] = [
    appLiveness,
    appReadiness,
    database,
    authCheck,
    openai,
    stripe,
    spaces,
    queueHealth,
    contentHealth,
    deployInfo,
    envSanity,
  ].sort((a, b) => a.id.localeCompare(b.id));

  const overall = classifyOverallStatus(checks);

  return {
    ok: true,
    overall,
    checkedAt,
    totalResponseTimeMs: Date.now() - wallStart,
    checks,
  };
}
