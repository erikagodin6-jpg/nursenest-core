/**
 * NurseNest blog article generation pipeline (admin, AI-backed).
 *
 * ## Stages
 * 1. **Structured plan** — One JSON completion validated by {@link blogControlPanelPlanSchema}:
 *    audience titles, H1, slug, SEO title & meta, excerpt, outline, internal link ideas, internal anchor opportunities,
 *    FAQs, breadcrumbs, schema opportunities, image prompts/placements, APA stubs, key takeaways.
 * 2. **Long-form body** — Second completion: HTML only (H2+), pathway/country-aware, anti-filler rules. For the long-form profile, {@link enforceLongFormBodyQuality} then checks outline H2 coverage, main-body word depth before FAQ, embedded `recommendedInternalLinks`, FAQ/total balance, and breadcrumb href sanity (errors block persist; flags merge into `plan.needsReviewFlags`).
 * 3. **Persist (optional)** — {@link persistControlPanelDraft} writes a `BlogPost` (default `DRAFT`; with `publishImmediately`, promotes to `PUBLISHED` when pre-publish validation passes).
 * 4. **Publishing package (same transaction)** — After insert, refreshes `internalLinkPlan.publishingPackage.relatedBlogPosts`
 *    from **live** posts (tag overlap) so related links stay current; anchor opportunities come from the plan JSON.
 *
 * **Post-save SEO refresh** (separate admin action): `POST /api/admin/blog/[id]/seo/regenerate` rebuilds the JSON SEO bundle
 * and related blog rows without touching the HTML body unless `overwrite: true` (then SERP columns refresh from deterministic SEO).
 *
 * **Body-only refresh** (separate admin action): `POST /api/admin/blog/[id]/body/regenerate` re-runs the HTML pass from the
 * stored outline + FAQ + link plan (legacy rows without a valid outline return 422).
 *
 * ## Storage mapping (`BlogPost`)
 * | Pipeline output | Where it lives |
 * |-----------------|----------------|
 * | H1 (on-page headline) | `title` |
 * | Slug | `slug` (unique; collision-suffixed) |
 * | SEO title | `seoTitle`, `metaTitleVariant` |
 * | Meta description | `seoDescription`, `metaDescriptionVariant` |
 * | Structured outline | `outlineJson` (JSON) |
 * | Article body | `body` (HTML text) |
 * | Internal link suggestions | `internalLinkPlan` (JSON: lessons + imagePlacements + attachments + **`seo` bundle**), `relatedLessonPaths` |
 * | FAQ section | `faqBlock` (`{ items: {q,a}[] }`), `keyQuestions` |
 * | SEO bundle (canonical, OG/Twitter, excerpt, crumbs, FAQ schema flag, keywords, image alts) | `internalLinkPlan.seo` from `blog-seo-automation.ts` + `schemaSummary` (JSON summary; version bumps in `blog-seo-automation`) |
 * | Related live blog links + anchor opportunities | `internalLinkPlan.publishingPackage` (`blog-publishing-package.ts`) |
 * | List excerpt / cards | `excerpt` (prefers AI `suggestedExcerpt` when strong) |
 * | Image prompts / placements | `internalLinkPlan.imagePlacements`, `coverImagePrompt`, `coverImageAlt`, `imageStatus` |
 * | APA 7 lines | `apaReferences` (string[]), `sourcesJson` |
 * | Alternate titles | `titleAlternates` |
 * | Pathway / country | `exam`, `countryTarget`, `targetKeyword`, `keywordCluster` |
 * | Editorial state | `workflowStatus`, `postStatus` (usually DRAFT until publish / immediate publish), `medicalRiskFlags`, etc. |
 *
 * Editing: admin `PATCH /api/admin/blog/[id]` and control panel UI update these fields without re-running the pipeline.
 */

import { BLOG_ARTICLE_MIN_BODY_CHARS } from "@/lib/blog/blog-article-bounds";
import type { ControlPanelGenerateInput, ControlPanelPersistResult } from "@/lib/blog/blog-control-panel-generation";
import {
  BlogControlPanelPlanError,
  fetchControlPanelBodyHtml,
  fetchControlPanelPlan,
  persistControlPanelDraft,
} from "@/lib/blog/blog-control-panel-generation";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { annotateBlogInternalLinkRowsWithVerification } from "@/lib/blog/blog-internal-link-verify";
import { normalizePlanSuggestedLessonRows } from "@/lib/blog/blog-internal-lesson-links";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { validateLongFormNursingPlanContract } from "@/lib/blog/blog-longform-nursing-contract";
import {
  enforceLongFormBodyQuality,
  mergeUniqueNeedsReviewFlags,
} from "@/lib/blog/blog-longform-body-enforcement";

/** Soft floor on raw HTML size before word counting (word count is authoritative; see {@link BLOG_ARTICLE_MIN_WORDS}). */
export { BLOG_ARTICLE_MIN_BODY_CHARS } from "@/lib/blog/blog-article-bounds";

export type BlogArticlePipelineStage = "plan" | "body" | "persist" | "citations";

export type BlogArticlePipelineSuccess = {
  ok: true;
  plan: BlogControlPanelPlan;
  bodyHtml: string;
  /** Present when `persist` was requested and persistence did not skip/fail. */
  persist?: Extract<ControlPanelPersistResult, { ok: true; skipped: false }>;
  /** When persistence skipped (duplicate topic/slug race). */
  persistSkipped?: Extract<ControlPanelPersistResult, { ok: true; skipped: true }>;
};

