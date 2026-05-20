/**
 * Glossary breadcrumbs — pathway-scoped and global nursing glossary.
 */

import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import {
  getBreadcrumbRoot,
  pathwayExamRoot,
  pathwayLessonsRoot,
  rootCrumbFromDefinition,
  rootSchemaFromDefinition,
} from "@/lib/breadcrumbs/breadcrumb-root-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import {
  canonicalBreadcrumbHref,
  glossaryHubHref,
  glossaryTermHref,
} from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";

function homePair() {
  const home = getBreadcrumbRoot("home")!;
  return {
    crumb: rootCrumbFromDefinition(home, true),
    schema: rootSchemaFromDefinition(home),
  };
}

function governedGlossary(
  pathname: string,
  crumbs: BreadcrumbResolution["crumbs"],
  schemaItems: BreadcrumbResolution["schemaItems"],
  opts?: { competencyId?: string | null; topicSlug?: string | null },
): BreadcrumbResolution {
  return applyGovernedBreadcrumbResolution({
    resolution: { crumbs, schemaItems },
    surface: "glossary",
    pathname,
    canonicalRootId: "glossary",
    competencyId: opts?.competencyId,
    topicSlug: opts?.topicSlug,
  });
}

/** Pathway glossary index: Home → {Exam} → Glossary */
export function glossaryIndexBreadcrumbs(examLabel: string, examPath: string): BreadcrumbResolution {
  const { crumb: homeCrumb, schema: homeSchema } = homePair();
  const glossary = getBreadcrumbRoot("glossary")!;
  const glossaryPath = `${examPath.replace(/\/$/, "")}/glossary`;
  return governedGlossary(
    glossaryPath,
    [
      homeCrumb,
      { name: examLabel, href: examPath },
      rootCrumbFromDefinition(glossary, false),
    ],
    [
      homeSchema,
      { name: examLabel, item: canonicalBreadcrumbHref(examPath) },
      { name: glossary.label, item: canonicalBreadcrumbHref(glossaryPath) },
    ],
  );
}

/** Pathway term: Home → {Exam} → Glossary → {Term} */
export function glossaryTermBreadcrumbs(
  examLabel: string,
  examPath: string,
  termLabel: string,
  termPath: string,
): BreadcrumbResolution {
  const { crumb: homeCrumb, schema: homeSchema } = homePair();
  const glossaryPath = `${examPath.replace(/\/$/, "")}/glossary`;
  const term = canonicalBreadcrumbHref(termPath);
  return governedGlossary(
    termPath,
    [
      homeCrumb,
      { name: examLabel, href: examPath },
      { name: "Glossary", href: glossaryPath },
      { name: termLabel, href: undefined },
    ],
    [
      homeSchema,
      { name: examLabel, item: canonicalBreadcrumbHref(examPath) },
      { name: "Glossary", item: canonicalBreadcrumbHref(glossaryPath) },
      { name: termLabel, item: term },
    ],
  );
}

/** Global nursing glossary hub */
export function nursingGlossaryHubBreadcrumbs(): BreadcrumbResolution {
  const glossary = getBreadcrumbRoot("glossary")!;
  const path = glossaryHubHref();
  const { crumb: homeCrumb, schema: homeSchema } = homePair();
  return governedGlossary(
    path,
    [homeCrumb, rootCrumbFromDefinition(glossary, false)],
    [homeSchema, rootSchemaFromDefinition(glossary)],
  );
}

/** Global term with pathway exam context: Home → {Exam} → Glossary → {Term} */
export function nursingGlossaryTermBreadcrumbs(input: {
  pathway: ExamPathwayDefinition;
  termLabel: string;
  termSlug: string;
  topicSlug: string;
}): BreadcrumbResolution {
  const exam = pathwayExamRoot(input.pathway);
  const glossary = getBreadcrumbRoot("glossary")!;
  const termPath = glossaryTermHref(input.termSlug);
  const competency = resolveRnCompetencyForTopic(input.topicSlug);
  const { crumb: homeCrumb, schema: homeSchema } = homePair();
  return governedGlossary(
    termPath,
    [
      homeCrumb,
      rootCrumbFromDefinition(exam, true),
      rootCrumbFromDefinition(glossary, true),
      { name: input.termLabel, href: undefined },
    ],
    [
      homeSchema,
      rootSchemaFromDefinition(exam),
      rootSchemaFromDefinition(glossary),
      { name: input.termLabel, item: canonicalBreadcrumbHref(termPath) },
    ],
    { competencyId: competency?.id ?? null, topicSlug: input.topicSlug },
  );
}

/** Education-first pathway glossary using registry (preferred for NCLEX hubs). */
export function pathwayGlossaryTermBreadcrumbs(
  pathway: ExamPathwayDefinition,
  termLabel: string,
  termSlug: string,
  topicSlug: string,
): BreadcrumbResolution {
  const exam = pathwayExamRoot(pathway);
  const glossary = getBreadcrumbRoot("glossary")!;
  const termPath = glossaryTermHref(termSlug);
  const competency = resolveRnCompetencyForTopic(topicSlug);
  const { crumb: homeCrumb, schema: homeSchema } = homePair();
  return governedGlossary(
    termPath,
    [
      homeCrumb,
      rootCrumbFromDefinition(exam, true),
      rootCrumbFromDefinition(glossary, true),
      { name: termLabel, href: undefined },
    ],
    [
      homeSchema,
      rootSchemaFromDefinition(exam),
      rootSchemaFromDefinition(glossary),
      { name: termLabel, item: canonicalBreadcrumbHref(termPath) },
    ],
    { competencyId: competency?.id ?? null, topicSlug },
  );
}
