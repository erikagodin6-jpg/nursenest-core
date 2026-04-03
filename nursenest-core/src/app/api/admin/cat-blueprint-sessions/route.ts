import { NextRequest, NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getCatBlueprintQualityThresholds } from "@/lib/exams/cat-blueprint-thresholds";
import type { CatExamReport } from "@/lib/exams/cat-types";
import { prisma } from "@/lib/db";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

/**
 * Admin-only: recent adaptive (CAT) practice tests with persisted blueprint diagnostics (pool + session + fallback).
 * GET ?limit=30&status=COMPLETED|ALL
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const limit = Math.min(80, Math.max(1, Number(sp.get("limit") ?? "30")));
  const statusFilter = (sp.get("status") ?? "COMPLETED").toUpperCase();

  const statusWhere =
    statusFilter === "ALL"
      ? {}
      : { status: statusFilter === "IN_PROGRESS" ? PracticeTestStatus.IN_PROGRESS : PracticeTestStatus.COMPLETED };

  const rows = await prisma.practiceTest.findMany({
    where: statusWhere,
    orderBy: { updatedAt: "desc" },
    take: Math.min(400, limit * 8),
    select: {
      id: true,
      userId: true,
      status: true,
      updatedAt: true,
      completedAt: true,
      config: true,
      results: true,
    },
  });

  const catRows = rows
    .filter((r) => {
      const c = r.config as PracticeTestConfigJson | null;
      return c?.selectionMode === "cat";
    })
    .slice(0, limit);

  const sessions = catRows.map((r) => {
    const cfg = r.config as PracticeTestConfigJson | null;
    const res = r.results as PracticeTestResultsJson | null;
    const report = res?.catReport as CatExamReport | null | undefined;
    const diag = report?.blueprintDiagnostics ?? null;
    const admin = report?.blueprintAdminDiagnostics ?? null;

    return {
      practiceTestId: r.id,
      userId: r.userId,
      status: r.status,
      updatedAt: r.updatedAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
      catPresentationMode: cfg?.catPresentationMode ?? "practice",
      poolMappedFraction: diag?.poolMappedFraction ?? null,
      sessionMappedFraction: diag?.sessionMappedFraction ?? admin?.sessionMappedFraction ?? null,
      deliveredMappedCount: admin?.deliveredMappedCount ?? null,
      deliveredFallbackCount: admin?.deliveredFallbackCount ?? null,
      deliveredPercentMapped: admin?.deliveredPercentMapped ?? null,
      deliveredPercentFallback: admin?.deliveredPercentFallback ?? null,
      poolCountsByBlueprintKey: diag?.poolCountsByBlueprintKey ?? null,
      sessionCountsByBlueprintKey: diag?.sessionCountsByBlueprintKey ?? null,
      topFallbackBlueprintKeysDelivered: admin?.topFallbackBlueprintKeysDelivered ?? null,
      fallbackDistributionDelivered: admin?.fallbackDistributionDelivered ?? null,
      mappingQualityWarnings: admin?.mappingQualityWarnings ?? null,
      qualityThresholds: admin?.qualityThresholds ?? getCatBlueprintQualityThresholds(),
      totalQuestions: report?.totalQuestions ?? null,
      hasBlueprintReport: Boolean(diag),
    };
  });

  return NextResponse.json({
    qualityThresholds: getCatBlueprintQualityThresholds(),
    count: sessions.length,
    sessions,
  });
}
