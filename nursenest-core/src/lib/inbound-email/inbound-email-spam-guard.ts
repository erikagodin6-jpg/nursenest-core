import type { NormalizedInboundMessage } from "@/lib/inbound-email/postmark-inbound-types";

const AUTO_SUBMITTED = /auto-submitted|auto-generated|auto-replied/i;
const PRECEDENCE_BULK = /^bulk$|^junk$|^list$/i;

function headerValue(headers: { name: string; value: string }[], name: string): string | null {
  const h = headers.find((x) => x.name.toLowerCase() === name.toLowerCase());
  return h?.value?.trim() || null;
}

/**
 * Drop obvious noise: empty bodies, system senders, auto-replies.
 * Conservative — when unsure, allow through and let humans triage from logs.
 */
export function shouldIgnoreInboundAsSpam(msg: NormalizedInboundMessage): { ignore: true; reason: string } | { ignore: false } {
  const combined = `${msg.textBody}\n${msg.htmlBody}`.trim();
  if (combined.length < 4) {
    return { ignore: true, reason: "empty_or_trivial_body" };
  }

  const local = msg.fromEmail.split("@")[0]?.toLowerCase() ?? "";
  const domain = msg.fromEmail.split("@")[1]?.toLowerCase() ?? "";
  if (
    local === "mailer-daemon" ||
    local === "postmaster" ||
    local.startsWith("noreply") ||
    local.startsWith("no-reply") ||
    local === "donotreply" ||
    local === "bounce"
  ) {
    return { ignore: true, reason: "system_or_noreply_sender" };
  }

  // Heuristic: disposable-ish local parts (not exhaustive)
  if (/^bounces?\+/i.test(local) || /^feedback-id$/i.test(local)) {
    return { ignore: true, reason: "bounce_or_feedback_address" };
  }

  if (!domain || !domain.includes(".")) {
    return { ignore: true, reason: "invalid_domain" };
  }

  const autoSub = headerValue(msg.headers, "Auto-Submitted");
  if (autoSub && AUTO_SUBMITTED.test(autoSub)) {
    return { ignore: true, reason: "auto_submitted_header" };
  }

  const precedence = headerValue(msg.headers, "Precedence");
  if (precedence && PRECEDENCE_BULK.test(precedence)) {
    return { ignore: true, reason: "precedence_bulk_or_list" };
  }

  const xAuto = headerValue(msg.headers, "X-Auto-Response-Suppress");
  if (xAuto && /all|dr|autoreply|autorespond/i.test(xAuto)) {
    return { ignore: true, reason: "x_auto_response_suppress" };
  }

  return { ignore: false };
}
