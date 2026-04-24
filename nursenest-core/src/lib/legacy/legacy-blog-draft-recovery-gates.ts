import type { PrePublishCheckId, PrePublishIssue, PrePublishValidationResult } from "@/lib/blog/blog-pre-publish-validation";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { isValidBlogSlug } from "@/lib/blog/blog-generate-seo";

/** Hard floor for publish during recovery (below this is never allowed, even in emergency SEO mode). */
export const BLOG_RECOVERY_HARD_MIN_WORDS = 300;

const PLACEHOLDER_RE = /\b(lorem ipsum|tbd\b|todo:\s*content|coming soon|placeholder page|content pending)\b/i;

const UNSAFE_HTML_RE = /<\s*script\b|javascript:\s*|\bon\w+\s*=/i;

/** Soft pre-publish checks bypassed when `EMERGENCY_SEO_PUBLISH=1` and body meets {@link BLOG_RECOVERY_HARD_MIN_WORDS}. */
export const EMERGENCY_SOFT_BYPASS_IDS = new Set<PrePublishCheckId>([
  "body_word_count",
  "body",
  "faq_schema",
  "faq_content_when_required",
  "breadcrumb",
  "seo_bundle",
  "image_cover",
  "image_alt",
  "image_workflow",
  "internal_link_recommendations",
  "schema_summary_opportunities",
  "schema_contract_notes",
  "meta_title_duplicate_h1",
  "meta_description_substance",
  "content_nursing_implications",
  "content_clinical_mechanism",
  "primary_keyword",
]);

export function hasUnsafeHtml(body: string): boolean {
  return UNSAFE_HTML_RE.test(body);
}

export function hasObviousPlaceholderText(body: string, title: string): boolean {
  return PLACEHOLDER_RE.test(body) || PLACEHOLDER_RE.test(title);
}

export function recoveryBodyWordCount(body: string): number {
  return countWordsFromHtml(body);
}

export function hardGateTitleMissing(title: string): boolean {
  return title.trim().length < 3;
}

export function hardGateInvalidSlug(slug: string): boolean {
  return !isValidBlogSlug(slug.trim());
}

/**
 * After {@link validateBlogPrePublish}, drop blocking issues that are editorial-only when emergency mode is on
 * and the article meets the recovery hard word floor.
 */
export function filterBlockingForEmergencyPublish(
  result: PrePublishValidationResult,
  bodyWordCount: number,
  emergencySeoPublish: boolean,
): PrePublishIssue[] {
  if (!emergencySeoPublish || bodyWordCount < BLOG_RECOVERY_HARD_MIN_WORDS) {
    return result.blocking;
  }
  return result.blocking.filter((b) => !EMERGENCY_SOFT_BYPASS_IDS.has(b.id));
}
