"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, LayoutDashboard, Stethoscope } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MARKETING_SCREENSHOT_SOURCES } from "@/lib/marketing-assets.generated";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
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
                <div
                  className="relative w-full bg-[var(--theme-muted-surface)]"
                  style={{ aspectRatio: `${dash.width} / ${dash.height}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- external CDN srcSet; avoid remotePatterns churn */}
                  <img
                    src={dash.fallback}
                    srcSet={dash.srcSet}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    width={dash.width}
                    height={dash.height}
                    alt={t("home.conversion.previewCaptionDash")}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
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
                <div
                  className="relative w-full bg-[var(--theme-muted-surface)]"
                  style={{ aspectRatio: `${qb.width} / ${qb.height}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qb.fallback}
                    srcSet={qb.srcSet}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    width={qb.width}
                    height={qb.height}
                    alt={t("home.conversion.previewCaptionBank")}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            ) : null}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--theme-muted-text)] sm:text-left">
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomePreviewSignupHint}
              className="font-semibold text-primary hover:underline"
            >
              {t("home.conversion.previewSignupHint")}
            </MarketingTrackedLink>
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
              pathwayKey="ca_rn"
              badge="Canada"
              title="NCLEX-RN (Canada)"
              body="RN registration prep: Canadian-context stems, lessons, and timed sets on the Canada NCLEX-RN route."
              primary={{ label: "Open Canada RN questions", href: loc("/canada/rn/nclex-rn/questions") }}
              secondary={[
                { label: "RN lessons", href: loc("/canada/rn/nclex-rn/lessons") },
                { label: "Pathway hub", href: loc("/canada/rn/nclex-rn") },
              ]}
            />
            <PathwayCard
              pathwayKey="ca_rex_pn"
              badge="Canada"
              title="REx-PN (Practical nurse)"
              body="Built for REx-PN: PN-scoped banks and topic lessons, not a relabeled US NCLEX-PN mix."
              primary={{ label: "Open REx-PN questions", href: loc("/canada/rpn/rex-pn/questions") }}
              secondary={[
                { label: "REx-PN lessons", href: loc("/canada/rpn/rex-pn/lessons") },
                { label: "REx-PN hub", href: loc(PN.caHub) },
              ]}
            />
            <PathwayCard
              pathwayKey="us_rn"
              badge="United States"
              title="NCLEX-RN"
              body="Clinical judgment practice with rationales for every option, aligned to the US NCLEX-RN hub."
              primary={{ label: "Open US NCLEX-RN questions", href: loc("/us/rn/nclex-rn/questions") }}
              secondary={[
                { label: "RN lessons", href: loc("/us/rn/nclex-rn/lessons") },
                { label: "NCLEX-RN prep overview", href: loc(RN.practiceProgrammatic) },
              ]}
            />
            <PathwayCard
              pathwayKey="us_nclex_pn"
              badge="United States"
              title="NCLEX-PN (LVN/LPN)"
              body="PN-level safety and pharmacology stems with lesson hubs on the US NCLEX-PN route."
              primary={{ label: "Open NCLEX-PN questions", href: loc("/us/lpn/nclex-pn/questions") }}
              secondary={[
                { label: "PN lessons", href: loc("/us/lpn/nclex-pn/lessons") },
                { label: "PN hub", href: loc("/us/lpn/nclex-pn") },
              ]}
            />
            <PathwayCard
              pathwayKey="np"
              badge="NP"
              title="Nurse practitioner"
              body="US: FNP and AGPCNP each have their own lessons and banks. Canada: CNPLE hub for national NP registration prep."
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
              pathwayKey="allied"
              badge="Allied"
              title="Allied health exams"
              body="Separate tier from nursing: start with your regional question bank and hub; use the careers brochure to scan supported certifications."
              primary={{ label: "Allied question bank", href: loc(alliedQuestions(region)) }}
              secondary={[
                { label: "Allied hub", href: loc(alliedHub(region)) },
                { label: "Supported careers (brochure)", href: ALLIED.marketingLanding(), external: true },
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
              <MarketingTrackedLink
                href={loc(rnQuestions(region))}
                event={PH.marketingHomeSampleContentClick}
                eventProps={{ sample: "question_bank", region }}
                className="flex h-full min-h-[8.5rem] flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/35 sm:min-h-0"
              >
                <span className="text-xs font-semibold uppercase text-primary">{t("home.conversion.sampleBank")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">
                  {region === "US" ? "NCLEX-RN question run" : "Canada RN question run"}
                </span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                  {t("home.conversion.sampleGo")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </MarketingTrackedLink>
            </li>
            <li>
              <MarketingTrackedLink
                href={loc(rnLessons(region))}
                event={PH.marketingHomeSampleContentClick}
                eventProps={{ sample: "lessons", region }}
                className="flex h-full min-h-[8.5rem] flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/35 sm:min-h-0"
              >
                <span className="text-xs font-semibold uppercase text-primary">{t("home.conversion.sampleLessons")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{t("home.conversion.sampleLessonsDesc")}</span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                  {t("home.conversion.sampleGo")}
                  <BookOpen className="ml-1 h-3.5 w-3.5" />
                </span>
              </MarketingTrackedLink>
            </li>
            <li>
              <MarketingTrackedLink
                href={loc(loginWithCallback("/app/exams"))}
                event={PH.marketingHomeSampleContentClick}
                eventProps={{ sample: "timed_exams_login", region }}
                className="flex h-full min-h-[8.5rem] flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/35 sm:min-h-0"
              >
                <span className="text-xs font-semibold uppercase text-primary">{t("home.conversion.sampleTimed")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{t("home.conversion.sampleTimedDesc")}</span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                  {t("home.conversion.sampleSignIn")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </MarketingTrackedLink>
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
          <div className="mt-6 space-y-3 sm:space-y-2">
            {faqKeys.map((n) => (
              <details
                key={n}
                className="group rounded-xl border border-[var(--theme-card-border)] bg-card px-4 py-3.5 shadow-sm open:shadow-[var(--shadow-card)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold leading-snug text-[var(--theme-heading-text)] marker:content-none [&::-webkit-details-marker]:hidden">
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
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "signup" }}
              className="shadow-primary/25 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto sm:min-h-[56px] sm:min-w-[200px] sm:text-lg"
            >
              {t("home.conversion.ctaSignup")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(HUB.pricing)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "pricing" }}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[var(--theme-input-border)] bg-card px-8 py-3 text-base font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--theme-muted-surface)] sm:w-auto sm:min-h-[56px] sm:min-w-[200px]"
            >
              {t("home.conversion.ctaPricing")}
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(rnQuestions(region))}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "try_rn_questions", region }}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:w-auto sm:min-h-[52px]"
            >
              {t("home.conversion.ctaTryFree")}
            </MarketingTrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}

function PathwayCard({
  pathwayKey,
  badge,
  title,
  body,
  primary,
  secondary,
}: {
  pathwayKey: string;
  badge: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <li className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-[var(--shadow-card)]">
      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{badge}</span>
      <h3 className="mt-1 text-base font-bold text-[var(--theme-heading-text)]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">{body}</p>
      <MarketingTrackedLink
        href={primary.href}
        event={PH.marketingHomePathwayCardPrimary}
        eventProps={{ pathway_key: pathwayKey }}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:w-auto"
      >
        {primary.label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </MarketingTrackedLink>
      <ul className="mt-3 space-y-1.5 border-t border-[var(--theme-card-border)] pt-3">
        {secondary.map((s) => (
          <li key={s.label}>
            <MarketingInlineLink
              href={s.href}
              className="text-xs font-medium text-primary hover:underline"
              pathwayKey={pathwayKey}
              linkLabel={s.label}
              external={s.external}
            >
              {s.label}
            </MarketingInlineLink>
          </li>
        ))}
      </ul>
    </li>
  );
}

function MarketingInlineLink({
  href,
  className,
  children,
  pathwayKey,
  linkLabel,
  external,
}: {
  href: string;
  className: string;
  children: ReactNode;
  pathwayKey: string;
  linkLabel: string;
  external?: boolean;
}) {
  if (external || href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackClientEvent(PH.marketingHomePathwayCardSecondary, {
            pathway_key: pathwayKey,
            link: linkLabel,
            external: true,
          });
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackClientEvent(PH.marketingHomePathwayCardSecondary, {
          pathway_key: pathwayKey,
          link: linkLabel,
        })
      }
    >
      {children}
    </Link>
  );
}
