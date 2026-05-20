import Link from "next/link";
import { BookOpen, ClipboardList, Layers } from "lucide-react";

type TFn = (key: string) => string;

/**
 * Top-of-page conversion strip for all programmatic SEO articles: pathway lessons, question bank, CAT landing.
 */
export function ProgrammaticStudyHubBlock({
  lessonsHref,
  questionsHref,
  catHref,
  signupHref,
  loginHref,
  pricingHref,
  t,
}: {
  lessonsHref: string;
  questionsHref: string;
  catHref: string;
  signupHref: string;
  loginHref: string;
  pricingHref: string;
  t: TFn;
}) {
  const items = [
    { href: lessonsHref, labelKey: "programmatic.hub.cardLessons", descKey: "programmatic.hub.cardLessonsDesc", Icon: BookOpen },
    { href: questionsHref, labelKey: "programmatic.hub.cardQuestions", descKey: "programmatic.hub.cardQuestionsDesc", Icon: ClipboardList },
    { href: catHref, labelKey: "programmatic.hub.cardCat", descKey: "programmatic.hub.cardCatDesc", Icon: Layers },
  ] as const;

  return (
    <section
      className="mb-10 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.07] via-[var(--theme-card-bg)] to-emerald-600/[0.06] p-5 shadow-[var(--shadow-elevated)] sm:p-6"
      aria-labelledby="programmatic-study-hub-heading"
      data-testid="programmatic-study-hub"
    >
      <h2 id="programmatic-study-hub-heading" className="text-xs font-bold uppercase tracking-wider text-primary">
        {t("programmatic.hub.heading")}
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("programmatic.hub.sub")}</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map(({ href, labelKey, descKey, Icon }) => (
          <li key={labelKey}>
            <Link
              href={href}
              className="group flex h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 transition hover:border-primary/45 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden />
              <span className="mt-2 font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">{t(labelKey)}</span>
              <span className="mt-1 text-xs leading-snug text-muted-foreground">{t(descKey)}</span>
              <span className="mt-3 text-xs font-semibold text-primary">{t("programmatic.hub.open")} →</span>
            </Link>
          </li>
        ))}
      </ul>
      <nav
        className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-primary/15 pt-4 text-xs text-muted-foreground"
        aria-label={t("programmatic.hub.accountNavAria")}
      >
        <Link href={signupHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("programmatic.hub.footerSignup")}
        </Link>
        <span className="text-[var(--theme-body-text)]/30" aria-hidden>
          ·
        </span>
        <Link href={loginHref} className="font-medium underline-offset-2 hover:text-foreground hover:underline">
          {t("programmatic.hub.footerLogin")}
        </Link>
        <span className="text-[var(--theme-body-text)]/30" aria-hidden>
          ·
        </span>
        <Link href={pricingHref} className="font-medium underline-offset-2 hover:text-foreground hover:underline">
          {t("programmatic.hub.footerPricing")}
        </Link>
      </nav>
    </section>
  );
}
