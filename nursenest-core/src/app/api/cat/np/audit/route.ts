/**
 * GET /api/cat/np/audit
 *
 * Dev-only: run a bounded CAT inference audit on a sample of questions.
 * Disabled in production unless NP_CAT_AUDIT_ENABLED=true is explicitly set.
 *
 * Query params:
 *   sample   - Number of questions to audit (default 50, max 200).
 *   exam     - Filter by exam key (e.g. "np-aanp").
 *   topic    - Filter by topic substring.
 *   tag      - Filter by tag value.
 *
 * Auth: requires active subscriber session (extra safety in dev).
 *
 * Response: CatAuditReport JSON.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import {
  isCatAuditAllowed,
  runCatInferenceAudit,
  type CatAuditFilter,
} from "@/lib/cat/cat-inference-audit";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isCatAuditAllowed()) {
    return NextResponse.json({ error: "Audit not available in production." }, { status: 403 });
  }

  const session = await requireSubscriberSession();
  if (!session.ok) return session.response;

  const { searchParams } = req.nextUrl;

  const filter: CatAuditFilter = {
    sample: searchParams.has("sample") ? parseInt(searchParams.get("sample")!, 10) : 50,
    exam: searchParams.get("exam") ?? undefined,
    topic: searchParams.get("topic") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
  };

  try {
    const report = await runCatInferenceAudit(prisma, filter);
    return NextResponse.json(report);
  } catch (err) {
    console.error("[cat/np/audit] error:", err);
    return NextResponse.json({ error: "Audit failed." }, { status: 500 });
  }
}
