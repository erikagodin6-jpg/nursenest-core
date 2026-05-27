import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildAccountActivityEvidence,
  buildActivityEvidenceHtmlReport,
  buildActivityEvidenceTextReport,
} from "@/lib/admin/account-activity-evidence";

type RouteContext = { params: Promise<{ userId: string }> };

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId } = await ctx.params;
  const evidence = await buildAccountActivityEvidence(userId);
  if (!evidence) {
    return NextResponse.json({ ok: false, error: "User activity evidence unavailable" }, { status: 404 });
  }

  const format = req.nextUrl.searchParams.get("format");
  if (format === "txt") {
    const report = buildActivityEvidenceTextReport(evidence);
    return new NextResponse(report, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="nursenest-activity-evidence-${userId.slice(0, 10)}.txt"`,
        "cache-control": "private, no-store",
      },
    });
  }

  if (format === "html") {
    const report = buildActivityEvidenceHtmlReport(evidence);
    return new NextResponse(report, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "content-disposition": `inline; filename="nursenest-activity-evidence-${userId.slice(0, 10)}.html"`,
        "cache-control": "private, no-store",
      },
    });
  }

  return NextResponse.json(
    { ok: true, evidence },
    {
      headers: {
        "cache-control": "private, no-store",
      },
    },
  );
}
