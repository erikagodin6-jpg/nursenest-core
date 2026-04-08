import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import { absoluteUrl } from "@/lib/seo/site-origin";
import {
  ALLIED,
  NP,
  PN,
  RN,
  loginWithCallback,
  pnPrimaryHub,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export const revalidate = 600;

type PathwayCard = {
  id: string;
  title: string;
  examLabel: string;
  who: string;
  includes: string;
  publicQuestionsHref: string;
  hubHref: string;
  region: MarketingRegionToggle;
};

const CARDS: PathwayCard[] = [
  {
    id: "rn-us",
    title: "NCLEX-RN (United States)",
    examLabel: "NCLEX-RN",
    who: "US RN candidates preparing for the National Council exam.",
    includes: "Client-needs–style items, clinical judgment practice, rationales, and topic drills scoped to US RN eligibility.",
    publicQuestionsHref: RN.usQuestions,
    hubHref: "/us/rn/nclex-rn",
    region: "US",
  },
  {
    id: "rn-ca",
    title: "NCLEX-RN (Canada)",
    examLabel: "NCLEX-RN",
    who: "Canadian RN candidates sitting NCLEX-RN for registration.",
    includes: "Country-appropriate framing, safety and scope aligned to Canadian practice, and pathway-scoped banks.",
    publicQuestionsHref: RN.caQuestions,
    hubHref: "/canada/rn/nclex-rn",
    region: "CA",
  },
  {
    id: "pn-us",
    title: "NCLEX-PN (US LVN/LPN)",
    examLabel: "NCLEX-PN",
    who: "Practical/vocational nursing candidates in the United States.",
    includes: "PN-level scope, prioritization, and medication safety with rationales tied to LVN/LPN practice.",
    publicQuestionsHref: PN.usQuestions,
    hubHref: "/us/lpn/nclex-pn",
    region: "US",
  },
  {
    id: "pn-ca",
    title: "REx-PN (Canada)",
    examLabel: "REx-PN",
    who: "Canadian practical nurse candidates.",
    includes: "REx-PN–scoped practice with Canadian context—not recycled US-only copy.",
    publicQuestionsHref: PN.caQuestions,
    hubHref: pnPrimaryHub("CA"),
    region: "CA",
  },
  {
    id: "np-us",
    title: "US Nurse Practitioner boards",
    examLabel: "NP (FNP, AGPCNP, PMHNP, …)",
    who: "Advanced practice candidates preparing for board-specific NP exams.",
    includes: "Specialty-scoped advanced practice items. Pick your board track in the pathway hub—content is not interchangeable between specialties.",
    publicQuestionsHref: NP.fnpQuestions,
    hubHref: "/us/np/fnp",
    region: "US",
  },
  {
    id: "np-ca",
    title: "Canadian NP (CNPLE track)",
    examLabel: "CNPLE",
    who: "Canadian NP candidates following national licensure preparation.",
    includes: "Pathway hub explains scope and readiness; question pools align to the Canadian NP track as published.",
    publicQuestionsHref: NP.caNpQuestions,
    hubHref: NP.caNpHub,
    region: "CA",
  },
  {
    id: "allied-us",
    title: "Allied health (United States)",
    examLabel: "Allied certifications",
    who: "Allied health professionals using NurseNest certification prep.",
    includes: "Reasoning-heavy items and protocol edges matched to US certification contexts for your discipline.",
    publicQuestionsHref: ALLIED.usQuestions,
    hubHref: ALLIED.usHub,
    region: "US",
  },
  {
    id: "allied-ca",
    title: "Allied health (Canada)",
    examLabel: "Allied certifications",
    who: "Canadian allied candidates.",
    includes: "Canadian framing for prioritization, scope, and exam-style practice for your pathway.",
    publicQuestionsHref: ALLIED.caQuestions,
    hubHref: ALLIED.caHub,
    region: "CA",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title = resolveMarketingCopy(m, "pages.publicQuestionBank.metaTitle", en, "NCLEX & REx-PN practice questions | NurseNest");
  const description = resolveMarketingCopy(
    m,
    "pages.publicQuestionBank.metaDescription",
    en,
    "Public overview of the NurseNest nursing question bank: practice items for NCLEX-RN, NCLEX-PN, REx-PN, and NP tracks. Sign up to practice in the app.",
  );
  const alt = marketingAlternatesSharedPage(locale, "/question-bank");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/question-bank"), languages: alt.languages },
    openGraph: { title, description, url: absoluteUrl("/question-bank"), type: "website" },
  };
}

export default async function QuestionBankHubPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const appBank = loginWithCallback("/app/questions");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Question bank", path: "/question-bank" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
        <nav className="text-sm text-[var(--theme-muted-text)]">
          <Link href={withMarketingLocale(locale, "/")} className="hover:text-primary">
            {t("nav.home")}
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="text-[var(--theme-heading-text)]">{t("pages.publicQuestionBank.breadcrumbCurrent")}</span>
        </nav>
      </div>
      <MarketingPublicStudyLanding
        h1={t("pages.publicQuestionBank.h1")}
        intro={t("pages.publicQuestionBank.intro")}
        primaryCta={{ href: appBank, label: t("pages.publicQuestionBank.ctaStartPracticing") }}
        secondaryCta={{
          href: withMarketingLocale(locale, "/lessons"),
          label: t("pages.publicQuestionBank.ctaBrowseLessons"),
        }}
      >
        <ul className="flex flex-col gap-3 sm:gap-[var(--nn-rhythm-card-grid-gap)]">
          {CARDS.map((c) => (
            <li key={c.id} className="nn-card p-4">
              <p className="text-xs font-semibold uppercase text-primary">
                {c.region === "CA" ? "Canada" : "United States"} · {c.examLabel}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{c.title}</h2>
              <p className="mt-2 text-sm text-muted">{c.who}</p>
              <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{c.includes}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={c.publicQuestionsHref} className="text-sm font-semibold text-primary hover:underline">
                  Public questions landing
                </Link>
                <Link href={c.hubHref} className="text-sm font-semibold text-primary hover:underline">
                  Pathway hub
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-sm text-[var(--theme-muted-text)]">
          Looking for timed sets and score review? See{" "}
          <Link href={withMarketingLocale(locale, "/practice-exams")} className="font-semibold text-primary hover:underline">
            Practice exams
          </Link>{" "}
          for how mocks and review work in NurseNest.
        </p>
      </MarketingPublicStudyLanding>
    </>
  );
}
