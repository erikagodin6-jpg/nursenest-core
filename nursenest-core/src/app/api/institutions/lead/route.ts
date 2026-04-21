import { NextResponse } from "next/server";
import { z } from "zod";
import { supportEmail } from "@/lib/legal/legal-config";
import { sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { JSON_BODY_TINY, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const runtime = "nodejs";

const institutionLeadSchema = z.object({
  institutionName: z.string().trim().min(1).max(300),
  programType: z.string().trim().min(1).max(40),
  estimatedStudentCount: z.coerce.number().int().min(0).max(500_000).optional().default(0),
  country: z.string().trim().min(1).max(20).optional(),
  contactName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(80).optional().nullable(),
  message: z.string().trim().max(8000).optional().nullable(),
  /** Legacy client field — mirrors selected country / region. */
  region: z.string().trim().min(1).max(20).optional(),
});

/**
 * Public institutional inquiry intake (legacy path `/api/institutions/lead`).
 * Delivers to support email when Resend is configured; always logs a structured receipt server-side.
 */
export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/institutions/lead", "marketing", async () => {
    const ip = getTrustedClientIp(req);
    const rl = await checkRateLimitUnified(`institution-lead:${ip}`, { windowMs: 60 * 60_000, max: 12 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_TINY);
    if (!bodyRead.ok) return bodyRead.response;

    const parsed = institutionLeadSchema.safeParse(bodyRead.value);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data", details: parsed.error.flatten() }, { status: 400 });
    }

    const d = parsed.data;
    const region = (d.region ?? d.country ?? "US").trim();
    const phone = d.phone?.trim() || "";
    const message = d.message?.trim() || "";

    safeServerLog("institution_lead", "received", {
      institutionName: d.institutionName.slice(0, 120),
      programType: d.programType,
      estimatedStudentCount: d.estimatedStudentCount,
      region,
      contactEmailDomain: d.email.includes("@") ? d.email.split("@")[1]?.slice(0, 80) : "",
    });

    const to = supportEmail();
    const subject = `Institutional inquiry: ${d.institutionName}`.slice(0, 200);
    const textLines = [
      `Institution: ${d.institutionName}`,
      `Program type: ${d.programType}`,
      `Estimated students: ${d.estimatedStudentCount}`,
      `Country / region: ${region}`,
      `Contact: ${d.contactName}`,
      `Email: ${d.email}`,
      `Phone: ${phone || "(none)"}`,
      "",
      message || "(no message)",
    ];
    const html = `<pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">${textLines
      .map((l) => l.replace(/&/g, "&amp;").replace(/</g, "&lt;"))
      .join("\n")}</pre>`;

    const sent = await sendTransactionalEmailHtml({ to, subject, html, text: textLines.join("\n") });
    if (!sent.ok) {
      safeServerLog("institution_lead", "email_not_sent", { skippedReason: sent.skippedReason ?? "unknown" });
    }

    return NextResponse.json({ success: true });
  });
}
