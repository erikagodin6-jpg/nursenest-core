import { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";

const LONGFORM_CONCEPT_EXPLAINER_TEMPLATES: ReadonlySet<BlogPostTemplate> = new Set([
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.COMPARISON_ARTICLE,
  BlogPostTemplate.MEDICATION_REVIEW,
  BlogPostTemplate.LAB_VALUES_GUIDE,
  BlogPostTemplate.PRIORITIZATION_ARTICLE,
]);

/**
 * Long-form pathophysiology / deep mechanism posts use this profile for stricter plan gates.
 * Prefer {@link BlogPostTemplate.DISEASE_PROCESS_EXPLAINER} in admin for classic pathophysiology articles.
 * {@link BlogPostIntent.CONCEPT_EXPLAINER} only triggers here on clinical explainer templates (not e.g. FAQ_STYLE).
 */
export function isLongFormPathophysiologyProfile(input: { template: BlogPostTemplate; intent: BlogPostIntent }): boolean {
  if (input.template === BlogPostTemplate.DISEASE_PROCESS_EXPLAINER) return true;
  return (
    input.intent === BlogPostIntent.CONCEPT_EXPLAINER && LONGFORM_CONCEPT_EXPLAINER_TEMPLATES.has(input.template)
  );
}

export function validateLongFormNursingPlanContract(
  plan: BlogControlPanelPlan,
  input: { template: BlogPostTemplate; intent: BlogPostIntent },
): { ok: true } | { ok: false; issues: string[] } {
  if (!isLongFormPathophysiologyProfile(input)) return { ok: true };
  const issues: string[] = [];
  if (plan.outline.length < 6) {
    issues.push(
      `outline_sections(${plan.outline.length}): require at least 6 H2 sections (mechanisms, symptoms, assessment, nursing implications, takeaways, etc.).`,
    );
  }
  if (plan.faqs.length < 4) {
    issues.push(`faq_items(${plan.faqs.length}): require at least 4 substantive FAQs for FAQPage eligibility and learner value.`);
  }
  const anchorN = plan.internalAnchorOpportunities?.length ?? 0;
  const recommendedN = plan.recommendedInternalLinks?.length ?? 0;
  const linkCount = plan.suggestedInternalLessons.length + anchorN + recommendedN;
  if (linkCount < 5) {
    issues.push(
      `internal_linking(${linkCount}): require at least 5 combined suggestedInternalLessons + internalAnchorOpportunities + recommendedInternalLinks (lessons, flashcards, question bank, CAT/practice, hubs).`,
    );
  }
  const h2Text = plan.outline.map((o) => o.h2.toLowerCase()).join(" | ");
  const nursingImplicationHint =
    h2Text.includes("nursing") ||
    h2Text.includes("nclex") ||
    h2Text.includes("clinical") ||
    h2Text.includes("implication") ||
    h2Text.includes("intervention") ||
    h2Text.includes("priority");
  if (!nursingImplicationHint) {
    issues.push(
      "nursing_value: at least one H2 should foreground nursing implications, priorities, NCLEX-relevant decisions, or clinical application (not only basic science headings).",
    );
  }
  const mechanismHint =
    h2Text.includes("pathophys") ||
    h2Text.includes("mechanism") ||
    h2Text.includes("why") ||
    h2Text.includes("process") ||
    h2Text.includes("step");
  if (!mechanismHint) {
    issues.push(
      "mechanism_depth: at least one H2 should signal mechanism / pathophysiology / \"why this happens\" (stepwise teaching).",
    );
  }

  const pk = plan.primaryKeyword?.trim();
  if (!pk || pk.length < 3) {
    issues.push("primaryKeyword: required (natural long-tail phrase, 3+ characters) for long-form pathophysiology SEO.");
  }
  const secondary = plan.secondaryKeywordPhrases ?? [];
  if (secondary.length < 3) {
    issues.push(
      `secondaryKeywordPhrases(${secondary.length}): require at least 3 semantic variants (aim for 3–8); avoid duplicate strings.`,
    );
  }

  const crumbs = plan.breadcrumbs ?? [];
  if (crumbs.length < 4) {
    issues.push(
      `breadcrumbs(${crumbs.length}): require at least 4 entries: Home (/), Blog (/blog), a topic/category hub (root-relative), then the article (/blog/<slug>).`,
    );
  } else {
    const c0 = crumbs[0];
    const c1 = crumbs[1];
    if (!c0 || c0.label.trim().toLowerCase() !== "home" || c0.href.trim() !== "/") {
      issues.push('breadcrumbs: first entry must be { "label": "Home", "href": "/" }.');
    }
    if (!c1 || c1.label.trim().toLowerCase() !== "blog" || c1.href.trim() !== "/blog") {
      issues.push('breadcrumbs: second entry must be { "label": "Blog", "href": "/blog" }.');
    }
    const badHref = crumbs.some((c) => {
      const h = c.href.trim();
      return !h.startsWith("/") || h.startsWith("/app") || h.startsWith("/api");
    });
    if (badHref) {
      issues.push("breadcrumbs: all href values must be root-relative marketing paths (no /app/ or /api/ or external URLs).");
    }
  }

  const sourceCandidatesN = plan.sourceCandidates?.length ?? 0;
  if (sourceCandidatesN < 3) {
    issues.push(
      `sourceCandidates(${sourceCandidatesN}): require at least 3 rows for editorial verification — title + optional url/sourceType/notes. Never invent DOIs or URLs; omit url when unknown.`,
    );
  }

  const schema = plan.schemaOpportunities ?? [];
  const types = new Set(schema.map((s) => s.type));
  if (!types.has("BlogPosting")) {
    issues.push('schemaOpportunities: include { "type": "BlogPosting", "rationale": "..." } for Article JSON-LD.');
  }
  if (!types.has("BreadcrumbList")) {
    issues.push('schemaOpportunities: include { "type": "BreadcrumbList", "rationale": "..." } matching the breadcrumb trail.');
  }
  if (plan.faqs.length >= 2 && !types.has("FAQPage")) {
    issues.push('schemaOpportunities: include { "type": "FAQPage", "rationale": "..." } because FAQs are present.');
  }

  const introPool =
    (plan.articleSummary?.trim().length ?? 0) >= 80
      ? plan.articleSummary!.trim()
      : (plan.suggestedExcerpt?.trim().length ?? 0) >= 80
        ? plan.suggestedExcerpt!.trim()
        : "";
  if (introPool.length < 80) {
    issues.push(
      "intro_block: provide articleSummary (80+ chars) OR suggestedExcerpt (80+ chars) with a direct answer to the search query for the intro/H1 context.",
    );
  }

  const reviewFlags = new Set((plan.needsReviewFlags ?? []).map((s) => s.trim().toLowerCase()));
  if (!reviewFlags.has("apa_source_review_required")) {
    issues.push(
      'needsReviewFlags: include "apa_source_review_required" unless admin-verified sources will be attached before publish (final APA lines are never invented by the model).',
    );
  }

  return issues.length ? { ok: false, issues } : { ok: true };
}
