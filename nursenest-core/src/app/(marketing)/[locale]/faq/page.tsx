import { redirect } from "next/navigation";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

/**
 * Without this route, `/[locale]/faq` would fall through to `[locale]/[slug]` and 404
 * (no programmatic SEO page for `faq`). Mirror the default-locale FAQ redirect.
 */
export default function LocaleFaqRedirectPage() {
  redirect(mapLegacyMarketingHref("/faq"));
}