export type BlogArticlePipelineFailure = {
  ok: false;
  stage: BlogArticlePipelineStage;
  error: string;
  /** Set when plan succeeded but a later stage failed (e.g. retry body only). */
  plan?: BlogControlPanelPlan;
  bodyHtml?: string;
  /** Machine-oriented code (citation gate, plan JSON phases, etc.). */
  code?: string;
  /** Structured validation issues or debug payloads for admin UI. */
  details?: unknown;
  riskFlags?: string[];
};

export type BlogArticlePipelineResult = BlogArticlePipelineSuccess | BlogArticlePipelineFailure;

export type RunBlogArticlePipelineOptions = {
  /** When true (default), writes `BlogPost` as DRAFT after body generation. */
  persist?: boolean;
  /** Override on-page H1 for the body pass (e.g. admin picked another title option). */
  pageH1Override?: string;
};

const MIN_BODY_CHARS = BLOG_ARTICLE_MIN_BODY_CHARS;

/**
 * End-to-end generation: structured plan → HTML article → optional DB draft.
 * Pathway- and country-aware prompts live in {@link blog-article-pipeline-prompts} / {@link blog-article-pathway-context}.
 */
export async function runBlogArticleGenerationPipeline(
  input: ControlPanelGenerateInput,
  options: RunBlogArticlePipelineOptions = {},
): Promise<BlogArticlePipelineResult> {
  const persist = options.persist !== false;

  let plan: BlogControlPanelPlan;
  try {
    plan = await fetchControlPanelPlan(input);
    const verifiedLessons = normalizePlanSuggestedLessonRows(
      await annotateBlogInternalLinkRowsWithVerification(plan.suggestedInternalLessons, input.country),
    );
    plan = {
      ...plan,
      suggestedInternalLessons: verifiedLessons as BlogControlPanelPlan["suggestedInternalLessons"],
    };
    const longCheck = validateLongFormNursingPlanContract(plan, { template: input.template, intent: input.intent });
    if (!longCheck.ok) {
      return {
        ok: false,
        stage: "plan",
        error: longCheck.issues.join(" "),
        code: "PLAN_LONGFORM_CONTRACT",
        details: { issues: longCheck.issues },
      };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (BlogControlPanelPlanError.is(e)) {
      return { ok: false, stage: "plan", error: msg, code: e.code, details: e.details };
    }
    return { ok: false, stage: "plan", error: msg };
  }

  let bodyHtml: string;
  try {
    bodyHtml = await fetchControlPanelBodyHtml({
      plan,
      topic: input.topic,
      exam: input.exam,
      country: input.country,
      template: input.template,
      intent: input.intent,
      funnelStage: input.funnelStage,
      tone: input.tone,
      keywords: input.keywords,
      selectedTitle: options.pageH1Override,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, stage: "body", error: msg, plan };
  }

  if (bodyHtml.length < MIN_BODY_CHARS) {
    return { ok: false, stage: "body", error: "Article body too short after generation", plan, bodyHtml };
  }
  const bodyWordCount = countWordsFromHtml(bodyHtml);
  if (bodyWordCount < BLOG_ARTICLE_MIN_WORDS) {
    return {
      ok: false,
      stage: "body",
      error: `Article body too short after generation (${bodyWordCount} words; minimum ${BLOG_ARTICLE_MIN_WORDS}).`,
      plan,
      bodyHtml,
    };
  }

  const longformBody = enforceLongFormBodyQuality({
    plan,
    bodyHtml,
    template: input.template,
    intent: input.intent,
  });
  if (!longformBody.ok) {
    return {
      ok: false,
      stage: "body",
      error: longformBody.errors.join(" "),
      plan,
      bodyHtml,
      code: "BODY_LONGFORM_ENFORCEMENT",
      details: { ...longformBody.details, errors: longformBody.errors },
    };
  }
  if (longformBody.flags.length > 0) {
    plan = mergeUniqueNeedsReviewFlags(plan, longformBody.flags);
  }

  if (!persist) {
    return { ok: true, plan, bodyHtml };
  }

  try {
    const persistResult = await persistControlPanelDraft(input, plan, bodyHtml);
    if (!persistResult.ok) {
      if (persistResult.code === "INSUFFICIENT_CITATIONS") {
        return {
          ok: false,
          stage: "citations",
          error: persistResult.error,
          plan,
          bodyHtml,
          code: persistResult.code,
          riskFlags: persistResult.riskFlags,
        };
      }
      if (persistResult.code === "PRE_PUBLISH_BLOCKED") {
        return {
          ok: false,
          stage: "persist",
          error: persistResult.error,
          plan,
          bodyHtml,
          code: persistResult.code,
          details: {
            prePublish: persistResult.prePublish ?? null,
            draftPost: persistResult.post ?? null,
          },
        };
      }
      return { ok: false, stage: "persist", error: persistResult.error, plan, bodyHtml };
    }
    if (persistResult.skipped) {
      return { ok: true, plan, bodyHtml, persistSkipped: persistResult };
    }
    return { ok: true, plan, bodyHtml, persist: persistResult };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, stage: "persist", error: msg, plan, bodyHtml };
  }
}
