import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const snapshot = await loadContentQualitySnapshot();
  return NextResponse.json(snapshot);
}
