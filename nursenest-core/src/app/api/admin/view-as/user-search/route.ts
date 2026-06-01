/**
 * GET /api/admin/view-as/user-search?q={query}
 *
 * Search users for the view-as selector. Returns lightweight rows safe to display in
 * admin UI (email, tier, country, subscription status). Never returns passwords,
 * payment data, or auth tokens.
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";

const NON_LEARNER_ROLES = ["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "SUPPORT_ADMIN"];

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ ok: true, users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      role: { notIn: NON_LEARNER_ROLES as never[] },
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      country: true,
      trialStatus: true,
      subscriptions: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          status: true,
          planCode: true,
          planTier: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const rows = users.map((u) => {
    const sub = u.subscriptions[0] ?? null;
    return {
      id: u.id,
      email: u.email ?? "",
      name: u.name ?? null,
      tier: String(u.tier ?? ""),
      country: String(u.country ?? ""),
      subscriptionStatus: sub?.status ? String(sub.status) : null,
      planCode: sub?.planCode ?? null,
      trialStatus: u.trialStatus ? String(u.trialStatus) : null,
    };
  });

  return NextResponse.json({ ok: true, users: rows });
}
