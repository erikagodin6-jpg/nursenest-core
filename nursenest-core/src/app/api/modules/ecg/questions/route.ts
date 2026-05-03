import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { getCurrentEcgModuleAccess, ecgApiDeniedResponse } from "@/lib/ecg-module/ecg-module.server";
import {
  ECG_QUESTION_FORMAT,
  ecgQuestionTierFilterForTier,
  isEcgQuestionExcludedFromCat,
  normalizeEcgLevel,
  normalizeEcgMode,
  type EcgRouteKind,
} from "@/lib/ecg-module/ecg-module-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeKind(raw: string | null): EcgRouteKind | null {
  if (
    raw === "lessons" ||
    raw === "quizzes" ||
    raw === "worksheets" ||
    raw === "video-drills" ||
    raw === "scenarios"
  ) {
    return raw;
  }
  return null;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry ?? "").trim()).filter(Boolean);
}

export async function GET(req: Request) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const url = new URL(req.url);
  const level = normalizeEcgLevel(url.searchParams.get("level"));
  const mode = normalizeEcgMode(url.searchParams.get("mode"));
  const kind = normalizeKind(url.searchParams.get("kind"));
  if (!level || !mode || !kind || kind === "worksheets") {
    return NextResponse.json({ ok: false, code: "invalid_ecg_query" }, { status: 400 });
  }

  const tiers = ecgQuestionTierFilterForTier(access.tier);
  if (tiers.length === 0) return NextResponse.json({ ok: true, items: [] });

  const rows = await prisma.examQuestion.findMany({
    where: {
      status: DB_PUBLISHED,
      questionFormat: ECG_QUESTION_FORMAT,
      level,
      mode,
      tier: { in: tiers },
      ...(kind === "scenarios" ? { OR: [{ isScenario: true }, { scenario: { not: null } }] } : {}),
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 40,
    select: {
      id: true,
      stem: true,
      topic: true,
      scenario: true,
      rationale: true,
      options: true,
      correctAnswer: true,
      questionFormat: true,
      tags: true,
      exhibitData: true,
    },
  });

  const items = rows.filter(isEcgQuestionExcludedFromCat).map((row) => ({
    id: row.id,
    stem: row.stem,
    options: kind === "quizzes" ? stringArray(row.options) : [],
    correctAnswer: kind === "quizzes" ? stringArray(row.correctAnswer) : [],
    topic: row.topic,
    scenario: row.scenario,
    rationale: kind === "quizzes" || level === "basic" ? row.rationale : null,
    exhibitData: row.exhibitData,
  }));

  return NextResponse.json({ ok: true, items });
}
