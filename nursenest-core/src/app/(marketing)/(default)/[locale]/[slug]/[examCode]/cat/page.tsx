import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  assessCatEligibilityForSubscriberAndPathway,
  assessMarketingCatSurfaceWithoutAuth,
} from "@/lib/exam-pathways/cat-eligibility";
import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import {
  pathwayCatLandingSubtitle,
  pathwayCatLandingTitle,
  pathwayCatMetadataDescription,
} from "@/lib/exam-pathways/pathway-cat-marketing-copy";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { pathwayCatPracticeBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeServerLog } from "@/lib/observability/safe-server-log";
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
      const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname: catPath });
      if (!pathway) {
        return { robots: { index: false, follow: true } };
      }
      const readinessConfig = readinessConfigForPathway(pathway);
      const publicCopy = publicCopyForReadinessConfig(readinessConfig);
      const country = pathway.countrySlug === "canada" ? "Canada" : "United States";
      const title = `${pathwayCatLandingTitle(pathway)} · ${country} | NurseNest`;
      const description = pathwayCatMetadataDescription(pathway, publicCopy);
      return {
        title,
        description,
        robots: { index: false, follow: true },
      };
    },
    { pathname: catPath, locale: countrySlug, routeGroup: "marketing.exam_hub.cat" },
  );
}

