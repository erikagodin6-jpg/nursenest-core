import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { pathwayCatPracticeBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { CnpleProvisionalDisclaimer } from "@/components/cnple/cnple-provisional-disclaimer";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/simulation`;

  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway || pathway.id !== "ca-np-cnple") return { robots: { index: false, follow: true } };

      const canonical = absoluteUrl(pathname);
      return {
        title: "CNPLE Simulation — Canadian NP Linear Exam Experience | NurseNest",
        description:
          "CNPLE-aligned linear simulation for Canadian Nurse Practitioner Licensure Examination preparation. Fixed-length, blueprint-balanced, no adaptive shutdown. Clinical cases, prescribing, diagnostics, and lifespan care.",
        alternates: { canonical },
        robots: { index: true, follow: true },
        openGraph: {
          title: "CNPLE Simulation | NurseNest",
          description:
            "Exam-style linear simulation inspired by the CNPLE blueprint and Canadian NP competencies.",
          url: canonical,
          type: "website",
        },
        twitter: { card: "summary_large_image", title: "CNPLE Simulation | NurseNest" },
      };
    },
    { pathname, locale, routeGroup: "marketing.cnple_simulation_landing" },
  );
}

const FAQ_ITEMS = [
  {
    question: "Is this the official CNPLE simulator?",
    answer:
      "No. NurseNest's CNPLE simulation is an independent preparation experience inspired by the CNPLE blueprint and Canadian NP competencies. It is not affiliated with CCRNR or any regulatory body and does not replicate the official exam environment.",
  },
  {
    question: "Why is this simulation linear instead of adaptive?",
    answer:
      "The CNPLE uses a linear on-the-fly testing (LOFT) format, not a computerized adaptive test (CAT). NurseNest aligns its simulation experience accordingly: fixed-length, blueprint-balanced, with back navigation allowed and a review screen before submission.",
  },
  {
    question: "How many questions are in the CNPLE Simulation?",
    answer:
      "The NurseNest CNPLE simulation session is calibrated to reflect a full linear exam sitting. Question count is set by the LOFT session configuration and may be adjusted as the CNPLE blueprint is confirmed by regulators.",
  },
  {
    question: "Does the simulation show rationales?",
    answer:
      "Simulation mode withholds rationales during the session. After submission you can review performance by domain and access linked lessons and flashcards for remediation.",
  },
];

export default async function CnpleSimulationLandingPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/simulation`;

  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  // This dedicated simulation landing is CNPLE-only — all other pathways use /cat
  if (pathway.id !== "ca-np-cnple") {
    redirect(buildExamPathwayPath(pathway, "cat"));
  }

  const { crumbs, schemaItems } = pathwayCatPracticeBreadcrumbs(pathway, { hubBasePath: buildExamPathwayPath(pathway) });
  const session = await getOptionalPublicSession({ pathname, surface: "marketing.cnple_simulation_landing" }).catch(() => null);
  const isSignedIn = Boolean((session?.user as { id?: string } | undefined)?.id);

  const catStartHref = isSignedIn
    ? appPathwayCatSessionStartPath(pathway.id)
    : loginWithCallback(appPathwayCatSessionStartPath(pathway.id));
  const practiceHref = buildExamPathwayPath(pathway, "questions");
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const reportCardHref = `${buildExamPathwayPath(pathway)}/report-card`;

  return (
    <>
      <WebPageJsonLd
        title="CNPLE Simulation — Canadian NP Linear Exam Experience"
        description="CNPLE-aligned linear simulation for Canadian NP licensure exam preparation."
        path={pathname}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <FaqJsonLd items={FAQ_ITEMS} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="mb-10">
          <p
            className="text-[12px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-brand)" }}
          >
            Canada · NP · CNPLE
          </p>
          <h1 className="mt-2 text-balance text-3xl font-black sm:text-4xl" style={{ color: "var(--palette-heading, var(--semantic-text-primary))" }}>
            CNPLE Simulation
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
            Canadian NP Licensure Exam experience. Exam-style linear simulation inspired by the
            CNPLE blueprint and Canadian NP competencies — clinical cases, prescribing safety,
            diagnostics, lifespan care, and more.
          </p>

          <div className="mt-4">
            <CnpleProvisionalDisclaimer variant="card" hideWhenConfirmed={false} />
          </div>
        </div>

        {/* What sets this apart */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {SIMULATION_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* Primary CTAs */}
        <div className="mb-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href={catStartHref}
            className="flex-1 rounded-2xl px-8 py-4 text-center text-[15px] font-bold shadow-sm transition-all"
            style={{ background: "var(--semantic-brand)", color: "#fff" }}
            data-nn-qa="cnple-sim-start-cta"
          >
            Start CNPLE Simulation
          </Link>
          <Link
            href={practiceHref}
            className="rounded-2xl border px-8 py-4 text-center text-[15px] font-semibold transition-all"
            style={{
              borderColor: "var(--semantic-border-soft)",
              color: "var(--semantic-text-secondary)",
              background: "var(--semantic-surface)",
            }}
          >
            Practice Questions
          </Link>
        </div>

        {/* Format details */}
        <section className="mb-10" aria-labelledby="format-heading">
          <h2 id="format-heading" className="mb-4 text-[18px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Simulation format
          </h2>
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--semantic-border-soft)" }}
          >
            {FORMAT_ROWS.map((row, i) => (
              <div
                key={row.label}
                className="flex items-start justify-between px-5 py-3"
                style={{
                  borderBottom: i < FORMAT_ROWS.length - 1 ? "1px solid var(--semantic-border-soft)" : "none",
                  background: i % 2 === 0 ? "var(--semantic-surface)" : "color-mix(in srgb, var(--semantic-brand) 2%, var(--semantic-surface))",
                }}
              >
                <span className="text-[13px] font-semibold" style={{ color: "var(--semantic-text-secondary)" }}>
                  {row.label}
                </span>
                <span className="text-[13px]" style={{ color: "var(--semantic-text-primary)" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Question types */}
        <section className="mb-10" aria-labelledby="qtypes-heading">
          <h2 id="qtypes-heading" className="mb-4 text-[18px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Question types supported
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {QUESTION_TYPES.map((qt) => (
              <li key={qt} className="flex items-center gap-2.5 text-[14px]" style={{ color: "var(--semantic-text-secondary)" }}>
                <span style={{ color: "var(--semantic-brand)" }}>✓</span> {qt}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10" aria-labelledby="sim-faq-heading">
          <h2 id="sim-faq-heading" className="mb-4 text-[18px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Frequently asked questions
          </h2>
          <dl className="space-y-5">
            {FAQ_ITEMS.map((item) => (
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

        {/* Internal links */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))" }}
        >
          <p className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Complete CNPLE preparation
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
            {[
              { href: lessonsHref, label: "CNPLE Lessons" },
              { href: practiceHref, label: "Practice Questions" },
              { href: `${buildExamPathwayPath(pathway)}/flashcards`, label: "CNPLE Flashcards" },
              { href: reportCardHref, label: "Report Card" },
              { href: buildExamPathwayPath(pathway), label: "CNPLE Hub" },
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

// ── Static data ───────────────────────────────────────────────────────────────

const SIMULATION_FEATURES = [
  {
    title: "Linear LOFT format",
    body: "Fixed question set, no adaptive shutdown, back navigation allowed. Matches the published CNPLE testing design.",
  },
  {
    title: "Blueprint-balanced domains",
    body: "Questions distributed across prescribing safety, diagnostics, lifespan care, chronic disease, mental health, and more.",
  },
  {
    title: "Clinical case clusters",
    body: "Evolving patient scenarios with labs, vitals, medications, and imaging — built for NP-level longitudinal reasoning.",
  },
  {
    title: "Domain report card",
    body: "After submission, review strengths and weaknesses by domain with links to targeted lessons and flashcards.",
  },
] as const;

const FORMAT_ROWS = [
  { label: "Format", value: "Linear / LOFT (not CAT adaptive)" },
  { label: "Back navigation", value: "Allowed" },
  { label: "Rationales during session", value: "Hidden (simulation mode)" },
  { label: "Review screen", value: "Yes — before final submission" },
  { label: "Post-session analytics", value: "Yes — domain breakdown" },
  { label: "Official affiliation", value: "None — independent prep experience" },
] as const;

const QUESTION_TYPES = [
  "Single best answer (SBA)",
  "Select all that apply (SATA)",
  "Clinical case clusters",
  "Lab & diagnostic interpretation",
  "Prescribing & medication safety",
  "Differential diagnosis",
  "Follow-up & monitoring decisions",
  "Referral & escalation decisions",
] as const;

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "var(--semantic-border-soft)", background: "var(--semantic-surface)" }}
    >
      <p className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        {title}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
        {body}
      </p>
    </div>
  );
}
