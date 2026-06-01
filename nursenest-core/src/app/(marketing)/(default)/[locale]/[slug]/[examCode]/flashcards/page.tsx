import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";

// 🧊 ISR: parent layout handles dynamic; child can set own revalidate
export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/flashcards`;

  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway) return { robots: { index: false, follow: true } };

      const isCnple = pathway.id === "ca-np-cnple";
      const canonical = absoluteUrl(isCnple ? pathname : buildExamPathwayPath(pathway));
      const title = isCnple
        ? "CNPLE Flashcards — Canadian NP Exam Prep | NurseNest"
        : `${pathway.shortName} Flashcards | NurseNest`;
      const description = isCnple
        ? "CNPLE-aligned flashcards for Canadian Nurse Practitioner Licensure Examination preparation. Cover prescribing safety, diagnostics, lifespan care, pharmacology, and more."
        : `${pathway.shortName} flashcard decks for exam preparation.`;

      return {
        title,
        description,
        alternates: { canonical },
        robots: { index: isCnple, follow: true },
        openGraph: { title, description, url: canonical, type: "website" },
      };
    },
    { pathname, locale, routeGroup: "marketing.pathway_flashcards" },
  );
}

const CNPLE_FAQ = [
  {
    question: "What topics do CNPLE flashcards cover?",
    answer:
      "NurseNest CNPLE flashcards span prescribing safety, diagnostics and lab interpretation, lifespan care, chronic disease management, acute deterioration recognition, mental health, women's health, paediatrics, and geriatrics — aligned to Canadian NP competency domains.",
  },
  {
    question: "Are these official CNPLE flashcards?",
    answer:
      "No. These are independent preparation materials created by NurseNest. They are not affiliated with CCRNR or any official regulatory body.",
  },
  {
    question: "Can I use flashcards alongside the CNPLE Simulation?",
    answer:
      "Yes. After a simulation session, the domain report card links directly to weak-topic flashcard decks so remediation is targeted rather than broad.",
  },
];

export default async function PathwayFlashcardsPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/flashcards`;

  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  const isCnple = pathway.id === "ca-np-cnple";
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, {
    hubBasePath: buildExamPathwayPath(pathway),
  });

  const hubHref = buildExamPathwayPath(pathway);
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const simulationHref = buildExamPathwayPath(pathway, "simulation");

  // For CNPLE, check whether any flashcard deck has cards available for learners.
  // The CNPLE flashcard deck exists but may have cardCount: 0 while content is authored.
  const cnpleFlashcardLive = isCnple
    ? await withDatabaseFallbackTimeout(
        () =>
          prisma.flashcardDeck.count({
            where: { tier: "NP", country: "CA", status: "PUBLISHED", cardCount: { gt: 0 } },
          }),
        0,
        1000,
        { scope: "marketing.pathway_flashcards", label: "cnple_fc_deck_count" },
      ).then((n) => n > 0)
    : true;

  return (
    <>
      <WebPageJsonLd
        title={isCnple ? "CNPLE Flashcards — Canadian NP Exam Prep" : `${pathway.shortName} Flashcards`}
        description={isCnple ? "CNPLE-aligned flashcards for Canadian NP exam preparation." : `${pathway.shortName} flashcard decks.`}
        path={pathname}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      {isCnple ? <FaqJsonLd items={CNPLE_FAQ} /> : null}

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12" data-premium-layout-version="2026-05-tests-hubs-v1">
        {/* Hero */}
        <div className="mb-8">
          <p
            className="text-[12px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-brand)" }}
          >
            {pathway.countrySlug === "canada" ? "Canada" : "United States"} · {pathway.roleTrack.toUpperCase()}
          </p>
          <h1 className="mt-2 text-balance text-3xl font-black sm:text-4xl" style={{ color: "var(--palette-heading, var(--semantic-text-primary))" }}>
            {isCnple ? "CNPLE Flashcards" : `${pathway.shortName} Flashcards`}
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
            {isCnple
              ? "CNPLE-aligned flashcard decks for Canadian Nurse Practitioner Licensure Examination preparation. Domain-targeted, spaced-repetition ready, and linked to your simulation report card."
              : `Pathway-scoped flashcard decks for ${pathway.displayName} preparation with spaced repetition.`}
          </p>
          {isCnple ? (
            <p className="mt-2 text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
              Independent preparation materials — not affiliated with CCRNR or any regulatory body.
            </p>
          ) : null}
        </div>

        {/* CTA — CNPLE shows coming-soon with study alternatives when flashcard inventory is not yet live */}
        {isCnple && !cnpleFlashcardLive ? (
          <div className="mb-10 rounded-2xl border p-6" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))" }}>
            <p className="text-[15px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              CNPLE flashcards are being prepared
            </p>
            <p className="mt-1 text-[14px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
              Domain-targeted flashcard decks are actively authored and will be published here as they complete quality review. In the meantime, prepare with CNPLE lessons and practice questions.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={simulationHref}
                className="flex-1 rounded-2xl px-6 py-3 text-center text-[14px] font-bold shadow-sm"
                style={{ background: "var(--semantic-brand)", color: "#fff" }}
              >
                Start CNPLE Simulation
              </Link>
              <Link
                href={lessonsHref}
                className="rounded-2xl border px-6 py-3 text-center text-[14px] font-semibold"
                style={{ borderColor: "var(--semantic-border-soft)", color: "var(--semantic-text-secondary)", background: "var(--semantic-surface)" }}
              >
                Browse Lessons
              </Link>
              <Link
                href={questionsHref}
                className="rounded-2xl border px-6 py-3 text-center text-[14px] font-semibold"
                style={{ borderColor: "var(--semantic-border-soft)", color: "var(--semantic-text-secondary)", background: "var(--semantic-surface)" }}
              >
                Practice Questions
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={HUB.flashcards}
              className="flex-1 rounded-2xl px-8 py-4 text-center text-[15px] font-bold shadow-sm transition-all"
              style={{ background: "var(--semantic-brand)", color: "#fff" }}
            >
              Browse public flashcard decks
            </Link>
            <Link
              href={HUB.flashcards}
              className="rounded-2xl border px-8 py-4 text-center text-[15px] font-semibold transition-all"
              style={{
                borderColor: "var(--semantic-border-soft)",
                color: "var(--semantic-text-secondary)",
                background: "var(--semantic-surface)",
              }}
            >
              Browse all decks
            </Link>
          </div>
        )}

        {/* Domain coverage (CNPLE only) */}
        {isCnple ? (
          <section className="mb-10" aria-labelledby="cnple-fc-domains">
            <h2 id="cnple-fc-domains" className="mb-4 text-[18px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              Domain coverage
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {CNPLE_FLASHCARD_DOMAINS.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-[14px]" style={{ color: "var(--semantic-text-secondary)" }}>
                  <span style={{ color: "var(--semantic-brand)" }}>✓</span> {d}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* FAQ (CNPLE only) */}
        {isCnple ? (
          <section className="mb-10" aria-labelledby="cnple-fc-faq">
            <h2 id="cnple-fc-faq" className="mb-4 text-[18px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              Frequently asked questions
            </h2>
            <dl className="space-y-5">
              {CNPLE_FAQ.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
                    {item.question}
                  </dt>
                  <dd className="mt-1 text-[14px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* Internal links */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))" }}
        >
          <p className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            More {isCnple ? "CNPLE" : pathway.shortName} study modes
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
            {[
              { href: hubHref, label: `${pathway.shortName} Hub` },
              { href: lessonsHref, label: "Lessons" },
              { href: questionsHref, label: "Practice Questions" },
              ...(isCnple
                ? [
                    { href: `${hubHref}/simulation`, label: "CNPLE Simulation" },
                    { href: `${hubHref}/report-card`, label: "Report Card" },
                  ]
                : []),
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold underline-offset-2 hover:underline"
                  style={{ color: "var(--semantic-brand)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

const CNPLE_FLASHCARD_DOMAINS = [
  "Prescribing Safety & Pharmacology",
  "Diagnostics & Lab Interpretation",
  "Lifespan Care",
  "Chronic Disease Management",
  "Acute Deterioration Recognition",
  "Professional & Legal Judgment",
  "Mental Health",
  "Women's Health",
  "Paediatrics",
  "Geriatrics",
  "Primary Care Principles",
  "Differential Diagnosis",
] as const;
