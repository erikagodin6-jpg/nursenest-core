import type { PracticeTestStatus } from "@prisma/client";
import { PracticeTestStatus as PracticeTestStatusEnum } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { catBlueprintSessionHasQualityWarnings } from "@/lib/exams/cat-blueprint-mapping-quality";
import { getCatBlueprintQualityThresholds } from "@/lib/exams/cat-blueprint-thresholds";
import type {
  CatBlueprintAdminDiagnostics,
  CatBlueprintDiagnostics,
  CatExamReport,
  CatPresentationMode,
} from "@/lib/exams/cat-types";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

const DEFAULT_LIST_LIMIT = 30;
const MAX_LIST_LIMIT = 80;
const DB_FETCH_MULTIPLIER = 8;
const MAX_DB_TAKE = 600;

export type CatBlueprintSessionJson = {
  practiceTestId: string;
  userId: string;
  status: PracticeTestStatus;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
  pathwayId: string | null;
  catExamConfigId: string | null;
  catPresentationMode: CatPresentationMode;
  poolMappedFraction: number | null;
  sessionMappedFraction: number | null;
  deliveredMappedCount: number | null;
  deliveredFallbackCount: number | null;
  deliveredPercentMapped: number | null;
  deliveredPercentFallback: number | null;
  poolCountsByBlueprintKey: CatBlueprintDiagnostics["poolCountsByBlueprintKey"] | null;
  sessionCountsByBlueprintKey: CatBlueprintDiagnostics["sessionCountsByBlueprintKey"] | null;
  topFallbackBlueprintKeysDelivered: CatBlueprintAdminDiagnostics["topFallbackBlueprintKeysDelivered"] | null;
  fallbackDistributionDelivered: CatBlueprintAdminDiagnostics["fallbackDistributionDelivered"] | null;
  mappingQualityWarnings: CatBlueprintAdminDiagnostics["mappingQualityWarnings"] | null;
  qualityThresholds: ReturnType<typeof getCatBlueprintQualityThresholds>;
  totalQuestions: number | null;
  hasBlueprintReport: boolean;
};

export type PracticeTestRowForCatBlueprint = {
  id: string;
  userId: string;
  status: PracticeTestStatus;
  startedAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  config: unknown;
  results: unknown;
};

export function parsePracticeTestStatusWhere(sp: URLSearchParams): Prisma.PracticeTestWhereInput {
  const co = sp.get("completedOnly");
  const statusRaw = (sp.get("status") ?? "COMPLETED").toUpperCase();

  if (co === "0" || co === "false") {
    return {};
  }
  if (co === "1" || co === "true") {
    return { status: PracticeTestStatusEnum.COMPLETED };
  }
  if (statusRaw === "ALL") {
    return {};
  }
  if (statusRaw === "IN_PROGRESS") {
    return { status: PracticeTestStatusEnum.IN_PROGRESS };
  }
  return { status: PracticeTestStatusEnum.COMPLETED };
}

export function mapPracticeTestRowToCatBlueprintSession(r: PracticeTestRowForCatBlueprint): CatBlueprintSessionJson {
  const cfg = r.config as PracticeTestConfigJson | null;
  const res = r.results as PracticeTestResultsJson | null;
  const report = res?.catReport as CatExamReport | null | undefined;
  const diag = report?.blueprintDiagnostics ?? null;
  const admin = report?.blueprintAdminDiagnostics ?? null;

  return {
    practiceTestId: r.id,
    userId: r.userId,
    status: r.status,
    startedAt: r.startedAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
    pathwayId: cfg?.pathwayId ?? null,
    catExamConfigId: cfg?.catExamConfigId ?? null,
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
    qualityThresholds: admin?.qualityThresholds
      ? { ...getCatBlueprintQualityThresholds(), ...admin.qualityThresholds }
      : getCatBlueprintQualityThresholds(),
    totalQuestions: report?.totalQuestions ?? null,
    hasBlueprintReport: Boolean(diag),
  };
}

