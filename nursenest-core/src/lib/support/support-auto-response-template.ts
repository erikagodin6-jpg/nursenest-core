import { SUPPORT_RESPONSE_TIME_COPY } from "@/lib/support/support-policy";

export const SUPPORT_AUTO_RESPONSE_SUBJECT = "We received your NurseNest support request";

export type SupportAutoResponseVars = {
  /** "there" when name unknown */
  nameOrThere: string;
};

export function buildSupportAutoResponseSubject(): string {
  return SUPPORT_AUTO_RESPONSE_SUBJECT;
}

/**
 * Ready-to-send template for optional future ingestion pipelines.
 * Not wired to outbound mail unless a support inbox integration exists.
 */
export function buildSupportAutoResponseBody(vars: SupportAutoResponseVars): string {
  const who = vars.nameOrThere.trim() || "there";
  return [
    `Hi ${who},`,
    "",
    "Thanks for contacting NurseNest Support. We've received your message and our team will review it.",
    "",
    SUPPORT_RESPONSE_TIME_COPY,
    "",
    "If your request is about billing or subscriptions, you can also check your account billing page for available self-serve options.",
    "",
    "Thanks,",
    "NurseNest Support",
  ].join("\n");
}
