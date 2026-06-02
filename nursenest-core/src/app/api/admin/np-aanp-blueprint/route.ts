import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  computeNpAanpBlueprintDiagnostics,
  npMissingAanpBlueprintWhere,
} from "@/lib/admin/np-aanp-blueprint-diagnostics";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { ContentStatus } from "@prisma/client";

/**
 * Admin: NP bank coverage for AANP-style blueprint tags (`nclex_client_needs_category`).
 * GET — summary JSON with counts, mapped fraction, per-domain totals.
 * GET ?missingOnly=1&limit=200&format=csv|json — export queue for content ops (ids missing valid AANP tag).
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const missingOnly = sp.get("missingOnly") === "1" || sp.get("missingOnly") === "true";
  const limit = Math.min(2000, Math.max(1, Number(sp.get("limit") ?? "200")));
  const format = (sp.get("format") ?? "json").toLowerCase();

  const published = contentStatusToDb(ContentStatus.PUBLISHED);

  const diagnostics = await computeNpAanpBlueprintDiagnostics(prisma);

  if (missingOnly) {
    const sample = await prisma.examQuestion.findMany({
      where: npMissingAanpBlueprintWhere(published),
      select: {
        id: true,
        exam: true,
        topic: true,
        bodySystem: true,
        nclexClientNeedsCategory: true,
        nclexClientNeedsSubcategory: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    if (format === "csv") {
      const header = "id,exam,topic,bodySystem,nclexClientNeedsCategory,nclexClientNeedsSubcategory,updatedAt\n";
      const esc = (s: string | null) => `"${(s ?? "").replace(/"/g, '""')}"`;
      const rows = sample
        .map(
          (r) =>
            [
              r.id,
              esc(r.exam),
              esc(r.topic),
              esc(r.bodySystem),
              esc(r.nclexClientNeedsCategory),
              esc(r.nclexClientNeedsSubcategory),
              r.updatedAt.toISOString(),
            ].join(","),
        )
        .join("\n");
      return new NextResponse(header + rows, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="np-missing-aanp-blueprint.csv"',
        },
      });
    }

    return NextResponse.json({
      summary: diagnostics,
      missingSampleRowCount: sample.length,
      rows: sample,
    });
  }

  return NextResponse.json({ summary: diagnostics });
}
