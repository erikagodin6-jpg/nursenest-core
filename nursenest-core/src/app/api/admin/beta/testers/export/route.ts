import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { betaFeaturesToLabels } from "@/lib/beta/beta-access";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const grants = await prisma.betaAccessGrant.findMany({
    orderBy: { redeemedAt: "desc" },
    include: {
      code: { select: { name: true, displayCode: true } },
      user: { select: { id: true, email: true, name: true, lastLoginAt: true } },
    },
  });

  const rows = [
    ["tester_name", "tester_email", "user_id", "code_name", "code", "features", "redeemed_at", "revoked_at", "last_login_at"],
    ...grants.map((grant) => [
      grant.user.name,
      grant.user.email,
      grant.user.id,
      grant.code.name,
      grant.code.displayCode,
      betaFeaturesToLabels(grant.features).join("; "),
      grant.redeemedAt.toISOString(),
      grant.revokedAt?.toISOString() ?? "",
      grant.user.lastLoginAt?.toISOString() ?? "",
    ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nursenest-beta-testers.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
