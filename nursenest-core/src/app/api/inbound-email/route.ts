import { NextResponse } from "next/server";
import { getOpenAiApiKey } from "@/lib/ai/openai-env";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isInboundAiAutoReplyEnabled } from "@/lib/inbound-email/inbound-ai-autoreply-env";
import { generateInboundSupportReplyText } from "@/lib/inbound-email/generate-inbound-support-reply";
import { processInboundEmailAutoreplyFlow } from "@/lib/inbound-email/inbound-email-autoreply-flow";
import {
  finalizeInboundAutoreplyFailed,
  finalizeInboundAutoreplyReplied,
  finalizeInboundAutoreplySkipped,
  reserveInboundAutoreplySlot,
} from "@/lib/inbound-email/inbound-email-autoreply-store";
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

/**
 * Postmark Inbound webhook → optional OpenAI draft → optional Postmark outbound reply.
 *
 * Security: set `POSTMARK_INBOUND_WEBHOOK_SECRET` (or `INBOUND_EMAIL_WEBHOOK_SECRET`). Prove possession via any of:
 * `Authorization: Bearer <secret>`, HTTP Basic password (Postmark inbound HTTP credentials), or `?secret=` on the webhook URL (HTTPS only).
 * In production the secret must be configured or the route returns 503.
 *
 * Idempotency: Postmark inbound `MessageID` is unique in `InboundEmailAutoreplyEvent`; duplicates return `{ ok: true, skipped: true, reason: "duplicate" }`.
 *
 * Kill switch: set `INBOUND_AI_AUTO_REPLY_ENABLED=true` to send replies. When unset/false, payload is parsed and logged, row is marked skipped (`auto_reply_disabled`), no OpenAI/Postmark send.
 *
 * Env: `POSTMARK_API_TOKEN` and OpenAI key (`OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY`) required only when autoreply is enabled; optional `POSTMARK_FROM_EMAIL` (verified sender in Postmark).
 * `DATABASE_URL` required when inbound `MessageID` is present (after spam/self checks) for dedupe and audit.
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

  const result = await processInboundEmailAutoreplyFlow({
    msg,
    autoReplyEnabled: isInboundAiAutoReplyEnabled(),
    postmarkToken: postmarkServerToken(),
    openAiConfigured: Boolean(getOpenAiApiKey()),
    outboundFrom: outboundFromAddress(),
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: isDatabaseUrlConfigured(),
    deps: {
      reserve: reserveInboundAutoreplySlot,
      finalizeSkipped: finalizeInboundAutoreplySkipped,
      finalizeReplied: finalizeInboundAutoreplyReplied,
      finalizeFailed: finalizeInboundAutoreplyFailed,
      generateReply: generateInboundSupportReplyText,
      sendReply: sendPostmarkReply,
    },
  });

  return NextResponse.json(result.body, { status: result.status });
}
