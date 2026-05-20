/**
 * Canonical breadcrumb root registry — ontology authority for trail labels and hrefs.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { canonicalBreadcrumbHref, canonicalMarketingPath } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";

export type OntologyClassification =
  | "site"
  | "pathway"
  | "academy"
  | "clinical_module"
  | "content_index"
  | "interpretation"
  | "glossary"
  | "case_study"
  | "specialty";

export type BreadcrumbEducationalIntent = "orientation" | "competency" | "interpretation" | "acquisition";

export type BreadcrumbRootDefinition = {
  rootId: string;
  label: string;
  href: string;
  ontologyClassification: OntologyClassification;
  schemaOwner: "page";
  /** Canonical ontology namespace for graph + navigation telemetry. */
  ontologyNamespace: string;
  telemetryNamespace: string;
  educationalIntent: BreadcrumbEducationalIntent;
  /** Optional remediation pathway prefixes linked to this root. */
  remediationPathwayIds: readonly string[];
  /** When true, root is retained for redirects only — do not use in new trails. */
  deprecated?: boolean;
  /** Labels that must never appear as alternate roots (semantic duplication). */
  forbiddenAliasLabels: readonly string[];
};

const ROOTS: Record<string, BreadcrumbRootDefinition> = {
  home: {
    rootId: "home",
    label: "Home",
    href: "/",
    ontologyClassification: "site",
    schemaOwner: "page",
    ontologyNamespace: "site.home",
    telemetryNamespace: "site.home",
    remediationPathwayIds: [],
    educationalIntent: "orientation",
    forbiddenAliasLabels: [],
  },
  lessons: {
    rootId: "lessons",
    label: "Lessons",
    href: "/lessons",
    ontologyClassification: "content_index",
    schemaOwner: "page",
    ontologyNamespace: "pathway.lessons",
    telemetryNamespace: "pathway.lessons",
    remediationPathwayIds: ["ca-rn-nclex-rn", "global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: ["All lessons", "Lesson library"],
  },
  ecg: {
    rootId: "ecg",
    label: "ECG Interpretation",
    href: "/ecg",
    ontologyClassification: "academy",
    schemaOwner: "page",
    ontologyNamespace: "academy.ecg",
    telemetryNamespace: "academy.ecg",
    remediationPathwayIds: ["global"],
    educationalIntent: "interpretation",
    forbiddenAliasLabels: [
      "ECG Academy",
      "Heart Rhythms",
      "Clinical ECG",
      "ECG Mastery",
      "Rhythm interpretation hub",
    ],
  },
  clinical_modules: {
    rootId: "clinical_modules",
    label: "Clinical Modules",
    href: "/clinical-modules",
    ontologyClassification: "clinical_module",
    schemaOwner: "page",
    ontologyNamespace: "academy.clinical_modules",
    telemetryNamespace: "academy.clinical_modules",
    remediationPathwayIds: ["global"],
    educationalIntent: "interpretation",
    forbiddenAliasLabels: ["Clinical readiness", "Labs academy"],
  },
  glossary: {
    rootId: "glossary",
    label: "Glossary",
    href: "/nursing-glossary",
    ontologyClassification: "glossary",
    schemaOwner: "page",
    ontologyNamespace: "reference.glossary",
    telemetryNamespace: "reference.glossary",
    remediationPathwayIds: ["global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: ["Dictionary", "Term index"],
  },
  clinical_interpretation: {
    rootId: "clinical_interpretation",
    label: "Clinical Interpretation",
    href: "/clinical-interpretation",
    ontologyClassification: "interpretation",
    schemaOwner: "page",
    ontologyNamespace: "reference.interpretation",
    telemetryNamespace: "reference.interpretation",
    remediationPathwayIds: ["global"],
    educationalIntent: "interpretation",
    forbiddenAliasLabels: [
      "Interpretation guides",
      "Clinical guides hub",
      "Interpretation hub",
      "Clinical reasoning lab",
    ],
  },
  case_studies: {
    rootId: "case_studies",
    label: "Case studies",
    href: "/case-studies",
    ontologyClassification: "case_study",
    schemaOwner: "page",
    ontologyNamespace: "reference.case_studies",
    telemetryNamespace: "reference.case_studies",
    remediationPathwayIds: ["global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: [],
  },
  pharmacology: {
    rootId: "pharmacology",
    label: "Pharmacology",
    href: "/lessons",
    ontologyClassification: "specialty",
    schemaOwner: "page",
    ontologyNamespace: "specialty.pharmacology",
    telemetryNamespace: "specialty.pharmacology",
    remediationPathwayIds: ["global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: ["Meds", "Drug therapy"],
  },
  med_surg: {
    rootId: "med_surg",
    label: "Med-Surg",
    href: "/lessons",
    ontologyClassification: "specialty",
    schemaOwner: "page",
    ontologyNamespace: "specialty.med_surg",
    telemetryNamespace: "specialty.med_surg",
    remediationPathwayIds: ["global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: [],
  },
  pediatrics: {
    rootId: "pediatrics",
    label: "Pediatrics",
    href: "/lessons",
    ontologyClassification: "specialty",
    schemaOwner: "page",
    ontologyNamespace: "specialty.pediatrics",
    telemetryNamespace: "specialty.pediatrics",
    remediationPathwayIds: ["global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: [],
  },
  critical_care: {
    rootId: "critical_care",
    label: "Critical Care",
    href: "/clinical-modules",
    ontologyClassification: "specialty",
    schemaOwner: "page",
    ontologyNamespace: "specialty.critical_care",
    telemetryNamespace: "specialty.critical_care",
    remediationPathwayIds: ["global"],
    educationalIntent: "interpretation",
    forbiddenAliasLabels: ["ICU hub", "Telemetry academy"],
  },
};

export function getBreadcrumbRoot(rootId: keyof typeof ROOTS | string): BreadcrumbRootDefinition | null {
  return ROOTS[rootId] ?? null;
}

export function listBreadcrumbRoots(): BreadcrumbRootDefinition[] {
  return Object.values(ROOTS);
}

/** Dynamic pathway exam root — label follows region-aware exam name; href is canonical hub. */
export function pathwayExamRoot(pathway: ExamPathwayDefinition): BreadcrumbRootDefinition {
  const href = canonicalMarketingPath(buildExamPathwayPath(pathway));
  const label = pathwayRegionAwareExamName(pathway);
  const ns = `pathway.${pathway.id}`;
  return {
    rootId: `pathway:${pathway.id}`,
    label,
    href,
    ontologyClassification: "pathway",
    schemaOwner: "page",
    ontologyNamespace: ns,
    telemetryNamespace: ns,
    remediationPathwayIds: [pathway.id, "global"],
    educationalIntent: "competency",
    forbiddenAliasLabels: [],
  };
}

export function pathwayLessonsRoot(pathway: ExamPathwayDefinition): BreadcrumbRootDefinition {
  const exam = pathwayExamRoot(pathway);
  const lessonsHref = canonicalMarketingPath(buildExamPathwayPath(pathway, "lessons"));
  return {
    ...ROOTS.lessons,
    href: lessonsHref,
    telemetryNamespace: `${exam.telemetryNamespace}.lessons`,
  };
}

export function rootCrumbFromDefinition(root: BreadcrumbRootDefinition, linked: boolean) {
  return {
    name: root.label,
    href: linked ? root.href : undefined,
    i18nKey: root.rootId === "home" ? ("breadcrumbs.home" as const) : undefined,
  };
}

export function rootSchemaFromDefinition(root: BreadcrumbRootDefinition) {
  return {
    name: root.label,
    item: canonicalBreadcrumbHref(root.href),
    i18nKey: root.rootId === "home" ? ("breadcrumbs.home" as const) : undefined,
  };
}

/** Fail CI when a trail reuses a forbidden alias for a canonical root. */
export function detectForbiddenRootAlias(
  rootId: string,
  trailLabels: readonly string[],
): string | null {
  const root = getBreadcrumbRoot(rootId);
  if (!root) return null;
  const lower = trailLabels.map((l) => l.trim().toLowerCase());
  for (const alias of root.forbiddenAliasLabels) {
    if (lower.includes(alias.toLowerCase())) {
      return `forbidden_alias:${rootId}:${alias}`;
    }
  }
  return null;
}

/** Detect duplicate telemetry namespaces across roots (ontology fragmentation). */
export function detectOntologyNamespaceConflicts(): string[] {
  const seen = new Map<string, string>();
  const conflicts: string[] = [];
  for (const root of listBreadcrumbRoots()) {
    const prior = seen.get(root.telemetryNamespace);
    if (prior && prior !== root.rootId) {
      conflicts.push(`${root.telemetryNamespace}:${prior}+${root.rootId}`);
    }
    seen.set(root.telemetryNamespace, root.rootId);
  }
  return conflicts;
}

export function assertRootNotDeprecated(rootId: string): string | null {
  const root = getBreadcrumbRoot(rootId);
  if (root?.deprecated) return `deprecated_root:${rootId}`;
  return null;
}
