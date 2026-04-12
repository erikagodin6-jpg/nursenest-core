import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { computeFraudScores, computeFraudSummary } from "@/lib/admin/fraud-scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const minScore = Number(req.nextUrl.searchParams.get("minScore") ?? 10);
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 50), 200);

  const [summary, accounts] = await Promise.all([
    computeFraudSummary(),
    computeFraudScores({ limit, minScore }),
  ]);

  return NextResponse.json({ summary, accounts });
}
