import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { isRtVentilatorMarketingSurfacesEnabled } from "@/lib/rt-ventilator/rt-ventilator-module-config";

export const dynamic = "force-dynamic";

const META_KEYS = [
  "pages.rtVentilatorLanding.metaTitle",
  "pages.rtVentilatorLanding.metaDescription",
  "pages.rtVentilatorLanding.heroTitle",
  "pages.rtVentilatorLanding.heroLead",
  "pages.rtVentilatorLanding.previewPill",
  "pages.rtVentilatorLanding.ctaRtHub",
  "pages.rtVentilatorLanding.ctaSignIn",
  "pages.rtVentilatorLanding.domainsTitle",
  "pages.rtVentilatorLanding.domainsBody",
  "pages.rtVentilatorLanding.premiumNote",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...META_KEYS]);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/respiratory-therapy/ventilator-training");
      const title = m["pages.rtVentilatorLanding.metaTitle"]!;
      const description = m["pages.rtVentilatorLanding.metaDescription"]!;
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title,
          description,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    {
      pathname: "/respiratory-therapy/ventilator-training",
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.rt_ventilator_landing",
    },
  );
}

export default async function RtVentilatorMarketingLandingPage() {
  if (!isRtVentilatorMarketingSurfacesEnabled()) notFound();

  const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...META_KEYS]);

  return (
    <main
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
      data-nn-marketing-rt-ventilator-landing=""
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
        {m["pages.rtVentilatorLanding.previewPill"]}
      </div>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
        {m["pages.rtVentilatorLanding.heroTitle"]}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--theme-muted-text)]">{m["pages.rtVentilatorLanding.heroLead"]}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/allied/respiratory"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-primary-foreground)] shadow-md transition hover:opacity-95"
        >
          {m["pages.rtVentilatorLanding.ctaRtHub"]}
        </Link>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:bg-[var(--semantic-surface-alt)]"
        >
          {m["pages.rtVentilatorLanding.ctaSignIn"]}
        </Link>
      </div>

      <section className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{m["pages.rtVentilatorLanding.domainsTitle"]}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">{m["pages.rtVentilatorLanding.domainsBody"]}</p>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{m["pages.rtVentilatorLanding.premiumNote"]}</p>
    </main>
  );
}
