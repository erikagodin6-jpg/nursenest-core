import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { isBlogSeoPillarDepthProfile } from "@/lib/blog/blog-seo-depth-profile";
import type { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import {
  collectEducationalPlaceholderIds,
  hasEducationalAiDisclaimerLanguage,
} from "@/lib/education/educational-content-placeholder-guard";

export type BlogGenerationOutputGateMode = "draft_storage" | "publish_or_schedule";

export type BlogGenerationOutputGateInput = {
  title: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  bodyHtml: string;
  /** When set, chooses 800 vs 1200 substantive minimum for publish/schedule mode. */
  template?: BlogPostTemplate;
  intent?: BlogPostIntent;
  /** Override pillar detection when template/intent are not available. */
  contentDepth?: "standard" | "pillar";
  mode: BlogGenerationOutputGateMode;
};

export type BlogGenerationOutputGateResult =
  | { ok: true; wordCount: number; minRequired: number }
  | { ok: false; wordCount: number; minRequired: number; reasons: string[] };

function depthFromInput(input: BlogGenerationOutputGateInput): "standard" | "pillar" {
  if (input.contentDepth) return input.contentDepth;
  if (input.template != null && input.intent != null) {
    return isBlogSeoPillarDepthProfile({ template: input.template, intent: input.intent }) ? "pillar" : "standard";
  }
  return "standard";
}

function hasEmptySectionSignals(html: string): boolean {
  const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  if (h2.length === 0) return false;
  for (const m of h2) {
    const heading = (m[1] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!heading) return true;
    const idx = m.index ?? 0;
    const after = html.slice(idx + m[0].length, idx + m[0].length + 4000);
    const nextH2 = after.search(/<h2\b/i);
    const chunk = nextH2 === -1 ? after : after.slice(0, nextH2);
    const text = chunk.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length < 40) return true;
  }
  return false;
}

/**
 * Deterministic quality gate for generated HTML before persisting as SCHEDULED/PUBLISHED,
 * or before accepting thin “metadata shells” in automation paths.
 */
export function evaluateBlogGenerationOutputGate(input: BlogGenerationOutputGateInput): BlogGenerationOutputGateResult {
  const reasons: string[] = [];
  const title = (input.title ?? "").trim();
  const slug = (input.slug ?? "").trim();
  const meta = (input.seoDescription ?? "").trim();
  const seoTitle = (input.seoTitle ?? "").trim();
  const body = input.bodyHtml ?? "";
  const wc = countWordsFromHtml(body);
  const depth = depthFromInput(input);
  const minRequired = input.mode === "publish_or_schedule" ? (depth === "pillar" ? 1200 : 800) : 300;

  if (!title) reasons.push("missing_title");
  if (!slug) reasons.push("missing_slug");
  if (input.mode === "publish_or_schedule" && !meta) reasons.push("missing_meta_description");
  if (input.mode === "publish_or_schedule" && !seoTitle) reasons.push("missing_seo_title");

  if (wc < 300) {
    reasons.push(`metadata_or_thin_body:word_count=${wc};minimum=300`);
  }

  if (input.mode === "publish_or_schedule" && wc < minRequired) {
    reasons.push(`body_below_depth_minimum:word_count=${wc};minimum=${minRequired};depth=${depth}`);
  }

  const stubBundle = [title, slug, meta, seoTitle, body].join("\n");
  const stubIds = collectEducationalPlaceholderIds(stubBundle);
  if (stubIds.length > 0) {
    reasons.push(`placeholder_language_detected:${stubIds.slice(0, 8).join(",")}`);
  }
  if (hasEducationalAiDisclaimerLanguage(stubBundle)) {
    reasons.push("ai_disclaimer_language_detected");
  }
  if (hasEmptySectionSignals(body)) {
    reasons.push("empty_or_trivial_section_under_heading");
  }

  if (reasons.length > 0) {
    return { ok: false, wordCount: wc, minRequired, reasons };
  }
  return { ok: true, wordCount: wc, minRequired };
}
