import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

const patchSchema = z.object({
  emailEngagementOptOut: z.boolean(),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/email-engagement-prefs", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/email-engagement-prefs",
      feature: SERVER_FEATURE.entitlement,
      userId: gate.userId,
    });

    try {
      const row = await prisma.user.findUnique({
        where: { id: gate.userId },
        select: { emailEngagementOptOut: true },
      });
      return NextResponse.json({ ok: true, emailEngagementOptOut: row?.emailEngagementOptOut ?? false });
    } catch {
      return NextResponse.json({ ok: false, error: "Unable to load preferences." }, { status: 503 });
    }
  });
}

export async function PATCH(req: Request) {
  return runWithApiTelemetry(req, "PATCH /api/learner/email-engagement-prefs", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/email-engagement-prefs",
      feature: SERVER_FEATURE.entitlement,
      userId: gate.userId,
    });

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }

    try {
      const updated = await prisma.user.update({
        where: { id: gate.userId },
        data: { emailEngagementOptOut: parsed.data.emailEngagementOptOut },
        select: { emailEngagementOptOut: true },
      });
      return NextResponse.json({ ok: true, emailEngagementOptOut: updated.emailEngagementOptOut });
    } catch {
      return NextResponse.json({ ok: false, error: "Unable to save preferences." }, { status: 503 });
    }
  });
}
