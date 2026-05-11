import Link from "next/link";
import { notFound } from "next/navigation";
import { AdvancedEcgLaunchPurchaseSection } from "@/components/marketing/advanced-ecg-launch-purchase-section";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import {
  ADVANCED_ECG_MARKETING_PRIMARY_CTA,
  ADVANCED_ECG_MARKETING_SECONDARY_CTA,
  buildAdvancedEcgMarketingFaqJsonLd,
  getAdvancedEcgMarketingPageBySegments,
  type AdvancedEcgMarketingPage,
} from "@/lib/advanced-ecg/advanced-ecg-marketing-pages";
import {
  ADVANCED_ECG_MODULE_ROUTE,
  ADVANCED_ECG_MODULE_NAME,
  ADVANCED_ECG_PRICE_LABEL,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import { getAdvancedEcgCommercialLaunchState } from "@/lib/advanced-ecg/advanced-ecg-module-status";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { absoluteUrl } from "@/lib/seo/site-origin";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

function JsonLd({ value }: { value: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />;
}

function StripPreviewBoard({ page }: { page: AdvancedEcgMarketingPage }) {
  return (
    <div className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_24%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--semantic-info)]">Telemetry preview</p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--semantic-text-primary)]">{page.stripPreviewTitle}</h2>
        </div>
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-secondary)]">
          Clinician-reviewed
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] px-4 py-3"
          >
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[color-mix(in_srgb,var(--semantic-info)_18%,transparent)]" aria-hidden />
            <div className="relative flex items-center gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={`${row}-${index}`}
                  className="h-5 flex-1 rounded-full bg-[linear-gradient(90deg,transparent_0%,color-mix(in_srgb,var(--semantic-info)_76%,white)_28%,transparent_56%,color-mix(in_srgb,var(--semantic-warning)_72%,white)_82%,transparent_100%)] opacity-[0.88]"
                  style={{
                    clipPath:
                      index % 4 === 1
                        ? "polygon(0 60%, 25% 60%, 40% 10%, 54% 88%, 74% 60%, 100% 60%, 100% 100%, 0 100%)"
                        : index % 4 === 2
                          ? "polygon(0 54%, 18% 54%, 32% 18%, 48% 88%, 72% 54%, 100% 54%, 100% 100%, 0 100%)"
                          : "polygon(0 58%, 34% 58%, 42% 44%, 58% 68%, 100% 58%, 100% 100%, 0 100%)",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {page.stripPreviewItems.map((item) => (
          <div key={item} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketingLinkCard({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:border-[color-mix(in_srgb,var(--semantic-info)_32%,var(--semantic-border-soft))] hover:shadow-[var(--semantic-shadow-soft)]"
    >
      <strong className="block text-sm text-[var(--semantic-text-primary)]">{label}</strong>
      <span className="mt-2 block text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{description}</span>
    </Link>
  );
}

export async function AdvancedEcgMarketingPageView({
  locale,
  segments,
}: {
  locale: string;
  segments?: string[];
}) {
  const page = getAdvancedEcgMarketingPageBySegments(segments);
  if (!page) notFound();
  const launchState = await getAdvancedEcgCommercialLaunchState();

  const breadcrumbItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Advanced ECG", item: absoluteUrl("/advanced-ecg") },
    { name: page.h1, item: absoluteUrl(page.path) },
  ];
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Advanced ECG", href: "/advanced-ecg" },
    { name: page.h1, href: page.path },
  ];

  return (
    <main className="bg-[var(--semantic-canvas)] text-[var(--semantic-text-primary)]">
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: page.path,
          title: page.title,
          description: page.description,
        })}
      />
      <JsonLd value={buildAdvancedEcgMarketingFaqJsonLd(page)} />

      <section className="relative overflow-hidden border-b border-[var(--semantic-border-soft)] bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--semantic-info)_24%,transparent)_0%,transparent_48%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--semantic-brand)_20%,transparent)_0%,transparent_42%),linear-gradient(180deg,color-mix(in_srgb,var(--semantic-panel-cool)_32%,var(--semantic-canvas))_0%,var(--semantic-canvas)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <BreadcrumbBar crumbs={crumbs} schemaItems={breadcrumbItems} navClassName="mb-6" />
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] xl:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-info)]">{page.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-5xl">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
                {page.heroLead}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {page.heroMetrics.map((metric) => (
                  <span
                    key={metric}
                    className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]"
                  >
                    {metric}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={ADVANCED_ECG_MARKETING_PRIMARY_CTA.href} className={MARKETING_PRIMARY_CTA_CLASS}>
                  {ADVANCED_ECG_MARKETING_PRIMARY_CTA.label}
                </Link>
                <Link href={ADVANCED_ECG_MARKETING_SECONDARY_CTA.href} className={MARKETING_SECONDARY_CTA_CLASS}>
                  {ADVANCED_ECG_MARKETING_SECONDARY_CTA.label}
                </Link>
              </div>
              <p className="mt-4 text-sm text-[var(--semantic-text-secondary)]">
                {ADVANCED_ECG_PRICE_LABEL} one-time purchase. Includes full access to the Basic ECG curriculum. Kept separate from base subscriptions so the specialty lane stays clearly premium.
              </p>
            </div>

            <div className="rounded-[32px] border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--semantic-panel-cool)_44%,var(--semantic-surface))_0%,color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))_100%)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">Specialty module snapshot</p>
              <div className="mt-4 rounded-3xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-canvas)_72%,var(--semantic-panel-cool))] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{ADVANCED_ECG_MODULE_NAME}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
                      {ADVANCED_ECG_PRICE_LABEL} lifetime access
                    </p>
                    <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
                      Dedicated learner route with telemetry, 12-lead, ACLS, and paced-strip tracks.
                    </p>
                  </div>
                  <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
                    Premium
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Telemetry", tone: "var(--semantic-info)" },
                    { label: "12-lead", tone: "var(--semantic-warning)" },
                    { label: "Pacemakers", tone: "var(--semantic-success)" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3"
                    >
                      <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: item.tone }} />
                      <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-primary)]">{item.label}</p>
                      <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">Clinically framed preview lane</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <section className="rounded-[28px] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">Curriculum</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">{page.curriculumTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{page.curriculumBody}</p>
            <div className="mt-6 grid gap-3">
              {page.curriculumItems.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_05%,var(--semantic-surface))] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]"
                >
                  {item}
                </article>
              ))}
            </div>
          </section>

          <StripPreviewBoard page={page} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-warning)]">Trust and positioning</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">{page.proofTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{page.proofBody}</p>
            <ul className="mt-5 grid gap-3">
              {page.proofItems.map((item) => (
                <li key={item} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_50%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-success)]">Learner outcomes</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">{page.outcomeTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{page.outcomeBody}</p>
            <ul className="mt-5 grid gap-3">
              {page.outcomeItems.map((item) => (
                <li key={item} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-info)]">Who this is for</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">Built for telemetry learners who want specialty-level rhythm confidence</h2>
            <ul className="mt-5 grid gap-3">
              {[
                "RN and NP learners who already know the basics and want stronger telemetry, 12-lead, ACLS, and paced-rhythm recognition.",
                "Critical-care, stepdown, emergency, and monitor-heavy learners who want repetition with clearer escalation framing.",
                "Learners who want one connected ECG pathway instead of bouncing between intro lessons and scattered reference sheets.",
              ].map((item) => (
                <li key={item} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-warning)]">Who it is not for</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">Not positioned as a generic bundle add-on or a beginner-only ECG primer</h2>
            <ul className="mt-5 grid gap-3">
              {[
                "Learners looking for a base exam subscription replacement. This module is a separate specialty purchase.",
                "PN, RPN, Allied, and New Grad tracks expecting default inclusion inside their base plan today.",
                "Students who only want a lightweight intro deck without specialty telemetry, 12-lead, ACLS, or pacemaker depth.",
              ].map((item) => (
                <li key={item} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-[28px] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-info)]">Learner access proof</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">How ownership and access actually work</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              The public launch path, checkout path, and learner path all point at the same specialty product: {ADVANCED_ECG_MODULE_NAME}.
            </p>
          </div>
          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-[24px] border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">Ownership rules</p>
              <ul className="mt-4 grid gap-3">
                {[
                  `${ADVANCED_ECG_PRICE_LABEL} one-time purchase for the Advanced ECG specialty lane.`,
                  "Base learner access is still required for the ECG ecosystem, with RN / NP eligibility enforced on the server.",
                  `Learner ownership resolves on the dedicated route at ${ADVANCED_ECG_MODULE_ROUTE}.`,
                ].map((item) => (
                  <li key={item} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {page.internalLinks.map((link) => (
                <MarketingLinkCard key={link.href} {...link} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">Common questions before buying</h2>
          <div className="mt-6 grid gap-4">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <AdvancedEcgLaunchPurchaseSection
          locale={locale}
          checkoutEnabled={launchState.canSellPublicly}
          disabledMessage={launchState.canSellPublicly ? null : launchState.publicMessage}
        />
      </div>
    </main>
  );
}
