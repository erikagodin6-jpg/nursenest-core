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
 * Recoverable validation failures (short body, long-form outline mismatch, SEO near-duplicate titles) trigger an
 * automatic repair pass (bounded attempts) before returning `ok: false`.
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
import {
  BLOG_ARTICLE_EXPANSION_REPAIR_FLOOR_WORDS,
  BLOG_ARTICLE_MIN_WORDS,
  BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH,
  countWordsFromHtml,
} from "@/lib/blog/blog-word-count";
import { validateLongFormNursingPlanContract } from "@/lib/blog/blog-longform-nursing-contract";
import {
  enforceLongFormBodyQuality,
  mergeUniqueNeedsReviewFlags,
} from "@/lib/blog/blog-longform-body-enforcement";
import {
  classifyBlogPipelineFailureForRepair,
  MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS,
} from "@/lib/blog/blog-generation-repair-classifier";
import {
  repairBlogPlanHeadlinesForSeoDistinctness,
  repairControlPanelArticleBodyHtml,
  repairPlanForLongformContractIssues,
} from "@/lib/blog/blog-generation-repair-ai";

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
  /** Count of repair rounds (plan/body/headline) applied before success. */
  repairPassesUsed?: number;
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
  /** Repair rounds attempted before terminal failure. */
  repairPassesUsed?: number;
};

export type BlogArticlePipelineResult = BlogArticlePipelineSuccess | BlogArticlePipelineFailure;

export type RunBlogArticlePipelineOptions = {
  /** When true (default), writes `BlogPost` as DRAFT after body generation. */
  persist?: boolean;
  /** Override on-page H1 for the body pass (e.g. admin picked another title option). */
  pageH1Override?: string;
  /** Suffix for OpenAI `user` on completions (e.g. batch id + item id). */
  idempotencyKey?: string;
  /** Skip first plan LLM fetch (async job retry / resume). */
  initialPlan?: BlogControlPanelPlan;
  /** Skip first body LLM fetch; enter repair/validation loop from this HTML. */
  initialBodyHtml?: string;
  /** Pipeline observability (admin job queue + server logs). */
  onProgressStage?: (stage: string) => void | Promise<void>;
};

const MIN_BODY_CHARS = BLOG_ARTICLE_MIN_BODY_CHARS;

