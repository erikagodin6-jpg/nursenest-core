import { SUPPORT_EMAIL } from "@/lib/support/support-policy";

const POSTMARK_API = "https://api.postmarkapp.com/email";

export type PostmarkSendResult =
  | { ok: true; messageId: string; submittedAt: string }
  | { ok: false; status: number; error: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Turn plain text into simple, email-safe HTML paragraphs. */
export function plainTextToEmailHtml(text: string): string {
  const blocks = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (blocks.length === 0) return `<p></p>`;
  return blocks.map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`).join("\n");
}

function buildReplySubject(originalSubject: string): string {
  const s = originalSubject.trim() || "Your message";
  if (/^re:\s/i.test(s)) return s;
  return `Re: ${s}`;
}

function formatInReplyTo(messageId: string | null): { name: string; value: string }[] | undefined {
  if (!messageId?.trim()) return undefined;
  const id = messageId.includes("<") ? messageId.trim() : `<${messageId.trim()}>`;
  return [
    { name: "In-Reply-To", value: id },
    { name: "References", value: id },
  ];
}

export async function sendPostmarkReply(params: {
  apiToken: string;
  inboundMessageId: string | null;
  to: string;
  originalSubject: string;
  replyText: string;
  /** Verified From in Postmark (defaults to SUPPORT_EMAIL). */
  from?: string;
}): Promise<PostmarkSendResult> {
  const from = params.from?.trim() || SUPPORT_EMAIL;
  const subject = buildReplySubject(params.originalSubject);
  const textBody = params.replyText;
  const htmlBody = plainTextToEmailHtml(params.replyText);
  const headers = formatInReplyTo(params.inboundMessageId);

  const body: Record<string, unknown> = {
    From: from,
    To: params.to,
    Subject: subject,
    TextBody: textBody,
    HtmlBody: htmlBody,
    MessageStream: "outbound",
    TrackOpens: false,
    TrackLinks: "None",
  };
  if (headers?.length) {
    body.Headers = headers;
  }

  const res = await fetch(POSTMARK_API, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": params.apiToken,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let data: { MessageID?: string; SubmittedAt?: string; ErrorCode?: number; Message?: string } = {};
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    /* handled below */
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: data.Message || raw.slice(0, 400) || `HTTP ${res.status}`,
    };
  }

  const mid = data.MessageID?.trim();
  if (!mid) {
    return { ok: false, status: res.status, error: "Postmark response missing MessageID" };
  }

  return {
    ok: true,
    messageId: mid,
    submittedAt: data.SubmittedAt ?? "",
  };
}
