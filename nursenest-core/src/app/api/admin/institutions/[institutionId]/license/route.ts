import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { updateInstitutionalLicense } from "@/lib/institutional/licensing-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ institutionId: string }> },
) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  if (gate.admin.tier !== "super") {
    return NextResponse.json({ ok: false, error: "Super admin access required." }, { status: 403 });
  }

  const { institutionId } = await params;
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    await updateInstitutionalLicense({
      organizationId: institutionId,
      seatCap: body?.seatCap,
      renewalAt: body?.renewalAt,
      status: body?.status,
      stripeCustomerId: body?.stripeCustomerId,
      stripeSubscriptionId: body?.stripeSubscriptionId,
      actorUserId: gate.admin.userId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to update license." },
      { status: 400 },
    );
  }
}
