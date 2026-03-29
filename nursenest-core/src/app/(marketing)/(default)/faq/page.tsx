import { redirect } from "next/navigation";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

/**
 * Static `/faq` beats `[locale]` dynamic `/faq` (which would treat "faq" as a locale segment).
 * Canonical FAQ lives on the public marketing site until a Core FAQ page exists.
 */
export default function FaqRedirectPage() {
  redirect(mapLegacyMarketingHref("/faq"));
}
