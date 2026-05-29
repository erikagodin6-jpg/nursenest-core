import "server-only";

import { loadPolicyAcceptanceEvidenceRows, type PolicyAcceptanceEvidenceRow } from "@/lib/business-protection/business-protection-audit";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const SESSION_MINUTES_FLOOR = 3;
const SESSION_MINUTES_CAP = 180;

function iso(d: Date | null | undefined): string | null {
  return d ? d.toISOString() : null;
}

function minutesBetween(first: Date, last: Date): number {
  const raw = Math.ceil((last.getTime() - first.getTime()) / 60_000);
  return Math.max(SESSION_MINUTES_FLOOR, Math.min(SESSION_MINUTES_CAP, raw));
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}

export type AdminActivityTimelineItem = {
  at: string;
  kind: "login" | "session" | "lesson" | "flashcard" | "exam" | "practice" | "question" | "subscription" | "security";
  label: string;
  detail: string;
};

export type AccountActivityEvidence = {
  generatedAt: string;
  userId: string;
  summary: {
    totalEstimatedMinutes: number;
    totalEstimatedHours: number;
    activeDays: number;
    firstSeenAt: string | null;
    lastActiveAt: string | null;
    subscriptionStartedAt: string | null;
    activeSubscriptionCount: number;
    subscriptionHistoryCount: number;
    sessionsTouched: number;
    lessonsViewed: number;
    lessonsCompleted: number;
    flashcardSessionsCompleted: number;
    flashcardsAnswered: number;
    examAttempts: number;
    examSessions: number;
    practiceTestsStarted: number;
    practiceTestsCompleted: number;
    questionAttempts: number;
    distinctIpHashes24h: number;
    activeDeviceSlots7d: number;
  };
  subscriptionHistory: Array<{
    id: string;
    status: string;
    planTier: string | null;
    planCountry: string | null;
    planCode: string | null;
    planDuration: string | null;
    createdAt: string;
    updatedAt: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }>;
  policyAcceptances: PolicyAcceptanceEvidenceRow[];
  accessBreakdown: Array<{ label: string; count: number; lastAt: string | null }>;
  timeline: AdminActivityTimelineItem[];
  disputeSummary: string;
  evidenceNotes: string[];
};

