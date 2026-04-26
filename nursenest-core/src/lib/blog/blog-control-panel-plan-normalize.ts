import type { ZodError, ZodIssue } from "zod";
import { blogControlPanelPlanSchema, type BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** How to join string[] when a scalar string field was emitted as an array. */
function arrayJoinForPlanField(fieldPath: string): "\n" | ", " {
  const p = fieldPath.toLowerCase();
  if (
    p.includes("bullets") ||
    p.includes(".h3") ||
    p.includes("h3[") ||
    p.includes("keytakeaways") ||
    p.includes(".a") ||
    p.includes("rationale") ||
    p.includes("promptidea") ||
    p.includes("captionidea") ||
    p.includes("metadescription") ||
    p.includes("opengraphdescription") ||
    p.includes("featuredsnippethint") ||
    p.includes("suggestedexcerpt") ||
    p.includes("recommendedinternallinks") ||
    p.includes("sourcecandidates") ||
    p.includes("twittercarddescription")
  ) {
    return "\n";
  }
  return ", ";
}

/**
 * Coerce a model-emitted value into a string for Zod fields typed as `z.string()`.
 * - string → unchanged
 * - string[] → joined (field-path chooses "\n" vs ", ")
 * - number | boolean → String(value)
 * - null | undefined → ""
 * - plain object → throws (avoid silently stringifying rich blobs)
 */
export function normalizePlanString(value: unknown, fieldPath: string): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const joiner = arrayJoinForPlanField(fieldPath);
    return value.map((entry, i) => normalizePlanString(entry, `${fieldPath}[${i}]`)).join(joiner);
  }
  if (isPlainObject(value)) {
    const keys = Object.keys(value).slice(0, 16).join(",");
    throw new Error(
      `[blog-plan-normalize] Refusing to coerce plain object to string at "${fieldPath}" (keys=${keys || "—"})`,
    );
  }
  return String(value);
}

function getAtPath(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj;
  for (const p of path) {
    if (cur === null || cur === undefined) return cur;
    if (typeof p === "number" && Array.isArray(cur)) {
      cur = cur[p];
      continue;
    }
    if (typeof p === "string" && isPlainObject(cur)) {
      cur = cur[p];
      continue;
    }
    return undefined;
  }
  return cur;
}

function previewValue(at: unknown): string {
  if (at === null) return "null";
  if (at === undefined) return "undefined";
  if (typeof at === "string") return `${at.slice(0, 140)}${at.length > 140 ? "…" : ""}`;
  if (typeof at === "number" || typeof at === "boolean") return String(at);
  if (Array.isArray(at)) return `[array len=${at.length}]`;
  try {
    return JSON.stringify(at).slice(0, 200);
  } catch {
    return String(at).slice(0, 200);
  }
}

/** Compact Zod issues for API responses and admin UI. */
export function formatZodIssuesForApi(err: ZodError): Array<{ path: string; code: string; message: string }> {
  return err.issues.map((iss: ZodIssue) => ({
    path: iss.path.length ? iss.path.map(String).join(".") : "(root)",
    code: iss.code,
    message: iss.message,
  }));
}

/** Structured stderr when {@link blogControlPanelPlanSchema} rejects after normalization. */
export function logBlogControlPanelPlanValidationFailure(err: ZodError, raw: unknown): void {
  const lines: string[] = [];
  for (const iss of err.issues) {
    const pathStr = iss.path.length ? iss.path.map(String).join(".") : "(root)";
    const at = getAtPath(raw, iss.path as (string | number)[]);
    const atType = at === null ? "null" : Array.isArray(at) ? "array" : typeof at;
    lines.push(
      `path=${pathStr} code=${iss.code} message=${JSON.stringify(iss.message)} atType=${atType} atPreview=${JSON.stringify(previewValue(at))}`,
    );
  }
  console.error(`[blog-plan-validate] Plan schema failed (${err.issues.length} issue(s)):\n${lines.join("\n")}`);
}

