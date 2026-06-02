import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { recordChargebackEvidenceExport } from "@/lib/business-protection/business-protection-audit";
import {
  buildChargebackEvidencePackage,
  buildChargebackEvidenceTextPackage,
} from "@/lib/business-protection/revenue-protection-center";
import { loadRevenueProtectionSubscriberSnapshot } from "@/lib/business-protection/revenue-protection-center.server";

type RouteContext = { params: Promise<{ userId: string }> };

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId } = await ctx.params;
  const snapshot = await loadRevenueProtectionSubscriberSnapshot(userId);
  if (!snapshot) {
    return NextResponse.json({ ok: false, error: "Revenue protection evidence unavailable" }, { status: 404 });
  }

  const pkg = buildChargebackEvidencePackage(snapshot);
  const format = req.nextUrl.searchParams.get("format") === "txt" ? "txt" : "json";

  await recordChargebackEvidenceExport({
    userId,
    generatedByUserId: gate.admin.userId,
    format,
    summary: {
      generatedAt: pkg.generatedAt,
      protectionScore: pkg.protectionScore,
      riskLevel: pkg.riskLevel,
      evidenceCount: pkg.evidenceCount,
      missingEvidence: pkg.missingEvidence.map((item) => item.key),
    },
  });

  if (format === "txt") {
    return new NextResponse(buildChargebackEvidenceTextPackage(pkg), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="nursenest-chargeback-evidence-${userId.slice(0, 10)}.txt"`,
        "cache-control": "private, no-store",
      },
    });
  }

  return NextResponse.json(
    { ok: true, package: pkg },
    {
      headers: {
        "cache-control": "private, no-store",
      },
    },
  );
}
