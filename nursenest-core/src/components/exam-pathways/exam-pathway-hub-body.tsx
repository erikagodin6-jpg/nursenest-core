"use client";

import Link from "next/link";
import { ExamFamily } from "@prisma/client";
import { ArrowRight, ClipboardList } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { catPathwayExamCodeLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { ExamPathwayHubPrimaryStudyCards, type HubLessonProgress } from "@/components/exam-pathways/exam-pathway-hub-study-modes";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";

const US_NP_SIBLING_IDS = [
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "us-np-pmhnp",
] as const;

type Props = {
  pathway: ExamPathwayDefinition;
  isSignedIn: boolean;
  /** NP practice-test SEO landings: highlight in-app CAT practice tests. */
  emphasizeCatPracticeTests?: boolean;
  /** Request path for this hub overview (e.g. `/us/rn/nclex-rn` or NP alias). Used for `/cat` intro links. */
  marketingHubPath: string;
  /** When set, all hub CTAs include `np_seo_alias_segment` + `from_np_seo_alias` for PostHog. */
  npSeoAliasSegment?: string;
  conversionSectionHeading?: string;
  conversionSectionLead?: string;
  /** Lesson completion snapshot for signed-in learners. */
  hubProgress?: HubLessonProgress | null;
  /** Pathway lesson catalogue total — passed through to the Lessons card progress bar. */
  pathwayLessonCount?: number;
};

export function ExamPathwayHubBody({
  pathway,
  isSignedIn,
  emphasizeCatPracticeTests = false,
  marketingHubPath,
  npSeoAliasSegment,
  conversionSectionHeading,
  conversionSectionLead,
  hubProgress,
  pathwayLessonCount,
}: Props) {
  const { t } = useMarketingI18n();
  const isWaitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";
  const pathwayCatIntroHref = `${marketingHubPath.replace(/\/$/, "")}/cat`;
  const catAppStartHref = appPathwayCatSessionStartPath(pathway.id);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
  const tertiaryHref = isSignedIn ? "/app" : pricingHref;
  const tertiaryLabel = isSignedIn ? t("components.examPathwayHub.body.tertiaryApp") : t("components.examPathwayHub.body.tertiaryPricing");
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const catExamLabel = catPathwayExamCodeLabel(pathway);
  const usNpSiblings =
    pathway.examFamily === ExamFamily.NP &&
    pathway.countrySlug === "us" &&
    pathway.status === "active" &&
    US_NP_SIBLING_IDS.includes(pathway.id as (typeof US_NP_SIBLING_IDS)[number])
      ? US_NP_SIBLING_IDS.map((id) => getExamPathwayById(id)).filter((p): p is ExamPathwayDefinition => Boolean(p && p.id !== pathway.id))
      : [];

  return (
    <>
      <ExamPathwayHubPrimaryStudyCards
        pathway={pathway}
        lessonsHref={lessonsHref}
        questionsHref={questionsHref}
        pathwayCatIntroHref={pathwayCatIntroHref}
        catAppStartHref={catAppStartHref}
        isSignedIn={isSignedIn}
        emphasizeCatPracticeTests={emphasizeCatPracticeTests}
        npSeoAliasSegment={npSeoAliasSegment}
        hubProgress={hubProgress}
        pathwayLessonCount={pathwayLessonCount}
      />

      {usNpSiblings.length > 0 ? (
        <aside className="nn-study-card nn-study-card--wash mt-8 px-4 py-4 sm:px-5" aria-labelledby="us-np-sibling-tracks">
          <p id="us-np-sibling-tracks" className="nn-marketing-label">
            {t("components.examPathwayHub.body.npSiblingsLabel")}
          </p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            {t("components.examPathwayHub.body.npSiblingsLead")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {usNpSiblings.map((p) => (
              <li key={p.id}>
                <Link
                  href={buildExamPathwayPath(p)}
                  className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:border-primary/40"
                >
                  {p.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

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
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full nn-btn-primary px-8 py-3 text-base font-semibold shadow-none transition hover:brightness-[1.03] sm:w-auto sm:min-h-[56px]"
        >
          {isWaitlist ? t("components.examPathwayHub.body.ctaJoinOrSignIn") : t("components.examPathwayHub.body.ctaCreateAccount")}
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
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--theme-primary)_24%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--bg-card))] px-8 py-3 text-base font-semibold text-[var(--theme-primary)] transition hover:bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--bg-card))] sm:w-auto sm:min-h-[56px]"
        >
          {t("components.examPathwayHub.body.tryQuestions", { shortName: pathway.shortName })}
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
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full nn-btn-secondary px-6 py-2.5 text-sm font-semibold sm:w-auto"
        >
          {tertiaryLabel}
        </MarketingTrackedLink>
      </div>

      {emphasizeCatPracticeTests ? (
        <div className="nn-study-callout mt-6 px-4 py-4 sm:px-5">
          <p className="nn-marketing-h4">{t("components.examPathwayHub.body.catStripTitle")}</p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{t("components.examPathwayHub.body.catStripBody")}</p>
          {isSignedIn ? (
            <MarketingTrackedLink
              href={catAppStartHref}
              event={PH.marketingPathwayHubCta}
              eventProps={{
                ...linkCtx,
                surface: "cat_practice_strip",
                pathway_id: pathway.id,
                signed_in: true,
                destination_type: "cat_practice_tests",
                link_target: "app_pathway_cat_start",
              }}
              className="nn-marketing-body-sm mt-3 inline-flex font-semibold text-primary hover:underline"
            >
              {t("components.examPathwayHub.body.catCtaSignedIn", { exam: catExamLabel })}
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
              className="nn-marketing-body-sm mt-3 inline-flex font-semibold text-primary hover:underline"
            >
              {t("components.examPathwayHub.body.catCtaSignup", { exam: catExamLabel })}
            </MarketingTrackedLink>
          )}
        </div>
      ) : null}

      <aside className="nn-study-card nn-study-card--wash mt-10 px-4 py-4 sm:px-5">
        <p className="nn-marketing-label">{t("components.examPathwayHub.body.prepRhythmLabel")}</p>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          {t("components.examPathwayHub.body.prepRhythmLine1")}{" "}
          <Link href={lessonsHref} className="font-semibold text-primary hover:underline">
            {t("components.examPathwayHub.body.prepLessonsLink")}
          </Link>
          {t("components.examPathwayHub.body.prepRhythmLine2")}{" "}
          <Link href={questionsHref} className="font-semibold text-primary hover:underline">
            {t("components.examPathwayHub.body.prepQuestionsLink")}
          </Link>
          {t("components.examPathwayHub.body.prepRhythmLine3")}{" "}
          <Link href={HUB.practiceExams} className="font-semibold text-primary hover:underline">
            {t("components.examPathwayHub.body.prepExamsLink")}
          </Link>
          {t("components.examPathwayHub.body.prepRhythmLine4")}{" "}
          <Link href="/lessons" className="font-semibold text-primary hover:underline">
            {t("components.examPathwayHub.body.prepDirectoryLink")}
          </Link>
          {t("components.examPathwayHub.body.prepRhythmEnd")}
        </p>
      </aside>

      <h2 className="nn-marketing-h2 mt-14">
        {conversionSectionHeading ?? t("components.examPathwayHub.body.conversionHeadingDefault")}
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
        {conversionSectionLead ?? t("components.examPathwayHub.body.conversionLeadDefault")}
      </p>
      <ul className="nn-marketing-body-sm mt-4 list-inside list-disc space-y-1.5 text-[var(--theme-body-text)]">
        <li>
          <span className="font-semibold text-[var(--theme-heading-text)]">{t("components.examPathwayHub.body.bulletPracticeItems")}</span>{" "}
          {t("components.examPathwayHub.body.bulletPracticeItemsBody")}
        </li>
        <li>
          <span className="font-semibold text-[var(--theme-heading-text)]">{t("components.examPathwayHub.body.bulletLessons")}</span>{" "}
          {t("components.examPathwayHub.body.bulletLessonsBody")}
        </li>
        <li>
          <span className="font-semibold text-[var(--theme-heading-text)]">{t("components.examPathwayHub.body.bulletFlashcards")}</span>{" "}
          {t("components.examPathwayHub.body.bulletFlashcardsBody")}
        </li>
        <li>
          <span className="font-semibold text-[var(--theme-heading-text)]">{t("components.examPathwayHub.body.bulletPracticeExams")}</span>{" "}
          {t("components.examPathwayHub.body.bulletPracticeExamsBody")}
        </li>
      </ul>

      <div className="mt-6 max-w-md">
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
          className="nn-study-card nn-card-interactive flex h-full min-h-[11rem] flex-col p-5 sm:min-h-[12rem]"
        >
          <ClipboardList className="h-5 w-5 text-primary" aria-hidden />
          <span className="nn-marketing-h4 mt-3">{t("components.examPathwayHub.body.pricingCardTitle")}</span>
          <span className="nn-marketing-body-sm mt-2 text-[var(--theme-body-text)]">
            {t("components.examPathwayHub.body.pricingCardBody", { countryCode: pathway.countryCode })}
          </span>
          <span className="nn-marketing-body-sm mt-auto inline-flex items-center pt-4 font-semibold text-primary">
            {t("components.examPathwayHub.body.pricingCardCta")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </MarketingTrackedLink>
      </div>

      {isSignedIn ? (
        <>
          <h2 className="nn-marketing-h2 mt-14">{t("components.examPathwayHub.body.signedInHeading")}</h2>
          <ul
            className={`mt-4 grid gap-3 ${emphasizeCatPracticeTests ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}
          >
            <li>
              <MarketingTrackedLink
                href={pathwayHubAppQuestionsHref(pathway.id)}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "shortcut_questions",
                  pathway_id: pathway.id,
                  signed_in: true,
                  destination_type: "app_questions",
                  link_target: "app_questions",
                }}
                className="nn-study-card nn-card-interactive block px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                {t("components.examPathwayHub.body.shortcutQuestions")}
              </MarketingTrackedLink>
            </li>
            {emphasizeCatPracticeTests ? (
              <li>
                <MarketingTrackedLink
                  href={catAppStartHref}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{
                    ...linkCtx,
                    surface: "shortcut_cat_practice",
                    pathway_id: pathway.id,
                    signed_in: true,
                    destination_type: "cat_practice_tests",
                    link_target: "app_pathway_cat_start",
                  }}
                  className="nn-study-card nn-card-interactive block px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)]"
                >
                  {t("components.examPathwayHub.body.shortcutCat", { exam: catExamLabel })}
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
                className="nn-study-card nn-card-interactive block px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                {t("components.examPathwayHub.body.shortcutDashboard")}
              </MarketingTrackedLink>
            </li>
          </ul>
        </>
      ) : null}

      <div className="nn-study-card nn-study-card--wash mt-12 p-5">
        <p className="nn-marketing-body-sm text-[var(--theme-body-text)]">
          {t("components.examPathwayHub.body.footerEntitlements", {
            shortName: pathway.shortName,
            tier: String(pathway.stripeTier),
            countryCode: pathway.countryCode,
          })}
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
            {t("components.examPathwayHub.body.ctaJoinOrSignInFooter")}
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
            {t("components.examPathwayHub.body.viewAllPlans")}
          </MarketingTrackedLink>
        )}
      </div>
    </>
  );
}