function repairBackoffMs(passIndex: number): number {
  const base = Math.min(
    30_000,
    Math.max(800, Number(process.env.BLOG_REPAIR_BACKOFF_BASE_MS?.trim()) || 1200),
  );
  return Math.min(30_000, Math.floor(base * Math.pow(2, Math.max(0, passIndex))));
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function openAiUserTag(idempotencyKey: string | undefined, ...parts: (string | number)[]): string | undefined {
  if (!idempotencyKey) return undefined;
  return `${idempotencyKey}:${parts.join(":")}`.slice(0, 120);
}

/**
 * End-to-end generation: structured plan → HTML article → optional DB draft.
 * Pathway- and country-aware prompts live in {@link blog-article-pipeline-prompts} / {@link blog-article-pathway-context}.
 */
export async function runBlogArticleGenerationPipeline(
  input: ControlPanelGenerateInput,
  options: RunBlogArticlePipelineOptions = {},
): Promise<BlogArticlePipelineResult> {
  const persist = options.persist !== false;
  const idem = options.idempotencyKey;
  let repairPassesUsed = 0;
  const substantiveWordMin = input.publishImmediately
    ? BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH
    : BLOG_ARTICLE_MIN_WORDS;

  const reportStage = async (stage: string) => {
    await options.onProgressStage?.(stage);
  };

  let plan: BlogControlPanelPlan;
  let planSeed: BlogControlPanelPlan | null = options.initialPlan ?? null;
  try {
    await reportStage("generating_plan");
    while (true) {
      try {
        if (planSeed) {
          plan = planSeed;
          planSeed = null;
        } else {
          plan = await fetchControlPanelPlan(input, { openAiUser: openAiUserTag(idem, "plan", repairPassesUsed) });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (BlogControlPanelPlanError.is(e)) {
          return { ok: false, stage: "plan", error: msg, code: e.code, details: e.details, repairPassesUsed };
        }
        return { ok: false, stage: "plan", error: msg, repairPassesUsed };
      }

      const verifiedLessons = normalizePlanSuggestedLessonRows(
        await annotateBlogInternalLinkRowsWithVerification(plan.suggestedInternalLessons, input.country),
      );
      plan = {
        ...plan,
        suggestedInternalLessons: verifiedLessons as BlogControlPanelPlan["suggestedInternalLessons"],
      };

      const longCheck = validateLongFormNursingPlanContract(plan, { template: input.template, intent: input.intent });
      if (longCheck.ok) break;

      const synthetic = {
        stage: "plan",
        error: longCheck.issues.join(" "),
        code: "PLAN_LONGFORM_CONTRACT" as const,
      };
      const cl = classifyBlogPipelineFailureForRepair(synthetic);
      if (!cl.recoverable || repairPassesUsed >= MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS) {
        return {
          ok: false,
          stage: "plan",
          error: longCheck.issues.join(" "),
          code: "PLAN_LONGFORM_CONTRACT",
          details: { issues: longCheck.issues },
          plan,
          repairPassesUsed,
        };
      }

      plan = await repairPlanForLongformContractIssues({
        plan,
        topic: input.topic,
        exam: input.exam,
        country: input.country,
        template: input.template,
        intent: input.intent,
        funnelStage: input.funnelStage,
        tone: input.tone,
        keywords: input.keywords,
        issuesJoined: longCheck.issues.join(" "),
      });
      const reVerified = normalizePlanSuggestedLessonRows(
        await annotateBlogInternalLinkRowsWithVerification(plan.suggestedInternalLessons, input.country),
      );
      plan = { ...plan, suggestedInternalLessons: reVerified as BlogControlPanelPlan["suggestedInternalLessons"] };
      repairPassesUsed += 1;
      await sleepMs(repairBackoffMs(repairPassesUsed - 1));
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (BlogControlPanelPlanError.is(e)) {
      return { ok: false, stage: "plan", error: msg, code: e.code, details: e.details, repairPassesUsed };
    }
    return { ok: false, stage: "plan", error: msg, repairPassesUsed };
  }

  let bodyHtml: string;
  try {
    await reportStage("generating_body");
    if (typeof options.initialBodyHtml === "string" && options.initialBodyHtml.trim().length > 0) {
      bodyHtml = options.initialBodyHtml;
    } else {
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
        openAiUser: openAiUserTag(idem, "body", repairPassesUsed),
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, stage: "body", error: msg, plan, repairPassesUsed };
  }

  for (;;) {
    const validationMessages: string[] = [];
    if (bodyHtml.length < MIN_BODY_CHARS) {
      validationMessages.push(`Article body is below minimum character length (${bodyHtml.length}; min ${MIN_BODY_CHARS}).`);
    }
    const bodyWordCount = countWordsFromHtml(bodyHtml);
    if (bodyWordCount < substantiveWordMin) {
      const inExpansionBand =
        bodyWordCount >= BLOG_ARTICLE_EXPANSION_REPAIR_FLOOR_WORDS && bodyWordCount < substantiveWordMin;
      validationMessages.push(
        inExpansionBand
          ? `Article body is below publish depth (${bodyWordCount} words; target ${substantiveWordMin} substantive words; hard minimum ${BLOG_ARTICLE_MIN_WORDS}). Running expansion repair.`
          : `Article body is too short (${bodyWordCount} words; minimum ${BLOG_ARTICLE_MIN_WORDS}). Target at least ${BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH} substantive words before publish.`,
      );
    }

    const longformBody = enforceLongFormBodyQuality({
      plan,
      bodyHtml,
      template: input.template,
      intent: input.intent,
    });
    if (!longformBody.ok) {
      validationMessages.push(...longformBody.errors);
    } else if (longformBody.flags.length > 0) {
      plan = mergeUniqueNeedsReviewFlags(plan, longformBody.flags);
    }

    if (validationMessages.length === 0 && longformBody.ok) {
      break;
    }

    const synthetic = {
      stage: "body",
      error: validationMessages.join(" ") || longformBody.errors.join(" "),
      code: longformBody.ok ? undefined : ("BODY_LONGFORM_ENFORCEMENT" as const),
    };
    const cl = classifyBlogPipelineFailureForRepair(synthetic);
    if (!cl.recoverable || repairPassesUsed >= MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS) {
      return {
        ok: false,
        stage: "body",
        error: synthetic.error,
        plan,
        bodyHtml,
        ...(longformBody.ok ? {} : { code: "BODY_LONGFORM_ENFORCEMENT", details: { ...longformBody.details, errors: longformBody.errors } }),
        repairPassesUsed,
      };
    }

    await sleepMs(repairBackoffMs(repairPassesUsed));
    await reportStage("repairing_body");
    try {
      bodyHtml = await repairControlPanelArticleBodyHtml({
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
        currentHtml: bodyHtml,
        validationMessages,
        targetWordMin: substantiveWordMin,
        openAiUser: openAiUserTag(idem, "repair-body", repairPassesUsed),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, stage: "body", error: msg, plan, bodyHtml, repairPassesUsed };
    }
    repairPassesUsed += 1;

    const longformAfter = enforceLongFormBodyQuality({
      plan,
      bodyHtml,
      template: input.template,
      intent: input.intent,
    });
    if (longformAfter.flags.length > 0) {
      plan = mergeUniqueNeedsReviewFlags(plan, longformAfter.flags);
    }
  }

  if (!persist) {
    return { ok: true, plan, bodyHtml, repairPassesUsed };
  }

  while (true) {
    try {
      const persistResult = await persistControlPanelDraft(input, plan, bodyHtml, {
        onPersistStage: async (s) => {
          await reportStage(s);
        },
      });
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
            repairPassesUsed,
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
            repairPassesUsed,
          };
        }
        if (persistResult.code === "SEO_DUPLICATE_BLOCKED") {
          const cl = classifyBlogPipelineFailureForRepair({
            stage: "persist",
            error: persistResult.error,
            code: persistResult.code,
          });
          if (!cl.recoverable || repairPassesUsed >= MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS) {
            return {
              ok: false,
              stage: "persist",
              error: persistResult.error,
              plan,
              bodyHtml,
              code: persistResult.code,
              repairPassesUsed,
            };
          }
          const repairedPlan = await repairBlogPlanHeadlinesForSeoDistinctness({
            plan,
            topic: input.topic,
            exam: input.exam,
            country: input.country,
            template: input.template,
            intent: input.intent,
            funnelStage: input.funnelStage,
            tone: input.tone,
            keywords: input.keywords,
            blockedReason: persistResult.error,
            openAiUser: openAiUserTag(idem, "repair-seo", repairPassesUsed),
          });
          if (!repairedPlan) {
            return {
              ok: false,
              stage: "persist",
              error: `${persistResult.error} (could not generate a sufficiently distinct headline after repair).`,
              plan,
              bodyHtml,
              code: persistResult.code,
              repairPassesUsed,
            };
          }
          plan = repairedPlan;
          const reVerified = normalizePlanSuggestedLessonRows(
            await annotateBlogInternalLinkRowsWithVerification(plan.suggestedInternalLessons, input.country),
          );
          plan = { ...plan, suggestedInternalLessons: reVerified as BlogControlPanelPlan["suggestedInternalLessons"] };
          repairPassesUsed += 1;
          await sleepMs(repairBackoffMs(repairPassesUsed - 1));
          // Regenerate body so headings align with new H1 theme
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
              selectedTitle: plan.h1,
              openAiUser: openAiUserTag(idem, "body-after-seo", repairPassesUsed),
            });
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            return { ok: false, stage: "body", error: msg, plan, repairPassesUsed };
          }
          const wc = countWordsFromHtml(bodyHtml);
          if (bodyHtml.length < MIN_BODY_CHARS || wc < substantiveWordMin) {
            const msgs = [
              `Post–title-repair body below limits (${wc} words; need ≥${substantiveWordMin}).`,
            ];
            try {
              await reportStage("repairing_body");
              bodyHtml = await repairControlPanelArticleBodyHtml({
                plan,
                topic: input.topic,
                exam: input.exam,
                country: input.country,
                template: input.template,
                intent: input.intent,
                funnelStage: input.funnelStage,
                tone: input.tone,
                keywords: input.keywords,
                selectedTitle: plan.h1,
                currentHtml: bodyHtml,
                validationMessages: msgs,
                targetWordMin: substantiveWordMin,
                openAiUser: openAiUserTag(idem, "repair-body-post-seo", repairPassesUsed),
              });
              repairPassesUsed += 1;
            } catch (ex) {
              const m = ex instanceof Error ? ex.message : String(ex);
              return { ok: false, stage: "body", error: m, plan, bodyHtml, repairPassesUsed };
            }
          }
          const lf = enforceLongFormBodyQuality({
            plan,
            bodyHtml,
            template: input.template,
            intent: input.intent,
          });
          if (!lf.ok) {
            return {
              ok: false,
              stage: "body",
              error: lf.errors.join(" "),
              plan,
              bodyHtml,
              code: "BODY_LONGFORM_ENFORCEMENT",
              details: lf.details,
              repairPassesUsed,
            };
          }
          if (lf.flags.length > 0) {
            plan = mergeUniqueNeedsReviewFlags(plan, lf.flags);
          }
          continue;
        }
        return { ok: false, stage: "persist", error: persistResult.error, plan, bodyHtml, repairPassesUsed };
      }
      if (persistResult.skipped) {
        return { ok: true, plan, bodyHtml, persistSkipped: persistResult, repairPassesUsed };
      }
      return { ok: true, plan, bodyHtml, persist: persistResult, repairPassesUsed };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, stage: "persist", error: msg, plan, bodyHtml, repairPassesUsed };
    }
  }
}
