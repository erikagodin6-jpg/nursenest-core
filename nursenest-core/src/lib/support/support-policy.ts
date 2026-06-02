import { supportEmail } from "@/lib/legal/legal-config";

/** Canonical support inbox (from `NEXT_PUBLIC_SUPPORT_EMAIL` when set). */
export const SUPPORT_EMAIL = supportEmail();

export const SUPPORT_RESPONSE_TIME_COPY = "Please allow up to 4 business days for a response.";

/** Single sentence for public surfaces (email + response window). */
export const SUPPORT_CONTACT_COPY = `Need help? Email ${SUPPORT_EMAIL}. ${SUPPORT_RESPONSE_TIME_COPY}`;

export function supportMailtoHref(): string {
  return `mailto:${encodeURIComponent(SUPPORT_EMAIL)}`;
}
