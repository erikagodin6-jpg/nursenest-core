import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { getCanonicalExamQuestionWhere } from "@/lib/study-question-pool/canonical-exam-question-where";

export const dynamic = "force-dynamic";

/**
 * GET /api/flashcards/inventory
 *
 * Returns pool counts from ExamQuestion — the SAME source as CAT practice exams.
 * Uses NON_ECG_PRACTICE_EXAM_WHERE to exclude ECG/video questions.
 *
 * Response:
 *   { success: true, categories: { name: string, count: number }[], total: number }
 * On error:
 *   { success: false, error: string, categories: [], total: 0 }
 */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/inventory", "content", async () => {
    try {
      const gate = await requireSubscriberSession();
      if (!gate.ok) return gate.response;

      if (!gate.entitlement.hasAccess) {
        return NextResponse.json(
          { success: false, error: "subscription_required", categories: [], total: 0 },
          { status: 403 },
        );
      }

      // Canonical WHERE — identical to CAT exams, Practice exams, and Flashcard sessions.
      const where = getCanonicalExamQuestionWhere(gate.entitlement);

      const questions = await prisma.examQuestion.findMany({
        where,
        select: {
          id: true,
          bodySystem: true,
          topic: true,
          tags: true,
        },
        // Bounded query — matches CAT MAX_POOL cap
        take: 8000,
        orderBy: { id: "asc" },
      });

      console.log("FLASHCARD INVENTORY COUNT:", questions.length);

      if (questions.length === 0) {
        console.error("FLASHCARD POOL EMPTY — THIS SHOULD NEVER HAPPEN");
        return NextResponse.json({
          success: false,
          error: "empty_pool",
          categories: [],
          total: 0,
        });
      }

      // Build category map: prefer topic, fall back to bodySystem, then "uncategorized"
      const categoryMap = new Map<string, number>();
      for (const q of questions) {
        const key = q.topic?.trim() || q.bodySystem?.trim() || "uncategorized";
        categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
      }

      const categories = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      return NextResponse.json({
        success: true,
        categories,
        total: questions.length,
      });
    } catch (error) {
      console.error("FLASHCARD INVENTORY ERROR:", error);
      return NextResponse.json(
        {
          success: false,
          error: "inventory_failed",
          categories: [],
          total: 0,
        },
        { status: 500 },
      );
    }
  });
}
