import type { BlogImageStatus, BlogPostStatus, CountryCode, Prisma } from "@prisma/client";
import { BLOG_ARTICLE_MIN_BODY_CHARS } from "@/lib/blog/blog-article-generation-pipeline";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { coerceBlogSourceRows, validateSources } from "@/lib/blog/apa7";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { parseMarketingLessonDetailPath } from "@/lib/blog/blog-internal-link-verify";
import { prisma } from "@/lib/db";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PrePublishCheckId =
  | "title"
  | "slug"
  | "slug_unique"
  | "meta_title"
  | "meta_description"
  | "excerpt"
  | "body"
  | "body_word_count"
  | "references_required"
  | "sources_structure"
  | "internal_links"
  | "image_cover"
  | "image_alt"
  | "image_workflow"
  | "breadcrumb"
  | "seo_bundle"
  | "faq_schema";

export type PrePublishSeverity = "block" | "warn";

export type PrePublishIssue = {
  id: PrePublishCheckId;
  severity: PrePublishSeverity;
  message: string;
  fix: string;
};

export type PrePublishValidationResult = {
  issues: PrePublishIssue[];
  blocking: PrePublishIssue[];
  warnings: PrePublishIssue[];
  okToPublish: boolean;
  hasWarnings: boolean;
};

/** Fields required to run pre-publish checks (admin select). */
export type BlogPostPrePublishRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  metaTitleVariant: string | null;
  metaDescriptionVariant: string | null;
  requiresReferences: boolean;
  apaReferences: string[];
  sourcesJson: Prisma.JsonValue;
  internalLinkPlan: Prisma.JsonValue;
  outlineJson: Prisma.JsonValue;
  faqBlock: Prisma.JsonValue;
  schemaSummary: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  coverImageCaption: string | null;
  coverImagePrompt: string | null;
  imageStatus: BlogImageStatus;
  countryTarget: CountryCode | null;
  postStatus: BlogPostStatus;
};

/** Prisma select shared by PATCH + GET pre-publish validation. */
export const blogPrePublishValidationSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  seoTitle: true,
  seoDescription: true,
  metaTitleVariant: true,
  metaDescriptionVariant: true,
  requiresReferences: true,
  apaReferences: true,
  sourcesJson: true,
  internalLinkPlan: true,
  outlineJson: true,
  faqBlock: true,
  schemaSummary: true,
  coverImage: true,
  coverImageAlt: true,
  coverImageCaption: true,
  coverImagePrompt: true,
  imageStatus: true,
  countryTarget: true,
  postStatus: true,
} as const;

export type BlogPostPrePublishPayload = Prisma.BlogPostGetPayload<{ select: typeof blogPrePublishValidationSelect }>;

export type PrePublishPatch = {
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  metaTitleVariant?: string | null;
  metaDescriptionVariant?: string | null;
  requiresReferences?: boolean;
  apaReferences?: string[];
  sourcesJson?: unknown;
  internalLinkPlan?: unknown;
  outlineJson?: unknown;
  faqBlock?: unknown;
  schemaSummary?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  coverImageCaption?: string | null;
  coverImagePrompt?: string | null;
  imageStatus?: BlogImageStatus;
  countryTarget?: CountryCode | null;
};