/**
 * Best-effort coercion of LLM JSON into the shape expected by {@link blogControlPanelPlanSchema}
 * (string-typed leaves must be strings before Zod runs).
 */
export function normalizeBlogControlPanelPlanJson(raw: unknown): Record<string, unknown> {
  if (!isPlainObject(raw)) {
    throw new Error(
      `[blog-plan-normalize] Plan root must be a plain object, got ${raw === null ? "null" : Array.isArray(raw) ? "array" : typeof raw}`,
    );
  }
  const out: Record<string, unknown> = { ...raw };

  /** Zod `.default([])` does not treat `null` like missing; coerce nullish list roots to []. */
  for (const k of [
    "suggestedInternalLessons",
    "faqs",
    "breadcrumbs",
    "imagePlacements",
    "keyTakeaways",
    "apaSourceStubs",
    "internalAnchorOpportunities",
    "recommendedInternalLinks",
    "sourceCandidates",
    "needsReviewFlags",
  ] as const) {
    if (out[k] === null || out[k] === undefined) {
      out[k] = [];
    }
  }

  const normScalar = (key: string) => {
    if (!(key in out)) return;
    out[key] = normalizePlanString(out[key], key);
  };

  for (const k of [
    "h1",
    "recommendedSlug",
    "metaTitle",
    "metaDescription",
    "featuredSnippetHint",
    "suggestedExcerpt",
    "openGraphTitle",
    "openGraphDescription",
    "canonicalPath",
    "primaryKeyword",
    "searchIntent",
    "twitterCardTitle",
    "twitterCardDescription",
  ]) {
    normScalar(k);
  }

  if ("titleOptions" in out && out.titleOptions !== undefined) {
    const v = out.titleOptions;
    if (typeof v === "string") {
      out.titleOptions = [normalizePlanString(v, "titleOptions[0]")];
    } else if (Array.isArray(v)) {
      out.titleOptions = v.map((x, i) => normalizePlanString(x, `titleOptions[${i}]`));
    } else {
      out.titleOptions = [normalizePlanString(v, "titleOptions")];
    }
  }

  if ("outline" in out && out.outline !== undefined) {
    let ol = out.outline;
    if (!Array.isArray(ol)) {
      if (isPlainObject(ol)) ol = [ol];
      else throw new Error(`[blog-plan-normalize] outline must be array or object, got ${typeof ol}`);
    }
    out.outline = (ol as unknown[]).map((node: unknown, idx: number) => {
      if (!isPlainObject(node)) {
        throw new Error(`[blog-plan-normalize] outline[${idx}] must be object, got ${typeof node}`);
      }
      const n: Record<string, unknown> = { ...node };
      n.h2 = normalizePlanString(n.h2, `outline[${idx}].h2`);
      if (n.h3 !== undefined) {
        if (Array.isArray(n.h3)) {
          n.h3 = n.h3.map((x: unknown, j: number) => normalizePlanString(x, `outline[${idx}].h3[${j}]`));
        } else {
          n.h3 = [normalizePlanString(n.h3, `outline[${idx}].h3`)];
        }
      }
      if (n.bullets !== undefined) {
        if (Array.isArray(n.bullets)) {
          n.bullets = n.bullets.map((x: unknown, j: number) =>
            normalizePlanString(x, `outline[${idx}].bullets[${j}]`),
          );
        } else {
          n.bullets = [normalizePlanString(n.bullets, `outline[${idx}].bullets`)];
        }
      }
      return n;
    });
  }

  if (out.suggestedInternalLessons !== undefined) {
    let rows = out.suggestedInternalLessons;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] suggestedInternalLessons must be array or object`);
    }
    out.suggestedInternalLessons = (rows as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) {
        throw new Error(`[blog-plan-normalize] suggestedInternalLessons[${i}] must be object`);
      }
      const r: Record<string, unknown> = { ...row };
      r.label = normalizePlanString(r.label, `suggestedInternalLessons[${i}].label`);
      r.suggestedPath = normalizePlanString(r.suggestedPath, `suggestedInternalLessons[${i}].suggestedPath`);
      if (r.rationale !== undefined) {
        r.rationale = normalizePlanString(r.rationale, `suggestedInternalLessons[${i}].rationale`);
      }
      if (r.id !== undefined) {
        r.id = normalizePlanString(r.id, `suggestedInternalLessons[${i}].id`);
      }
      if (r.replacementPath !== undefined && r.replacementPath !== null) {
        r.replacementPath = normalizePlanString(
          r.replacementPath,
          `suggestedInternalLessons[${i}].replacementPath`,
        );
      }
      return r;
    });
  }

  if (out.faqs !== undefined) {
    let faqs = out.faqs;
    if (!Array.isArray(faqs)) {
      if (isPlainObject(faqs) && "q" in faqs && "a" in faqs) faqs = [faqs];
      else throw new Error(`[blog-plan-normalize] faqs must be array or {q,a} object`);
    }
    out.faqs = (faqs as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] faqs[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      r.q = normalizePlanString(r.q, `faqs[${i}].q`);
      r.a = normalizePlanString(r.a, `faqs[${i}].a`);
      return r;
    });
  }

  if (out.breadcrumbs !== undefined) {
    let bc = out.breadcrumbs;
    if (!Array.isArray(bc)) {
      if (isPlainObject(bc) && "label" in bc && "href" in bc) bc = [bc];
      else throw new Error(`[blog-plan-normalize] breadcrumbs must be array or single link object`);
    }
    out.breadcrumbs = (bc as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] breadcrumbs[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      r.label = normalizePlanString(r.label, `breadcrumbs[${i}].label`);
      r.href = normalizePlanString(r.href, `breadcrumbs[${i}].href`);
      return r;
    });
  }

  if (out.imagePlacements !== undefined) {
    let im = out.imagePlacements;
    if (!Array.isArray(im)) {
      if (isPlainObject(im)) im = [im];
      else throw new Error(`[blog-plan-normalize] imagePlacements must be array or object`);
    }
    out.imagePlacements = (im as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] imagePlacements[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      if (r.slotKey !== undefined) {
        r.slotKey = normalizePlanString(r.slotKey, `imagePlacements[${i}].slotKey`);
      }
      r.section = normalizePlanString(r.section, `imagePlacements[${i}].section`);
      r.promptIdea = normalizePlanString(r.promptIdea, `imagePlacements[${i}].promptIdea`);
      r.altIdea = normalizePlanString(r.altIdea, `imagePlacements[${i}].altIdea`);
      if (r.captionIdea !== undefined) {
        r.captionIdea = normalizePlanString(r.captionIdea, `imagePlacements[${i}].captionIdea`);
      }
      return r;
    });
  }

  if (out.keyTakeaways !== undefined && Array.isArray(out.keyTakeaways)) {
    out.keyTakeaways = out.keyTakeaways.map((x: unknown, i: number) =>
      normalizePlanString(x, `keyTakeaways[${i}]`),
    );
  }

  if (out.seoFocusKeywords !== undefined && Array.isArray(out.seoFocusKeywords)) {
    out.seoFocusKeywords = out.seoFocusKeywords.map((x: unknown, i: number) =>
      normalizePlanString(x, `seoFocusKeywords[${i}]`),
    );
  }

  if (out.secondaryKeywordPhrases !== undefined && Array.isArray(out.secondaryKeywordPhrases)) {
    out.secondaryKeywordPhrases = out.secondaryKeywordPhrases.map((x: unknown, i: number) =>
      normalizePlanString(x, `secondaryKeywordPhrases[${i}]`),
    );
  }

  if (out.needsReviewFlags !== undefined && Array.isArray(out.needsReviewFlags)) {
    out.needsReviewFlags = out.needsReviewFlags.map((x: unknown, i: number) =>
      normalizePlanString(x, `needsReviewFlags[${i}]`),
    );
  }

  if (out.recommendedInternalLinks !== undefined) {
    let rows = out.recommendedInternalLinks;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] recommendedInternalLinks must be array or object`);
    }
    out.recommendedInternalLinks = (rows as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] recommendedInternalLinks[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      r.targetType = normalizePlanString(r.targetType, `recommendedInternalLinks[${i}].targetType`);
      r.suggestedPath = normalizePlanString(r.suggestedPath, `recommendedInternalLinks[${i}].suggestedPath`);
      r.anchorText = normalizePlanString(r.anchorText, `recommendedInternalLinks[${i}].anchorText`);
      if (r.reason !== undefined) {
        r.reason = normalizePlanString(r.reason, `recommendedInternalLinks[${i}].reason`);
      }
      return r;
    });
  }

  if (out.sourceCandidates !== undefined) {
    let rows = out.sourceCandidates;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] sourceCandidates must be array or object`);
    }
    out.sourceCandidates = (rows as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] sourceCandidates[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      r.title = normalizePlanString(r.title, `sourceCandidates[${i}].title`);
      if (r.url !== undefined && r.url !== null) {
        r.url = normalizePlanString(r.url, `sourceCandidates[${i}].url`);
      }
      if (r.sourceType !== undefined) {
        r.sourceType = normalizePlanString(r.sourceType, `sourceCandidates[${i}].sourceType`);
      }
      if (r.notes !== undefined) {
        r.notes = normalizePlanString(r.notes, `sourceCandidates[${i}].notes`);
      }
      return r;
    });
  }

  if (out.schemaOpportunities !== undefined && Array.isArray(out.schemaOpportunities)) {
    out.schemaOpportunities = out.schemaOpportunities.map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] schemaOpportunities[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      if (r.rationale !== undefined) {
        r.rationale = normalizePlanString(r.rationale, `schemaOpportunities[${i}].rationale`);
      }
      return r;
    });
  }

  if (out.internalAnchorOpportunities !== undefined) {
    let rows = out.internalAnchorOpportunities;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] internalAnchorOpportunities must be array or object`);
    }
    out.internalAnchorOpportunities = (rows as unknown[]).map((row: unknown, i: number) => {
      if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] internalAnchorOpportunities[${i}] must be object`);
      const r: Record<string, unknown> = { ...row };
      r.phrase = normalizePlanString(r.phrase, `internalAnchorOpportunities[${i}].phrase`);
      r.suggestedAnchorText = normalizePlanString(
        r.suggestedAnchorText,
        `internalAnchorOpportunities[${i}].suggestedAnchorText`,
      );
      r.targetSuggestedPath = normalizePlanString(
        r.targetSuggestedPath,
        `internalAnchorOpportunities[${i}].targetSuggestedPath`,
      );
      if (r.rationale !== undefined) {
        r.rationale = normalizePlanString(r.rationale, `internalAnchorOpportunities[${i}].rationale`);
      }
      return r;
    });
  }

  return out;
}

export type SafeParseBlogControlPanelPlanResult =
  | { success: true; data: BlogControlPanelPlan }
  | { success: false; zodError?: ZodError; normalizeError?: string };

/**
 * Normalize LLM-shaped JSON, then validate with {@link blogControlPanelPlanSchema}.
 * On Zod failure, logs each issue with path + original value type/preview from **pre-normalized** raw input.
 */
export function safeParseBlogControlPanelPlan(raw: unknown): SafeParseBlogControlPanelPlanResult {
  let normalized: Record<string, unknown>;
  try {
    normalized = normalizeBlogControlPanelPlanJson(raw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[blog-plan-validate] Normalization failed: ${msg}`);
    return { success: false, normalizeError: msg };
  }

  const parsed = blogControlPanelPlanSchema.safeParse(normalized);
  if (!parsed.success) {
    logBlogControlPanelPlanValidationFailure(parsed.error, raw);
    return { success: false, zodError: parsed.error };
  }
  return { success: true, data: parsed.data };
}
