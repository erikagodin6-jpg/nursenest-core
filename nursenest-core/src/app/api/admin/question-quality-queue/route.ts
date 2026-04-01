import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { analyzeQuestionQualitySignals } from "@/lib/questions/question-quality-signals";

type Severity = "high" | "medium" | "low";

function parseSeverity(raw: string | null): Severity | null {
  const s = (raw ?? "").trim().toLowerCase();
  if (s === "high" || s === "medium" || s === "low") return s;
  return null;
}

function scoreSeverity(row: {
  flags: string[];
  rationaleCompleteness: "full" | "partial" | "thin";
  duplicate: boolean;
}): Severity {
  if (
    row.rationaleCompleteness === "thin" ||
    row.flags.includes("no_core_rationale") ||
    row.flags.includes("missing_high_yield_takeaway") ||
    row.duplicate
  ) {
    return "high";
  }
  if (row.rationaleCompleteness === "partial" || row.flags.includes("stem_short") || row.flags.includes("stem_long")) {
    return "medium";
  }
  return "low";
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(5, Number(req.nextUrl.searchParams.get("pageSize") ?? "25")));
  const severityFilter = parseSeverity(req.nextUrl.searchParams.get("severity"));
  const skip = (page - 1) * pageSize;

  const rows = await prisma.examQuestion.findMany({
    where: { status: "published" },
    select: {
      id: true,
      stem: true,
      exam: true,
      topic: true,
      subtopic: true,
      updatedAt: true,
      rationale: true,
      correctAnswerExplanation: true,
      clinicalReasoning: true,
      keyTakeaway: true,
      distractorRationales: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 1200,
  });

  const queue = rows
    .map((q) => {
      const signals = analyzeQuestionQualitySignals(q);
      const duplicate = signals.flags.includes("possible_duplicate_explanation_rationale");
      const severity = scoreSeverity({
        flags: signals.flags,
        rationaleCompleteness: signals.rationaleCompleteness,
        duplicate,
      });
      const issues = [
        ...signals.flags,
        ...(signals.rationaleCompleteness === "thin" ? ["thin_rationale"] : []),
        ...(duplicate ? ["duplicate_rationale_explanation"] : []),
      ];
      if (issues.length === 0) return null;
      return {
        questionId: q.id,
        exam: q.exam,
        topic: q.topic,
        topicCode: q.subtopic,
        severity,
        rationaleCompleteness: signals.rationaleCompleteness,
        missingKeyTakeaway: !signals.hasHighYieldTakeaway,
        issues: [...new Set(issues)],
        stemPreview: q.stem.slice(0, 180),
        updatedAt: q.updatedAt.toISOString(),
        editHref: `/admin/questions/${q.id}`,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .filter((x) => (severityFilter ? x.severity === severityFilter : true))
    .sort((a, b) => {
      const rank: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
      return rank[a.severity] - rank[b.severity] || a.updatedAt.localeCompare(b.updatedAt);
    });

  const total = queue.length;
  const pageItems = queue.slice(skip, skip + pageSize);

  return NextResponse.json({
    items: pageItems,
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    severity: severityFilter,
    counts: {
      high: queue.filter((q) => q.severity === "high").length,
      medium: queue.filter((q) => q.severity === "medium").length,
      low: queue.filter((q) => q.severity === "low").length,
    },
  });
}
