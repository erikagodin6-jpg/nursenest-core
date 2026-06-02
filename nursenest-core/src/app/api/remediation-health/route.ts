import { NextResponse } from "next/server";
import {
  resolveCanonicalTopic,
  resolveCanonicalTopicId,
  topicDangerLevel,
  CANONICAL_ENTRIES,
} from "@/lib/remediation/topic-taxonomy";
import {
  computeRemediationScore,
  spacedReviewDays,
} from "@/lib/remediation/remediation-scoring";
import { inferRemediationMistakeType } from "@/lib/remediation/infer-mistake-type";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Lightweight remediation graph initialization probe.
 * No DB. No auth. Verifies static remediation modules load and canonical entries exist.
 * 200 = remediation engine modules available.
 * 500 = import or init failure.
 */
export function GET() {
  try {
    const canonical = resolveCanonicalTopic("pharmacology");
    const topicId = resolveCanonicalTopicId("cardiac");
    const danger = topicDangerLevel("medication");
    const entryCount = CANONICAL_ENTRIES.length;

    const probeScore = computeRemediationScore({
      recent24h: 2,
      recentWeek7d: 4,
      priorMistakeCount: 1,
      confidence: "low",
      catDifficultyHint: 3,
      topic: null,
    });

    const reviewDays = spacedReviewDays(3);

    const mistakeType = inferRemediationMistakeType({
      tags: ["pharmacology", "medication"],
      questionType: null,
    });

    return NextResponse.json(
      {
        ok: true,
        remediation: {
          canonicalEntriesLoaded: entryCount > 0,
          entryCount,
          pharmacologyResolved: canonical !== null,
          cardiacTopicId: topicId,
          medicationDanger: danger,
          probeTotal: probeScore.total,
          reviewDays,
          mistakeType,
        },
        checkedAt: new Date().toISOString(),
      },
      { status: 200, headers: NO_STORE },
    );
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message.slice(0, 300) : String(e),
        checkedAt: new Date().toISOString(),
      },
      { status: 500, headers: NO_STORE },
    );
  }
}
