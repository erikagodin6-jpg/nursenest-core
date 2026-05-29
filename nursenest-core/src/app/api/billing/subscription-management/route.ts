import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  applyManagedSubscriptionChange,
  listManagedBillingPlans,
  previewManagedSubscriptionChange,
} from "@/lib/billing/subscription-management";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const runtime = "nodejs";

const bodySchema = z
  .object({
    action: z.enum(["preview", "apply"]),
    planCode: z.string().trim().min(1).max(160),
  })
  .strict();

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/billing/subscription-management", "billing", async () => {
    const session = await auth();
    const userId = sessionUserId(session);
    if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    return NextResponse.json({ ok: true, plans: listManagedBillingPlans() });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/billing/subscription-management", "billing", async () => {
    const session = await auth();
    const userId = sessionUserId(session);
    if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "JSON body required.", code: "INVALID_JSON" }, { status: 400 });
    }
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid billing request.", code: "INVALID_PAYLOAD", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result =
      parsed.data.action === "preview"
        ? await previewManagedSubscriptionChange(userId, parsed.data.planCode)
        : await applyManagedSubscriptionChange(userId, parsed.data.planCode);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  });
}
