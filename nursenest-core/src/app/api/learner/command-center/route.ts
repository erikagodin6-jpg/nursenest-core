import { NextResponse } from "next/server";
import { LearnerNoteScope } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { hrefForLearnerNote, labelForLearnerNoteScope } from "@/lib/learner/learner-note-href";
import { loadLearnerStudyNextBlock } from "@/lib/learner/load-learner-study-next-block";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { loadMistakeNotebook } from "@/lib/mistakes/mistake-store";
import { loadUnifiedReviewData } from "@/lib/study/unified-review-engine";
import { stripToPlainText } from "@/lib/content-quality/plain-text";

const NOTE_TAKE = 48;
const MISTAKE_TAKE = 14;

function snippet(text: string | null | undefined, max: number): string {
  const t = stripToPlainText(text ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1).trim()}…` : t;
}

/** GET /api/learner/command-center — aggregated study hub payload (subscriber). */
export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  setSentryServerContext({ route: "/api/learner/command-center", feature: SERVER_FEATURE.other, userId: gate.userId });

  const userId = gate.userId;
  const entitlement = gate.entitlement;

  try {
    const [studyNext, topicPerf, reviewData, mistakeEntries, noteRows] = await Promise.all([
      loadLearnerStudyNextBlock(userId, entitlement).catch(() => null),
      loadUnifiedTopicPerformance(userId, entitlement, 14).catch(() => null),
      loadUnifiedReviewData(userId, entitlement).catch(() => null),
      loadMistakeNotebook(userId).catch(() => [] as Awaited<ReturnType<typeof loadMistakeNotebook>>),
      prisma.learnerNote
        .findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: NOTE_TAKE,
          select: {
            id: true,
            scope: true,
            contextId: true,
            title: true,
            body: true,
            topic: true,
            updatedAt: true,
          },
        })
        .catch(() => []),
    ]);

    const weakTopics =
      topicPerf?.weakTopics.slice(0, 12).map((w) => ({
        topic: w.topic,
        missRate: w.missRate ?? 0,
        href: remediationTopicDrillHref(w.topic),
      })) ?? [];

    const mistakes = mistakeEntries.slice(0, MISTAKE_TAKE).map((e) => ({
      id: e.questionId,
      topic: e.topic,
      stemSnippet: snippet(e.stemPreview, 140),
      lastMissedAt: e.lastMissedAt,
      href: e.topic ? remediationTopicDrillHref(e.topic) : `/app/questions?includeIds=${encodeURIComponent(e.questionId)}`,
    }));

    const notes = noteRows.map((r) => {
      const cid = r.contextId;
      const isBookmark = cid.startsWith("bk:");
      const isSavedRationale = cid.startsWith("rationale:");
      let kind: "note" | "bookmark" | "rationale" = "note";
      if (isBookmark) kind = "bookmark";
      else if (isSavedRationale) kind = "rationale";
      return {
        id: r.id,
        scope: r.scope,
        contextId: cid,
        title: r.title,
        snippet: snippet(r.body, 200),
        topic: r.topic,
        updatedAt: r.updatedAt.toISOString(),
        href: hrefForLearnerNote(r.scope as LearnerNoteScope, cid),
        scopeLabel: labelForLearnerNoteScope(r.scope as LearnerNoteScope),
        kind,
      };
    });

    const review = reviewData
      ? {
          href: "/app/review",
          overdue: reviewData.summary.overdueCount,
          dueToday: reviewData.summary.dueTodayCount,
          highRisk: reviewData.summary.highRiskCount,
          total: reviewData.summary.totalItems,
          message: reviewData.summary.summaryMessage,
        }
      : {
          href: "/app/review",
          overdue: 0,
          dueToday: 0,
          highRisk: 0,
          total: 0,
          message: "Open your review queue when you are ready.",
        };

    const plannedLessons =
      studyNext?.secondary
        .filter((a) => a.type === "continue_pathway_lesson" || a.type === "weak_topic_lesson" || a.href.includes("/lessons"))
        .slice(0, 6)
        .map((a) => ({ title: a.title, href: a.href })) ?? [];
    if (studyNext?.continueWhere && !plannedLessons.some((p) => p.href === studyNext.continueWhere.href)) {
      plannedLessons.unshift({
        title: studyNext.continueWhere.title,
        href: studyNext.continueWhere.href,
      });
    }

    return NextResponse.json({
      studyNext,
      weakTopics,
      notes,
      mistakes,
      review,
      plannedLessons: plannedLessons.slice(0, 8),
    });
  } catch (e) {
    return NextResponse.json({ error: "Unable to load command center" }, { status: 503 });
  }
}
