import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { CnpleReportCard, CNPLE_DOMAIN_LABELS } from "@/components/cnple/cnple-report-card";
import type { CnpleDomainResult } from "@/components/cnple/cnple-report-card";
import { CnpleProvisionalDisclaimer } from "@/components/cnple/cnple-provisional-disclaimer";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/report-card`;

  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway) return { robots: { index: false, follow: true } };

      const isCnple = pathway.id === "ca-np-cnple";
      const canonical = absoluteUrl(isCnple ? pathname : buildExamPathwayPath(pathway));
      const title = isCnple
        ? "CNPLE Report Card — Canadian NP Readiness Analysis | NurseNest"
        : `${pathway.shortName} Report Card | NurseNest`;
      const description = isCnple
        ? "View your CNPLE simulation performance by domain. Track prescribing safety, diagnostics, lifespan care, and more. Access targeted remediation lessons and flashcards."
        : `${pathway.shortName} performance analysis and remediation recommendations.`;

      return {
        title,
        description,
        alternates: { canonical },
        robots: { index: isCnple, follow: true },
        openGraph: { title, description, url: canonical, type: "website" },
      };
    },
    { pathname, locale, routeGroup: "marketing.cnple_report_card" },
  );
}

export default async function PathwayReportCardPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/report-card`;

  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  const isCnple = pathway.id === "ca-np-cnple";
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, {
    hubBasePath: buildExamPathwayPath(pathway),
  });

  const hubHref = buildExamPathwayPath(pathway);
  const simulationHref = `${hubHref}/simulation`;
  const practiceHref = buildExamPathwayPath(pathway, "questions");
  const flashcardsHref = `${hubHref}/flashcards`;
  const signInHref = loginWithCallback(pathname);

  // Demo data (shown when not signed in; real data comes from the app after a session)
  const demoDomains: CnpleDomainResult[] = [
    { domain: "prescribing_safety", label: CNPLE_DOMAIN_LABELS.prescribing_safety, score: 18, total: 25, remediationLessonsHref: `${hubHref}/lessons`, remediationFlashcardsHref: flashcardsHref },
    { domain: "diagnostics_labs", label: CNPLE_DOMAIN_LABELS.diagnostics_labs, score: 14, total: 20, remediationLessonsHref: `${hubHref}/lessons`, remediationFlashcardsHref: flashcardsHref },
    { domain: "lifespan_care", label: CNPLE_DOMAIN_LABELS.lifespan_care, score: 21, total: 25, remediationLessonsHref: `${hubHref}/lessons` },
    { domain: "chronic_disease", label: CNPLE_DOMAIN_LABELS.chronic_disease, score: 16, total: 20, remediationFlashcardsHref: flashcardsHref },
    { domain: "acute_deterioration", label: CNPLE_DOMAIN_LABELS.acute_deterioration, score: 9, total: 15, remediationLessonsHref: `${hubHref}/lessons`, remediationFlashcardsHref: flashcardsHref },
    { domain: "professional_legal", label: CNPLE_DOMAIN_LABELS.professional_legal, score: 13, total: 15 },
    { domain: "mental_health", label: CNPLE_DOMAIN_LABELS.mental_health, score: 11, total: 15, remediationFlashcardsHref: flashcardsHref },
    { domain: "womens_health", label: CNPLE_DOMAIN_LABELS.womens_health, score: 8, total: 10 },
    { domain: "pediatrics", label: CNPLE_DOMAIN_LABELS.pediatrics, score: 7, total: 10, remediationFlashcardsHref: flashcardsHref },
    { domain: "geriatrics", label: CNPLE_DOMAIN_LABELS.geriatrics, score: 8, total: 10 },
  ];

  return (
    <>
      <WebPageJsonLd
        title={isCnple ? "CNPLE Report Card — Canadian NP Readiness Analysis" : `${pathway.shortName} Report Card`}
        description={isCnple ? "CNPLE simulation performance by domain with remediation links." : `${pathway.shortName} report card.`}
        path={pathname}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {isCnple ? (
          <div className="mb-6">
            <CnpleProvisionalDisclaimer variant="subtle" surface="short" hideWhenConfirmed />
          </div>
        ) : null}
        {/* Public preview: real learner report data stays in the authenticated app runtime. */}
        <div>
            <div className="mb-8">
              <p
                className="text-[12px] font-bold uppercase tracking-widest"
                style={{ color: "var(--semantic-brand)" }}
              >
                {isCnple ? "CNPLE" : pathway.shortName} · Report Card
              </p>
              <h1 className="mt-2 text-balance text-3xl font-black sm:text-4xl" style={{ color: "var(--palette-heading, var(--semantic-text-primary))" }}>
                {isCnple ? "CNPLE Report Card" : `${pathway.shortName} Report Card`}
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
                {isCnple
                  ? "After completing a CNPLE simulation, your domain-level performance report appears here. See strengths, focus areas, and linked remediation resources."
                  : `After completing a practice session, your performance report appears here.`}
              </p>
            </div>

            {/* Demo preview */}
            <div
              className="relative mb-6 overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--semantic-border-soft)" }}
              aria-label="Report card preview (sample data)"
            >
              <div className="pointer-events-none select-none opacity-40">
                <div className="p-6">
                  <CnpleReportCard
                    totalQuestions={150}
                    correctAnswers={105}
                    timeTakenSec={8340}
                    domains={demoDomains}
                    readinessLevel="approaching"
                    weakDomains={["acute_deterioration", "diagnostics_labs"]}
                    strongDomains={["professional_legal", "womens_health", "geriatrics"]}
                    cnpleHubHref={hubHref}
                    practiceHref={practiceHref}
                    flashcardsHref={flashcardsHref}
                    overallRecommendation="Focus on acute deterioration recognition and diagnostic interpretation. Your professional practice and lifespan care scores are strong — prioritise the clinical reasoning domains before your next simulation."
                  />
                </div>
              </div>
              {/* Overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--semantic-surface) 80%, transparent)" }}
              >
                <p className="text-[16px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
                  Sign in to view your report
                </p>
                <p className="mt-1 text-[14px]" style={{ color: "var(--semantic-text-muted)" }}>
                  Complete a {isCnple ? "CNPLE simulation" : "practice session"} to unlock your domain analysis.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    href={signInHref}
                    className="rounded-full px-7 py-3 text-[14px] font-bold transition-colors"
                    style={{ background: "var(--semantic-brand)", color: "#fff" }}
                  >
                    Sign in
                  </Link>
                  {isCnple ? (
                    <Link
                      href={simulationHref}
                      className="rounded-full border px-7 py-3 text-[14px] font-semibold transition-colors"
                      style={{
                        borderColor: "var(--semantic-border-soft)",
                        color: "var(--semantic-text-secondary)",
                        background: "var(--semantic-surface)",
                      }}
                    >
                      Start simulation
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>

            {/* What the report card shows */}
            <section aria-labelledby="rc-features-heading">
              <h2 id="rc-features-heading" className="mb-4 text-[18px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
                What your report card shows
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {REPORT_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]" style={{ color: "var(--semantic-text-secondary)" }}>
                    <span style={{ color: "var(--semantic-brand)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </section>

            {/* Navigation */}
            <div className="mt-8 flex flex-wrap gap-3">
              {isCnple ? (
                <Link
                  href={simulationHref}
                  className="rounded-full px-6 py-2.5 text-[14px] font-bold"
                  style={{ background: "var(--semantic-brand)", color: "#fff" }}
                >
                  Start CNPLE Simulation
                </Link>
              ) : null}
              <Link
                href={practiceHref}
                className="rounded-full border px-6 py-2.5 text-[14px] font-semibold"
                style={{ borderColor: "var(--semantic-border-soft)", color: "var(--semantic-text-secondary)", background: "var(--semantic-surface)" }}
              >
                Practice Questions
              </Link>
              <Link
                href={hubHref}
                className="rounded-full border px-6 py-2.5 text-[14px] font-semibold"
                style={{ borderColor: "var(--semantic-border-soft)", color: "var(--semantic-text-secondary)", background: "var(--semantic-surface)" }}
              >
                {pathway.shortName} Hub
              </Link>
            </div>
        </div>
      </div>
    </>
  );
}

const REPORT_FEATURES = [
  "Domain-level score breakdown",
  "Prescribing safety analysis",
  "Diagnostics & lab performance",
  "Lifespan care coverage",
  "Strength and focus-area identification",
  "Readiness level indicator",
  "Linked lessons for weak domains",
  "Linked flashcard decks for remediation",
  "Longitudinal progress tracking",
  "Overall study recommendation",
] as const;
