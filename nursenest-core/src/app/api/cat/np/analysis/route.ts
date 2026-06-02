/**
 * GET /api/cat/np/analysis?practiceTestId=...
 *
 * Retrieve the full session analysis for a completed NP CAT session.
 *
 * Query params:
 *   practiceTestId - The practice_tests.id returned when the session was created.
 *
 * Response:
 *   SessionAnalysis JSON with weak areas, lesson recommendations, follow-up set,
 *   readiness score, and dimensional performance breakdown.
 *
 * Returns 404 if the session is not found, not owned by the user, or not yet complete.
 * Returns 202 (Accepted) if the session is still in progress — client should poll.
 *
 * Auth: subscriber required.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireNpCatSubscriberSession } from "@/lib/entitlements/require-np-cat-subscriber-session";
import { loadNpCatAnalysis } from "@/lib/cat/session-persistence";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { readinessBand } from "@/lib/cat/readiness-scorer";

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<Response> {
  return runWithApiTelemetry(
    req,
    "GET /api/cat/np/analysis",
    "content",
    async () => {
      const session = await requireNpCatSubscriberSession(
        "np_cat_analysis_api",
      );
      if (!session.ok) return session.response;
      const { userId } = session;

      const practiceTestId = req.nextUrl.searchParams.get("practiceTestId");
      if (!practiceTestId) {
        return NextResponse.json(
          { error: "practiceTestId is required" },
          { status: 400 },
        );
      }

      // Check if session exists and is owned by the user
      const record = await prisma.practiceTest.findFirst({
        where: { id: practiceTestId, userId },
        select: { status: true },
      });

      if (!record) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }

      if (record.status !== "COMPLETED") {
        // Session still in progress — client should poll or wait
        return NextResponse.json(
          { error: "Session not yet complete", code: "in_progress" },
          { status: 202 },
        );
      }

      const analysis = await loadNpCatAnalysis(prisma, practiceTestId, userId);

      if (!analysis) {
        return NextResponse.json(
          { error: "Analysis not available for this session" },
          { status: 404 },
        );
      }

      // Enrich with band label for UI display
      const score = analysis.summary.readinessScore.score;
      const band = readinessBand(score);

      return NextResponse.json({
        ...analysis,
        summary: {
          ...analysis.summary,
          readinessScore: {
            ...analysis.summary.readinessScore,
            band,
          },
        },
      });
    },
  );
}

/**
 * GET /api/cat/np/analysis/list
 *
 * List recent NP CAT sessions for the authenticated user.
 * Useful for a "Your history" dashboard view.
 *
 * Query params:
 *   limit - Number of sessions to return (default 10, max 20).
 */
export async function HEAD(req: NextRequest): Promise<Response> {
  return runWithApiTelemetry(
    req,
    "HEAD /api/cat/np/analysis",
    "content",
    async () => {
      // Used by the client to cheaply check if a session is complete
      const session = await requireNpCatSubscriberSession(
        "np_cat_analysis_head",
      );
      if (!session.ok) return session.response;
      const { userId } = session;

      const practiceTestId = req.nextUrl.searchParams.get("practiceTestId");
      if (!practiceTestId) return new NextResponse(null, { status: 400 });

      const record = await prisma.practiceTest.findFirst({
        where: { id: practiceTestId, userId },
        select: { status: true },
      });

      if (!record) return new NextResponse(null, { status: 404 });

      return new NextResponse(null, {
        status: record.status === "COMPLETED" ? 200 : 202,
        headers: { "x-session-status": record.status },
      });
    },
  );
}