export function buildActivityEvidenceTextReport(evidence: AccountActivityEvidence): string {
  const s = evidence.summary;
  const lines = [
    "NurseNest Account Activity Evidence",
    `Generated: ${evidence.generatedAt}`,
    `User: ${evidence.userId}`,
    "",
    "Summary",
    `- ${evidence.disputeSummary}`,
    `- First seen: ${s.firstSeenAt ?? "not recorded"}`,
    `- Last active: ${s.lastActiveAt ?? "not recorded"}`,
    `- Subscription start: ${s.subscriptionStartedAt ?? "not recorded"}`,
    `- Subscription rows: ${s.subscriptionHistoryCount} (${s.activeSubscriptionCount} active/grace)`,
    "",
    "Policy Acceptances",
    ...evidence.policyAcceptances.map(
      (p) =>
        `- ${p.acceptedAt} ${p.scope} v${p.policyBundleVersion}${p.planCode ? ` · ${p.planCode}` : ""}${p.country ? ` · ${p.country}` : ""}`,
    ),
    "",
    "Access Breakdown",
    ...evidence.accessBreakdown.map((r) => `- ${r.label}: ${r.count.toLocaleString()}${r.lastAt ? ` (last ${r.lastAt})` : ""}`),
    "",
    "Recent Timeline",
    ...evidence.timeline.slice(0, 80).map((t) => `- ${t.at} [${t.kind}] ${t.label}: ${t.detail}`),
    "",
    "Evidence Notes",
    ...evidence.evidenceNotes.map((n) => `- ${n}`),
  ];
  return `${lines.join("\n")}\n`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export function buildActivityEvidenceHtmlReport(evidence: AccountActivityEvidence): string {
  const s = evidence.summary;
  const row = (label: string, value: string | number | null) =>
    `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value == null ? "not recorded" : String(value))}</td></tr>`;
  const timeline = evidence.timeline
    .slice(0, 100)
    .map(
      (t) =>
        `<li><strong>${escapeHtml(t.at)}</strong> <span>${escapeHtml(t.kind)}</span><br>${escapeHtml(t.label)} — ${escapeHtml(t.detail)}</li>`,
    )
    .join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>NurseNest Account Activity Evidence</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111827; margin: 40px; line-height: 1.5; }
    h1 { font-size: 24px; margin: 0 0 6px; }
    h2 { font-size: 15px; margin: 28px 0 10px; text-transform: uppercase; letter-spacing: .08em; color: #475569; }
    .summary { border: 1px solid #dbe4ee; border-radius: 16px; padding: 18px; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; }
    th { width: 260px; color: #475569; font-weight: 600; }
    li { margin: 0 0 12px; }
    span { color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: .08em; }
    @media print { body { margin: 22mm; } .no-print { display: none; } }
  </style>
</head>
<body>
  <button class="no-print" onclick="window.print()" style="float:right;border:1px solid #cbd5e1;border-radius:999px;background:white;padding:8px 14px;font-weight:600;">Print / Save PDF</button>
  <h1>NurseNest Account Activity Evidence</h1>
  <p>Generated ${escapeHtml(evidence.generatedAt)} for user ${escapeHtml(evidence.userId)}.</p>
  <div class="summary">${escapeHtml(evidence.disputeSummary)}</div>
  <h2>Summary</h2>
  <table>
    ${row("Estimated study hours", s.totalEstimatedHours)}
    ${row("Active study days", s.activeDays)}
    ${row("First seen", s.firstSeenAt)}
    ${row("Last active", s.lastActiveAt)}
    ${row("Subscription start", s.subscriptionStartedAt)}
    ${row("Active subscription rows", s.activeSubscriptionCount)}
    ${row("Lessons viewed / completed", `${s.lessonsViewed} / ${s.lessonsCompleted}`)}
    ${row("Flashcards answered", s.flashcardsAnswered)}
    ${row("Exam sessions", s.examSessions)}
    ${row("Practice tests completed", s.practiceTestsCompleted)}
    ${row("Question attempts", s.questionAttempts)}
  </table>
  <h2>Policy Acceptances</h2>
  <table>
    <tr><th>Accepted At</th><th>Scope</th><th>Version</th><th>Plan</th><th>Context</th></tr>
    ${evidence.policyAcceptances
      .map(
        (p) =>
          `<tr><td>${escapeHtml(p.acceptedAt)}</td><td>${escapeHtml(p.scope)}</td><td>${escapeHtml(p.policyBundleVersion)}</td><td>${escapeHtml(p.planCode ?? "not recorded")}</td><td>${escapeHtml([p.country, p.browser, p.device].filter(Boolean).join(" / ") || "not recorded")}</td></tr>`,
      )
      .join("")}
  </table>
  <h2>Recent Activity Timeline</h2>
  <ol>${timeline}</ol>
  <h2>Evidence Notes</h2>
  <ul>${evidence.evidenceNotes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>
</body>
</html>`;
}

export async function buildAccountActivityEvidence(userId: string): Promise<AccountActivityEvidence | null> {
  if (!isDatabaseUrlConfigured() || !userId.trim()) return null;

  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    user,
    subscriptions,
    sessionRows,
    ipGroups24h,
    deviceGroups7d,
    lessonCounts,
    lessonRecent,
    flashcardSessionCounts,
    flashcardAttempts,
    recentFlashcardSessions,
    examAttemptCounts,
    examSessionCounts,
    practiceCounts,
    recentExamAttempts,
    recentExamSessions,
    recentPracticeTests,
    questionAttemptsCount,
    recentQuestionAttempts,
    abuseReviews,
    policyAcceptances,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, createdAt: true, lastLoginAt: true },
    }),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        planTier: true,
        planCountry: true,
        planCode: true,
        planDuration: true,
        createdAt: true,
        updatedAt: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
    prisma.learnerSessionActivity.findMany({
      where: { userId },
      orderBy: { lastSeenAt: "desc" },
      take: 500,
      select: { firstSeenAt: true, lastSeenAt: true, regionHint: true, revokedAt: true, suspiciousReason: true },
    }),
    prisma.learnerSessionIpObservation.groupBy({
      by: ["ipHash"],
      where: { userId, lastSeenAt: { gte: ago24h } },
    }),
    prisma.learnerSessionActivity.groupBy({
      by: ["sessionKeyHash"],
      where: { userId, lastSeenAt: { gte: ago7d }, revokedAt: null },
    }),
    prisma.progress.groupBy({
      by: ["completed"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: { lessonId: true, completed: true, createdAt: true, engagedAt: true, updatedAt: true },
    }),
    prisma.flashcardSession.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.flashcardAttempt.count({ where: { userId } }),
    prisma.flashcardSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 30,
      select: { id: true, status: true, startedAt: true, completedAt: true, cardCount: true },
    }),
    prisma.examAttempt.count({ where: { userId } }),
    prisma.examSession.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.practiceTest.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, createdAt: true, score: true, total: true, exam: { select: { title: true } } },
    }),
    prisma.examSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: { id: true, status: true, examMode: true, createdAt: true, updatedAt: true, elapsedMs: true },
    }),
    prisma.practiceTest.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: { id: true, title: true, status: true, startedAt: true, completedAt: true, updatedAt: true, elapsedMs: true },
    }),
    prisma.examQuestionPracticeAnswerAttempt.count({ where: { userId } }),
    prisma.examQuestionPracticeAnswerAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { questionId: true, mode: true, isCorrect: true, createdAt: true, pathwayId: true },
    }),
    prisma.protectionAbuseReview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { reason: true, score: true, createdAt: true, dismissedAt: true, resolution: true },
    }),
    loadPolicyAcceptanceEvidenceRows(userId),
  ]);

  if (!user) return null;

  let lessonsViewed = 0;
  let lessonsCompleted = 0;
  for (const row of lessonCounts) {
    lessonsViewed += row._count._all;
    if (row.completed) lessonsCompleted += row._count._all;
  }

  const completedFlashcardSessions =
    flashcardSessionCounts.find((r) => String(r.status) === "COMPLETED")?._count._all ?? 0;
  const examSessions = examSessionCounts.reduce((sum, r) => sum + r._count._all, 0);
  const practiceTestsStarted = practiceCounts.reduce((sum, r) => sum + r._count._all, 0);
  const practiceTestsCompleted = practiceCounts.find((r) => String(r.status) === "COMPLETED")?._count._all ?? 0;
  const activeSubscriptionCount = subscriptions.filter((s) => s.status === "ACTIVE" || s.status === "GRACE").length;

  const activeDays = new Set<string>();
  const timeline: AdminActivityTimelineItem[] = [];
  let estimatedMinutes = 0;
  let lastActiveAt: Date | null = user.lastLoginAt ?? user.createdAt;
  let firstSeenAt: Date | null = user.createdAt;

  const touch = (d: Date | null | undefined) => {
    if (!d) return;
    activeDays.add(dayKey(d));
    if (!lastActiveAt || d > lastActiveAt) lastActiveAt = d;
    if (!firstSeenAt || d < firstSeenAt) firstSeenAt = d;
  };

  touch(user.createdAt);
  touch(user.lastLoginAt);
  if (user.lastLoginAt) {
    timeline.push({ at: user.lastLoginAt.toISOString(), kind: "login", label: "Last login recorded", detail: "User authenticated successfully." });
  }

  for (const row of sessionRows) {
    touch(row.firstSeenAt);
    touch(row.lastSeenAt);
    estimatedMinutes += minutesBetween(row.firstSeenAt, row.lastSeenAt);
    timeline.push({
      at: row.lastSeenAt.toISOString(),
      kind: "session",
      label: row.revokedAt ? "Session revoked" : "Session active/touched",
      detail: `${minutesBetween(row.firstSeenAt, row.lastSeenAt)} estimated minutes${row.regionHint ? ` · region ${row.regionHint}` : ""}${row.suspiciousReason ? ` · signal ${row.suspiciousReason}` : ""}`,
    });
  }

  for (const row of subscriptions) {
    touch(row.createdAt);
    timeline.push({
      at: row.createdAt.toISOString(),
      kind: "subscription",
      label: `Subscription ${row.status}`,
      detail: [row.planCode, row.planTier, row.planCountry, row.currentPeriodEnd ? `renews/ends ${row.currentPeriodEnd.toISOString()}` : null]
        .filter(Boolean)
        .join(" · "),
    });
  }

  for (const row of lessonRecent) {
    touch(row.updatedAt);
    timeline.push({
      at: row.updatedAt.toISOString(),
      kind: "lesson",
      label: row.completed ? "Lesson completed" : "Lesson opened",
      detail: `${row.lessonId}${row.engagedAt ? ` · engaged ${row.engagedAt.toISOString()}` : ""}`,
    });
  }

  for (const row of recentFlashcardSessions) {
    touch(row.startedAt);
    if (row.completedAt) touch(row.completedAt);
    timeline.push({
      at: row.completedAt?.toISOString() ?? row.startedAt.toISOString(),
      kind: "flashcard",
      label: row.status === "COMPLETED" ? "Flashcard session completed" : "Flashcard session activity",
      detail: `${plural(row.cardCount, "card")} · session ${row.id.slice(0, 10)}…`,
    });
  }

  for (const row of recentExamAttempts) {
    touch(row.createdAt);
    timeline.push({
      at: row.createdAt.toISOString(),
      kind: "exam",
      label: "Exam attempt submitted",
      detail: `${row.exam?.title ?? "Exam"} · ${row.score}/${row.total}`,
    });
  }

  for (const row of recentExamSessions) {
    touch(row.updatedAt);
    timeline.push({
      at: row.updatedAt.toISOString(),
      kind: "exam",
      label: `${row.examMode.toUpperCase()} exam session`,
      detail: `${row.status}${row.elapsedMs ? ` · ${Math.round(row.elapsedMs / 60_000)} min elapsed` : ""}`,
    });
  }

  for (const row of recentPracticeTests) {
    touch(row.updatedAt);
    timeline.push({
      at: row.completedAt?.toISOString() ?? row.updatedAt.toISOString(),
      kind: "practice",
      label: row.status === "COMPLETED" ? "Practice exam completed" : "Practice exam activity",
      detail: `${row.title ?? "Practice exam"}${row.elapsedMs ? ` · ${Math.round(row.elapsedMs / 60_000)} min elapsed` : ""}`,
    });
  }

  for (const row of recentQuestionAttempts) {
    touch(row.createdAt);
    timeline.push({
      at: row.createdAt.toISOString(),
      kind: "question",
      label: row.isCorrect ? "Question answered correctly" : "Question answered incorrectly",
      detail: `${row.mode}${row.pathwayId ? ` · ${row.pathwayId}` : ""} · question ${row.questionId.slice(0, 10)}…`,
    });
  }

  for (const row of abuseReviews) {
    touch(row.createdAt);
    timeline.push({
      at: row.createdAt.toISOString(),
      kind: "security",
      label: "Protection review signal",
      detail: `${row.reason} · score ${row.score}${row.dismissedAt ? ` · ${row.resolution ?? "closed"}` : " · open"}`,
    });
  }

  timeline.sort((a, b) => b.at.localeCompare(a.at));

  const totalEstimatedHours = Math.round((estimatedMinutes / 60) * 10) / 10;
  const summary = {
    totalEstimatedMinutes: estimatedMinutes,
    totalEstimatedHours,
    activeDays: activeDays.size,
    firstSeenAt: iso(firstSeenAt),
    lastActiveAt: iso(lastActiveAt),
    subscriptionStartedAt: iso(subscriptions.at(-1)?.createdAt ?? null),
    activeSubscriptionCount,
    subscriptionHistoryCount: subscriptions.length,
    sessionsTouched: sessionRows.length,
    lessonsViewed,
    lessonsCompleted,
    flashcardSessionsCompleted: completedFlashcardSessions,
    flashcardsAnswered: flashcardAttempts,
    examAttempts: examAttemptCounts,
    examSessions,
    practiceTestsStarted,
    practiceTestsCompleted,
    questionAttempts: questionAttemptsCount,
    distinctIpHashes24h: ipGroups24h.length,
    activeDeviceSlots7d: deviceGroups7d.length,
  };

  const accessBreakdown = [
    { label: "Estimated study time", count: summary.totalEstimatedMinutes, lastAt: summary.lastActiveAt },
    { label: "Active study days", count: summary.activeDays, lastAt: summary.lastActiveAt },
    { label: "Lessons viewed", count: summary.lessonsViewed, lastAt: iso(lessonRecent[0]?.updatedAt) },
    { label: "Lessons completed", count: summary.lessonsCompleted, lastAt: iso(lessonRecent.find((r) => r.completed)?.updatedAt) },
    { label: "Flashcards answered", count: summary.flashcardsAnswered, lastAt: iso(recentFlashcardSessions[0]?.completedAt ?? recentFlashcardSessions[0]?.startedAt) },
    { label: "CAT / exam sessions", count: summary.examSessions, lastAt: iso(recentExamSessions[0]?.updatedAt) },
    { label: "Practice tests started", count: summary.practiceTestsStarted, lastAt: iso(recentPracticeTests[0]?.updatedAt) },
    { label: "Question attempts", count: summary.questionAttempts, lastAt: iso(recentQuestionAttempts[0]?.createdAt) },
  ];

  const disputeSummary = `User accessed NurseNest on ${plural(summary.activeDays, "separate day")} totaling approximately ${summary.totalEstimatedHours.toLocaleString()} study hours, including ${plural(summary.examSessions, "exam session")}, ${plural(summary.practiceTestsCompleted, "completed practice exam")}, ${plural(summary.flashcardSessionsCompleted, "completed flashcard session")}, and ${plural(summary.flashcardsAnswered, "answered flashcard")}.`;

  return {
    generatedAt: now.toISOString(),
    userId,
    summary,
    subscriptionHistory: subscriptions.map((s) => ({
      id: s.id,
      status: s.status,
      planTier: s.planTier,
      planCountry: s.planCountry,
      planCode: s.planCode,
      planDuration: s.planDuration,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      currentPeriodEnd: iso(s.currentPeriodEnd),
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    })),
    policyAcceptances,
    accessBreakdown,
    timeline,
    disputeSummary,
    evidenceNotes: [
      "Session telemetry uses HMAC hashes for IP and user-agent values; raw IP addresses are intentionally not exposed in admin reports.",
      "Estimated study time is derived from first/last session touches and capped per session to avoid overstating passive open-tab time.",
      "Stripe identifiers are excluded from this report; billing reconciliation should use Stripe Dashboard or the billing integrity tools.",
    ],
  };
}
