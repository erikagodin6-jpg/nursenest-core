import "server-only";

import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import {
  loadPolicyAcceptanceEvidenceRows,
  type PolicyAcceptanceEvidenceRow,
} from "@/lib/business-protection/business-protection-audit";
import {
  buildChargebackEvidencePackage,
  type ChargebackEvidencePackage,
  type RevenueProtectionEvidenceKind,
  type RevenueProtectionEvidenceRecord,
  type RevenueProtectionSubscriberSnapshot,
} from "@/lib/business-protection/revenue-protection-center";

const REVENUE_PROTECTION_TIMEOUT_MS = 3500;

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function evidenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function evidenceRecord(args: {
  id: string;
  kind: RevenueProtectionEvidenceKind;
  occurredAt: string | null;
  summary: string;
  source: string;
  metadata?: Record<string, unknown>;
}): RevenueProtectionEvidenceRecord {
  const payload = {
    id: args.id,
    kind: args.kind,
    occurredAt: args.occurredAt ?? "",
    summary: args.summary,
    source: args.source,
    metadata: args.metadata ?? {},
  };
  return {
    id: args.id,
    kind: args.kind,
    occurredAt: args.occurredAt ?? new Date(0).toISOString(),
    summary: args.summary,
    source: args.source,
    immutableHash: evidenceHash(payload),
    metadata: args.metadata,
  };
}

function policyEvidenceRows(rows: PolicyAcceptanceEvidenceRow[]): RevenueProtectionEvidenceRecord[] {
  return rows.flatMap((row, index) => {
    const base = `${row.scope}:${row.acceptedAt}:${index}`;
    const shared = {
      occurredAt: row.acceptedAt,
      source: "policy_acceptance_records",
      metadata: {
        scope: row.scope,
        policyBundleVersion: row.policyBundleVersion,
        wordingSha256: row.wordingSha256,
        planCode: row.planCode,
        amountTotal: row.amountTotal,
        currency: row.currency,
        country: row.country,
        browser: row.browser,
        device: row.device,
      },
    };
    const evidence: RevenueProtectionEvidenceRecord[] = [
      evidenceRecord({
        ...shared,
        id: `${base}:terms`,
        kind: "terms_acceptance",
        summary: `Accepted checkout terms and digital service acknowledgement for ${row.scope} v${row.policyBundleVersion}.`,
      }),
      evidenceRecord({
        ...shared,
        id: `${base}:refund`,
        kind: "refund_acknowledgement",
        summary: `Accepted refund/cancellation acknowledgement for ${row.scope} v${row.policyBundleVersion}.`,
      }),
    ];
    if (row.stripeCheckoutSessionId || row.planCode) {
      evidence.push(
        evidenceRecord({
          ...shared,
          id: `${base}:checkout`,
          kind: "checkout",
          summary: `Checkout initiated for ${row.planCode ?? "recorded plan"}${row.amountTotal != null ? ` (${row.amountTotal} ${row.currency ?? ""})` : ""}.`,
        }),
      );
    }
    return evidence;
  });
}

export type RevenueProtectionCenterRow = {
  userId: string;
  email: string;
  name: string;
  planCode: string | null;
  subscriptionStatus: string | null;
  lastActiveAt: string | null;
  package: ChargebackEvidencePackage;
};

export type RevenueProtectionExportRow = {
  userId: string;
  generatedByUserId: string | null;
  format: string;
  createdAt: string;
  summary: unknown;
};

export type RevenueProtectionDashboard = {
  generatedAt: string;
  query: string;
  summary: {
    subscribersReviewed: number;
    averageProtectionScore: number;
    criticalRiskCount: number;
    missingRefundAcknowledgementCount: number;
    missingLearningActivityCount: number;
    recentExportCount: number;
  };
  rows: RevenueProtectionCenterRow[];
  recentExports: RevenueProtectionExportRow[];
};

