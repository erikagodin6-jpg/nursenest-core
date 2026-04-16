import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildVisibleLessonScopeForLearner } from "@/lib/learner/learner-visible-lesson-scope";
import {
  loadLearnerDashboard,
  loadPathwayLessonProgressBundle,
} from "@/lib/learner/load-learner-dashboard";
import { remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import type { ReadinessBand } from "@/lib/learner/readiness-score";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

/**
 * Maps readiness band + numeric score to a conservative pass-likelihood tier for UI/API consumers.
 * Not a published psychometric probability—only an interpretive label from in-app signals.
 */
function passLikelihoodFromReadiness(
  score: number | null,
  band: ReadinessBand,
): { tier: "unknown" | "low" | "developing" | "moderate" | "high"; explanation: string } {
  if (score == null || band === "insufficient_data") {
    return {
      tier: "unknown",
      explanation:
        "Complete more graded practice or a practice exam. Estimates require recent in-app performance data.",
    };
  }
  if (band === "ready") {
    return {
      tier: "high",
      explanation:
        "Your recent practice and mock signals are strong. This is a study estimate—not a guarantee on your licensure exam.",
    };
  }
  if (band === "near_ready") {
    return {
      tier: "moderate",
      explanation: "Close to target; tighten weak topics and confirm with a timed mock.",
    };
  }
  if (band === "improving") {
    return {
      tier: "developing",
      explanation: "Trajectory is positive; keep drilling weak areas and lessons.",
    };
  }
  return {
    tier: "low",
    explanation: "Prioritize accuracy on weak topics and lesson coverage before relying on a pass estimate.",
  };
}

/**
 * Subscriber readiness snapshot: one pathway bundle per request, then {@link loadLearnerDashboard}
 * (same aggregates as the learner dashboard; avoids a second pathway inventory read).
 *
 * - **Score0–100** and factor breakdown: `readiness`
 * - **Weak content areas** (topic-level): `contentAreas` with lesson + question drill links
 * - **Recency**: practice factor uses last completed sessions (see `recency` + session grading summary)
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/readiness", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/learner/readiness", feature: SERVER_FEATURE.api, userId: gate.userId });

    const bundle = await loadPathwayLessonProgressBundle(gate.userId, gate.entitlement, {
      source: "api:GET:learner/readiness",
    });
    if (!bundle) {
      return NextResponse.json({ error: "Dashboard unavailable", code: "dashboard_unavailable" }, { status: 503 });
    }

    const visibleLessonScope = await buildVisibleLessonScopeForLearner(gate.entitlement, bundle.pathwayLessonRows);

    const dashboard = await loadLearnerDashboard(gate.userId, gate.entitlement, {
      source: "api:GET:learner/readiness",
      userProfile: bundle.user,
      visibleLessonScope,
      pathwayRowsForScope: bundle.pathwayLessonRows,
      pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
      pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
    });
    if (!dashboard) {
      return NextResponse.json({ error: "Dashboard unavailable", code: "dashboard_unavailable" }, { status: 503 });
    }

    const pathwayId = dashboard.learnerPath;
    const contentAreas = dashboard.weakTopics.slice(0, 12).map((w) => ({
      topic: w.topic,
      normalizedTopic: w.normalizedTopic ?? null,
      missRate: w.missRate,
      attempted: w.attempted,
      missed: w.missed,
      strength: w.strength ?? null,
      lessonHref: remediationLessonsTopicHref(w.topic, w.normalizedTopic ?? null, pathwayId),
      practiceHref: remediationTopicDrillHref(w.topic, pathwayId),
    }));

    const passLikelihood = passLikelihoodFromReadiness(dashboard.readiness.score, dashboard.readiness.band);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      scope: dashboard.scope,
      passLikelihood,
      readiness: dashboard.readiness,
      contentAreas,
      sessionGrading: {
        correct: dashboard.sessionGrading.correct,
        total: dashboard.sessionGrading.total,
        sessionCount: dashboard.sessionGrading.sessionCount,
      },
      recency: {
        practiceSource: "last_completed_sessions",
        practiceSessionsCap: 8,
        note: "Practice accuracy in readiness uses your most recent completed in-app question sessions (capped for performance).",
      },
      recommendedQuizTopic: dashboard.recommendedQuizTopic,
    });
  });
}
