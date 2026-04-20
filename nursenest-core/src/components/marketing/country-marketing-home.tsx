import Link from "next/link";
import type { CountryCode } from "@/lib/marketing/countries/types";
import type { CountryHomepageContent } from "@/lib/marketing/countries/types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

type Props = {
  country: CountryCode;
  content: CountryHomepageContent;
};

export function CountryMarketingHome({ country, content }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="max-w-3xl">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{content.brandLine}</p>
        <h1 className="nn-marketing-h1 mt-3 text-balance">{content.headline}</h1>
        <p className="nn-marketing-body mt-4 max-w-2xl text-pretty text-[var(--semantic-text-muted)]">{content.subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={content.primaryCta.href}
            className="nn-nav-cta inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {content.primaryCta.label}
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,transparent)]"
          >
            {content.secondaryCta.label}
          </Link>
        </div>
      </header>

      <section className="mt-14" aria-labelledby={`pathways-${country}`}>
        <h2 id={`pathways-${country}`} className="nn-marketing-h2 text-balance">
          Choose your pathway
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {content.pathwayCards.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_22%,var(--surface-base))] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
              >
                <span className="text-base font-semibold text-[var(--theme-heading-text)]">{card.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-muted)]">{card.description}</span>
                <span className="mt-4 text-sm font-semibold text-[var(--semantic-brand)]">Open hub →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-label="Trust highlights">
        <ul className="flex flex-wrap gap-3">
          {content.proofStrip.map((line) => (
            <li
              key={line}
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,transparent)] px-4 py-2 text-sm font-medium text-[var(--theme-heading-text)]"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby={`tools-${country}`}>
        <h2 id={`tools-${country}`} className="nn-marketing-h2">
          Featured exam tools
        </h2>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
          <li>
            <Link className="text-[var(--semantic-brand)] underline-offset-4 hover:underline" href={HUB.questionBank}>
              Question bank
            </Link>
          </li>
          <li>
            <Link className="text-[var(--semantic-info)] underline-offset-4 hover:underline" href={HUB.practiceExams}>
              Practice exams
            </Link>
          </li>
          <li>
            <Link className="text-[var(--semantic-success)] underline-offset-4 hover:underline" href={HUB.flashcards}>
              Flashcards
            </Link>
          </li>
          <li>
            <Link className="text-[var(--semantic-chart-3)] underline-offset-4 hover:underline" href={HUB.examLessons}>
              Lessons index
            </Link>
          </li>
        </ul>
      </section>

      {content.crossBorderCta ? (
        <section className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--surface-base))] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{content.crossBorderCta.title}</h2>
          <Link
            href={content.crossBorderCta.href}
            className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            {content.crossBorderCta.label}
          </Link>
        </section>
      ) : null}

      <section className="mt-14 text-center">
        <Link href={content.primaryCta.href} className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold">
          {content.primaryCta.label}
        </Link>
      </section>
    </div>
  );
}
