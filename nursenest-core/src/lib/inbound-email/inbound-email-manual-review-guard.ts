/**
 * Inbound support messages that match these substrings (case-insensitive) in subject or body
 * must not receive an automated AI reply — ops handles manually.
 */
export const INBOUND_EMAIL_MANUAL_REVIEW_SUBSTRINGS = [
  "refund",
  "charge",
  "billing",
  "cancel",
  "subscription",
  "legal",
  "complaint",
] as const;

export type InboundManualReviewCheck = {
  required: boolean;
  /** First matched keyword (lowercase), for logs only. */
  matched: string | null;
};

export function inboundEmailContentRequiresManualReview(msg: { subject: string; textBody: string }): InboundManualReviewCheck {
  const haystack = `${msg.subject}\n${msg.textBody}`.toLowerCase();
  for (const word of INBOUND_EMAIL_MANUAL_REVIEW_SUBSTRINGS) {
    if (haystack.includes(word)) {
      return { required: true, matched: word };
    }
  }
  return { required: false, matched: null };
}
