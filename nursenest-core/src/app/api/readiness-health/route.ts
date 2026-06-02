import { NextResponse } from "next/server";
import {
  computeReadinessScore,
  emptyReadinessScore,
  l3HighRiskAccuracy,
  normaliseItemWeight,
  readinessBand,
} from "@/lib/cat/readiness-scorer";
import {
  buildPerformanceProfile,
  emptyPerformanceProfile,
  identifyWeakDimensions,
} from "@/lib/cat/performance-tracker";
import type { AnswerRecord } from "@/lib/cat/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

const PROBE_ANSWERS: AnswerRecord[] = [
  {
    questionId: "probe-q1",
    topicSlug: "cardiac-assessment",
    systemTag: "cardiovascular",
    cognitiveLayer: "L2",
    riskLevel: "moderate",
    correct: true,
    answeredAt: Date.now() - 60_000,
  },
  {
    questionId: "probe-q2",
    topicSlug: "medication-safety",
    systemTag: "pharmacology",
    cognitiveLayer: "L3",
    riskLevel: "high",
    correct: false,
    answeredAt: Date.now() - 30_000,
  },
];

/**
 * Lightweight readiness orchestration probe.
 * No DB. No auth. Executes the full scoring pipeline on minimal synthetic answers.
 * 200 = readiness scoring engine operates correctly.
 * 500 = import or computation failure.
 */
export function GET() {
  try {
    const empty = emptyReadinessScore();
    const score = computeReadinessScore(PROBE_ANSWERS);
    const band = readinessBand(score.score);
    const l3Acc = l3HighRiskAccuracy(PROBE_ANSWERS);
    const itemWeight = normaliseItemWeight("L3", "high");

    const profile = buildPerformanceProfile(PROBE_ANSWERS);
    const emptyProfile = emptyPerformanceProfile();
    const weakDimensions = identifyWeakDimensions(profile);

    return NextResponse.json(
      {
        ok: true,
        readiness: {
          emptyScoreStructure: empty.score === 0 && empty.confidence === "low",
          probeScore: score.score,
          probeConfidence: score.confidence,
          probeSampleSize: score.sampleSize,
          band,
          l3HighRiskAccuracy: l3Acc,
          maxItemWeight: itemWeight,
          profileBuilt: typeof profile === "object",
          emptyProfileBuilt: typeof emptyProfile === "object",
          weakDimensionsIdentified: Array.isArray(weakDimensions),
          weakCount: weakDimensions.length,
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
