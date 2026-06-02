import "server-only";
import { requireAdmin } from "@/lib/auth/guards";
import { buildOpsCenterSnapshot } from "@/lib/observability/ops-center";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<Response> {
  await requireAdmin();
  try {
    const snapshot = await buildOpsCenterSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-OpsCenter-Version": "1.0",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ops-center snapshot failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