export async function loadRevenueProtectionSubscriberSnapshot(
  userId: string,
): Promise<RevenueProtectionSubscriberSnapshot | null> {
  if (!isDatabaseUrlConfigured() || !userId.trim()) return null;

  const [
    user,
    subscriptions,
    policyRows,
    sessionRows,
    learnerEvents,
    progressCounts,
    flashcardAttempts,
    questionAttempts,
    examSessions,
    practiceTests,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, country: true, createdAt: true, lastLoginAt: true },
    }),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        planCode: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        createdAt: true,
        updatedAt: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
    loadPolicyAcceptanceEvidenceRows(userId),
    prisma.learnerSessionActivity.findMany({
      where: { userId },
      orderBy: { lastSeenAt: "desc" },
      take: 80,
      select: { sessionKeyHash: true, firstSeenAt: true, lastSeenAt: true, regionHint: true },
    }),
    prisma.learnerActivityEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 80,
      select: { id: true, activityType: true, lifecycle: true, createdAt: true, durationMs: true, itemsCompleted: true, score: true },
    }),
    prisma.progress.groupBy({ by: ["completed"], where: { userId }, _count: { _all: true } }),
    prisma.flashcardAttempt.count({ where: { userId } }),
    prisma.examQuestionPracticeAnswerAttempt.count({ where: { userId } }),
    prisma.examSession.count({ where: { userId } }),
    prisma.practiceTest.count({ where: { userId } }),
  ]);

  if (!user) return null;

  const evidence: RevenueProtectionEvidenceRecord[] = [];
  evidence.push(...policyEvidenceRows(policyRows));

  for (const sub of subscriptions) {
    evidence.push(
      evidenceRecord({
        id: `subscription:${sub.id}:${sub.updatedAt.toISOString()}`,
        kind: "subscription_lifecycle",
        occurredAt: sub.updatedAt.toISOString(),
        source: "subscriptions",
        summary: `Subscription ${sub.status}${sub.planCode ? ` for ${sub.planCode}` : ""}${sub.cancelAtPeriodEnd ? " with cancellation scheduled" : ""}.`,
        metadata: {
          status: sub.status,
          planCode: sub.planCode,
          currentPeriodEnd: iso(sub.currentPeriodEnd),
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        },
      }),
    );
  }

  if (user.lastLoginAt) {
    evidence.push(
      evidenceRecord({
        id: `login:${user.id}:${user.lastLoginAt.toISOString()}`,
        kind: "login_history",
        occurredAt: user.lastLoginAt.toISOString(),
        source: "users.last_login_at",
        summary: "Successful login recorded on the learner account.",
      }),
    );
  }

  for (const session of sessionRows) {
    const minutes = Math.max(1, Math.min(180, Math.ceil((session.lastSeenAt.getTime() - session.firstSeenAt.getTime()) / 60_000)));
    evidence.push(
      evidenceRecord({
        id: `session:${session.sessionKeyHash}:${session.lastSeenAt.toISOString()}`,
        kind: "session_duration",
        occurredAt: session.lastSeenAt.toISOString(),
        source: "learner_session_activities",
        summary: `Learner session touched for approximately ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        metadata: { minutes, regionHint: session.regionHint },
      }),
    );
  }

  for (const event of learnerEvents) {
    evidence.push(
      evidenceRecord({
        id: `learner-activity:${event.id}`,
        kind: "learning_activity",
        occurredAt: event.createdAt.toISOString(),
        source: "learner_activity_events",
        summary: `${event.activityType} ${event.lifecycle}${event.itemsCompleted != null ? ` (${event.itemsCompleted} item${event.itemsCompleted === 1 ? "" : "s"})` : ""}.`,
        metadata: {
          activityType: event.activityType,
          lifecycle: event.lifecycle,
          durationMs: event.durationMs,
          itemsCompleted: event.itemsCompleted,
          score: event.score,
        },
      }),
    );
  }

  const lessonsViewed = progressCounts.reduce((sum, row) => sum + row._count._all, 0);
  const lessonsCompleted = progressCounts.find((row) => row.completed)?._count._all ?? 0;
  if (lessonsViewed > 0 || flashcardAttempts > 0 || questionAttempts > 0 || examSessions > 0 || practiceTests > 0) {
    evidence.push(
      evidenceRecord({
        id: `content-consumption:${user.id}`,
        kind: "content_consumption",
        occurredAt: iso(user.lastLoginAt ?? user.createdAt),
        source: "content_activity_rollup",
        summary: `Content consumed: ${lessonsViewed} lesson opens, ${lessonsCompleted} lesson completions, ${flashcardAttempts} flashcard attempts, ${questionAttempts} question attempts, ${examSessions} exam sessions, ${practiceTests} practice tests.`,
        metadata: { lessonsViewed, lessonsCompleted, flashcardAttempts, questionAttempts, examSessions, practiceTests },
      }),
    );
  }

  if (flashcardAttempts > 0 || questionAttempts > 0 || examSessions > 0 || practiceTests > 0) {
    evidence.push(
      evidenceRecord({
        id: `learning-rollup:${user.id}`,
        kind: "learning_activity",
        occurredAt: iso(user.lastLoginAt ?? user.createdAt),
        source: "learning_activity_rollup",
        summary: `Learning activity rollup: ${flashcardAttempts} flashcards, ${questionAttempts} practice answers, ${examSessions} exam sessions, ${practiceTests} practice tests.`,
        metadata: { flashcardAttempts, questionAttempts, examSessions, practiceTests },
      }),
    );
  }

  const primarySub = subscriptions[0];
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    country: String(user.country),
    planCode: primarySub?.planCode ?? null,
    stripeCustomerId: primarySub?.stripeCustomerId ?? null,
    stripeSubscriptionId: primarySub?.stripeSubscriptionId ?? null,
    subscriptionStatus: primarySub ? String(primarySub.status) : null,
    createdAt: user.createdAt.toISOString(),
    renewalDate: iso(primarySub?.currentPeriodEnd),
    totalPaidCents: null,
    evidence: evidence.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
  };
}

async function loadRecentEvidenceExports(): Promise<RevenueProtectionExportRow[]> {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        user_id: string;
        generated_by_user_id: string | null;
        format: string;
        summary: unknown;
        created_at: Date;
      }>
    >`
      SELECT "user_id", "generated_by_user_id", "format", "summary", "created_at"
      FROM "chargeback_evidence_exports"
      ORDER BY "created_at" DESC
      LIMIT 12
    `;
    return rows.map((row) => ({
      userId: row.user_id,
      generatedByUserId: row.generated_by_user_id,
      format: row.format,
      summary: row.summary,
      createdAt: row.created_at.toISOString(),
    }));
  } catch {
    return [];
  }
}

async function loadTargetUserIds(query: string, limit: number): Promise<string[]> {
  const q = query.trim();
  if (q.length >= 2) {
    const rows = await prisma.user.findMany({
      where: {
        OR: [
          { id: q },
          { email: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true },
    });
    return rows.map((row) => row.id);
  }

  const subscriptionRows = await prisma.subscription.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    distinct: ["userId"],
    select: { userId: true },
  });
  return subscriptionRows.map((row) => row.userId);
}

export async function loadRevenueProtectionDashboard(args: {
  query?: string;
  limit?: number;
} = {}): Promise<RevenueProtectionDashboard> {
  const query = args.query?.trim() ?? "";
  const limit = Math.max(1, Math.min(50, args.limit ?? 20));
  const fallback: RevenueProtectionDashboard = {
    generatedAt: new Date().toISOString(),
    query,
    summary: {
      subscribersReviewed: 0,
      averageProtectionScore: 0,
      criticalRiskCount: 0,
      missingRefundAcknowledgementCount: 0,
      missingLearningActivityCount: 0,
      recentExportCount: 0,
    },
    rows: [],
    recentExports: [],
  };

  return withDatabaseFallbackTimeout(
    async () => {
      const [userIds, recentExports] = await Promise.all([loadTargetUserIds(query, limit), loadRecentEvidenceExports()]);
      const snapshots = (await Promise.all(userIds.map((userId) => loadRevenueProtectionSubscriberSnapshot(userId)))).filter(
        (row): row is RevenueProtectionSubscriberSnapshot => Boolean(row),
      );
      const rows = snapshots.map((snapshot) => {
        const pkg = buildChargebackEvidencePackage(snapshot);
        return {
          userId: snapshot.userId,
          email: snapshot.email ?? "",
          name: snapshot.name ?? "",
          planCode: snapshot.planCode ?? null,
          subscriptionStatus: snapshot.subscriptionStatus ?? null,
          lastActiveAt: snapshot.evidence[0]?.occurredAt ?? snapshot.createdAt ?? null,
          package: pkg,
        };
      });
      const averageProtectionScore =
        rows.length > 0 ? Math.round(rows.reduce((sum, row) => sum + row.package.protectionScore, 0) / rows.length) : 0;

      return {
        generatedAt: new Date().toISOString(),
        query,
        summary: {
          subscribersReviewed: rows.length,
          averageProtectionScore,
          criticalRiskCount: rows.filter((row) => row.package.riskLevel === "critical").length,
          missingRefundAcknowledgementCount: rows.filter((row) =>
            row.package.missingEvidence.some((item) => item.key === "refund_acknowledgement"),
          ).length,
          missingLearningActivityCount: rows.filter((row) =>
            row.package.missingEvidence.some((item) => item.key === "learning_activity"),
          ).length,
          recentExportCount: recentExports.length,
        },
        rows,
        recentExports,
      };
    },
    fallback,
    REVENUE_PROTECTION_TIMEOUT_MS,
    { scope: "revenue_protection", label: "dashboard" },
  );
}
