/**
 * Bounded admin command-center payload for the main /admin dashboard and related surfaces.
 */
import {
  BlogPostStatus,
  ContentStatus,
  CountryCode,
  PracticeTestStatus,
  SubscriptionStatus,
  TierCode,
  UserRole,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { loadAdminDashboardStats, type AdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";
import { loadAdminDiagnostics, type AdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { listMissingStripePriceEnvKeys, eachStripePriceMatrixRow } from "@/lib/stripe/pricing-map";
import { loadAdminQaIssueSnapshot } from "@/lib/admin/admin-qa-snapshot";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import { loadContentQualityCorpusPayload } from "@/lib/admin/content-quality-corpus-refresh";
import type { ContentQualityCorpusPayload } from "@/lib/admin/content-quality-corpus-refresh";
import { emptyContentQualityCorpusPayload } from "@/lib/admin/content-quality-corpus-refresh";
import { emptyContentQualitySnapshot, loadContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";
import type { ContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";
import {
  loadPremiumProtectionAdminSnapshot,
  type PremiumProtectionAdminSnapshot,
} from "@/lib/admin/load-premium-protection-admin-snapshot";
import {
  loadQuestionBankRemediationIntelligence,
  type QuestionBankRemediationIntelligence,
} from "@/lib/questions/load-question-bank-remediation-intelligence";

export type AdminNeedsAttentionItem = {
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href?: string;
};

export type TimeSeriesPoint = { label: string; value: number };

export type AdminCommandCenterData = {
  generatedAt: string;
  stats: AdminDashboardStats | null;
  diagnostics: AdminDiagnostics | null;
  users: {
    total: number;
    learners: number;
    admins: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    trialActive: number;
    onboardingIncomplete: number;
    byCountry: { country: CountryCode; count: number }[];
    byTier: { tier: TierCode; count: number }[];
    byRole: { role: UserRole; count: number }[];
  };
  subscriptions: {
    active: number;
    grace: number;
    cancelled: number;
    pastDue: number;
    byPlanTier: { planTier: TierCode | null; count: number }[];
    byPlanCountry: { planCountry: CountryCode | null; count: number }[];
  };
  stripe: {
    secretConfigured: boolean;
    missingPriceEnvKeys: string[];
    configuredCells: number;
    totalCells: number;
  };
  content: {
    lessonsContentItems: number;
    lessonsContentItemsPublished: number;
    lessonsContentItemsDraft: number;
    pathwayLessonsPublished: number;
    pathwayLessonsDraft: number;
    questionsTotal: number;
    questionsPublished: number;
    blogTotal: number;
    blogPublished: number;
    blogDraft: number;
    blogScheduled: number;
    flashcardsPublished: number;
    practiceTestsTotal: number;
  };
  activity: {
    examAttemptsLast7d: number;
    examSessionsLast7d: number;
    catSessionsLast7d: number;
    practiceTestsCompletedLast7d: number;
  };
  seo: {
    blogMissingSeoFields: number;
    pathwayLessonsWeakSeoSample: number;
    contentLessonsWeakSeoSample: number;
    estimatedPublicLessonRoutes: number;
  };
  blog: {
    overdueScheduled: number;
    nextScheduledAt: string | null;
    missingSeoPostIds: string[];
  };
  pathwayCoveragePreview: Array<{
    pathwayId: string;
    displayName: string;
    lessonsPublished: number;
    questionsMatched: number;
    readiness: "ready" | "partial" | "not_ready";
  }>;
  charts: {
    signupsByDay: TimeSeriesPoint[];
    subscriptionsByDay: TimeSeriesPoint[];
  };
  needsAttention: AdminNeedsAttentionItem[];
  /** Editorial quality: live snapshot + optional persisted full-corpus scan. */
  contentQuality: {
    snapshot: ContentQualitySnapshot;
    corpus: ContentQualityCorpusPayload | null;
  };
  /** Premium deterrence rollups, notes adoption, abuse review queue (no note bodies). */
  premiumProtection: PremiumProtectionAdminSnapshot | null;
  /** Actionable question-bank remediation intelligence layer. */
  questionBankIntel: QuestionBankRemediationIntelligence | null;
};

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86400000);
}

export async function loadAdminCommandCenter(): Promise<AdminCommandCenterData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;
  const generatedAt = new Date().toISOString();

  const [stats, diagnostics, qa] = await Promise.all([
    loadAdminDashboardStats(),
    loadAdminDiagnostics(),
    loadAdminQaIssueSnapshot().catch(() => null),
  ]);

  const todayStart = startOfUtcDay(new Date());
  const weekAgo = daysAgo(7);
  const monthAgo = daysAgo(30);
  const chartSince = daysAgo(14);

  try {
    const [
      total,
      learners,
      admins,
      newToday,
      newThisWeek,
      newThisMonth,
      trialActive,
      onboardingIncomplete,
      byCountry,
      byTier,
      byRole,
      subActive,
      subGrace,
      subCancelled,
      subPastDue,
      subByTier,
      subByCountry,
      lessonsCi,
      lessonsCiPub,
      lessonsCiDraft,
      plPub,
      plDraft,
      qTotal,
      qPub,
      blogTotal,
      blogPub,
      blogDraft,
      blogSched,
      fcPub,
      ptTotal,
      examAtt7,
      es7,
      cat7,
      ptDone7,
      blogMissingSeo,
      plSeoWeak,
      ciSeoWeak,
      overdueSched,
      nextSched,
      questionDiag,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.LEARNER } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.user.count({ where: { trialStatus: "ACTIVE" } }),
      prisma.user.count({ where: { role: UserRole.LEARNER, onboardingCompletedAt: null } }),
      prisma.user.groupBy({ by: ["country"], _count: { _all: true } }),
      prisma.user.groupBy({ by: ["tier"], _count: { _all: true } }),
      prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.GRACE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELLED } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.PAST_DUE } }),
      prisma.subscription.groupBy({ by: ["planTier"], _count: { _all: true } }),
      prisma.subscription.groupBy({ by: ["planCountry"], _count: { _all: true } }),
      prisma.contentItem.count({ where: { type: "lesson" } }),
      prisma.contentItem.count({ where: { type: "lesson", status: "published" } }),
      prisma.contentItem.count({ where: { type: "lesson", status: "draft" } }),
      prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.pathwayLesson.count({ where: { status: ContentStatus.DRAFT } }),
      prisma.examQuestion.count(),
      prisma.examQuestion.count({ where: { status: "published" } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
      prisma.blogPost.count({ where: { postStatus: BlogPostStatus.DRAFT } }),
      prisma.blogPost.count({ where: { postStatus: BlogPostStatus.SCHEDULED } }),
      prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.practiceTest.count(),
      prisma.examAttempt.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.examSession.count({ where: { updatedAt: { gte: weekAgo } } }),
      prisma.$queryRaw<[{ n: bigint }]>`
        SELECT COUNT(*)::bigint AS n FROM "ExamSession"
        WHERE "updatedAt" >= ${weekAgo} AND "adaptive_state" IS NOT NULL
      `.then((r) => Number(r[0]?.n ?? 0)),
      prisma.practiceTest.count({
        where: { status: PracticeTestStatus.COMPLETED, completedAt: { gte: weekAgo } },
      }),
      prisma.blogPost.count({
        where: {
          OR: [{ seoTitle: null }, { seoDescription: null }, { seoTitle: "" }, { seoDescription: "" }],
        },
      }),
      prisma.pathwayLesson.count({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [{ seoTitle: "" }, { seoDescription: "" }],
        },
      }),
      prisma.contentItem.count({
        where: {
          type: "lesson",
          status: "published",
          OR: [{ seoTitle: null }, { seoDescription: null }, { seoTitle: "" }, { seoDescription: "" }],
        },
      }),
      prisma.blogPost.count({
        where: {
          postStatus: BlogPostStatus.SCHEDULED,
          publishAt: { lt: new Date() },
        },
      }),
      prisma.blogPost.findFirst({
        where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { gte: new Date() } },
        orderBy: { publishAt: "asc" },
        select: { publishAt: true },
      }),
      buildQuestionBankCoverageReport().catch(() => null),
    ]);

    const signupsRaw = await prisma.$queryRaw<Array<{ d: Date; c: bigint }>>`
      SELECT date_trunc('day', "createdAt") AS d, COUNT(*)::bigint AS c
      FROM "User"
      WHERE "createdAt" >= ${chartSince}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    const subsRaw = await prisma.$queryRaw<Array<{ d: Date; c: bigint }>>`
      SELECT date_trunc('day', "createdAt") AS d, COUNT(*)::bigint AS c
      FROM "Subscription"
      WHERE "createdAt" >= ${chartSince}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const signupsByDay: TimeSeriesPoint[] = signupsRaw.map((r) => ({
      label: r.d.toISOString().slice(0, 10),
      value: Number(r.c),
    }));
    const subscriptionsByDay: TimeSeriesPoint[] = subsRaw.map((r) => ({
      label: r.d.toISOString().slice(0, 10),
      value: Number(r.c),
    }));

    const matchByPathway = new Map(
      (questionDiag?.pathwayPublishedMatch ?? []).map((m) => [m.pathwayId, m.publishedCount]),
    );

    const pathwayLessonCounts = await prisma.pathwayLesson.groupBy({
      by: ["pathwayId"],
      where: { status: ContentStatus.PUBLISHED },
      _count: { _all: true },
    });
    const pubByPathway = new Map<string, number>();
    for (const row of pathwayLessonCounts) {
      pubByPathway.set(row.pathwayId, row._count._all);
    }

    const pathwayCoveragePreview = EXAM_PATHWAYS.filter((p) => p.countryCode === CountryCode.US).slice(0, 12).map((p) => {
      const lessonsPublished = pubByPathway.get(p.id) ?? 0;
      const questionsMatched = matchByPathway.get(p.id) ?? 0;
      const readiness: "ready" | "partial" | "not_ready" =
        lessonsPublished >= 10 && questionsMatched >= 200 ? "ready" : lessonsPublished > 0 || questionsMatched > 0 ? "partial" : "not_ready";
      return {
        pathwayId: p.id,
        displayName: p.displayName,
        lessonsPublished,
        questionsMatched,
        readiness,
      };
    });

    const matrix = eachStripePriceMatrixRow();
    const missingPriceEnvKeys = listMissingStripePriceEnvKeys();
    const stripeSecretConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());

    const missingSeoIds = await prisma.blogPost
      .findMany({
        where: {
          OR: [
            { seoTitle: null },
            { seoDescription: null },
            { seoTitle: "" },
            { seoDescription: "" },
          ],
        },
        take: 40,
        select: { id: true },
      })
      .then((rows) => rows.map((r) => r.id))
      .catch(() => []);

    const needsAttention: AdminNeedsAttentionItem[] = [];

    if (diagnostics?.dbHealth.status === "error") {
      needsAttention.push({
        severity: "critical",
        title: "Database health check failed",
        detail: diagnostics.dbHealth.error ?? "See diagnostics",
        href: "/admin/operations",
      });
    }
    if (isRuntimeSafeMode()) {
      needsAttention.push({
        severity: "warning",
        title: "Safe mode is on",
        detail: "Some admin metrics and writes may be limited.",
      });
    }
    if (stripeSecretConfigured && missingPriceEnvKeys.length > 0) {
      const prod = process.env.NODE_ENV === "production";
      needsAttention.push({
        severity: prod ? "critical" : "warning",
        title: `${missingPriceEnvKeys.length} Stripe price env vars missing`,
        detail: prod
          ? `Checkout returns 400 for those plans until envs are set. Example: ${missingPriceEnvKeys[0] ?? "STRIPE_PRICE_*"}.`
          : "Checkout will be unavailable for those plan cells until STRIPE_PRICE_* keys are set.",
        href: "/admin/subscriptions",
      });
    }
    if (overdueSched > 0) {
      needsAttention.push({
        severity: "warning",
        title: `${overdueSched} scheduled blog post(s) past publish time`,
        detail: "Run cron blog-publish or promote from ops — posts may already be visible via SCHEDULED+publishAt rule.",
        href: "/admin/blog/scheduler",
      });
    }
    if (blogMissingSeo > 0) {
      needsAttention.push({
        severity: "info",
        title: `${blogMissingSeo} blog post(s) lack SEO title or description`,
        detail: "Prioritize high-traffic URLs in /admin/seo",
        href: "/admin/seo",
      });
    }
    if (qa && qa.questionsFlaggedNeedsReview > 0) {
      needsAttention.push({
        severity: "info",
        title: `${qa.questionsFlaggedNeedsReview} questions flagged for review`,
        detail: "Rationale or quality QA backlog",
        href: "/admin/content",
      });
    }
    const thinPathways = pathwayCoveragePreview.filter((r) => r.readiness === "not_ready");
    if (thinPathways.length > 0) {
      needsAttention.push({
        severity: "info",
        title: `${thinPathways.length} US pathways show thin content depth`,
        detail: "See coverage table — add lessons and bank alignment.",
        href: "/admin/content",
      });
    }

    const [contentQualitySnapshot, contentQualityCorpus, premiumProtection, questionBankIntel] = await Promise.all([
      loadContentQualitySnapshot().catch(() => emptyContentQualitySnapshot(generatedAt)),
      loadContentQualityCorpusPayload().catch(() => emptyContentQualityCorpusPayload("load_failed")),
      loadPremiumProtectionAdminSnapshot().catch(() => null),
      loadQuestionBankRemediationIntelligence().catch(() => null),
    ]);

    if (!contentQualityCorpus.meta.available) {
      needsAttention.push({
        severity: "warning",
        title: "Content-quality corpus data unavailable",
        detail: contentQualityCorpus.meta.reason
          ? `Corpus load/refresh issue (${contentQualityCorpus.meta.reason}). Workbench snapshot metrics still load separately.`
          : "Using fallback until corpus refresh succeeds.",
        href: "/admin/content-quality",
      });
    }

    if (premiumProtection && premiumProtection.openAbuseReviews.length > 0) {
      needsAttention.push({
        severity: "warning",
        title: `${premiumProtection.openAbuseReviews.length} premium-protection abuse item(s) need review`,
        detail: "Repeated rate limits or bulk API volume on protected routes.",
        href: "/admin/premium-protection",
      });
    }

    needsAttention.sort((a, b) => {
      const rank = { critical: 0, warning: 1, info: 2 };
      return rank[a.severity] - rank[b.severity];
    });

    return {
      generatedAt,
      stats,
      diagnostics,
      users: {
        total,
        learners,
        admins,
        newToday,
        newThisWeek,
        newThisMonth,
        trialActive,
        onboardingIncomplete,
        byCountry: byCountry.map((r) => ({ country: r.country, count: r._count._all })),
        byTier: byTier.map((r) => ({ tier: r.tier, count: r._count._all })),
        byRole: byRole.map((r) => ({ role: r.role, count: r._count._all })),
      },
      subscriptions: {
        active: subActive,
        grace: subGrace,
        cancelled: subCancelled,
        pastDue: subPastDue,
        byPlanTier: subByTier.map((r) => ({ planTier: r.planTier, count: r._count._all })),
        byPlanCountry: subByCountry.map((r) => ({ planCountry: r.planCountry, count: r._count._all })),
      },
      stripe: {
        secretConfigured: stripeSecretConfigured,
        missingPriceEnvKeys,
        configuredCells: matrix.filter((m) => m.priceId).length,
        totalCells: matrix.length,
      },
      content: {
        lessonsContentItems: lessonsCi,
        lessonsContentItemsPublished: lessonsCiPub,
        lessonsContentItemsDraft: lessonsCiDraft,
        pathwayLessonsPublished: plPub,
        pathwayLessonsDraft: plDraft,
        questionsTotal: qTotal,
        questionsPublished: qPub,
        blogTotal,
        blogPublished: blogPub,
        blogDraft: blogDraft,
        blogScheduled: blogSched,
        flashcardsPublished: fcPub,
        practiceTestsTotal: ptTotal,
      },
      activity: {
        examAttemptsLast7d: examAtt7,
        examSessionsLast7d: es7,
        catSessionsLast7d: cat7,
        practiceTestsCompletedLast7d: ptDone7,
      },
      seo: {
        blogMissingSeoFields: blogMissingSeo,
        pathwayLessonsWeakSeoSample: plSeoWeak,
        contentLessonsWeakSeoSample: ciSeoWeak,
        estimatedPublicLessonRoutes: plPub + lessonsCiPub,
      },
      blog: {
        overdueScheduled: overdueSched,
        nextScheduledAt: nextSched?.publishAt?.toISOString() ?? null,
        missingSeoPostIds: missingSeoIds,
      },
      pathwayCoveragePreview,
      charts: { signupsByDay, subscriptionsByDay },
      needsAttention,
      contentQuality: {
        snapshot: contentQualitySnapshot,
        corpus: contentQualityCorpus,
      },
      premiumProtection,
      questionBankIntel,
    };
  } catch (e) {
    console.error("[loadAdminCommandCenter]", e);
    return {
      generatedAt,
      stats,
      diagnostics,
      users: {
        total: 0,
        learners: 0,
        admins: 0,
        newToday: 0,
        newThisWeek: 0,
        newThisMonth: 0,
        trialActive: 0,
        onboardingIncomplete: 0,
        byCountry: [],
        byTier: [],
        byRole: [],
      },
      subscriptions: {
        active: 0,
        grace: 0,
        cancelled: 0,
        pastDue: 0,
        byPlanTier: [],
        byPlanCountry: [],
      },
      stripe: {
        secretConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
        missingPriceEnvKeys: listMissingStripePriceEnvKeys(),
        configuredCells: 0,
        totalCells: eachStripePriceMatrixRow().length,
      },
      content: {
        lessonsContentItems: 0,
        lessonsContentItemsPublished: 0,
        lessonsContentItemsDraft: 0,
        pathwayLessonsPublished: 0,
        pathwayLessonsDraft: 0,
        questionsTotal: 0,
        questionsPublished: 0,
        blogTotal: 0,
        blogPublished: 0,
        blogDraft: 0,
        blogScheduled: 0,
        flashcardsPublished: 0,
        practiceTestsTotal: 0,
      },
      activity: {
        examAttemptsLast7d: 0,
        examSessionsLast7d: 0,
        catSessionsLast7d: 0,
        practiceTestsCompletedLast7d: 0,
      },
      seo: {
        blogMissingSeoFields: 0,
        pathwayLessonsWeakSeoSample: 0,
        contentLessonsWeakSeoSample: 0,
        estimatedPublicLessonRoutes: 0,
      },
      blog: { overdueScheduled: 0, nextScheduledAt: null, missingSeoPostIds: [] },
      pathwayCoveragePreview: [],
      charts: { signupsByDay: [], subscriptionsByDay: [] },
      needsAttention: [
        {
          severity: "critical",
          title: "Command center data partially unavailable",
          detail: e instanceof Error ? e.message : String(e),
          href: "/admin/operations",
        },
      ],
      contentQuality: {
        snapshot: emptyContentQualitySnapshot(generatedAt),
        corpus: null,
      },
      premiumProtection: null,
      questionBankIntel: null,
    };
  }
}