export default async function PathwayCatEntryPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname: `${pathname}/cat` });
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
  const readinessConfig = readinessConfigForPathway(pathway);
  const publicCopy = publicCopyForReadinessConfig(readinessConfig);
  const landingTitle = pathwayCatLandingTitle(pathway);
  const landingSubtitle = pathwayCatLandingSubtitle(pathway, publicCopy);
  const howItWorksItems =
    publicCopy.effectiveMode === "production_ready" && readinessConfig.engineType === "CAT"
      ? [
          "Each answer updates the estimate of your ability (θ).",
          "Item difficulty adapts so the exam targets your level efficiently.",
          "Stopping rules mirror exam-style precision rules when enough evidence is gathered.",
        ]
      : publicCopy.effectiveMode === "mini_adaptive"
        ? [
            "A shorter adaptive run for progress checks between full-length sessions.",
            "Difficulty still responds to performance, with a smaller item budget.",
            "Use results to spot weak categories before a full CAT attempt.",
          ]
        : publicCopy.effectiveMode === "simulation"
          ? [
              "Scenario-style progression with timed pacing.",
              "High-yield topics weighted for this pathway.",
              "Results highlight follow-up in lessons and the question bank.",
            ]
          : [
              "Adaptive scoring calibrates to your current performance.",
              "Works alongside lessons and targeted question practice.",
              "Coverage expands as the pathway bank grows.",
            ];
  const isCatAvailable =
    assessment.marketingPrimaryCta === "open_app_cat" || assessment.marketingPrimaryCta === "sign_in_to_cat";
  const lockedReasonCopy =
    assessment.reason === "wrong_subscription_tier"
      ? `Your current plan or country track does not include ${catShort} on this pathway.`
      : assessment.reason === "no_subscription"
        ? `An active plan that covers ${catShort} is required to launch a session from here.`
        : assessment.reason === "unauthenticated"
          ? `Sign in with a plan that includes ${catShort} to start in the app.`
          : assessment.safeUserMessage;
  const lockedContextCopy =
    assessment.reason === "wrong_subscription_tier" || assessment.reason === "no_subscription"
      ? "You can still use lessons and practice questions from this hub while you review billing or study preferences."
      : null;
  const lockedQuestionBankCopy =
    questionSnapshot.status === "ok"
      ? `You have access to ${questionSnapshot.pathwayScopedCount} practice questions on this pathway.`
      : "You have access to practice questions for this pathway.";
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
  const scoringNote =
    readinessConfig.engineType === "CAT"
      ? `Results compare your estimated ability to a pathway passing-standard band (not a government or board certificate).`
      : `Results summarize performance against this pathway’s practice simulation rules.`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <MarketingPathwayCatViewBeacon pathway={pathway} hubPath={marketingCatPath} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <Link href={overviewHref} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{landingTitle}</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {landingSubtitle}{" "}
        <strong className="text-[var(--theme-heading-text)]">Region: {countryLabel}</strong> ({pathway.displayName}).
      </p>
      {publicCopy.strongSimulationClaim ? (
        <p className="mt-2 text-sm font-medium text-[var(--theme-heading-text)]">
          Exam-style delivery: one question at a time, timed, with constraints matched to this pathway.
        </p>
      ) : null}
      {publicCopy.betaLabel ? (
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">CAT surface ({publicCopy.betaLabel})</p>
      ) : null}

      <section className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Session setup</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
          <li>
            <span className="font-semibold">Question range:</span> {readinessConfig.questionRange}
          </li>
          <li>
            <span className="font-semibold">Time estimate:</span> {readinessConfig.timeEstimate}
          </li>
          <li>
            <span className="font-semibold">Time limit:</span> {readinessConfig.timeLimitMinutes} minutes (enforced in-app
            when timed mode is on)
          </li>
          <li>
            <span className="font-semibold">Experience:</span> {publicCopy.experienceLabel}
          </li>
          <li>
            <span className="font-semibold">Navigation:</span>{" "}
            {readinessConfig.allowBackNavigation
              ? "Back navigation allowed between items."
              : "No backtracking after you submit an answer (exam-style)."}
          </li>
          <li>
            <span className="font-semibold">Scoring:</span> {scoringNote}
          </li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">How CAT works</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
          {howItWorksItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">After the session</h2>
        <p className="mt-2 text-sm text-[var(--theme-body-text)]">
          In the app you get a report-style breakdown: estimate band, category performance, strengths, focus areas, and
          links back into lessons, flashcards, and the question bank for weak topics.
        </p>
      </section>

      <PathwayLiveInventoryStrip pathway={pathway} questionSnapshot={questionSnapshot} variant="cat" />

      <section
        className={`mt-6 rounded-2xl border border-[var(--semantic-border-soft)] p-5 ${
          isCatAvailable ? "bg-[var(--semantic-panel-positive)]" : "bg-[var(--semantic-surface)]"
        }`}
        aria-label="CAT access and next steps"
      >
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">
          {isCatAvailable ? "Start or continue" : "Access"}
        </h2>
        {isCatAvailable ? (
          <>
            <p className="mt-2 text-sm text-[var(--theme-body-text)]">
              Launch the in-app CAT shell (one question at a time, timer, exam controls). You can warm up in the
              question bank first if you prefer.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={
                  assessment.marketingPrimaryCta === "sign_in_to_cat"
                    ? signInReturnHref
                    : (assessment.appCatStartPath ?? appPathwayCatSessionStartPath(pathway.id))
                }
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
              >
                {assessment.marketingPrimaryCta === "sign_in_to_cat" ? `Sign in to start ${catShort}` : `Start ${catShort}`}
              </Link>
              <Link
                href={questionsHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
              >
                Practice questions first
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-[var(--theme-body-text)]">{lockedReasonCopy}</p>
            {lockedContextCopy ? <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{lockedContextCopy}</p> : null}
            <p className="mt-3 text-sm text-[var(--theme-muted-text)]">{lockedQuestionBankCopy}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {assessment.reason === "unauthenticated" ? (
                <Link
                  href={signInReturnHref}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
                >
                  Sign in for {catShort}
                </Link>
              ) : assessment.reason === "no_subscription" || assessment.reason === "wrong_subscription_tier" ? (
                <Link
                  href={pricingHref}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
                >
                  View plans for CAT access
                </Link>
              ) : null}
              <Link
                href={questionsHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
              >
                Open question bank
              </Link>
              <Link
                href={lessonsHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
              >
                Browse lessons
              </Link>
            </div>
          </>
        )}
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
