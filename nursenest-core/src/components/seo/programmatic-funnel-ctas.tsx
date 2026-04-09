import Link from "next/link";
import { ArrowRight } from "lucide-react";

type TFn = (key: string) => string;

/** Mid-article conversion band after the first content section. */
export function ProgrammaticMidPagePracticeCta({
  questionsHref,
  pricingHref,
  signupHref,
  t,
}: {
  questionsHref: string;
  pricingHref: string;
  signupHref: string;
  t: TFn;
}) {
  return (
    <aside
      className="my-10 rounded-2xl border border-role-cta/30 bg-gradient-to-r from-role-cta-soft/80 to-primary/[0.06] px-5 py-8 text-center sm:px-8"
      aria-label={t("programmatic.midCta.aria")}
      data-testid="programmatic-mid-cta"
    >
      <p className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("programmatic.midCta.title")}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{t("programmatic.midCta.sub")}</p>
      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Link
          href={questionsHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-role-cta px-6 py-3 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover"
        >
          {t("programmatic.midCta.primary")}
          <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <Link
          href={signupHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
        >
          {t("programmatic.midCta.secondary")}
        </Link>
        <Link href={pricingHref} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
          {t("programmatic.midCta.tertiary")}
        </Link>
      </div>
    </aside>
  );
}

/** Strong closing funnel before related links. */
export function ProgrammaticFinalFunnelCta({
  questionsHref,
  signupHref,
  pricingHref,
  t,
}: {
  questionsHref: string;
  signupHref: string;
  pricingHref: string;
  t: TFn;
}) {
  return (
    <section
      className="mt-14 rounded-2xl border-2 border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-6 sm:p-8"
      aria-labelledby="programmatic-final-funnel-heading"
      data-testid="programmatic-final-cta"
    >
      <h2 id="programmatic-final-funnel-heading" className="text-xl font-semibold text-[var(--theme-heading-text)]">
        {t("programmatic.finalCta.title")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("programmatic.finalCta.sub")}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={questionsHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] sm:min-w-[200px]"
        >
          {t("programmatic.finalCta.primary")}
        </Link>
        <Link
          href={signupHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-primary/35 bg-card px-5 py-2.5 text-sm font-semibold text-primary sm:min-w-[200px]"
        >
          {t("programmatic.finalCta.secondary")}
        </Link>
        <Link
          href={pricingHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-card px-5 py-2.5 text-sm font-semibold text-[var(--theme-body-text)] sm:min-w-[160px]"
        >
          {t("programmatic.finalCta.pricing")}
        </Link>
      </div>
    </section>
  );
}
