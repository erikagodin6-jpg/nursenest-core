import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadContentQualityReport } from "@/lib/admin/content-quality-intelligence";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const report = await loadContentQualityReport();
  if (!report) {
    return NextResponse.json({ ok: false, error: "Content quality report unavailable" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, report }, {
    headers: { "cache-control": "private, max-age=300" },
  });
}
