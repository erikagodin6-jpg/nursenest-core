import Link from "next/link";
import { resolveMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  MARKETING_PRIMARY_CTA_COMPACT_CLASS,
  MARKETING_SECONDARY_CTA_COMPACT_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

export async function MarketingForInstitutionsPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const contactHref = resolveMarketingHref("/contact");
  const pricingHref = withMarketingLocale(locale, "/pricing");

  const offers = [
    m["pages.forInstitutions.offer1"],
    m["pages.forInstitutions.offer2"],
    m["pages.forInstitutions.offer3"],
    m["pages.forInstitutions.offer4"],
    m["pages.forInstitutions.offer5"],
  ];
  const audiences = [
    m["pages.forInstitutions.audience1"],
    m["pages.forInstitutions.audience2"],
    m["pages.forInstitutions.audience3"],
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <p className="nn-marketing-label nn-marketing-label--accent">{m["pages.forInstitutions.eyebrow"]}</p>
      <h1 className="nn-marketing-h1 mt-2">{m["pages.forInstitutions.h1"]}</h1>
      <p className="nn-marketing-body-sm mt-3 max-w-2xl text-muted">{m["pages.forInstitutions.intro"]}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="nn-card p-6">
          <h2 className="nn-marketing-h2">{m["pages.forInstitutions.sectionOffer"]}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
            {offers.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="nn-card p-6">
          <h2 className="nn-marketing-h2">{m["pages.forInstitutions.sectionAudience"]}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
            {audiences.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border pt-6">
            <p className="nn-marketing-h4">{m["pages.pricing.trust.guaranteeTitle"]}</p>
            <p className="mt-2 text-sm text-muted">{m["pages.pricing.trust.guaranteeBody"]}</p>
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] p-8">
        <h2 className="nn-marketing-h2">{m["pages.forInstitutions.sectionNext"]}</h2>
        <p className="mt-3 max-w-3xl text-muted">{m["pages.forInstitutions.nextBody"]}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={contactHref} className={MARKETING_PRIMARY_CTA_COMPACT_CLASS} rel="noopener noreferrer">
            {m["pages.forInstitutions.ctaContact"]}
          </a>
          <Link
            href={pricingHref}
            className={MARKETING_SECONDARY_CTA_COMPACT_CLASS}
          >
            {m["pages.forInstitutions.ctaPricing"]}
          </Link>
        </div>
      </section>
    </main>
  );
}
