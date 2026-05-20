/**
 * Navigation consumer registry — governance audit for breadcrumb-generating surfaces.
 */

import { pageOwnsBreadcrumbSchema } from "@/lib/breadcrumbs/schema-ownership";
import { detectDuplicateBreadcrumbSchema } from "@/lib/breadcrumbs/structured-data-governance";

export type NavigationConsumerTier = "governed" | "partial" | "ungoverned";

export type NavigationConsumerSurface = {
  id: string;
  label: string;
  tier: NavigationConsumerTier;
  routePattern: string;
  emitsBreadcrumbList: boolean;
  usesResolver: boolean;
  notes?: string;
};

export const NAVIGATION_CONSUMER_REGISTRY: readonly NavigationConsumerSurface[] = [
  {
    id: "pathway-lessons",
    label: "Pathway lessons (marketing)",
    tier: "governed",
    routePattern: "/canada/rn/*/lessons",
    emitsBreadcrumbList: true,
    usesResolver: true,
    notes: "Education-first via pathway-education-breadcrumbs",
  },
  {
    id: "learner-lessons",
    label: "Learner lesson detail",
    tier: "governed",
    routePattern: "/app/lessons",
    emitsBreadcrumbList: false,
    usesResolver: true,
    notes: "learner-pathway-lesson intent suppresses schema",
  },
  {
    id: "ecg-academy",
    label: "ECG academy cluster",
    tier: "governed",
    routePattern: "/ecg",
    emitsBreadcrumbList: true,
    usesResolver: true,
  },
  {
    id: "labs-academy",
    label: "Labs / clinical modules",
    tier: "governed",
    routePattern: "/labs-interpretation",
    emitsBreadcrumbList: true,
    usesResolver: true,
  },
  {
    id: "blog",
    label: "Blog posts",
    tier: "governed",
    routePattern: "/blog",
    emitsBreadcrumbList: true,
    usesResolver: false,
    notes: "pathway-breadcrumbs.ts builders + BreadcrumbBar",
  },
  {
    id: "layout-fallback",
    label: "Marketing layout path fallback",
    tier: "partial",
    routePattern: "/*",
    emitsBreadcrumbList: true,
    usesResolver: false,
    notes: "Last resort; blocked when pageOwnsBreadcrumbSchema",
  },
  {
    id: "ecg-inline-metadata",
    label: "Legacy ECG inline @graph",
    tier: "partial",
    routePattern: "/ecg/",
    emitsBreadcrumbList: true,
    usesResolver: false,
    notes: "Migrate nested Article breadcrumb to resolver-only",
  },
  {
    id: "learner-app",
    label: "Learner /app governed trails",
    tier: "governed",
    routePattern: "/app/",
    emitsBreadcrumbList: false,
    usesResolver: true,
    notes: "LearnerBreadcrumbTrail + learner-breadcrumb-resolver",
  },
  {
    id: "clinical-interpretation",
    label: "Clinical interpretation guides",
    tier: "partial",
    routePattern: "/clinical-interpretation",
    emitsBreadcrumbList: false,
    usesResolver: true,
    notes: "Builders ready; routes not fully shipped",
  },
  {
    id: "glossary",
    label: "Public glossary",
    tier: "partial",
    routePattern: "/glossary",
    emitsBreadcrumbList: true,
    usesResolver: true,
    notes: "glossaryBreadcrumbs ready when routes ship",
  },
  {
    id: "post-exam-coaching",
    label: "Post-exam coaching reports",
    tier: "ungoverned",
    routePattern: "/app/",
    emitsBreadcrumbList: false,
    usesResolver: false,
    notes: "No breadcrumb component; study loop separate",
  },
  {
    id: "cat-loft-results",
    label: "CAT / LOFT results",
    tier: "ungoverned",
    routePattern: "/app/",
    emitsBreadcrumbList: false,
    usesResolver: false,
  },
] as const;

export type NavigationGovernanceAudit = {
  governed: number;
  partial: number;
  ungoverned: number;
  duplicateRiskRoutes: string[];
  surfaces: NavigationConsumerSurface[];
};

export function auditNavigationGovernance(): NavigationGovernanceAudit {
  const surfaces = [...NAVIGATION_CONSUMER_REGISTRY];
  const duplicateRiskRoutes: string[] = [];
  for (const s of surfaces) {
    if (s.tier === "partial" && s.emitsBreadcrumbList) {
      const sample = s.routePattern.replace(/\*/g, "nclex-rn");
      if (pageOwnsBreadcrumbSchema(sample)) {
        const dup = detectDuplicateBreadcrumbSchema({
          pathname: sample,
          pageEmitsBreadcrumbList: true,
          layoutEmitsBreadcrumbList: true,
        });
        if (dup) duplicateRiskRoutes.push(`${s.id}:${dup.code}`);
      }
    }
  }
  return {
    governed: surfaces.filter((s) => s.tier === "governed").length,
    partial: surfaces.filter((s) => s.tier === "partial").length,
    ungoverned: surfaces.filter((s) => s.tier === "ungoverned").length,
    duplicateRiskRoutes,
    surfaces,
  };
}

export function listUngovernedNavigationSurfaces(): NavigationConsumerSurface[] {
  return NAVIGATION_CONSUMER_REGISTRY.filter((s) => s.tier === "ungoverned");
}
