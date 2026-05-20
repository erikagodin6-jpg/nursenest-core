import { NextResponse } from "next/server";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { listEcgQuestionsForAccess } from "@/lib/ecg-module/ecg-question-store";
import {
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

  const items = await listEcgQuestionsForAccess(access, { level, mode, kind });
  return NextResponse.json({ ok: true, items });
}
