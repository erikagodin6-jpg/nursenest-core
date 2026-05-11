/**
 * SiteHeaderServer — Server Component wrapper for the marketing SiteHeader.
 *
 * Responsibilities:
 * 1. Pre-computes static nav link labels and hrefs server-side from i18n messages.
 * 2. Passes these as `precomputedNavData` to the client `SiteHeader` component.
 * 3. Establishes a clean server/client boundary so static nav labels are never
 *    recomputed by useMarketingI18n() hooks during client hydration.
 *
 * The existing SiteHeader client component is preserved in full — it still handles
 * all interactive behavior (auth, mobile menu, scroll shadow, theme, region, etc.).
 * This wrapper only eliminates the hook-computed static desktop nav labels.
 *
 * Architecture: Marketing layouts should use SiteHeaderServer instead of SiteHeader
 * directly. Non-marketing routes that don't have the message shards available can
 * still import SiteHeader directly (backward-compatible fallback path).
 */

import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { formatTitleCase } from "@/lib/format/text-case";
import { SiteHeader, type SiteHeaderProps, type SiteHeaderPrecomputedNav } from "@/components/layout/site-header";

/** Resolve a key from a flat messages record with a safe English fallback. */
function pick(messages: Record<string, string>, key: string, fallback: string): string {
  const v = messages[key]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/** Load nav + brand message shards from the filesystem (server-only path). */
async function loadNavMessagesSafe(locale: string): Promise<Record<string, string>> {
  try {
    const { loadMarketingMessageShards } = await import(
      "@/lib/marketing-i18n/load-marketing-messages"
    );
    return await loadMarketingMessageShards(locale, ["nav", "brand"]);
  } catch {
    return {};
  }
}

function localizeHref(locale: string, href: string): string {
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) return href;
    return withMarketingLocale(locale, href);
  } catch {
    return href;
  }
}

function buildPrecomputedNavData(
  messages: Record<string, string>,
  locale: string,
): SiteHeaderPrecomputedNav {
  const tr = (key: string, fallback: string) => pick(messages, key, fallback);

  return {
    locale,
    homeAriaLabel: tr("brand.homeAriaLabel", "NurseNest home"),
    loginLabel: formatTitleCase(tr("nav.logIn", "Log In"), locale),
    signupLabel: formatTitleCase(tr("nav.signup", "Start Free"), locale),
    moreLinks: [
      {
        key: "pricing",
        href: localizeHref(locale, HUB.pricing),
        matchBase: "/pricing",
        label: formatTitleCase(tr("nav.pricing", "Pricing"), locale),
      },
      {
        key: "about",
        href: localizeHref(locale, "/about"),
        matchBase: "/about",
        label: formatTitleCase(tr("nav.about", "About"), locale),
      },
      {
        key: "blog",
        href: localizeHref(locale, "/blog"),
        matchBase: "/blog",
        label: formatTitleCase(tr("footer.blog", "Blog"), locale),
      },
      {
        key: "faq",
        href: localizeHref(locale, "/faq"),
        matchBase: "/faq",
        label: formatTitleCase(tr("footer.faq", "FAQ"), locale),
      },
      {
        key: "pre-nursing",
        href: localizeHref(locale, "/pre-nursing"),
        matchBase: "/pre-nursing",
        label: formatTitleCase(tr("nav.preNursing", "Pre-Nursing"), locale),
      },
      {
        key: "tools",
        href: localizeHref(locale, HUB.tools),
        matchBase: HUB.tools,
        label: formatTitleCase(tr("nav.tools", "Tools"), locale),
      },
    ],
  };
}

/**
 * Server Component wrapper for the marketing header.
 *
 * Pre-computes static nav labels from the server-side i18n message cache
 * and passes them to the client SiteHeader. The client component uses these
 * labels directly for the static desktop "more links" row (Pricing, About,
 * Blog, FAQ, Pre-Nursing, Tools), reducing hook-computed string lookups
 * during hydration.
 */
export async function SiteHeaderServer({ serverHasStaffSession }: SiteHeaderProps = {}) {
  const locale = DEFAULT_MARKETING_LOCALE;
  const messages = await loadNavMessagesSafe(locale);
  const precomputedNavData = buildPrecomputedNavData(messages, locale);

  return (
    <SiteHeader
      serverHasStaffSession={serverHasStaffSession}
      precomputedNavData={precomputedNavData}
    />
  );
}
