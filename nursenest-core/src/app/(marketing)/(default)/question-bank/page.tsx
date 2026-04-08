import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
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

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Exam question banks | NurseNest",
  description:
    "Pathway-scoped nursing question banks for NCLEX-RN, NCLEX-PN, REx-PN, NP boards, and allied health. See what each track includes before you sign in.",
  alternates: { canonical: absoluteUrl("/question-bank") },
  openGraph: {
    title: "Exam question banks | NurseNest",
    url: absoluteUrl("/question-bank"),
    type: "website",
  },
};

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

export default function QuestionBankHubPage() {
  const appBank = loginWithCallback("/app/questions");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Question banks", path: "/question-bank" },
        ]}
      />
      <nav className="text-sm text-[var(--theme-muted-text)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="text-primary underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">Question banks</li>
        </ol>
      </nav>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] p-5 sm:p-6">
        <h1 className="text-3xl font-extrabold text-[var(--theme-heading-text)]">Exam question banks</h1>
        <p className="mt-3 text-[var(--theme-muted-text)]">
          Every bank is tied to a <strong className="font-semibold text-[var(--theme-heading-text)]">country</strong> and{" "}
          <strong className="font-semibold text-[var(--theme-heading-text)]">exam pathway</strong> so items, rationales, and scope stay
          consistent with what you will see on test day. Use the public pathway pages to explore scope; the full personalized bank,
          weak-area drills, and history live in the app after you sign in.
        </p>
        <div className="nn-hero-cta-row mt-[var(--nn-rhythm-text-to-cta)] flex-wrap">
          <Link
            href={appBank}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            Open question bank in app
          </Link>
          <Link
            href="/lessons"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/40"
          >
            Clinical lessons overview
          </Link>
        </div>
      </div>

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
        <Link href="/practice-exams" className="font-semibold text-primary hover:underline">
          Practice exams
        </Link>{" "}
        for how mocks and review work in NurseNest.
      </p>
    </div>
  );
}
