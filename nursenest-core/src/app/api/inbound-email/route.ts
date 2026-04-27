import { NextResponse } from "next/server";
import { getOpenAiApiKey } from "@/lib/ai/openai-env";
import { generateInboundSupportReplyText } from "@/lib/inbound-email/generate-inbound-support-reply";
import { shouldIgnoreInboundAsSpam } from "@/lib/inbound-email/inbound-email-spam-guard";
import { verifyInboundWebhookBearer } from "@/lib/inbound-email/inbound-webhook-auth";
import { normalizePostmarkInboundPayload } from "@/lib/inbound-email/postmark-inbound-types";
import { sendPostmarkReply } from "@/lib/inbound-email/postmark-outbound";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { SUPPORT_EMAIL } from "@/lib/support/support-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function postmarkServerToken(): string | null {
  return process.env["POSTMARK_API_TOKEN"]?.trim() || null;
}

function outboundFromAddress(): string {
  return process.env["POSTMARK_FROM_EMAIL"]?.trim() || SUPPORT_EMAIL;
}

function logMetaForInbound(msg: { fromEmail: string; subject: string }) {
  const at = msg.fromEmail.indexOf("@");
  const domain = at > 0 ? msg.fromEmail.slice(at + 1) : "";
  return {
    fromDomain: domain.slice(0, 64),
    subjectLen: msg.subject.length,
  };
}

/**
 * Postmark Inbound webhook → OpenAI draft → Postmark outbound reply.
 *
 * Security: set `POSTMARK_INBOUND_WEBHOOK_SECRET` (or `INBOUND_EMAIL_WEBHOOK_SECRET`). Prove possession via any of:
 * `Authorization: Bearer <secret>`, HTTP Basic password (Postmark inbound HTTP credentials), or `?secret=` on the webhook URL (HTTPS only).
 * In production the secret must be configured or the route returns 503.
 *
 * Env: `POSTMARK_API_TOKEN`, `OPENAI_API_KEY` (or `AI_INTEGRATIONS_OPENAI_API_KEY`), optional `POSTMARK_FROM_EMAIL` (verified sender in Postmark).
 */
export async function POST(request: Request) {
  const auth = verifyInboundWebhookBearer(request);
  if (!auth.ok) {
    if (auth.reason === "missing_webhook_secret") {
      safeServerLogCritical("inbound_email", "missing_webhook_secret_production", {}, undefined, {
        flow: "inbound_email",
      });
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 503 });
    }
    safeServerLog("inbound_email", "unauthorized", { reason: auth.reason });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postmarkToken = postmarkServerToken();
  if (!postmarkToken) {
    safeServerLog("inbound_email", "missing_postmark_api_token");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  if (!getOpenAiApiKey()) {
    safeServerLog("inbound_email", "missing_openai_api_key");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    safeServerLog("inbound_email", "invalid_json");
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const msg = normalizePostmarkInboundPayload(body);
  if (!msg) {
    safeServerLog("inbound_email", "payload_parse_failed");
    return NextResponse.json({ error: "Invalid Postmark inbound payload" }, { status: 400 });
  }

  const meta = logMetaForInbound(msg);

  if (msg.fromEmail.toLowerCase() === SUPPORT_EMAIL.toLowerCase()) {
    safeServerLog("inbound_email", "skipped_loop_self_address", meta);
    return NextResponse.json({ ok: true, skipped: true, reason: "loop_self_address" });
  }

  const spam = shouldIgnoreInboundAsSpam(msg);
  if (spam.ignore) {
    safeServerLog("inbound_email", "skipped_spam", { ...meta, reason: spam.reason });
    return NextResponse.json({ ok: true, skipped: true, reason: spam.reason });
  }

  try {
    const replyText = await generateInboundSupportReplyText(msg);
    const from = outboundFromAddress();

    const send = await sendPostmarkReply({
      apiToken: postmarkToken,
      inboundMessageId: msg.messageId,
      to: msg.fromEmail,
      originalSubject: msg.subject,
      replyText,
      from,
    });

    if (!send.ok) {
      safeServerLogCritical(
        "inbound_email",
        "postmark_send_failed",
        { ...meta, httpStatus: send.status },
        send.error,
        { flow: "inbound_email" },
      );
      return NextResponse.json({ ok: false, error: "postmark_send_failed" }, { status: 502 });
    }

    safeServerLog("inbound_email", "reply_sent", {
      ...meta,
      postmarkMessageIdPrefix: send.messageId.slice(0, 12),
    });

    return NextResponse.json({
      ok: true,
      postmarkMessageIdPrefix: send.messageId.slice(0, 12),
    });
  } catch (e) {
    safeServerLogCritical("inbound_email", "handler_failed", meta, e, { flow: "inbound_email" });
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
