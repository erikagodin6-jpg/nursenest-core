import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { recordReferralClick } from "@/lib/referrals/referral-rewards";

export const dynamic = "force-dynamic";

const clickSchema = z.object({
  code: z.string().min(1).max(64),
  landingPath: z.string().max(512).optional().nullable(),
  referrerUrl: z.string().max(1024).optional().nullable(),
  utmSource: z.string().max(120).optional().nullable(),
  utmMedium: z.string().max(120).optional().nullable(),
  utmCampaign: z.string().max(160).optional().nullable(),
  sessionId: z.string().max(128).optional().nullable(),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/referrals/click", "public", async () => {
    const parsed = clickSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    await recordReferralClick({
      rawCode: parsed.data.code,
      landingPath: parsed.data.landingPath,
      referrerUrl: parsed.data.referrerUrl,
      utmSource: parsed.data.utmSource,
      utmMedium: parsed.data.utmMedium,
      utmCampaign: parsed.data.utmCampaign,
      sessionId: parsed.data.sessionId,
      ip: getTrustedClientIp(req),
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({ ok: true });
  });
}
