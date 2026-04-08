"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, GraduationCap, LayoutList } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";

type Props = {
  pathway: ExamPathwayDefinition;
  isSignedIn: boolean;
  /** Programmatic SEO parent link; rendered after top CTAs, before conversion cards. */
  discovery: { path: string; label: string } | null;
  /** NP practice-test SEO landings: highlight in-app CAT practice tests. */
  emphasizeCatPracticeTests?: boolean;
  /** When set, all hub CTAs include `np_seo_alias_segment` + `from_np_seo_alias` for PostHog. */
  npSeoAliasSegment?: string;
  conversionSectionHeading?: string;
  conversionSectionLead?: string;
};

export function ExamPathwayHubBody({
  pathway,
  isSignedIn,
  discovery,
  emphasizeCatPracticeTests = false,
  npSeoAliasSegment,
  conversionSectionHeading,
  conversionSectionLead,
}: Props) {
  const isWaitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
  const tertiaryHref = isSignedIn ? "/app" : pricingHref;
  const tertiaryLabel = isSignedIn ? "Open your study hub" : "Plans & pricing";
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <MarketingTrackedLink
          href="/signup"
          event={PH.marketingPathwayHubCta}
          eventProps={{
            ...linkCtx,
            surface: "top_primary",
            pathway_id: pathway.id,
            signed_in: isSignedIn,
            destination_type: "signup",
            link_target: "signup",
          }}
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 sm:w-auto sm:min-h-[56px]"
        >
          {isWaitlist ? "Join or sign in" : "Create free account"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </MarketingTrackedLink>
        <MarketingTrackedLink
          href={questionsHref}
          event={PH.marketingPathwayHubCta}
          eventProps={{
            ...linkCtx,
            surface: "top_questions",
            pathway_id: pathway.id,
            destination_type: "marketing_questions",
            link_target: "marketing_questions_hub",
          }}
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-primary/35 bg-primary/5 px-8 py-3 text-base font-semibold text-primary transition hover:bg-primary/10 sm:w-auto sm:min-h-[56px]"
        >
          Try {pathway.shortName} questions
        </MarketingTrackedLink>
        <MarketingTrackedLink
          href={tertiaryHref}
          event={PH.marketingPathwayHubCta}
          eventProps={{
            ...linkCtx,
            surface: isSignedIn ? "top_app_hub" : "top_pricing",
            pathway_id: pathway.id,
            signed_in: isSignedIn,
            destination_type: isSignedIn ? "app_entry" : "marketing_pricing",
            link_target: isSignedIn ? "app_dashboard" : "marketing_pricing_hub",
          }}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--theme-input-border)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--theme-muted-surface)] sm:w-auto"
        >
          {tertiaryLabel}
        </MarketingTrackedLink>
      </div>

      {emphasizeCatPracticeTests ? (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm text-[var(--theme-body-text)] sm:px-5">
          <p className="font-semibold text-[var(--theme-heading-text)]">Computerized adaptive (CAT) practice tests</p>
          <p className="mt-1 text-[var(--theme-muted-text)]">
            After sign-in, open Practice tests to run CAT-style sessions matched to your pathway (length, topics, and review
            flow). Full adaptive depth unlocks with a plan that covers this track.
          </p>
          {isSignedIn ? (
            <MarketingTrackedLink
              href="/app/practice-tests"
              event={PH.marketingPathwayHubCta}
              eventProps={{
                ...linkCtx,
                surface: "cat_practice_strip",
                pathway_id: pathway.id,
                signed_in: true,
                destination_type: "cat_practice_tests",
                link_target: "cat_practice_tests",
              }}
              className="mt-3 inline-flex font-semibold text-primary hover:underline"
            >
              Go to practice tests →
            </MarketingTrackedLink>
          ) : (
            <MarketingTrackedLink
              href="/signup"
              event={PH.marketingPathwayHubCta}
              eventProps={{
                ...linkCtx,
                surface: "cat_practice_strip",
                pathway_id: pathway.id,
                signed_in: false,
                destination_type: "signup",
                link_target: "signup",
              }}
              className="mt-3 inline-flex font-semibold text-primary hover:underline"
            >
              Create a free account to start →
            </MarketingTrackedLink>
          )}
        </div>
      ) : null}

      <aside className="mt-10 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/80 px-4 py-4 text-sm text-[var(--theme-body-text)] sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Search &amp; discovery</p>
        <p className="mt-2 text-[var(--theme-muted-text)]">
          {discovery ? (
            <>
              Related public guide:{" "}
              {npSeoAliasSegment ? (
                <MarketingTrackedLink
                  href={discovery.path}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{
                    ...linkCtx,
                    surface: "discovery_programmatic_guide",
                    pathway_id: pathway.id,
                    destination_type: "programmatic_guide",
                    link_target: "programmatic_seo_guide",
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  {discovery.label}
                </MarketingTrackedLink>
              ) : (
                <Link href={discovery.path} className="font-semibold text-primary hover:underline">
                  {discovery.label}
                </Link>
              )}
              . Or{" "}
              <Link href="/lessons" className="font-semibold text-primary hover:underline">
                browse all exam lesson pathways
              </Link>
              .
            </>
          ) : (
            <>
              <Link href="/lessons" className="font-semibold text-primary hover:underline">
                Browse all exam lesson pathways
              </Link>{" "}
              to compare tracks.
            </>
          )}
        </p>
      </aside>

      <h2 className="mt-14 text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">
        {conversionSectionHeading ?? "Everything for this exam in one platform"}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)]">
        {conversionSectionLead ??
          "Same-pathway question runs, structured lessons, spaced flashcards, study planner, and readiness sit behind one login after you subscribe. Timed and exam-style practice (including mocks) unlock in the app once your plan matches this pathway."}
      </p>
      <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-[var(--theme-body-text)]">
        <li>
          <span className="font-medium text-[var(--theme-heading-text)]">Question bank:</span> short reps with rationales on every option.
        </li>
        <li>
          <span className="font-medium text-[var(--theme-heading-text)]">Lessons:</span> system and safety topics aligned to this exam’s framing.
        </li>
        <li>
          <span className="font-medium text-[var(--theme-heading-text)]">Flashcards &amp; planner:</span> weak-topic decks and pacing after sign-in.
        </li>
        <li>
          <span className="font-medium text-[var(--theme-heading-text)]">Exam mode &amp; mocks:</span> full-length timing and review flags in-app.
        </li>
      </ul>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        <li>
          <MarketingTrackedLink
            href={questionsHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "card_questions",
              pathway_id: pathway.id,
              destination_type: "marketing_questions",
              link_target: "marketing_questions_hub",
            }}
            className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)] sm:min-h-[12rem]"
          >
            <LayoutList className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Question bank hub</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              Topic runs, rationales, and pathway filters. Best first stop when you have ten to twenty minutes.
            </span>
            <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-primary">
              Open bank
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href={lessonsHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "card_lessons",
              pathway_id: pathway.id,
              destination_type: "marketing_lessons",
              link_target: "marketing_lessons_hub",
            }}
            className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)] sm:min-h-[12rem]"
          >
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Exam lessons</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              Blueprint-style hubs for the systems and safety topics that show up most on your form of the exam.
            </span>
            <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-primary">
              Open lessons
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href={pricingHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "card_pricing",
              pathway_id: pathway.id,
              destination_type: "marketing_pricing",
              link_target: "marketing_pricing_hub",
            }}
            className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)] sm:min-h-[12rem]"
          >
            <ClipboardList className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Pricing & plans</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              See the NurseNest tier for this pathway in {pathway.countryCode}. NP specialties may share the NP tier until per-pathway billing
              ships.
            </span>
            <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-primary">
              Compare plans
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href="/app/exams"
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "card_timed_exams",
              pathway_id: pathway.id,
              destination_type: "marketing_timed_exams",
              link_target: "marketing_timed_exams",
            }}
            className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)] sm:min-h-[12rem]"
          >
            <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Timed practice exams</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              Full-length and half-length mocks live in the app after sign-in. Use them once category scores hold steady.
            </span>
            <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-primary">
              Go to exams
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </MarketingTrackedLink>
        </li>
      </ul>

      {isSignedIn ? (
        <>
          <h2 className="mt-14 text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">Already studying inside NurseNest?</h2>
          <ul
            className={`mt-4 grid gap-3 ${emphasizeCatPracticeTests ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}
          >
            <li>
              <MarketingTrackedLink
                href="/app/questions"
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "shortcut_questions",
                  pathway_id: pathway.id,
                  signed_in: true,
                  destination_type: "app_questions",
                  link_target: "app_questions",
                }}
                className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/25"
              >
                In-app question bank →
              </MarketingTrackedLink>
            </li>
            {emphasizeCatPracticeTests ? (
              <li>
                <MarketingTrackedLink
                  href="/app/practice-tests"
                  event={PH.marketingPathwayHubCta}
                  eventProps={{
                    ...linkCtx,
                    surface: "shortcut_cat_practice",
                    pathway_id: pathway.id,
                    signed_in: true,
                    destination_type: "cat_practice_tests",
                    link_target: "cat_practice_tests",
                  }}
                  className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/25"
                >
                  Adaptive practice tests →
                </MarketingTrackedLink>
              </li>
            ) : null}
            <li>
              <MarketingTrackedLink
                href="/app"
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "shortcut_dashboard",
                  pathway_id: pathway.id,
                  signed_in: true,
                  destination_type: "app_entry",
                  link_target: "app_dashboard",
                }}
                className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/25"
              >
                Open your dashboard →
              </MarketingTrackedLink>
            </li>
          </ul>
        </>
      ) : null}

      <div className="mt-12 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] p-5 text-sm text-[var(--theme-body-text)]">
        <p>
          Checkout and content entitlements use your <strong className="text-[var(--theme-heading-text)]">{pathway.shortName}</strong> track with
          NurseNest&apos;s <strong className="text-[var(--theme-heading-text)]">{pathway.stripeTier}</strong> tier for{" "}
          <strong className="text-[var(--theme-heading-text)]">{pathway.countryCode}</strong>. Pick the correct pathway in your profile so
          lessons and banks stay exam-specific.
        </p>
        {isWaitlist ? (
          <MarketingTrackedLink
            href="/signup"
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "footer_waitlist",
              pathway_id: pathway.id,
              destination_type: "signup",
              link_target: "signup",
            }}
            className="mt-4 inline-flex items-center font-semibold text-primary"
          >
            Join or sign in →
          </MarketingTrackedLink>
        ) : (
          <MarketingTrackedLink
            href="/pricing"
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "footer_pricing",
              pathway_id: pathway.id,
              destination_type: "marketing_pricing",
              link_target: "marketing_pricing_global",
            }}
            className="mt-4 inline-flex items-center font-semibold text-primary"
          >
            View all plans →
          </MarketingTrackedLink>
        )}
      </div>
    </>
  );
}
