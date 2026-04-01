import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { refreshContentQualityCorpusSnapshot } from "@/lib/admin/content-quality-corpus-refresh";

export async function POST() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const payload = await refreshContentQualityCorpusSnapshot();
    return NextResponse.json({ ok: true, payload });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Refresh failed" },
      { status: 500 },
    );
  }
}
