import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Practice exams & mock tests | NurseNest",
  description:
    "Timed practice exams, attempt history, and rationales—scoped by pathway. Learn what NurseNest offers for NCLEX, PN, NP, and allied tracks before you sign in.",
  alternates: { canonical: absoluteUrl("/practice-exams") },
  openGraph: {
    title: "Practice exams & mock tests | NurseNest",
    url: absoluteUrl("/practice-exams"),
    type: "website",
  },
};

export default function PracticeExamsHubPage() {
  const appExams = loginWithCallback("/app/exams");
  const appPracticeTests = loginWithCallback("/app/practice-tests");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Practice exams", path: "/practice-exams" },
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
          <li className="font-medium text-[var(--theme-heading-text)]">Practice exams</li>
        </ol>
      </nav>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] p-5 sm:p-6">
        <h1 className="text-3xl font-extrabold text-[var(--theme-heading-text)]">Practice exams & mocks</h1>
        <p className="mt-3 text-[var(--theme-muted-text)]">
          NurseNest separates <strong className="font-semibold text-[var(--theme-heading-text)]">full-length timed exams</strong> (mock
          tests with pacing and review) from your{" "}
          <strong className="font-semibold text-[var(--theme-heading-text)]">question bank</strong> study sessions. Everything is
          filtered to your subscription pathway so you do not mix RN, PN, NP, or allied scopes by accident.
        </p>
        <div className="nn-hero-cta-row mt-[var(--nn-rhythm-text-to-cta)] flex-wrap">
          <Link
            href={appExams}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            Go to practice exams (sign in)
          </Link>
          <Link
            href="/question-bank"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/40"
          >
            Question bank overview
          </Link>
        </div>
      </div>

      <section className="nn-card p-5" aria-labelledby="timed-mocks">
        <h2 id="timed-mocks" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Timed mock exams
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Full-length or section-timed attempts with review of rationales and history—available to subscribers in the app for their
          entitled pathway. Use this when you want exam-day pacing and a score-oriented pass.
        </p>
      </section>

      <section className="nn-card p-5" aria-labelledby="cat-practice">
        <h2 id="cat-practice" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Topic practice tests & CAT-style sessions
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          For supported pathways, NurseNest also offers <strong className="font-semibold text-[var(--theme-heading-text)]">topic-level</strong>{" "}
          practice tests in the app, including adaptive (CAT-style) sessions where the product implements them. Availability varies by
          pathway and content pack—open{" "}
          <Link href={appPracticeTests} className="font-semibold text-primary underline">
            practice tests
          </Link>{" "}
          after sign-in to see what your subscription includes. This is not a substitute for official NCLEX or board scheduling or
          rules.
        </p>
      </section>

      <section className="nn-card p-5" aria-labelledby="pathway-sections">
        <h2 id="pathway-sections" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          RN, PN, NP, and Allied
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-muted-text)]">
          <li>
            <strong className="text-[var(--theme-heading-text)]">RN / PN:</strong> Mocks and drills align to NCLEX-RN, NCLEX-PN, or
            REx-PN context for your region.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">NP:</strong> Advanced practice mocks are specialty-scoped (for example
            FNP vs PMHNP)—always enter from your NP pathway in the app.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Allied:</strong> Timed practice follows allied certification framing for
            your hub—not nursing NCLEX content.
          </li>
        </ul>
        <p className="mt-4 text-sm text-[var(--theme-muted-text)]">
          Start from your public pathway hub if you are still choosing a track:{" "}
          <Link href="/lessons" className="font-semibold text-primary hover:underline">
            Lessons overview
          </Link>{" "}
          links every exam-specific lesson catalog.
        </p>
      </section>
    </div>
  );
}
