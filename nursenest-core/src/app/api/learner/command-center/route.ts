import { NextResponse } from "next/server";
import { LearnerNoteScope } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import type {
  CommandCenterApiPayload,
  CommandCenterReviewPayload,
  CommandCenterSegmentLoadFailures,
} from "@/lib/learner/command-center-api-types";
import { hrefForLearnerNote, labelForLearnerNoteScope } from "@/lib/learner/learner-note-href";
import { loadLearnerStudyNextBlock } from "@/lib/learner/load-learner-study-next-block";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { loadMistakeNotebook } from "@/lib/mistakes/mistake-store";
import { loadUnifiedReviewData } from "@/lib/study/unified-review-engine";
import { stripToPlainText } from "@/lib/content-quality/plain-text";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const NOTE_TAKE = 48;
const MISTAKE_TAKE = 14;

type CommandCenterNoteDbRow = {
  id: string;
  scope: string;
  contextId: string;
  title: string | null;
  body: string | null;
  topic: string | null;
  updatedAt: Date;
};

function snippet(text: string | null | undefined, max: number): string {
  const t = stripToPlainText(text ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1).trim()}…` : t;
}

function logCommandCenterSegmentFailure(userId: string, segment: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  safeServerLog("learner_command_center", "segment_load_failed", {
    user_id: userId.slice(0, 8),
    segment_name: segment,
    error_message: message.slice(0, 500),
    outcome: "error",
    cache_mode: "unknown",
  });
}

/** GET /api/learner/command-center — aggregated study hub payload (subscriber). */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/command-center", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    if (!isDatabaseUrlConfigured()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    setSentryServerContext({
      route: "/api/learner/command-center",
      feature: SERVER_FEATURE.other,
      userId: gate.userId,
    });

    const userId = gate.userId;
    const entitlement = gate.entitlement;

    try {
      const settled = await Promise.allSettled([
        loadLearnerStudyNextBlock(userId, entitlement),
        loadUnifiedTopicPerformance(userId, entitlement, 14),
        loadUnifiedReviewData(userId, entitlement),
        loadMistakeNotebook(userId),
        prisma.learnerNote.findMany({
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
        }),
      ]);

      const segmentLoadFailures: CommandCenterSegmentLoadFailures = {};

      let studyNext: CommandCenterApiPayload["studyNext"] = null;
      if (settled[0]!.status === "fulfilled") {
        studyNext = settled[0]!.value;
      } else {
        logCommandCenterSegmentFailure(userId, "study_next", settled[0]!.reason);
        segmentLoadFailures.studyNext = true;
      }

      let topicPerf: Awaited<ReturnType<typeof loadUnifiedTopicPerformance>> | null = null;
      if (settled[1]!.status === "fulfilled") {
        topicPerf = settled[1]!.value;
      } else {
        logCommandCenterSegmentFailure(userId, "topic_performance", settled[1]!.reason);
        segmentLoadFailures.topicPerformance = true;
      }

      let review: CommandCenterReviewPayload;
      if (settled[2]!.status === "rejected") {
        logCommandCenterSegmentFailure(userId, "unified_review", settled[2]!.reason);
        segmentLoadFailures.review = true;
        review = {
          loadState: "error",
          href: "/app/review",
          message: "Could not load review counts. Open your review queue to continue.",
          retryable: true,
        };
      } else {
        const reviewData = settled[2]!.value;
        if (reviewData) {
          review = {
            loadState: "ok",
            href: "/app/review",
            overdue: reviewData.summary.overdueCount,
            dueToday: reviewData.summary.dueTodayCount,
            highRisk: reviewData.summary.highRiskCount,
            total: reviewData.summary.totalItems,
            message: reviewData.summary.summaryMessage,
          };
        } else {
          review = {
            loadState: "ok",
            href: "/app/review",
            overdue: 0,
            dueToday: 0,
            highRisk: 0,
            total: 0,
            message: "Open your review queue when you are ready.",
          };
        }
      }

      let mistakeEntries: Awaited<ReturnType<typeof loadMistakeNotebook>> = [];
      if (settled[3]!.status === "fulfilled") {
        mistakeEntries = settled[3]!.value;
      } else {
        logCommandCenterSegmentFailure(userId, "mistake_notebook", settled[3]!.reason);
        segmentLoadFailures.mistakes = true;
      }

      let noteRows: CommandCenterNoteDbRow[] = [];
      if (settled[4]!.status === "fulfilled") {
        noteRows = settled[4]!.value as CommandCenterNoteDbRow[];
      } else {
        logCommandCenterSegmentFailure(userId, "learner_notes", settled[4]!.reason);
        segmentLoadFailures.notes = true;
      }

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
        href: e.topic
          ? remediationTopicDrillHref(e.topic)
          : `/app/questions?includeIds=${encodeURIComponent(e.questionId)}`,
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

      const plannedLessons: { title: string; href: string }[] = [];
      if (studyNext?.continueWhere) {
        plannedLessons.push({ title: studyNext.continueWhere.title, href: studyNext.continueWhere.href });
      }
      const primary = studyNext?.primary;
      if (
        primary &&
        (primary.type === "continue_pathway_lesson" || primary.type === "weak_topic_lesson") &&
        !plannedLessons.some((p) => p.href === primary.href)
      ) {
        plannedLessons.unshift({ title: primary.title, href: primary.href });
      }
      for (const a of studyNext?.secondary ?? []) {
        if (a.type !== "continue_pathway_lesson" && a.type !== "weak_topic_lesson") continue;
        if (plannedLessons.some((p) => p.href === a.href)) continue;
        plannedLessons.push({ title: a.title, href: a.href });
        if (plannedLessons.length >= 8) break;
      }

      const payload: CommandCenterApiPayload = {
        studyNext,
        weakTopics,
        notes,
        mistakes,
        review,
        plannedLessons: plannedLessons.slice(0, 8),
        ...(Object.keys(segmentLoadFailures).length > 0 ? { segmentLoadFailures } : {}),
      };

      if (Object.keys(segmentLoadFailures).length > 0) {
        safeServerLog("learner_command_center", "payload_partial_due_to_segment_failures", {
          user_id: userId.slice(0, 8),
          segments_json: JSON.stringify(segmentLoadFailures),
          outcome: "partial",
        });
      }

      return NextResponse.json(payload);
    } catch {
      return NextResponse.json({ error: "Unable to load command center" }, { status: 503 });
    }
  });
}
