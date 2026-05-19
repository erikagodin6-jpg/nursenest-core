import Link from "next/link";

export type MarketingSimpleInfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  sections: Array<{
    title: string;
    body: string;
    bullets?: string[];
  }>;
};

export function MarketingSimpleInfoPage({
  eyebrow,
  title,
  description,
  primaryCta = { label: "Contact Support", href: "/contact" },
  secondaryCta = { label: "View Pricing", href: "/pricing" },
  sections,
}: MarketingSimpleInfoPageProps) {
  return (
    <main className="nn-marketing-x mx-auto w-full max-w-6xl py-16 sm:py-20">
      <section className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--theme-body-text)]">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryCta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-[var(--shadow-card)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-surface-alt)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]"
          >
            <h2 className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)]">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--theme-body-text)]">{section.body}</p>
            {section.bullets?.length ? (
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                {section.bullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