export function mergeBlogPostForPrePublishPatch(
  current: BlogPostPrePublishPayload,
  patch: Partial<PrePublishPatch>,
): BlogPostPrePublishRow {
  return {
    id: current.id,
    slug: patch.slug !== undefined ? patch.slug : current.slug,
    title: patch.title !== undefined ? patch.title : current.title,
    excerpt: patch.excerpt !== undefined ? patch.excerpt : current.excerpt,
    body: patch.body !== undefined ? patch.body : current.body,
    seoTitle: patch.seoTitle !== undefined ? patch.seoTitle : current.seoTitle,
    seoDescription: patch.seoDescription !== undefined ? patch.seoDescription : current.seoDescription,
    metaTitleVariant: patch.metaTitleVariant !== undefined ? patch.metaTitleVariant : current.metaTitleVariant,
    metaDescriptionVariant:
      patch.metaDescriptionVariant !== undefined ? patch.metaDescriptionVariant : current.metaDescriptionVariant,
    requiresReferences: patch.requiresReferences !== undefined ? patch.requiresReferences : current.requiresReferences,
    apaReferences: patch.apaReferences !== undefined ? patch.apaReferences : current.apaReferences,
    sourcesJson:
      patch.sourcesJson !== undefined
        ? (patch.sourcesJson as Prisma.JsonValue)
        : (current.sourcesJson as Prisma.JsonValue),
    internalLinkPlan:
      patch.internalLinkPlan !== undefined
        ? (patch.internalLinkPlan as Prisma.JsonValue)
        : (current.internalLinkPlan as Prisma.JsonValue),
    outlineJson:
      patch.outlineJson !== undefined ? (patch.outlineJson as Prisma.JsonValue) : (current.outlineJson as Prisma.JsonValue),
    faqBlock: patch.faqBlock !== undefined ? (patch.faqBlock as Prisma.JsonValue) : (current.faqBlock as Prisma.JsonValue),
    schemaSummary: patch.schemaSummary !== undefined ? patch.schemaSummary : current.schemaSummary,
    coverImage: patch.coverImage !== undefined ? patch.coverImage : current.coverImage,
    coverImageAlt: patch.coverImageAlt !== undefined ? patch.coverImageAlt : current.coverImageAlt,
    coverImageCaption: patch.coverImageCaption !== undefined ? patch.coverImageCaption : current.coverImageCaption,
    coverImagePrompt: patch.coverImagePrompt !== undefined ? patch.coverImagePrompt : current.coverImagePrompt,
    imageStatus: patch.imageStatus !== undefined ? patch.imageStatus : current.imageStatus,
    countryTarget: patch.countryTarget !== undefined ? patch.countryTarget : current.countryTarget,
    postStatus: current.postStatus,
  };
}

function push(
  issues: PrePublishIssue[],
  row: PrePublishIssue,
): void {
  issues.push(row);
}

function effectiveMetaTitle(row: BlogPostPrePublishRow): string {
  return (row.seoTitle ?? row.metaTitleVariant ?? "").trim();
}

function effectiveMetaDescription(row: BlogPostPrePublishRow): string {
  return (row.seoDescription ?? row.metaDescriptionVariant ?? "").trim();
}

function faqItemCount(faqBlock: Prisma.JsonValue): number {
  if (!faqBlock || typeof faqBlock !== "object") return 0;
  const items = (faqBlock as { items?: unknown }).items;
  return Array.isArray(items) ? items.length : 0;
}

function schemaSummaryParsed(row: BlogPostPrePublishRow): {
  emitFaqSchema?: boolean;
  breadcrumbs?: { label: string; href: string }[];
} | null {
  if (!row.schemaSummary?.trim()) return null;
  try {
    return JSON.parse(row.schemaSummary) as {
      emitFaqSchema?: boolean;
      breadcrumbs?: { label: string; href: string }[];
    };
  } catch {
    return null;
  }
}

/**
 * Validates a blog post before publish or schedule. Does not mutate.
 * Slug uniqueness uses `postId` to exclude the current row.
 */
