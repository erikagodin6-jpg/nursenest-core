import Link from "next/link";
import { TRUST_BLOCK } from "@/lib/conversion/pricing-catalog";
import { resolveMarketingHref } from "@/lib/legacy-marketing-routes";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

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
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Institutional</p>
      <h1 className="mt-2 text-4xl font-bold">{m["pages.forInstitutions.h1"]}</h1>
      <p className="mt-3 max-w-2xl text-muted">{m["pages.forInstitutions.intro"]}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="nn-card p-6">
          <h2 className="text-xl font-bold">{m["pages.forInstitutions.sectionOffer"]}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
            {offers.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="nn-card p-6">
          <h2 className="text-xl font-bold">{m["pages.forInstitutions.sectionAudience"]}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
            {audiences.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-sm font-semibold">{TRUST_BLOCK.guaranteeTitle}</p>
            <p className="mt-2 text-sm text-muted">{TRUST_BLOCK.guaranteeBody}</p>
          </div>
        </section>
      </div>

      <section className="mt-10 nn-card bg-gradient-to-br from-primary/10 to-primary/5 p-8">
        <h2 className="text-xl font-bold">{m["pages.forInstitutions.sectionNext"]}</h2>
        <p className="mt-3 max-w-3xl text-muted">{m["pages.forInstitutions.nextBody"]}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={contactHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            rel="noopener noreferrer"
          >
            {m["pages.forInstitutions.ctaContact"]}
          </a>
          <Link
            href={pricingHref}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/80"
          >
            {m["pages.forInstitutions.ctaPricing"]}
          </Link>
        </div>
      </section>
    </main>
  );
}
