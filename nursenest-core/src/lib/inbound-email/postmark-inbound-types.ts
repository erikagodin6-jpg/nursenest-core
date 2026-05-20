import { z } from "zod";

/** Postmark Inbound webhook JSON (subset we consume). @see https://postmarkapp.com/developer/webhooks/inbound-webhook */
export const postmarkInboundPayloadSchema = z.object({
  From: z.string().optional(),
  FromFull: z
    .object({
      Email: z.string().optional(),
      Name: z.string().optional(),
      MailboxHash: z.string().optional(),
    })
    .optional(),
  Subject: z.string().optional(),
  TextBody: z.string().optional(),
  HtmlBody: z.string().optional(),
  MessageID: z.string().optional(),
  OriginalRecipient: z.string().optional(),
  Headers: z
    .array(
      z.object({
        Name: z.string(),
        Value: z.string(),
      }),
    )
    .optional(),
});

export type PostmarkInboundPayload = z.infer<typeof postmarkInboundPayloadSchema>;

export type NormalizedInboundMessage = {
  fromEmail: string;
  fromDisplayName: string | null;
  subject: string;
  textBody: string;
  htmlBody: string;
  messageId: string | null;
  headers: { name: string; value: string }[];
};

const emailInAngleBrackets = /<([^>\s]+@[^>\s]+)>/;

function extractEmailFromFromField(from: string | undefined): string | null {
  if (!from?.trim()) return null;
  const m = from.match(emailInAngleBrackets);
  if (m?.[1]) return m[1].trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+$/.test(from.trim())) return from.trim().toLowerCase();
  return null;
}

function stripTagsToPlain(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePostmarkInboundPayload(raw: unknown): NormalizedInboundMessage | null {
  const parsed = postmarkInboundPayloadSchema.safeParse(raw);
  if (!parsed.success) return null;

  const p = parsed.data;
  const fromEmail =
    p.FromFull?.Email?.trim().toLowerCase() ||
    extractEmailFromFromField(p.From) ||
    null;
  if (!fromEmail) return null;

  const fromDisplayName = p.FromFull?.Name?.trim() || null;
  const subject = (p.Subject ?? "").trim();
  const textRaw = (p.TextBody ?? "").trim();
  const htmlRaw = (p.HtmlBody ?? "").trim();
  const textBody = textRaw.length > 0 ? textRaw : stripTagsToPlain(htmlRaw);

  const headers = (p.Headers ?? []).map((h) => ({ name: h.Name, value: h.Value }));

  return {
    fromEmail,
    fromDisplayName,
    subject,
    textBody,
    htmlBody: htmlRaw,
    messageId: p.MessageID?.trim() || null,
    headers,
  };
}
