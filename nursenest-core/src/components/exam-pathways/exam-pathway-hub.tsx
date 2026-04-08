import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { NpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { pathwayHubFaqSchema } from "@/lib/seo/pathway-hub-faq-schema";
import { ExamPathwayHubBody } from "@/components/exam-pathways/exam-pathway-hub-body";
import { NpSeoAliasHubAnalytics } from "@/components/marketing/np-seo-alias-hub-analytics";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { NpPathwayInventoryGate } from "@/lib/np/np-pathway-inventory-gate";

export function ExamPathwayHub({
  pathway,
  isSignedIn = false,
  npInventory = null,
  heroTitle,
  heroLead,
  emphasizeCatPracticeTests = false,
  marketingHubPath,
  npPracticeSeo,
  npSeoAliasSegment,
}: {
  pathway: ExamPathwayDefinition;
  isSignedIn?: boolean;
  npInventory?: NpPathwayInventoryGate | null;
  /** NP SEO landing (`aanp-practice-test`, …) overrides the default hub headline. */
  heroTitle?: string;
  heroLead?: string;
  /** Surfaces CAT practice-test entry (signed-in → `/app/practice-tests`). */
  emphasizeCatPracticeTests?: boolean;
  /** Request path for the hub crumb. On NP alias overviews, equals the keyword URL (self-canonical). Subpages omit hubBasePath in breadcrumbs — see `np-seo-alias-canonical-policy.ts`. */
  marketingHubPath: string;
  /** Full NP alias copy when on a board-named URL. */
  npPracticeSeo?: NpPracticeTestLandingCopy | null;
  /** Third path segment when it is an NP SEO alias (e.g. `aanp-practice-test`). */
  npSeoAliasSegment?: string;
}) {
  const hubOpts = { hubBasePath: marketingHubPath };
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, hubOpts);
  const countryLine = pathway.countrySlug === "canada" ? "Canada" : "United States";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      {npSeoAliasSegment ? (
        <NpSeoAliasHubAnalytics
          pathwayId={pathway.id}
          aliasSegment={npSeoAliasSegment}
          canonicalPathwayHubPath={buildExamPathwayPath(pathway)}
          countrySlug={pathway.countrySlug}
          examFamily={String(pathway.examFamily)}
        />
      ) : null}
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pathwayHubFaqSchema(pathway)} />
      <div className="mb-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {countryLine} · {pathway.boardLabel ?? pathway.roleTrack.toUpperCase()}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
        {heroTitle ?? pathway.displayName}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-lg">
        {heroLead ?? pathway.seoDescription}
      </p>

      {pathway.status === "upcoming" ? (
        <aside className="nn-card mt-8 border-amber-200/80 bg-amber-50/60 p-4 text-sm text-foreground">
          <p className="font-semibold">Upcoming or transitioning pathway</p>
          <p className="mt-1 text-[var(--theme-muted-text)]">
            Exam branding and registration rules can change (especially Canadian NP integration). This hub stays updated: join the list or
            start from an active track if you test sooner.
          </p>
        </aside>
      ) : null}

      {npInventory?.belowThreshold ? (
        <aside className="nn-card mt-6 border-border bg-[var(--theme-muted-surface)] p-4 text-sm text-[var(--theme-body-text)]">
          <p className="font-semibold text-[var(--theme-heading-text)]">Content depth (transparent)</p>
          <p className="mt-1 leading-relaxed text-[var(--theme-muted-text)]">{npInventory.noticeMarkdown}</p>
        </aside>
      ) : null}

      {npPracticeSeo ? (
        <section className="nn-card mt-8 border border-[var(--theme-card-border)] bg-card p-4 sm:p-5" aria-labelledby="np-alias-support-heading">
          <h2 id="np-alias-support-heading" className="text-base font-bold text-[var(--theme-heading-text)]">
            {npPracticeSeo.supportSectionHeading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">{npPracticeSeo.supportSectionBody}</p>
        </section>
      ) : null}

      <ExamPathwayHubBody
        pathway={pathway}
        isSignedIn={isSignedIn}
        emphasizeCatPracticeTests={emphasizeCatPracticeTests}
        npSeoAliasSegment={npSeoAliasSegment}
        conversionSectionHeading={npPracticeSeo?.conversionSectionHeading}
        conversionSectionLead={npPracticeSeo?.conversionSectionLead}
      />
    </div>
  );
}
