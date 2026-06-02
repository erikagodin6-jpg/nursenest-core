import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { applyAdminSubscriptionAction } from "@/lib/billing/subscription-management";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const runtime = "nodejs";

const bodySchema = z
  .object({
    userId: z.string().trim().min(1).max(160),
    action: z.enum(["cancel", "reactivate", "gift_month", "apply_credit", "apply_coupon"]),
    amountCents: z.number().int().positive().max(250000).optional(),
    couponId: z.string().trim().min(1).max(160).optional(),
    reason: z.string().trim().min(10).max(1000),
  })
  .strict();

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/admin/billing/subscription-actions", "billing", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;

    if (gate.admin.tier !== "super" && gate.admin.tier !== "support") {
      return NextResponse.json({ ok: false, error: "Forbidden", code: "ADMIN_TIER_FORBIDDEN" }, { status: 403 });
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "JSON body required.", code: "INVALID_JSON" }, { status: 400 });
    }
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin billing action.", code: "INVALID_PAYLOAD", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await applyAdminSubscriptionAction({
      actorUserId: gate.admin.userId,
      actorTier: gate.admin.tier,
      userId: parsed.data.userId,
      action: parsed.data.action,
      amountCents: parsed.data.amountCents,
      couponId: parsed.data.couponId,
      reason: parsed.data.reason,
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  });
}
