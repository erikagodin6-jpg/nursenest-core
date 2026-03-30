import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { pathwayHubFaqSchema } from "@/lib/seo/pathway-hub-faq-schema";
import { getPathwayProgrammaticSeoLanding } from "@/lib/seo/pathway-programmatic-seo";
import { ExamPathwayHubBody } from "@/components/exam-pathways/exam-pathway-hub-body";

export function ExamPathwayHub({ pathway, isSignedIn = false }: { pathway: ExamPathwayDefinition; isSignedIn?: boolean }) {
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway);
  const programmaticLanding = getPathwayProgrammaticSeoLanding(pathway);
  const countryLine = pathway.countrySlug === "canada" ? "Canada" : "United States";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pathwayHubFaqSchema(pathway)} />
      <div className="mb-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {countryLine} · {pathway.boardLabel ?? pathway.roleTrack.toUpperCase()}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
        {pathway.displayName}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-lg">{pathway.seoDescription}</p>

      {pathway.status === "upcoming" ? (
        <aside className="nn-card mt-8 border-amber-200/80 bg-amber-50/60 p-4 text-sm text-foreground">
          <p className="font-semibold">Upcoming or transitioning pathway</p>
          <p className="mt-1 text-[var(--theme-muted-text)]">
            Exam branding and registration rules can change (especially Canadian NP integration). This hub stays updated: join the list or
            start from an active track if you test sooner.
          </p>
        </aside>
      ) : null}

      <ExamPathwayHubBody pathway={pathway} isSignedIn={isSignedIn} discovery={programmaticLanding} />
    </div>
  );
}
