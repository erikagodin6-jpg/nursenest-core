/**
 * Canonical breadcrumb types — shared by resolvers, JSON-LD builders, and UI.
 * @see breadcrumb-resolver.ts
 */

export type { BreadcrumbCrumb, BreadcrumbSchemaItem, BreadcrumbResolution, BreadcrumbItem, BreadcrumbI18nParams } from "@/lib/seo/breadcrumb-types";

/** Clinical category context for lesson/category marketing URLs. */
export type PathwayLessonCategoryBreadcrumb = {
  label: string;
  /** URL segment under `…/lessons/{categorySlug}`. */
  slug: string;
};
