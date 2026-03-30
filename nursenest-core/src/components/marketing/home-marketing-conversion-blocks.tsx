"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, LayoutDashboard, Stethoscope } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MARKETING_SCREENSHOT_SOURCES } from "@/lib/marketing-assets.generated";
import {
  ALLIED,
  HUB,
  NP,
  PN,
  RN,
  alliedHub,
  alliedQuestions,
  loginWithCallback,
  rnLessons,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";

type Props = {
  region: NursenestMarketingRegion;
};

export function HomeMarketingConversionBlocks({ region }: Props) {
  const { t, locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const dash = MARKETING_SCREENSHOT_SOURCES["screenshot2"];
  const qb = MARKETING_SCREENSHOT_SOURCES["screenshot6"];

  const faqKeys = ["1", "2", "3", "4", "5", "6"] as const;

  return (
    <>
      <section
        className="border-t border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-why-choosenest"
        aria-labelledby="why-choosenest-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2
            id="why-choosenest-heading"
            className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl"
          >
            {t("home.conversion.whyHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)] sm:text-base">{t("home.conversion.whySub")}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {(["why1", "why2", "why3", "why4"] as const).map((key) => (
              <li
                key={key}
                className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">{t(`home.conversion.${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{t(`home.conversion.${key}Body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-t border-[var(--theme-card-border)] bg-gradient-to-b from-[var(--theme-muted-surface)] to-[var(--theme-card-bg)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-platform-preview"
        aria-labelledby="platform-preview-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="platform-preview-heading" className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
            {t("home.conversion.previewHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)] sm:text-base">{t("home.conversion.previewSub")}</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {dash ? (
              <figure className="overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-card shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 border-b border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-2.5">
                  <LayoutDashboard className="h-4 w-4 text-primary" aria-hidden />
                  <figcaption className="text-xs font-semibold text-[var(--theme-heading-text)]">
                    {t("home.conversion.previewCaptionDash")}
                  </figcaption>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element -- external CDN srcSet; avoid remotePatterns churn */}
                <img
                  src={dash.fallback}
                  srcSet={dash.srcSet}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width={dash.width}
                  height={dash.height}
                  alt=""
                  className="h-auto w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ) : null}
            {qb ? (
              <figure className="overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-card shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 border-b border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-2.5">
                  <Stethoscope className="h-4 w-4 text-primary" aria-hidden />
                  <figcaption className="text-xs font-semibold text-[var(--theme-heading-text)]">
                    {t("home.conversion.previewCaptionBank")}
                  </figcaption>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qb.fallback}
                  srcSet={qb.srcSet}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width={qb.width}
                  height={qb.height}
                  alt=""
                  className="h-auto w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ) : null}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--theme-muted-text)] sm:text-left">
            <Link href={loc(HUB.signup)} className="font-semibold text-primary hover:underline">
              {t("home.conversion.previewSignupHint")}
            </Link>
          </p>
        </div>
      </section>

      <section
        className="border-t border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-pathway-cards"
        aria-labelledby="pathway-cards-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="pathway-cards-heading" className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
            {t("home.conversion.pathwaysHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)] sm:text-base">{t("home.conversion.pathwaysSub")}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PathwayCard
              badge="Canada"
              title="NCLEX-RN (Canada)"
              body="RN registration prep with Canadian-context stems, lessons, and timed sets."
              primary={{ label: "Open Canada RN questions", href: loc("/canada/rn/nclex-rn/questions") }}
              secondary={[
                { label: "RN lessons", href: loc("/canada/rn/nclex-rn/lessons") },
                { label: "Pathway hub", href: loc("/canada/rn/nclex-rn") },
              ]}
            />
            <PathwayCard
              badge="Canada"
              title="REx-PN (Practical nurse)"
              body="PN candidates: REx-PN-scoped banks and topic lessons—not a generic NCLEX-PN dump relabeled."
              primary={{ label: "Open REx-PN questions", href: loc("/canada/rpn/rex-pn/questions") }}
              secondary={[
                { label: "REx-PN lessons", href: loc("/canada/rpn/rex-pn/lessons") },
                { label: "REx-PN hub", href: loc(PN.caHub) },
              ]}
            />
            <PathwayCard
              badge="United States"
              title="NCLEX-RN"
              body="Next Gen-style clinical judgment practice with rationales tied to each option."
              primary={{ label: "Open US NCLEX-RN questions", href: loc("/us/rn/nclex-rn/questions") }}
              secondary={[
                { label: "RN lessons", href: loc("/us/rn/nclex-rn/lessons") },
                { label: "NCLEX-RN prep overview", href: loc(RN.practiceProgrammatic) },
              ]}
            />
            <PathwayCard
              badge="United States"
              title="NCLEX-PN (LVN/LPN)"
              body="Safety-first PN stems, lesson hubs, and a dedicated NCLEX-PN question route."
              primary={{ label: "Open NCLEX-PN questions", href: loc("/us/lpn/nclex-pn/questions") }}
              secondary={[
                { label: "PN lessons", href: loc("/us/lpn/nclex-pn/lessons") },
                { label: "PN hub", href: loc("/us/lpn/nclex-pn") },
              ]}
            />
            <PathwayCard
              badge="NP"
              title="Nurse practitioner"
              body="FNP and AGPCNP for US boards; Canadian NP uses the CNPLE hub when you are registering in Canada."
              primary={{
                label: region === "US" ? "Practice FNP questions" : "Open CNPLE questions",
                href: loc(region === "US" ? NP.fnpQuestions : NP.caNpQuestions),
              }}
              secondary={[
                { label: "NP prep overview", href: loc(NP.practiceProgrammatic) },
                { label: "FNP lessons", href: loc(NP.fnpLessons) },
                { label: "AGPCNP lessons", href: loc(NP.agpcnpLessons) },
                ...(region === "CA" ? [{ label: "CNPLE hub", href: loc(NP.caNpHub) }] : []),
              ]}
            />
            <PathwayCard
              badge="Allied"
              title="Allied health exams"
              body="Separate tier from nursing: browse careers, then hit the in-app bank for your exam family."
              primary={{ label: "Allied question bank", href: loc(alliedQuestions(region)) }}
              secondary={[
                { label: "Allied hub", href: loc(alliedHub(region)) },
                { label: "Careers overview", href: ALLIED.marketingLanding() },
              ]}
            />
          </ul>
        </div>
      </section>

      <section
        className="border-t border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-sample-content"
        aria-labelledby="sample-content-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="sample-content-heading" className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
            {t("home.conversion.sampleHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)] sm:text-base">{t("home.conversion.sampleSub")}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            <li>
              <Link
                href={loc(rnQuestions(region))}
                className="flex h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/35"
              >
                <span className="text-xs font-semibold uppercase text-primary">{t("home.conversion.sampleBank")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">
                  {region === "US" ? "NCLEX-RN question run" : "Canada RN question run"}
                </span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                  {t("home.conversion.sampleGo")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={loc(rnLessons(region))}
                className="flex h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/35"
              >
                <span className="text-xs font-semibold uppercase text-primary">{t("home.conversion.sampleLessons")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{t("home.conversion.sampleLessonsDesc")}</span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                  {t("home.conversion.sampleGo")}
                  <BookOpen className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={loc(loginWithCallback("/app/exams"))}
                className="flex h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/35"
              >
                <span className="text-xs font-semibold uppercase text-primary">{t("home.conversion.sampleTimed")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{t("home.conversion.sampleTimedDesc")}</span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                  {t("home.conversion.sampleSignIn")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section
        className="border-t border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-home-faq"
        aria-labelledby="home-faq-heading"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="home-faq-heading" className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
            {t("home.conversion.faqHeading")}
          </h2>
          <div className="mt-6 space-y-2">
            {faqKeys.map((n) => (
              <details
                key={n}
                className="group rounded-xl border border-[var(--theme-card-border)] bg-card px-4 py-3 shadow-sm open:shadow-[var(--shadow-card)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-[var(--theme-heading-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(`home.conversion.faq${n}q`)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-primary transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 border-t border-[var(--theme-card-border)] pt-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
                  {t(`home.conversion.faq${n}a`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-[var(--theme-card-border)] bg-gradient-to-br from-primary/12 via-[var(--theme-muted-surface)] to-[var(--theme-card-bg)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-final-cta"
        aria-labelledby="final-cta-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="final-cta-heading" className="text-2xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl">
            {t("home.conversion.finalTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--theme-body-text)] sm:text-base">{t("home.conversion.finalSub")}</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={loc(HUB.signup)}
              className="shadow-primary/25 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto sm:min-h-[56px] sm:text-lg"
            >
              {t("home.conversion.ctaSignup")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href={loc(HUB.pricing)}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[var(--theme-input-border)] bg-card px-8 py-3 text-base font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--theme-muted-surface)] sm:w-auto sm:min-h-[56px]"
            >
              {t("home.conversion.ctaPricing")}
            </Link>
            <Link
              href={loc(rnQuestions(region))}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:w-auto"
            >
              {t("home.conversion.ctaTryFree")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PathwayCard({
  badge,
  title,
  body,
  primary,
  secondary,
}: {
  badge: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string }[];
}) {
  return (
    <li className="flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-[var(--shadow-card)]">
      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{badge}</span>
      <h3 className="mt-1 text-base font-bold text-[var(--theme-heading-text)]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">{body}</p>
      <Link
        href={primary.href}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:w-auto"
      >
        {primary.label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
      <ul className="mt-3 space-y-1.5 border-t border-[var(--theme-card-border)] pt-3">
        {secondary.map((s) => (
          <li key={s.label}>
            <MarketingInlineLink href={s.href} className="text-xs font-medium text-primary hover:underline">
              {s.label}
            </MarketingInlineLink>
          </li>
        ))}
      </ul>
    </li>
  );
}

function MarketingInlineLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
