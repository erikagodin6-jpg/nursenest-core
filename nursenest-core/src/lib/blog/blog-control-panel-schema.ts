import { z } from "zod";

export function lessonLinkStableId(row: { suggestedPath: string; label: string }, index: number): string {
  let h = 0;
  const s = `${row.suggestedPath}\0${row.label}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `ll-${index}-${Math.abs(h).toString(36).slice(0, 10)}`;
}

/** Single curated internal link row (lesson, hub, or question bank path). Exported for storage normalization. */
export const blogLinkPathStatusSchema = z.enum([
  "unchecked",
  "ok",
  "invalid_allowlist",
  "not_found",
  "skipped_non_lesson",
]);

export type BlogLinkPathStatus = z.infer<typeof blogLinkPathStatusSchema>;

export const blogLessonLinkRowSchema = z.object({
  label: z.string().min(2).max(200),
  suggestedPath: z.string().min(2).max(500),
  rationale: z.string().max(400).optional(),
  id: z.string().max(80).optional(),
  linkKind: z
    .enum([
      "lesson",
      "lessons_hub",
      "question_bank",
      "topic_cluster",
      "practice_exams",
      "practice_programmatic",
      "general",
    ])
    .optional(),
  reviewStatus: z.enum(["active", "removed"]).optional(),
  replacementPath: z.string().max(500).nullable().optional(),
  /** Set by server verification; admin UI shows review state. */
  pathStatus: blogLinkPathStatusSchema.optional(),
});

export type BlogLessonLinkRow = z.infer<typeof blogLessonLinkRowSchema>;

const blogControlPanelPlanBase = z.object({
  titleOptions: z.array(z.string().min(3).max(200)).min(2).max(6),
  /** On-page main headline (stored as BlogPost.title); distinct from metaTitle / SEO title. */
  h1: z.string().min(3).max(200).optional(),
  recommendedSlug: z.string().min(3).max(120),
  metaTitle: z.string().min(3).max(70),
  metaDescription: z.string().min(20).max(320),
  outline: z
    .array(
      z.object({
        h2: z.string().min(2).max(200),
        h3: z.array(z.string().max(200)).max(8).optional(),
        bullets: z.array(z.string().max(400)).max(12).optional(),
      }),
    )
    .min(3)
    .max(10),
  suggestedInternalLessons: z.array(blogLessonLinkRowSchema).max(16).default([]),
  faqs: z
    .array(
      z.object({
        q: z.string().min(5).max(300),
        a: z.string().min(10).max(1200),
      }),
    )
    .max(12)
    .default([]),
  breadcrumbs: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        href: z.string().min(1).max(500),
      }),
    )
    .max(12)
    .default([]),
  imagePlacements: z
    .array(
      z.object({
        /** Stable key for admin attachments (e.g. hero, inline_1). */
        slotKey: z.string().min(2).max(48).optional(),
        role: z.enum(["hero", "inline"]).optional(),
        section: z.string().min(2).max(200),
        promptIdea: z.string().min(10).max(500),
        altIdea: z.string().min(5).max(240),
        captionIdea: z.string().max(300).optional(),
      }),
    )
    .max(10)
    .default([]),
  apaSourceStubs: z.array(z.record(z.string(), z.unknown())).max(20).default([]),
  keyTakeaways: z.array(z.string().min(5).max(400)).max(10).default([]),
  featuredSnippetHint: z.string().max(400).optional(),
  /** List/card excerpt — must be concrete when present; transform pads from meta if short. */
  suggestedExcerpt: z.string().max(360).optional(),
  openGraphTitle: z.string().max(90).optional(),
  openGraphDescription: z.string().max(200).optional(),
  /** Only `/blog/{slug}` allowed after sanitize; omit for default canonical. */
  canonicalPath: z.string().max(220).optional(),
  seoFocusKeywords: z.array(z.string().min(2).max(80)).max(10).optional(),
  /** JSON-LD / structured data opportunities for engineering review (not auto-injected without validation). */
  schemaOpportunities: z
    .array(
      z.object({
        type: z.enum(["BlogPosting", "FAQPage", "BreadcrumbList", "HowTo", "Speakable", "VideoObject"]),
        rationale: z.string().min(5).max(400),
      }),
    )
    .max(8)
    .optional(),
  /**
   * Suggested in-body anchor opportunities (review before linking). Paths must be real marketing routes.
   */
  internalAnchorOpportunities: z
    .array(
      z.object({
        phrase: z.string().min(2).max(200),
        suggestedAnchorText: z.string().min(2).max(120),
        targetSuggestedPath: z.string().min(2).max(500),
        rationale: z.string().max(300).optional(),
      }),
    )
    .max(24)
    .default([]),
});

/**
 * Model output for the editorial planning pass (JSON).
 * If the model omits `h1`, it defaults to the first title option.
 */
export const blogControlPanelPlanSchema = blogControlPanelPlanBase.transform((d) => {
  const h1 =
    d.h1?.trim() && d.h1.trim().length >= 3 ? d.h1.trim().slice(0, 200) : (d.titleOptions[0] ?? "").slice(0, 200);
  const suggestedInternalLessons = d.suggestedInternalLessons.map((row, i) => ({
    ...row,
    id: row.id?.trim() || lessonLinkStableId(row, i),
    reviewStatus: row.reviewStatus ?? "active",
  }));
  const suggestedExcerpt = (() => {
    const raw = d.suggestedExcerpt?.trim();
    if (raw && raw.length >= 80) return raw.slice(0, 360);
    const meta = d.metaDescription.trim();
    if (meta.length >= 70) return meta.slice(0, 360);
    const head = h1.slice(0, 120);
    return `${head} — Focused nursing exam prep: clinical cues, safety, and test-taking strategy (NurseNest).`.slice(0, 360);
  })();
  const openGraphTitle = d.openGraphTitle?.trim() ? d.openGraphTitle.trim().slice(0, 90) : undefined;
  const openGraphDescription = d.openGraphDescription?.trim()
    ? d.openGraphDescription.trim().slice(0, 200)
    : undefined;
  return {
    ...d,
    h1,
    suggestedInternalLessons,
    suggestedExcerpt,
    openGraphTitle,
    openGraphDescription,
  };
});

export type BlogControlPanelPlan = z.output<typeof blogControlPanelPlanSchema>;
