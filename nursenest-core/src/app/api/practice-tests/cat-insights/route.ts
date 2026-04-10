import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { isSkipBeyondLimit, listSkipRows, parseListPage } from "@/lib/api/api-pagination-limits";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

const PAGE_SIZE = 12;

export type CatInsightRow = {
  id: string;
  title: string | null;
  completedAt: string | null;
  passOutlookPercent: number | null;
  confidenceLevel: string | null;
  decision: string | null;
  totalQuestions: number | null;
  catPresentationMode: string | null;
};

export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/practice-tests/cat-insights", feature: SERVER_FEATURE.practiceTest, userId: gate.userId });

  const pageParsed = parseListPage(req.nextUrl.searchParams.get("page"));
  const pageNum = pageParsed.ok ? pageParsed.page : 1;
  const skip = listSkipRows(pageNum, PAGE_SIZE);
  if (isSkipBeyondLimit(skip)) {
    return NextResponse.json({ error: "Page out of range" }, { status: 400 });
  }

  const rows = await prisma.practiceTest.findMany({
    where: {
      userId: gate.userId,
      status: PracticeTestStatus.COMPLETED,
      NOT: { completedAt: null },
      config: {
        path: ["selectionMode"],
        equals: "cat",
      },
    },
    orderBy: { completedAt: "desc" },
    skip,
    take: PAGE_SIZE + 1,
    select: {
      id: true,
      title: true,
      completedAt: true,
      config: true,
      results: true,
    },
  });

  const hasMore = rows.length > PAGE_SIZE;
  const slice = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

  const items: CatInsightRow[] = slice.map((r) => {
    const cfg = parsePracticeTestConfigAtBoundary(r.config, { practiceTestId: r.id, surface: "cat_insights_list" });
    const res = r.results as PracticeTestResultsJson | null;
    const coach = res?.catCoach;
    const report = res?.catReport;
    return {
      id: r.id,
      title: r.title,
      completedAt: r.completedAt?.toISOString() ?? null,
      passOutlookPercent: coach?.passOutlookPercent ?? report?.readinessScore ?? null,
      confidenceLevel: coach?.confidenceLevel ?? report?.confidenceLevel ?? null,
      decision: report?.decision ?? null,
      totalQuestions: report?.totalQuestions ?? null,
      catPresentationMode: cfg?.catPresentationMode ?? null,
    };
  });

  return NextResponse.json({
    page: pageNum,
    pageSize: PAGE_SIZE,
    hasMore,
    items,
  });
}
