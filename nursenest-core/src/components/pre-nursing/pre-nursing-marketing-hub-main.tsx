import { ExamPathwayHubPremiumModules } from "@/components/exam-pathways/exam-pathway-hub-premium-modules";
import { AdmissionsProductReadinessGrid } from "@/components/pre-nursing/admissions-product-readiness-grid";
import { PreNursingLandingClient } from "@/components/pre-nursing/pre-nursing-landing-client";
import { PreNursingMarketingHubActions } from "@/components/pre-nursing/pre-nursing-marketing-hub-actions";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { preNursingHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

const DEFAULT_PATHWAY_ID = "pre-nursing" as const;

/**
 * Public Pre-Nursing hub body: hero, primary study-mode cards, and the same premium foundations
 * ecosystem as {@link ExamPathwayHubPremiumModules} on pathway-tier hubs (`pre-nursing` / `pre-nursing-ca`).
 */
export async function PreNursingMarketingHubMain({
  heroTitle,
  heroSubtitle,
  linkHref,
  marketingLocale = DEFAULT_MARKETING_LOCALE,
  pathwayId = DEFAULT_PATHWAY_ID,
}: {
  heroTitle: string;
  heroSubtitle: string;
  /** Prefix in-app-safe marketing paths (e.g. `withMarketingLocale`); exam `/us/…` paths must never be prefixed. */
  linkHref: (path: string) => string;
  /** Marketing UI locale for {@link withMarketingLocale} (module grid + hub actions compute hrefs client/server consistently). */
  marketingLocale?: string;
  pathwayId?: typeof DEFAULT_PATHWAY_ID | "pre-nursing-ca";
}) {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Pre-Nursing hub: missing pathway registry entry "${pathwayId}"`);
  }

  const practiceAppPath = pathwayHubAppPracticeTestsHref(pathway.id);
  const practiceHref = loginWithCallback(practiceAppPath);

  const lessonsPublicHref = withMarketingLocale(marketingLocale, "/pre-nursing/lessons");
  const flashcardsPublicHref = withMarketingLocale(marketingLocale, "/flashcards");
  const examsPublicHref = withMarketingLocale(marketingLocale, "/pre-nursing/mini-cat");
  const practicePublicHref = withMarketingLocale(marketingLocale, practiceHref);

  const { crumbs, schemaItems } = preNursingHubBreadcrumbs();
  const localizedCrumbs = crumbs.map((c) => (c.href ? { ...c, href: linkHref(c.href) } : c));

  return (
    <div
      className="nn-pre-nursing-marketing-hub mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
      data-nn-nursing-tier-hub="surface"
      data-nn-qa-pre-nursing-marketing-hub=""
    >
      <PreNursingSurfaceAnalytics surface="hub" />
      <BreadcrumbBar
        crumbs={localizedCrumbs}
        schemaItems={schemaItems}
        navClassName="nn-marketing-caption text-[var(--theme-muted-text)]"
      />
      <section className="nn-pre-nursing-hub-shell space-y-8" aria-labelledby="pre-nursing-hero-heading">
        <PreNursingMarketingHubActions
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          lessonsHref={lessonsPublicHref}
          flashcardsHref={flashcardsPublicHref}
          practiceHref={practicePublicHref}
          examsHref={examsPublicHref}
        />

        <AdmissionsProductReadinessGrid />

        <div className="space-y-6 pt-2">
          <PreNursingLandingClient modulesOnly marketingLocale={marketingLocale} />
        </div>

        <ExamPathwayHubPremiumModules pathway={pathway} isSignedIn={false} rootClassName="mt-2 sm:mt-4" />
      </section>
    </div>
  );
}
