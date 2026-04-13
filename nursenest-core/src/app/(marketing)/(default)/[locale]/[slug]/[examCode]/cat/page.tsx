import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  assessCatEligibilityForSubscriberAndPathway,
  assessMarketingCatSurfaceWithoutAuth,
} from "@/lib/exam-pathways/cat-eligibility";
import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import {
  PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS,
  appPathwayCatSessionStartPath,
} from "@/lib/exam-pathways/pathway-cat-flow";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { pathwayCatPracticeBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { MarketingPathwayCatViewBeacon } from "@/components/observability/marketing-study-surface-view-beacons";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const catPath = `${pathname}/cat`;
  return safeGenerateMetadata(
    async () => {
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname: catPath });
      if (!pathway) {
        return { robots: { index: false, follow: true } };
      }
      const country = pathway.countrySlug === "canada" ? "Canada" : "United States";
      return {
        title: `CAT practice · ${pathway.shortName} (${country}) | NurseNest`,
        description: `Pathway-scoped adaptive (CAT) practice for ${pathway.displayName}. One question at a time; sign in to run a session matched to your plan.`,
        robots: { index: false, follow: true },
      };
    },
    { pathname: catPath, locale: countrySlug, routeGroup: "marketing.exam_hub.cat" },
  );
}

export default async function PathwayCatEntryPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname: `${pathname}/cat` });
  if (!pathway) notFound();

  const { questionSnapshot } = await loadMarketingExamHubOptionalBlocks(pathway, {
    pathname: `${pathname}/cat`,
    locale: countrySlug,
    country: countrySlug,
    examCode,
    pathwayId: pathway.id,
    roleTrack,
  });

  const session = await getOptionalPublicSession({
    pathname: `${pathname}/cat`,
    surface: "marketing.exam_hub.cat",
  });
  const userId = (session?.user as { id?: string })?.id ?? "";
  const isSignedIn = Boolean(userId);

  const hubBase = `/${countrySlug}/${roleTrack}/${examCode}`;
  const { crumbs, schemaItems } = pathwayCatPracticeBreadcrumbs(pathway);
  const overviewHref = hubBase;
  const marketingCatPath = buildExamPathwayPath(pathway, "cat");
  /** After login, return to this public CAT page (exam URLs are not locale-prefixed). */
  const signInReturnHref = loginWithCallback(marketingCatPath);

  let assessment = assessMarketingCatSurfaceWithoutAuth(pathway, questionSnapshot);

  if (isSignedIn) {
    const entitlement = await resolveEntitlementForPage(userId);
    if (entitlement === "error") {
      assessment = {
        eligible: false,
        reason: "internal_error",
        nextAction: "retry",
        marketingPrimaryCta: "none",
        safeUserMessage:
          "We could not verify your subscription right now. Try refreshing, or open the question bank while we sort this out.",
        pathway,
        pathwayId: pathway.id,
        marketingCatPath,
        appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
        logCode: "CAT_ENTITLEMENT_VERIFY_FAILED",
      };
      safeServerLog("cat_marketing", "CAT_ENTITLEMENT_VERIFY_FAILED", {
        pathwayId: pathway.id,
        userIdPrefix: userId.slice(0, 8),
      });
    } else {
      assessment = await assessCatEligibilityForSubscriberAndPathway({
        userId,
        entitlement,
        pathway,
      });
    }
    if (!assessment.eligible && assessment.logCode !== "CAT_OK") {
      safeServerLog("cat_marketing", assessment.logCode, {
        pathwayId: pathway.id,
        reason: assessment.reason,
        userIdPrefix: userId.slice(0, 8),
      });
    }
  }

  const countryLabel = pathway.countrySlug === "canada" ? "Canada" : "US";
  const catShort = catPathwayShortCatLabel(pathway);
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
  const appBankHref = `/app/questions?pathwayId=${encodeURIComponent(pathway.id)}`;

  const showExplainerAside =
    assessment.marketingPrimaryCta === "none" || (isSignedIn && !assessment.eligible && assessment.reason !== "ok");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <MarketingPathwayCatViewBeacon pathway={pathway} hubPath={marketingCatPath} />
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={overviewHref} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{catShort}</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        One question at a time, difficulty adjusts from your answers. Pool is limited to{" "}
        <strong className="text-[var(--theme-heading-text)]">{pathway.shortName}</strong> items for {countryLabel} (
        {pathway.displayName}).
      </p>
      <PathwayLiveInventoryStrip pathway={pathway} questionSnapshot={questionSnapshot} variant="cat" />

      <ul className="mt-6 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
        <li>
          <span className="font-semibold">Mode:</span> CAT practice (untimed; rationale unlocks after you finish)
        </li>
        <li>
          <span className="font-semibold">Length cap:</span> up to {PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS} questions
          (server may stop earlier based on adaptive rules)
        </li>
        <li>
          <span className="font-semibold">Requires:</span> an active plan that covers this pathway when you start in the app
        </li>
      </ul>

      {showExplainerAside ? (
        <ContentEmptyState
          variant="cat"
          body={assessment.safeUserMessage}
          showGrowthBadge={assessment.reason === "insufficient_cat_pool"}
          primaryCta={{
            label:
              assessment.nextAction === "upgrade" || assessment.nextAction === "switch_pathway"
                ? "Review your plan"
                : "Study question bank",
            href:
              assessment.nextAction === "upgrade" || assessment.nextAction === "switch_pathway"
                ? "/app/account/billing"
                : questionsHref,
          }}
          secondaryCtas={[
            { label: "Browse lessons", href: lessonsHref },
            ...(assessment.nextAction === "join_waitlist"
              ? [{ label: "Pathway hub", href: overviewHref, variant: "ghost" as const }]
              : []),
            ...(!isSignedIn
              ? [{ label: "Create account", href: "/signup", variant: "ghost" as const }]
              : [{ label: "App question bank", href: appBankHref, variant: "ghost" as const }]),
          ]}
        />
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {assessment.marketingPrimaryCta === "open_app_cat" && assessment.appCatStartPath ? (
          <Link
            href={assessment.appCatStartPath}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
          >
            Start {catShort}
          </Link>
        ) : assessment.marketingPrimaryCta === "sign_in_to_cat" ? (
          <Link
            href={signInReturnHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
          >
            Sign in for {catShort}
          </Link>
        ) : (
          <span className="inline-flex min-h-[48px] cursor-default items-center justify-center rounded-full border border-border bg-muted/50 px-8 py-3 text-sm font-semibold text-muted-foreground">
            {catShort} unavailable — use links below
          </span>
        )}
        <Link
          href={lessonsHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
        >
          Lessons
        </Link>
        <Link
          href={questionsHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
        >
          Question bank
        </Link>
        {(assessment.reason === "no_subscription" || assessment.reason === "wrong_subscription_tier") && (
          <Link
            href={pricingHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 px-8 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Plans &amp; pricing
          </Link>
        )}
        {!isSignedIn ? (
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 px-8 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Create account
          </Link>
        ) : null}
        <Link
          href={HUB.practiceExams}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-dashed border-border px-8 py-3 text-sm font-semibold text-[var(--theme-muted-text)] hover:bg-card sm:w-auto"
        >
          All practice exams (every pathway)
        </Link>
      </div>
    </div>
  );
}
