import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildStudyToolsSession } from "@/lib/study-tools/build-study-tools-session";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import type { StudyToolSessionMode } from "@/lib/study-tools/study-tools-session-types";
import { CANONICAL_STUDY_CATEGORIES, type CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

const MODES = new Set<StudyToolSessionMode>([
  "matching",
  "fill_in_the_blank",
  "ordering",
  "lab_drills",
  "medication_drills",
]);

const CANON = new Set<string>(CANONICAL_STUDY_CATEGORIES.map((c) => c.id));

function parseCategories(raw: string | null): CanonicalStudyCategoryId[] {
  if (!raw?.trim()) return [];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: CanonicalStudyCategoryId[] = [];
  for (const p of parts) {
    if (CANON.has(p)) out.push(p as CanonicalStudyCategoryId);
  }
  return out;
}

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/study-tools/session", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;

    const sp = req.nextUrl.searchParams;
    const pathwayId = sp.get("pathwayId")?.trim() ?? "";
    const modeRaw = sp.get("mode")?.trim() ?? "";
    const mode = (MODES.has(modeRaw as StudyToolSessionMode) ? modeRaw : null) as StudyToolSessionMode | null;
    if (!pathwayId || !mode) {
      return NextResponse.json(
        { ok: false, code: "bad_request", message: "pathwayId and a valid mode are required." },
        { status: 400 },
      );
    }

    const count = Math.min(50, Math.max(1, Number(sp.get("count") ?? "12") || 12));
    const shuffle = sp.get("shuffle") !== "0";
    const weakOnly = sp.get("weakOnly") === "1" || sp.get("weakOnly") === "true";
    const selectedCategories = parseCategories(sp.get("categories"));

    const built = await buildStudyToolsSession({
      userId: gate.userId,
      entitlement: gate.entitlement,
      pathwayId,
      mode,
      selectedCategories,
      count,
      shuffle,
      filters: { weakOnly },
    });

    if (!built.ok) {
      const status =
        built.code === "database_error" ? 503 : built.code === "pathway_not_covered" ? 403 : built.code === "invalid_pathway" ? 400 : 404;
      return NextResponse.json({ ok: false, code: built.code, message: built.message }, { status });
    }

    return NextResponse.json({
      ok: true,
      pathwayId: built.pathwayId,
      payload: built.payload,
      items: built.items,
    });
  });
}
