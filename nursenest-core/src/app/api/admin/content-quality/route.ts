import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const snapshot = await loadContentQualitySnapshot();
  return NextResponse.json(snapshot);
}
