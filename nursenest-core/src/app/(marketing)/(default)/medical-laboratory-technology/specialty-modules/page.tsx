import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { isMltSpecialtyMarketingSurfacesEnabled } from "@/lib/mlt/mlt-premium-module-config";
import { MLT_PREMIUM_MODULE_DEFINITIONS } from "@/lib/mlt/mlt-premium-modules-registry";

export const revalidate = 1800; // 🧊 ISR: allied health lessons

const META_KEYS = [
  "pages.mltSpecialtyModulesLanding.metaTitle",
  "pages.mltSpecialtyModulesLanding.metaDescription",
  "pages.mltSpecialtyModulesLanding.heroTitle",
  "pages.mltSpecialtyModulesLanding.heroLead",
  "pages.mltSpecialtyModulesLanding.previewPill",
  "pages.mltSpecialtyModulesLanding.ctaMltHub",
  "pages.mltSpecialtyModulesLanding.ctaSignIn",
  "pages.mltSpecialtyModulesLanding.modulesSectionTitle",
  "pages.mltSpecialtyModulesLanding.domainsTitle",
  "pages.mltSpecialtyModulesLanding.domainsBody",
  "pages.mltSpecialtyModulesLanding.premiumNote",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...META_KEYS]);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/medical-laboratory-technology/specialty-modules");
      const title = m["pages.mltSpecialtyModulesLanding.metaTitle"]!;
      const description = m["pages.mltSpecialtyModulesLanding.metaDescription"]!;
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
      pathname: "/medical-laboratory-technology/specialty-modules",
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.mlt_specialty_modules_landing",
    },
  );
}

export default async function MltSpecialtyModulesMarketingLandingPage() {
  if (!isMltSpecialtyMarketingSurfacesEnabled()) notFound();

  const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...META_KEYS]);

  return (
    <main
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
      data-nn-marketing-mlt-specialty-landing=""
      data-testid="mlt-specialty-modules-marketing"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
        {m["pages.mltSpecialtyModulesLanding.previewPill"]}
      </div>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
        {m["pages.mltSpecialtyModulesLanding.heroTitle"]}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--theme-muted-text)]">{m["pages.mltSpecialtyModulesLanding.heroLead"]}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/allied/mlt"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-primary-foreground)] shadow-md transition hover:opacity-95"
        >
          {m["pages.mltSpecialtyModulesLanding.ctaMltHub"]}
        </Link>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:bg-[var(--semantic-surface-alt)]"
        >
          {m["pages.mltSpecialtyModulesLanding.ctaSignIn"]}
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{m["pages.mltSpecialtyModulesLanding.modulesSectionTitle"]}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {MLT_PREMIUM_MODULE_DEFINITIONS.map((mod) => (
            <li
              key={mod.id}
              className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
            >
              <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{mod.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">{mod.description}</p>
              <p className="mt-3 text-[11px] font-mono text-[var(--semantic-text-muted)]">{mod.bankTag}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{m["pages.mltSpecialtyModulesLanding.domainsTitle"]}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">{m["pages.mltSpecialtyModulesLanding.domainsBody"]}</p>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{m["pages.mltSpecialtyModulesLanding.premiumNote"]}</p>
    </main>
  );
}
