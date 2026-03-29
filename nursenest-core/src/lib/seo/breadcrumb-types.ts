/**
 * NurseNest breadcrumb model: one resolver drives visible UI + optional JSON-LD.
 *
 * Route classes (audit):
 * - **A — Public indexable:** home, pricing, pathway hubs, lessons, blog, exam-lessons, pre-nursing, case-studies, tools, for-institutions, programmatic SEO slugs (see registry).
 * - **B — Public low-priority:** login, signup, forgot/reset password (optional/minimal crumbs).
 * - **C — Protected /app:** question bank, exams, dashboard, lessons — **visible crumbs only; no BreadcrumbList schema** (layout uses robots noindex).
 */

/** Visible trail + JSON-LD (marketing only). */
export type BreadcrumbCrumb = { name: string; href?: string };

/** schema.org BreadcrumbList item (`item` is path or absolute URL; absolutized in JSON-LD). */
export type BreadcrumbSchemaItem = { name: string; item: string };

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
