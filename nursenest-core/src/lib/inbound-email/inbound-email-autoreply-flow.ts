import { generateInboundSupportReplyText } from "@/lib/inbound-email/generate-inbound-support-reply";
import { inboundEmailContentRequiresManualReview } from "@/lib/inbound-email/inbound-email-manual-review-guard";
import { shouldIgnoreInboundAsSpam } from "@/lib/inbound-email/inbound-email-spam-guard";
import type { PostmarkSendResult } from "@/lib/inbound-email/postmark-outbound";
import { sendPostmarkReply } from "@/lib/inbound-email/postmark-outbound";
import type { NormalizedInboundMessage } from "@/lib/inbound-email/postmark-inbound-types";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

export function logMetaForInbound(msg: { fromEmail: string; subject: string }) {
  const at = msg.fromEmail.indexOf("@");
  const domain = at > 0 ? msg.fromEmail.slice(at + 1) : "";
  return {
    fromDomain: domain.slice(0, 64),
    subjectLen: msg.subject.length,
  };
}

export type InboundAutoreplyFlowDeps = {
  reserve: (args: { messageId: string; senderEmail: string; subject: string }) => Promise<"reserved" | "duplicate">;
  finalizeSkipped: (messageId: string, detail: string) => Promise<void>;
  finalizeReplied: (messageId: string, args: { outboundMessageId: string }) => Promise<void>;
  finalizeFailed: (messageId: string, detail: string) => Promise<void>;
  generateReply: typeof generateInboundSupportReplyText;
  sendReply: typeof sendPostmarkReply;
};

export type InboundAutoreplyFlowInput = {
  msg: NormalizedInboundMessage;
  autoReplyEnabled: boolean;
  postmarkToken: string | null;
  openAiConfigured: boolean;
  outboundFrom: string;
  supportEmail: string;
  databaseConfigured: boolean;
  deps: InboundAutoreplyFlowDeps;
};

export type InboundAutoreplyFlowResult = { status: number; body: Record<string, unknown> };

/**
 * Core inbound → reserve → optional OpenAI + Postmark. Caller handles webhook auth and JSON parse.
 * Self-address and spam return before DB; idempotency applies after those checks when `messageId` is present.
 */
export async function processInboundEmailAutoreplyFlow(input: InboundAutoreplyFlowInput): Promise<InboundAutoreplyFlowResult> {
  const { msg, autoReplyEnabled, postmarkToken, openAiConfigured, outboundFrom, supportEmail, databaseConfigured, deps } =
    input;
  const meta = logMetaForInbound(msg);

  if (msg.fromEmail.toLowerCase() === supportEmail.toLowerCase()) {
    safeServerLog("inbound_email", "skipped_loop_self_address", meta);
    return { status: 200, body: { ok: true, skipped: true, reason: "loop_self_address" } };
  }

  const spam = shouldIgnoreInboundAsSpam(msg);
  if (spam.ignore) {
    safeServerLog("inbound_email", "skipped_spam", { ...meta, reason: spam.reason });
    return { status: 200, body: { ok: true, skipped: true, reason: spam.reason } };
  }

  const messageId = msg.messageId?.trim();
  if (!messageId) {
    safeServerLog("inbound_email", "skipped_missing_message_id", meta);
    return { status: 200, body: { ok: true, skipped: true, reason: "missing_message_id" } };
  }

  if (!databaseConfigured) {
    safeServerLog("inbound_email", "database_unavailable", meta);
    return { status: 503, body: { error: "Not configured" } };
  }

  const slot = await deps.reserve({
    messageId,
    senderEmail: msg.fromEmail,
    subject: msg.subject,
  });
  if (slot === "duplicate") {
    safeServerLog("inbound_email", "skipped_duplicate_message_id", { ...meta, messageIdPrefix: messageId.slice(0, 24) });
    return { status: 200, body: { ok: true, skipped: true, reason: "duplicate" } };
  }

  const manualReview = inboundEmailContentRequiresManualReview(msg);
  if (manualReview.required) {
    await deps.finalizeSkipped(messageId, "requires_manual_review");
    safeServerLog("inbound_email", "skipped_requires_manual_review", {
      ...meta,
      matchedKeyword: manualReview.matched ?? "",
    });
    return { status: 200, body: { ok: true, skipped: true, reason: "requires_manual_review" } };
  }

  if (!autoReplyEnabled) {
    await deps.finalizeSkipped(messageId, "auto_reply_disabled");
    safeServerLog("inbound_email", "skipped_auto_reply_disabled", meta);
    return { status: 200, body: { ok: true, skipped: true, reason: "auto_reply_disabled" } };
  }

  if (!postmarkToken) {
    await deps.finalizeFailed(messageId, "missing_postmark_api_token");
    safeServerLog("inbound_email", "missing_postmark_api_token");
    return { status: 503, body: { error: "Not configured" } };
  }

  if (!openAiConfigured) {
    await deps.finalizeFailed(messageId, "missing_openai_api_key");
    safeServerLog("inbound_email", "missing_openai_api_key");
    return { status: 503, body: { error: "Not configured" } };
  }

  try {
    const replyText = await deps.generateReply(msg);
    const send: PostmarkSendResult = await deps.sendReply({
      apiToken: postmarkToken,
      inboundMessageId: msg.messageId,
      to: msg.fromEmail,
      originalSubject: msg.subject,
      replyText,
      from: outboundFrom,
    });

    if (!send.ok) {
      await deps.finalizeFailed(messageId, `postmark_send_failed:${send.status}:${send.error.slice(0, 500)}`);
      safeServerLogCritical(
        "inbound_email",
        "postmark_send_failed",
        { ...meta, httpStatus: send.status },
        send.error,
        { flow: "inbound_email" },
      );
      return { status: 502, body: { ok: false, error: "postmark_send_failed" } };
    }

    await deps.finalizeReplied(messageId, { outboundMessageId: send.messageId });
    safeServerLog("inbound_email", "reply_sent", {
      ...meta,
      postmarkMessageIdPrefix: send.messageId.slice(0, 12),
    });
    return {
      status: 200,
      body: { ok: true, postmarkMessageIdPrefix: send.messageId.slice(0, 12) },
    };
  } catch (e) {
    await deps.finalizeFailed(messageId, e instanceof Error ? e.message.slice(0, 2000) : String(e).slice(0, 2000));
    safeServerLogCritical("inbound_email", "handler_failed", meta, e, { flow: "inbound_email" });
    return { status: 500, body: { ok: false, error: "internal_error" } };
  }
}
