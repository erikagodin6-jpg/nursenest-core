import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  assessCatEligibilityForSubscriberAndPathway,
  assessMarketingCatSurfaceWithoutAuth,
} from "@/lib/exam-pathways/cat-eligibility";
import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import {
  appPathwayCatSessionStartPath,
} from "@/lib/exam-pathways/pathway-cat-flow";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { pathwayCatPracticeBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { MarketingPathwayCatViewBeacon } from "@/components/observability/marketing-study-surface-view-beacons";
import { getExamLabel, getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

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
      const readinessConfig = readinessConfigForPathway(pathway);
      const publicCopy = publicCopyForReadinessConfig(readinessConfig);
      const country = pathway.countrySlug === "canada" ? "Canada" : "United States";
      const uiCountry = pathway.countrySlug === "canada" ? "CA" : "US";
      const pnRoleLabel = pathway.examFamily === "NCLEX_PN" || pathway.examFamily === "REX_PN"
        ? getNursingRoleLabel({ country: uiCountry, role: "PN" })
        : null;
      const pnExamLabel = pathway.examFamily === "NCLEX_PN" || pathway.examFamily === "REX_PN"
        ? getExamLabel({ country: uiCountry, role: "PN" })
        : null;
      const resolvedTitle = pnExamLabel ? `${pnExamLabel} Readiness Exam` : publicCopy.title;
      const resolvedSubtitle = pnRoleLabel
        ? `${pnRoleLabel} licensing exam`
        : `${publicCopy.subtitle} for ${pathway.displayName}. Sign in to run a session matched to your pathway.`;
      return {
        title: `${resolvedTitle} · ${country} | NurseNest`,
        description: resolvedSubtitle,
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
  const uiCountry = pathway.countrySlug === "canada" ? "CA" : "US";
  const pnRoleLabel = pathway.examFamily === "NCLEX_PN" || pathway.examFamily === "REX_PN"
    ? getNursingRoleLabel({ country: uiCountry, role: "PN" })
    : null;
  const pnExamLabel = pathway.examFamily === "NCLEX_PN" || pathway.examFamily === "REX_PN"
    ? getExamLabel({ country: uiCountry, role: "PN" })
    : null;
  const publicTitle = pnExamLabel ? `${pnExamLabel} Readiness Exam` : publicCopy.title;
  const publicSubtitle = pnRoleLabel ? `${pnRoleLabel} licensing exam` : publicCopy.subtitle;
  const howItWorksItems =
    publicCopy.effectiveMode === "production_ready" && readinessConfig.engineType === "CAT"
      ? [
          "Adapts to your performance",
          "Adjusts difficulty after each question",
          "Determines if you are above passing level under exam-style stopping rules",
        ]
      : publicCopy.effectiveMode === "mini_adaptive"
        ? [
            "Adapts question difficulty as you answer",
            "Provides a short readiness check for your current level",
            "Highlights weak categories to review before full readiness testing",
          ]
        : publicCopy.effectiveMode === "simulation"
          ? [
              "Covers exam-relevant scenarios across key categories",
              "Uses timed progression to simulate test pressure",
              "Returns readiness guidance and weak-area follow-up",
            ]
          : [
          "Covers exam-relevant topics",
          "Adaptive scoring calibrates to your current performance",
          "Use with lessons and question practice while coverage expands",
          ];
  const primaryCtaLabel = pnExamLabel
    ? `Start ${pnExamLabel} Practice`
    : publicCopy.effectiveMode === "production_ready"
      ? "Start Readiness Exam"
      : "Start Assessment";
  const questionsFirstLabel =
    publicCopy.effectiveMode === "production_ready"
      ? "Practice Questions First"
      : "Practice Questions";
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
  const isCatAvailable =
    assessment.marketingPrimaryCta === "open_app_cat" || assessment.marketingPrimaryCta === "sign_in_to_cat";
  const lockedReasonCopy =
    assessment.reason === "wrong_subscription_tier"
      ? `Your current tier or country track does not include the Readiness Exam for ${catShort}.`
      : assessment.reason === "no_subscription"
        ? `Your plan does not include the Readiness Exam for ${catShort}.`
        : assessment.reason === "unauthenticated"
          ? `Sign in with a plan that includes the Readiness Exam for ${catShort}.`
          : assessment.safeUserMessage;
  const lockedContextCopy =
    assessment.reason === "wrong_subscription_tier" || assessment.reason === "no_subscription"
      ? "This usually means your current plan is the wrong tier, on the wrong country track, or does not include this exam."
      : null;
  const lockedQuestionBankCopy =
    questionSnapshot.status === "ok"
      ? `You have access to ${questionSnapshot.pathwayScopedCount} practice questions.`
      : "You have access to practice questions for this pathway.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <MarketingPathwayCatViewBeacon pathway={pathway} hubPath={marketingCatPath} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <Link href={overviewHref} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">
        {publicTitle}
      </h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {publicSubtitle} for <strong className="text-[var(--theme-heading-text)]">{countryLabel}</strong>
        {pnRoleLabel ? "." : <> ({pathway.displayName}).</>}
      </p>
      {publicCopy.strongSimulationClaim ? (
        <p className="mt-2 text-sm font-medium text-[var(--theme-heading-text)]">
          This is the closest simulation to the real exam.
        </p>
      ) : null}
      {publicCopy.betaLabel ? (
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Adaptive Practice ({publicCopy.betaLabel})</p>
      ) : null}

      {isCatAvailable ? (
        <>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={
                assessment.marketingPrimaryCta === "sign_in_to_cat"
                  ? signInReturnHref
                  : (assessment.appCatStartPath ?? appPathwayCatSessionStartPath(pathway.id))
              }
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={questionsHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
            >
              {questionsFirstLabel}
            </Link>
          </div>

          <PathwayLiveInventoryStrip pathway={pathway} questionSnapshot={questionSnapshot} variant="cat" />

          <section className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">How it works</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
              {howItWorksItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Who this is for</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
              <li>Finished studying core topics</li>
              <li>Practiced questions</li>
              <li>Ready to test readiness</li>
            </ul>
          </section>

          <section className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">What to expect</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
              <li>
                <span className="font-semibold">Question range:</span> {readinessConfig.questionRange}
              </li>
              <li>
                <span className="font-semibold">Time estimate:</span> {readinessConfig.timeEstimate}
              </li>
              <li>
                <span className="font-semibold">Time limit:</span> {readinessConfig.timeLimitMinutes} minutes
              </li>
              <li>
                <span className="font-semibold">Experience:</span> {publicCopy.experienceLabel}
              </li>
              <li>
                <span className="font-semibold">Navigation:</span>{" "}
                {readinessConfig.allowBackNavigation
                  ? "Back navigation allowed."
                  : "No backtracking once an answer is submitted."}
              </li>
            </ul>
          </section>

          <section className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">After the exam</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
              <li>Readiness score</li>
              <li>Weak areas</li>
              <li>Recommended next steps</li>
            </ul>
          </section>
        </>
      ) : (
        <section className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Readiness exam locked for your current plan</h2>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{lockedReasonCopy}</p>
          {lockedContextCopy ? <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{lockedContextCopy}</p> : null}
          <p className="mt-3 text-sm text-[var(--theme-muted-text)]">{lockedQuestionBankCopy}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={pricingHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
            >
              Unlock Readiness Exam
            </Link>
            <Link
              href={questionsHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
            >
              Start Practice Questions
            </Link>
            <Link
              href={lessonsHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
            >
              Browse Lessons
            </Link>
          </div>
        </section>
      )}

      {isCatAvailable ? (
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
      ) : null}
    </div>
  );
}
