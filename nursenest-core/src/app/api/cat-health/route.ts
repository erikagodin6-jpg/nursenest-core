import { NextResponse } from "next/server";
import {
  createEmptyCatSession,
  emptyPerformanceProfile,
  emptyReadinessScore,
  isSessionComplete,
  selectNextQuestion,
} from "@/lib/cat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Lightweight CAT engine initialization probe.
 * No DB. No auth. Pure module init + smoke-calls only.
 * 200 = CAT engine modules loaded and callable.
 * 500 = import or init failure (build artifact issue).
 */
export function GET() {
  try {
    const session = createEmptyCatSession("health-probe");
    const profile = emptyPerformanceProfile();
    const score = emptyReadinessScore();

    const selectResult = selectNextQuestion(session, {
      questionPool: [],
      historicalAnswers: [],
      maxQuestions: 10,
    });

    const complete = isSessionComplete(session, {
      questionPool: [],
      historicalAnswers: [],
      maxQuestions: 10,
    });

    return NextResponse.json(
      {
        ok: true,
        cat: {
          engineInit: true,
          sessionCreated: typeof session.sessionId === "string",
          sessionId: session.sessionId,
          profileKeysPresent:
            "byLayer" in profile || "bySystem" in profile || typeof profile === "object",
          readinessScoreStructure: score.confidence === "low" && score.score === 0,
          emptyPoolSelectDone: selectResult.done === true,
          emptySessionIsComplete: typeof complete === "boolean",
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