function sessionMatchesLowQuality(s: CatBlueprintSessionJson): boolean {
  return catBlueprintSessionHasQualityWarnings({
    presentationMode: s.catPresentationMode,
    poolMappedFraction: s.poolMappedFraction,
    sessionMappedFraction: s.sessionMappedFraction,
    scoredCount: s.totalQuestions,
    persistedWarnings: s.mappingQualityWarnings,
  });
}

export async function queryCatBlueprintSessionsForAdmin(sp: URLSearchParams): Promise<{
  sessions: CatBlueprintSessionJson[];
  qualityThresholds: ReturnType<typeof getCatBlueprintQualityThresholds>;
}> {
  const limit = Math.min(MAX_LIST_LIMIT, Math.max(1, Number(sp.get("limit") ?? String(DEFAULT_LIST_LIMIT))));
  const statusWhere = parsePracticeTestStatusWhere(sp);
  const pathwayId = sp.get("pathwayId")?.trim() || undefined;
  const catExamConfigId = sp.get("catExamConfigId")?.trim() || undefined;
  const lowQualityOnly =
    sp.get("lowQualityOnly") === "1" || sp.get("lowQualityOnly")?.toLowerCase() === "true";

  const rows = await prisma.practiceTest.findMany({
    where: statusWhere,
    orderBy: { updatedAt: "desc" },
    take: Math.min(MAX_DB_TAKE, limit * DB_FETCH_MULTIPLIER),
    select: {
      id: true,
      userId: true,
      status: true,
      startedAt: true,
      updatedAt: true,
      completedAt: true,
      config: true,
      results: true,
    },
  });

  let sessions = rows
    .filter((r) => {
      const c = r.config as PracticeTestConfigJson | null;
      return c?.selectionMode === "cat";
    })
    .map((r) => mapPracticeTestRowToCatBlueprintSession(r as PracticeTestRowForCatBlueprint));

  if (pathwayId) {
    sessions = sessions.filter((s) => (s.pathwayId ?? "") === pathwayId);
  }
  if (catExamConfigId) {
    sessions = sessions.filter((s) => (s.catExamConfigId ?? "") === catExamConfigId);
  }
  if (lowQualityOnly) {
    sessions = sessions.filter(sessionMatchesLowQuality);
  }

  sessions = sessions.slice(0, limit);

  return {
    sessions,
    qualityThresholds: getCatBlueprintQualityThresholds(),
  };
}

function csvEscapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function catBlueprintSessionsToCsv(sessions: CatBlueprintSessionJson[]): string {
  const headers = [
    "practiceTestId",
    "userId",
    "status",
    "startedAt",
    "completedAt",
    "updatedAt",
    "pathwayId",
    "catExamConfigId",
    "catPresentationMode",
    "poolMappedPct",
    "sessionMappedPct",
    "deliveredMappedCount",
    "deliveredFallbackCount",
    "warningCodes",
    "topFallbackKeys",
    "hasBlueprintReport",
  ];
  const lines = [headers.join(",")];
  for (const s of sessions) {
    const poolPct =
      s.poolMappedFraction != null ? String(Math.round(s.poolMappedFraction * 10_000) / 100) : "";
    const sessPct =
      s.sessionMappedFraction != null ? String(Math.round(s.sessionMappedFraction * 10_000) / 100) : "";
    const codes = (s.mappingQualityWarnings ?? []).map((w) => w.code).join(";");
    const topKeys = (s.topFallbackBlueprintKeysDelivered ?? [])
      .slice(0, 5)
      .map((e) => `${e.blueprintKey}:${e.count}`)
      .join(";");
    const row = [
      s.practiceTestId,
      s.userId,
      s.status,
      s.startedAt,
      s.completedAt ?? "",
      s.updatedAt,
      s.pathwayId ?? "",
      s.catExamConfigId ?? "",
      s.catPresentationMode,
      poolPct,
      sessPct,
      s.deliveredMappedCount != null ? String(s.deliveredMappedCount) : "",
      s.deliveredFallbackCount != null ? String(s.deliveredFallbackCount) : "",
      codes,
      topKeys,
      s.hasBlueprintReport ? "1" : "0",
    ].map(csvEscapeCell);
    lines.push(row.join(","));
  }
  return lines.join("\n");
}
