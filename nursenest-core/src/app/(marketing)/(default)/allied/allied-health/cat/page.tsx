/**
 * /allied/allied-health/cat — global Allied Health CAT marketing page.
 *
 * This page was previously a thin wrapper over the general [locale]/[slug]/[examCode]/cat page,
 * but that pattern triggered a permanentRedirect loop: the general page re-directs Allied
 * pathways back to /allied/allied-health/cat, which would call itself infinitely.
 *
 * Fixed by rendering directly here with the correct Allied pathway resolution, bypassing
 * the locale-redirect guard that only applies to country-prefixed URLs.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-hub-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { assessMarketingCatSurfaceWithoutAuth } from "@/lib/exam-pathways/cat-eligibility";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

const ALLIED_LOCALE = "us";
const ALLIED_ROLE = "allied";
const ALLIED_EXAM = "allied-health";
const CAT_PATH = "/allied/allied-health/cat";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(async () => {
    const pathway = await resolveExamPathwaySafe(ALLIED_LOCALE, ALLIED_ROLE, ALLIED_EXAM, {
      pathname: CAT_PATH,
    });
    if (!pathway) return { robots: { index: false, follow: true } };
    return {
      title: `Allied Health CAT Exam Prep | NurseNest`,
      description:
        "Practice allied health exam questions with adaptive assessment. Sign in to start your CAT session or browse lessons and the question bank.",
      alternates: { canonical: absoluteUrl(CAT_PATH) },
      robots: { index: true, follow: true },
    };
  });
}

export default async function GlobalAlliedCatPage() {
  const pathway = await resolveExamPathwaySafe(ALLIED_LOCALE, ALLIED_ROLE, ALLIED_EXAM, {
    pathname: CAT_PATH,
  });
  if (!pathway) notFound();

  const { questionSnapshot } = await loadMarketingExamHubOptionalBlocks(pathway, {
    pathname: CAT_PATH,
    locale: ALLIED_LOCALE,
    country: ALLIED_LOCALE,
    examCode: ALLIED_EXAM,
    pathwayId: pathway.id,
    roleTrack: ALLIED_ROLE,
  });
  const assessment = assessMarketingCatSurfaceWithoutAuth(pathway, questionSnapshot);

  const lessonsHref = buildAlliedGlobalHubPath("lessons");
  const questionsHref = buildAlliedGlobalHubPath("questions");
  const signInHref = loginWithCallback(CAT_PATH);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="nn-marketing-h1">Allied Health CAT Exam Practice</h1>
      <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">
        Adaptive assessment for allied health certification prep. Sign in to start your session or
        warm up with lessons and practice questions first.
      </p>

      {/* ── CAT access card ──────────────────────────────────────────────── */}
      <section
        className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-6"
        aria-label="Start or sign in to practise"
        data-nn-qa-cat-authority-cta="true"
      >
        <h2 className="text-base font-bold text-[var(--theme-heading-text)]">
          {assessment.eligible ? "Start your session" : "Access"}
        </h2>
        {!assessment.eligible && (
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {assessment.safeUserMessage}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={signInHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-90"
            data-nn-qa-cat-authority-signin="true"
          >
            Sign In to Start
          </Link>
          <Link
            href={lessonsHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-[14px] font-semibold text-[var(--theme-body-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
          >
            Lessons
          </Link>
          <Link
            href={questionsHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-[14px] font-semibold text-[var(--theme-body-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
          >
            Practice Questions
          </Link>
        </div>
      </section>

      {/* ── Fallback pathway navigation ───────────────────────────────────── */}
      <nav className="mt-8 flex flex-wrap gap-3" aria-label="Allied Health pathway navigation">
        <Link
          href={lessonsHref}
          className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
        >
          Allied Health lessons →
        </Link>
        <Link
          href={questionsHref}
          className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
        >
          Allied Health practice questions →
        </Link>
        <Link
          href="/allied/allied-health"
          className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
        >
          Allied Health hub →
        </Link>
      </nav>
    </div>
  );
}
