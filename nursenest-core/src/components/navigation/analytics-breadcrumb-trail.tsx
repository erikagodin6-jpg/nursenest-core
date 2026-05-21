"use client";

import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { BreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";

export function AnalyticsBreadcrumbTrail({
  items,
  navClassName,
}: {
  items: BreadcrumbCrumb[];
  pathname: string;
  intent?: BreadcrumbIntent;
  breadcrumbSurface?: BreadcrumbSurface;
  schemaOwner?: BreadcrumbSchemaOwner;
  breadcrumbDepth?: number;
  navClassName?: string;
  topicSlug?: string;
  competencyId?: string | null;
  remediationPathwayId?: string;
  pathwayId?: string | null;
  canonicalRoot?: string;
  learnerStateReason?: string | null;
  graphDepth?: number;
  sourceSurface?: string;
  ontologyNamespace?: string;
  educationalIntent?: string;
  testing_model?: string;
  interpretationChainDepth?: number;
  glossaryTraversalContinuity?: boolean;
}) {
  return (
    <BreadcrumbTrail
      items={items}
      navClassName={navClassName}
      onCrumbClick={() => {}}
    />
  );
}