export async function validateBlogPrePublish(
  row: BlogPostPrePublishRow,
  postId: string,
): Promise<PrePublishValidationResult> {
  const issues: PrePublishIssue[] = [];

  const title = row.title.trim();
  if (title.length < 3) {
    push(issues, {
      id: "title",
      severity: "block",
      message: "Title is missing or too short.",
      fix: "Set a clear H1-style title (at least 3 characters) in the Title section.",
    });
  }

  const slug = row.slug.trim();
  if (slug.length < 3 || !SLUG_RE.test(slug)) {
    push(issues, {
      id: "slug",
      severity: "block",
      message: "Slug is missing or not valid kebab-case.",
      fix: "Use lowercase letters, numbers, and hyphens only (e.g. nclex-fluid-balance). Save draft to persist.",
    });
  } else {
    const clash = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id: postId } },
      select: { id: true },
    });
    if (clash) {
      push(issues, {
        id: "slug_unique",
        severity: "block",
        message: `Slug “${slug}” is already used by another post.`,
        fix: "Change the slug to a unique value, then Save draft.",
      });
    }
  }

  const metaTitle = effectiveMetaTitle(row);
  if (metaTitle.length < 3) {
    push(issues, {
      id: "meta_title",
      severity: "block",
      message: "Meta / SEO title is empty.",
      fix: "Fill Meta title in the Meta & SEO section (or meta title variant).",
    });
  }

  const metaDesc = effectiveMetaDescription(row);
  if (metaDesc.length < 10) {
    push(issues, {
      id: "meta_description",
      severity: "block",
      message: "Meta description is missing or too short.",
      fix: "Add a compelling meta description (~20–320 characters).",
    });
  }

  const excerpt = row.excerpt.trim();
  if (excerpt.length < 10) {
    push(issues, {
      id: "excerpt",
      severity: "block",
      message: "Excerpt / card text is too short.",
      fix: "Expand the excerpt (min ~10 characters) in the Excerpt section.",
    });
  }

  const body = row.body.trim();
  if (body.length < BLOG_ARTICLE_MIN_BODY_CHARS) {
    push(issues, {
      id: "body",
      severity: "block",
      message: `Article body is too short (min ${BLOG_ARTICLE_MIN_BODY_CHARS} characters).`,
      fix: "Complete the article body or regenerate content from the control panel.",
    });
  }

  const bodyWords = countWordsFromHtml(body);
  if (bodyWords < BLOG_ARTICLE_MIN_WORDS) {
    push(issues, {
      id: "body_word_count",
      severity: "block",
      message: `Article body is too short for publish (${bodyWords} words; minimum ${BLOG_ARTICLE_MIN_WORDS}).`,
      fix: "Expand the article body or regenerate with the long-form blog generator until it meets the word minimum.",
    });
  }

  const apaLines = row.apaReferences.map((s) => s.trim()).filter(Boolean);
  if (row.requiresReferences && apaLines.length === 0) {
    push(issues, {
      id: "references_required",
      severity: "block",
      message: "This post requires references but the APA list is empty.",
      fix: "Add verified sources JSON and persist, or add APA lines manually under References.",
    });
  }

  const sources = coerceBlogSourceRows(
    Array.isArray(row.sourcesJson) ? (row.sourcesJson as unknown[]) : [],
  );
  if (row.requiresReferences && sources.length === 0 && apaLines.length === 0) {
    push(issues, {
      id: "sources_structure",
      severity: "block",
      message: "Structured sources JSON is empty while references are required.",
      fix: "Paste admin-verified source objects (HTTPS URL or DOI + title + year) in Verified sources JSON.",
    });
  }
  if (sources.length > 0) {
    const check = validateSources(sources);
    for (const w of check.warnings) {
      push(issues, {
        id: "sources_structure",
        severity: row.requiresReferences ? "warn" : "warn",
        message: `Source quality: ${w}`,
        fix: "Improve source rows (title, year, authority, URL/DOI) in structured JSON.",
      });
    }
    if (row.requiresReferences && check.reliabilityScore < 35 && sources.length > 0) {
      push(issues, {
        id: "sources_structure",
        severity: "warn",
        message: `Reference authority mix is weak (score ${check.reliabilityScore}).`,
        fix: "Add regulator, guideline, or peer-reviewed sources where appropriate.",
      });
    }
  }

  const parsedPlan = parseInternalLinkPlanJson(row.internalLinkPlan);
  const seo = parsedPlan.seo;

  for (const lesson of parsedPlan.lessons) {
    if (lesson.reviewStatus === "removed") continue;
    const ps = lesson.pathStatus;
    if (ps === "not_found" || ps === "invalid_allowlist") {
      push(issues, {
        id: "internal_links",
        severity: "block",
        message: `Internal link invalid (${ps}): ${lesson.label} → ${lesson.suggestedPath}`,
        fix: "Fix the path, replace with a verified lesson URL, or mark the row removed in Internal links.",
      });
    } else if (!ps || ps === "unchecked") {
      const candidate = (lesson.replacementPath ?? lesson.suggestedPath ?? "").trim();
      if (parseMarketingLessonDetailPath(candidate)) {
        push(issues, {
          id: "internal_links",
          severity: "warn",
          message: `Lesson link not verified: ${lesson.label} → ${candidate}`,
          fix: "Save draft from the control panel (or re-run link verification) so pathStatus is checked.",
        });
      }
    }
  }

  const cover = row.coverImage?.trim() ?? "";
  if (cover) {
    if (!cover.startsWith("https://")) {
      push(issues, {
        id: "image_cover",
        severity: "block",
        message: "Cover image URL must use HTTPS.",
        fix: "Use an https:// image URL or upload via the image workflow.",
      });
    }
    if (!(row.coverImageAlt ?? "").trim()) {
      push(issues, {
        id: "image_alt",
        severity: "block",
        message: "Cover image is set but alt text is empty.",
        fix: "Add descriptive alt text for the hero image (accessibility + SEO).",
      });
    }
  }

  if (
    row.imageStatus === "GENERATED" &&
    !cover &&
    parsedPlan.imagePlacements.length > 0
  ) {
    push(issues, {
      id: "image_workflow",
      severity: "warn",
      message: "Image workflow expects a hero asset but coverImage is empty.",
      fix: "Upload or set a cover image URL, or clear image placements if not using a hero image.",
    });
  }

  if (row.imageStatus === "FAILED") {
    push(issues, {
      id: "image_workflow",
      severity: "warn",
      message: "Featured image generation failed — review image workflow state.",
      fix: "Re-queue AI image, upload a file, or set image status appropriately before publishing.",
    });
  }

  const schemaMeta = schemaSummaryParsed(row);

  if (parsedPlan.lessons.length > 0 && !seo) {
    push(issues, {
      id: "seo_bundle",
      severity: "warn",
      message: "Structured SEO bundle (breadcrumbs, FAQ flags) is missing from internalLinkPlan.",
      fix: "Save draft from the control panel so breadcrumbs and schema hints are persisted under internalLinkPlan.seo.",
    });
  }

  const crumbs = seo?.normalizedBreadcrumbs ?? schemaMeta?.breadcrumbs;
  if (!crumbs || crumbs.length < 2) {
    push(issues, {
      id: "breadcrumb",
      severity: "warn",
      message: "Breadcrumb trail is missing or too short for rich results.",
      fix: "Ensure Home → Blog → article crumbs exist (save draft with SEO bundle or edit Breadcrumbs).",
    });
  } else if (crumbs.length >= 2) {
    const first = crumbs[0];
    const second = crumbs[1];
    if (first?.href !== "/" || second?.href !== "/blog") {
      push(issues, {
        id: "breadcrumb",
        severity: "warn",
        message: "Breadcrumbs should start with Home (/) and Blog (/blog) for consistency.",
        fix: "Regenerate from control panel or normalize crumbs in the Breadcrumbs editor.",
      });
    }
  }

  const emitFaq = Boolean(seo?.emitFaqSchema ?? schemaMeta?.emitFaqSchema);
  if (emitFaq && faqItemCount(row.faqBlock) < 2) {
    push(issues, {
      id: "faq_schema",
      severity: "warn",
      message: "FAQ structured data is enabled but fewer than 2 FAQ items are stored.",
      fix: "Add FAQs in the FAQ section or disable FAQ schema in the SEO bundle / schemaSummary.",
    });
  }

  const blocking = issues.filter((i) => i.severity === "block");
  const warnings = issues.filter((i) => i.severity === "warn");

  return {
    issues,
    blocking,
    warnings,
    okToPublish: blocking.length === 0,
    hasWarnings: warnings.length > 0,
  };
}
