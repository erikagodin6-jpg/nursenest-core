/**
 * NurseNest breadcrumb model: one resolver drives visible UI + optional JSON-LD.
 *
 * Route classes (audit):
 * - **A – Public indexable:** home, pricing, pathway hubs, lessons, blog, exam-lessons, pre-nursing, case-studies, tools, for-institutions, programmatic SEO slugs (see registry).
 * - **Pathway marketing:** trails are built in `pathway-breadcrumbs.ts` as Home → `/exam-lessons` (label matches that page’s h1) → pathway hub → section → current. Never label “Canada”/country and link to `/exam-lessons`.
 * - **B – Public low-priority:** login, signup, forgot/reset password (optional/minimal crumbs).
 * - **C – Protected /app:** question bank, exams, dashboard, lessons. **Visible crumbs only; no BreadcrumbList schema** (layout uses robots noindex).
 */

/** Params for `{{param}}` interpolation when resolving `i18nKey` (marketing bundles). */
export type BreadcrumbI18nParams = Record<string, string | number | undefined>;

/** Visible trail + JSON-LD (marketing only). */
export type BreadcrumbCrumb = {
  name: string;
  href?: string;
  /** When set, localized pages replace `name` via `localizeBreadcrumbCrumbs`. */
  i18nKey?: string;
  i18nParams?: BreadcrumbI18nParams;
};

/** schema.org BreadcrumbList item (`item` is path or absolute URL; absolutized in JSON-LD). */
export type BreadcrumbSchemaItem = {
  name: string;
  item: string;
  i18nKey?: string;
  i18nParams?: BreadcrumbI18nParams;
};

/**
 * Fully-resolved item for future dynamic resolver expansion.
 * `includeInSchema`: false for decorative middle crumbs (e.g. category text with no archive URL).
 */
export type BreadcrumbItem = {
  label: string;
  href?: string;
  includeInSchema: boolean;
};

export type BreadcrumbResolution = {
  /** Visible `<BreadcrumbTrail>` */
  crumbs: BreadcrumbCrumb[];
  /** JSON-LD for indexable pages only; omit component when empty or for /app */
  schemaItems: BreadcrumbSchemaItem[];
};
