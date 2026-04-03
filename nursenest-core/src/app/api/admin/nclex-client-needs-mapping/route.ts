import { NextRequest, NextResponse } from "next/server";
import { ContentStatus, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";

export type NclexMappingMissingField = "category" | "subcategory" | "both";

function buildWhere(
  published: ContentStatus,
  missingField: NclexMappingMissingField,
): Prisma.ExamQuestionWhereInput {
  const base: Prisma.ExamQuestionWhereInput = { status: contentStatusToDb(published) };
  const missingCategory: Prisma.ExamQuestionWhereInput = {
    OR: [{ nclexClientNeedsCategory: null }, { nclexClientNeedsCategory: "" }],
  };
  const missingSubcategory: Prisma.ExamQuestionWhereInput = {
    OR: [{ nclexClientNeedsSubcategory: null }, { nclexClientNeedsSubcategory: "" }],
  };
  const hasCategory: Prisma.ExamQuestionWhereInput = {
    nclexClientNeedsCategory: { not: null },
    NOT: { nclexClientNeedsCategory: "" },
  };

  if (missingField === "category") {
    return { AND: [base, missingCategory] };
  }
  if (missingField === "subcategory") {
    return { AND: [base, hasCategory, missingSubcategory] };
  }
  if (missingField === "both") {
    return { AND: [base, { OR: [missingCategory, { AND: [hasCategory, missingSubcategory] }] }] };
  }
  return base;
}

/**
 * Admin-only: inspect NCLEX client-needs columns for backfill / remediation queues.
 *
 * Query:
 * - `missingField=category` — empty/missing category (default when `missingOnly=1`)
 * - `missingField=subcategory` — category set but subcategory empty
 * - `missingField=both` — missing category OR (category set and subcategory missing)
 * - `missingOnly=1` — alias for `missingField=category` (backward compatible)
 * - `limit`, `format=json|csv`
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const missingOnlyLegacy = sp.get("missingOnly") === "1" || sp.get("missingOnly") === "true";
  const missingFieldParam = sp.get("missingField")?.toLowerCase();
  let missingField: NclexMappingMissingField | null = null;
  if (missingFieldParam === "subcategory" || missingFieldParam === "category" || missingFieldParam === "both") {
    missingField = missingFieldParam;
  } else if (missingOnlyLegacy) {
    missingField = "category";
  }
  const limit = Math.min(500, Math.max(1, Number(sp.get("limit") ?? "100")));
  const format = (sp.get("format") ?? "json").toLowerCase();

  const published = ContentStatus.PUBLISHED;
  const where = missingField ? buildWhere(published, missingField) : { status: contentStatusToDb(published) };

  const baseWhere = { status: contentStatusToDb(published) };

  const [totalPublished, withCategory, withSubcategory, sample] = await Promise.all([
    prisma.examQuestion.count({ where: baseWhere }),
    prisma.examQuestion.count({
      where: {
        ...baseWhere,
        nclexClientNeedsCategory: { not: null },
        NOT: { nclexClientNeedsCategory: "" },
      },
    }),
    prisma.examQuestion.count({
      where: {
        ...baseWhere,
        nclexClientNeedsSubcategory: { not: null },
        NOT: { nclexClientNeedsSubcategory: "" },
      },
    }),
    prisma.examQuestion.findMany({
      where,
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
    }),
  ]);

  const missingCategory = totalPublished - withCategory;

  const filenameSuffix =
    missingField === "subcategory"
      ? "missing-subcategory"
      : missingField === "both"
        ? "missing-category-or-subcategory"
        : missingField === "category"
          ? "missing-category"
          : "sample";

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
        "Content-Disposition": `attachment; filename="nclex-client-needs-${filenameSuffix}.csv"`,
      },
    });
  }

  return NextResponse.json({
    summary: {
      totalPublished,
      withNclexClientNeedsCategory: withCategory,
      missingNclexClientNeedsCategory: missingCategory,
      withNclexClientNeedsSubcategory: withSubcategory,
      sampleRowCount: sample.length,
      missingFieldFilter: missingField,
      missingOnlyLegacy,
    },
    rows: sample,
  });
}
