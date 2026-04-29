import type { ZodError, ZodIssue } from "zod";
import { blogControlPanelPlanSchema, type BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Default hero prompt when the model omits or weakens `imagePlacements` (keeps pipeline + image jobs unblocked). */
export const BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA =
  "clinical nursing education illustration showing patient assessment and care planning";

export const BLOG_PLAN_FALLBACK_IMAGE_ALT_IDEA =
  "Clinical nursing education illustration supporting article content";

export const BLOG_PLAN_FALLBACK_IMAGE_SECTION = "Article overview";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Optional context for structured logs when image placement fields are repaired (no secrets / no body). */
export type BlogEditorialPlanNormalizeContext = {
  jobId?: string;
  slug?: string;
  title?: string;
};

function coerceImagePlacementScalarString(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  if (Array.isArray(raw)) {
    return raw.map((x) => coerceImagePlacementScalarString(x)).filter(Boolean).join(" ");
  }
  return "";
}

function promptIdeaRepairReason(raw: unknown, trimmed: string): "ok" | "missing" | "empty" | "too_short" | "invalid_type" {
  if (raw !== null && raw !== undefined && typeof raw === "object" && !Array.isArray(raw)) {
    return "invalid_type";
  }
  if (raw === null || raw === undefined) return "missing";
  if (trimmed.length === 0) return "empty";
  if (trimmed.length < 10) return "too_short";
  return "ok";
}

function logImagePlacementRepair(
  reason: "missing" | "empty" | "too_short" | "invalid_type",
  index: number,
  ctx?: BlogEditorialPlanNormalizeContext,
): void {
  const titleSlice = ctx?.title ? String(ctx.title).slice(0, 120) : undefined;
  safeServerLog("blog-plan-normalize", "repaired_imagePlacements_promptIdea", {
    reason,
    index,
    ...(ctx?.jobId ? { jobId: ctx.jobId } : {}),
    ...(ctx?.slug ? { slug: ctx.slug } : {}),
    ...(titleSlice ? { title: titleSlice } : {}),
  });
}

/**
 * Ensures `imagePlacements` is a non-empty array with valid `promptIdea` strings before Zod runs.
 * Does not throw for missing or malformed `imagePlacements` (repairs in place).
 */
export function repairImagePlacementsInPlanRecord(
  out: Record<string, unknown>,
  ctx?: BlogEditorialPlanNormalizeContext,
): void {
  let im: unknown = out.imagePlacements;
  if (im === null || im === undefined) {
    im = [];
  }
  if (!Array.isArray(im)) {
    if (isPlainObject(im)) {
      im = [im];
    } else {
      logImagePlacementRepair("invalid_type", -1, ctx);
      im = [];
    }
  }

  const rows: Record<string, unknown>[] = [];
  let i = 0;
  for (const row of im as unknown[]) {
    if (!isPlainObject(row)) {
      logImagePlacementRepair("invalid_type", i, ctx);
      i++;
      continue;
    }
    const r: Record<string, unknown> = { ...row };
    const rawPrompt = r.promptIdea;
    const promptTrimmed = coerceImagePlacementScalarString(rawPrompt).trim().slice(0, 500);
    const pr = promptIdeaRepairReason(rawPrompt, promptTrimmed);
    if (pr !== "ok") {
      r.promptIdea = BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA;
      logImagePlacementRepair(pr, i, ctx);
    } else {
      r.promptIdea = promptTrimmed;
    }

    const sec = coerceImagePlacementScalarString(r.section).trim().slice(0, 200);
    r.section = sec.length >= 1 ? sec : BLOG_PLAN_FALLBACK_IMAGE_SECTION;

    const alt = coerceImagePlacementScalarString(r.altIdea).trim().slice(0, 240);
    r.altIdea = alt.length >= 5 ? alt : BLOG_PLAN_FALLBACK_IMAGE_ALT_IDEA;

    if (r.slotKey !== undefined) {
      const sk = coerceImagePlacementScalarString(r.slotKey).trim().slice(0, 48);
      if (sk.length >= 2) r.slotKey = sk;
      else delete r.slotKey;
    }
    if (r.captionIdea !== undefined) {
      const c = coerceImagePlacementScalarString(r.captionIdea).trim().slice(0, 300);
      if (c) r.captionIdea = c;
      else delete r.captionIdea;
    }
    rows.push(r);
    i++;
  }

  if (rows.length === 0) {
    rows.push({
      slotKey: "hero",
      role: "hero",
      section: BLOG_PLAN_FALLBACK_IMAGE_SECTION,
      promptIdea: BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA,
      altIdea: BLOG_PLAN_FALLBACK_IMAGE_ALT_IDEA,
    });
    logImagePlacementRepair("missing", 0, ctx);
  }

  out.imagePlacements = rows.slice(0, 10);
}

/**
 * Shallow-clone a plan-shaped object and repair `imagePlacements` / `promptIdea` before schema validation.
 * Non-objects are returned unchanged (callers must still validate root shape).
 */
export function normalizeBlogEditorialPlanCandidate(
  candidate: unknown,
  ctx?: BlogEditorialPlanNormalizeContext,
): unknown {
  if (!isPlainObject(candidate)) return candidate;
  const out = { ...candidate };
  repairImagePlacementsInPlanRecord(out, ctx);
  return out;
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
 * (string-typed leaves must be strings before Zod runs, and must fit within Zod length bounds).
 *
 * Truncates fields that exceed schema max lengths so the AI can return overly-long strings
 * (e.g. a metaTitle longer than 70 chars) without breaking the Zod parse step.
 * Provides fallbacks for required fields that are missing or too short after normalization.
 */
export function normalizeBlogControlPanelPlanJson(
  raw: unknown,
  ctx?: BlogEditorialPlanNormalizeContext,
): Record<string, unknown> {
  const primed = normalizeBlogEditorialPlanCandidate(raw, ctx);
  if (!isPlainObject(primed)) {
    throw new Error(
      `[blog-plan-normalize] Plan root must be a plain object, got ${raw === null ? "null" : Array.isArray(raw) ? "array" : typeof raw}`,
    );
  }
  const out: Record<string, unknown> = { ...primed };

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

  // ── Post-normalize clamping ──────────────────────────────────────────────────
  // Clamp every scalar string field to the Zod schema max so AI-returned strings
  // that exceed the limit don't cause "String must contain at most N character(s)" failures.

  // Optional fields: clamp to max; delete key if empty (schema treats absent as optional).
  const clampOpt = (key: string, maxLen: number) => {
    if (!(key in out)) return;
    const v = String(out[key] ?? "").slice(0, maxLen).trim();
    if (v) out[key] = v;
    else delete out[key];
  };
  clampOpt("h1", 200);
  clampOpt("featuredSnippetHint", 400);
  clampOpt("suggestedExcerpt", 360);
  clampOpt("openGraphTitle", 90);
  clampOpt("openGraphDescription", 200);
  clampOpt("canonicalPath", 220);
  clampOpt("primaryKeyword", 160);
  clampOpt("searchIntent", 120);
  clampOpt("twitterCardTitle", 120);
  clampOpt("twitterCardDescription", 280);

  // recommendedSlug — required (min 3, max 120). Clean + clamp; fallback to "blog-draft".
  {
    const raw = String(out.recommendedSlug ?? "").trim().toLowerCase()
      .replace(/[^\x00-\x7F]/g, " ").replace(/\s*&\s*/g, " and ")
      .replace(/[/:\\—–]/g, " ").replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
    out.recommendedSlug = raw.length >= 3 ? raw : "blog-draft";
  }

  // metaTitle — required (min 3, max 70). Clamp; fallback to first titleOption or h1.
  {
    const v = String(out.metaTitle ?? "").slice(0, 70).trim();
    if (v.length >= 3) {
      out.metaTitle = v;
    } else {
      // Derive from titleOptions or h1 as fallback
      const firstTitle = (() => {
        if (Array.isArray(out.titleOptions) && out.titleOptions.length > 0) {
          return String(out.titleOptions[0] ?? "").slice(0, 70).trim();
        }
        return String(out.h1 ?? "").slice(0, 70).trim();
      })();
      out.metaTitle = firstTitle.length >= 3 ? firstTitle : "Nursing Study Guide";
    }
  }

  // metaDescription — required (min 20, max 320). Clamp; fallback if too short.
  {
    const v = String(out.metaDescription ?? "").slice(0, 320).trim();
    if (v.length >= 20) {
      out.metaDescription = v;
    } else {
      const fromExcerpt = String(out.suggestedExcerpt ?? "").slice(0, 320).trim();
      if (fromExcerpt.length >= 20) {
        out.metaDescription = fromExcerpt;
      } else {
        const titleFallback = String(out.metaTitle ?? "").trim();
        out.metaDescription = `${titleFallback} — Comprehensive nursing exam prep with clinical reasoning and practice questions.`.slice(0, 320);
      }
    }
  }
  // ── End clamping ─────────────────────────────────────────────────────────────

  if ("titleOptions" in out && out.titleOptions !== undefined) {
    const v = out.titleOptions;
    let items: unknown[];
    if (typeof v === "string") {
      items = [normalizePlanString(v, "titleOptions[0]")];
    } else if (Array.isArray(v)) {
      items = v.map((x, i) => normalizePlanString(x, `titleOptions[${i}]`));
    } else {
      items = [normalizePlanString(v, "titleOptions")];
    }
    // Clamp each title to max 200 chars; filter empties; ensure at least 2 items (schema min(2))
    const clamped = items
      .map((x) => String(x ?? "").slice(0, 200).trim())
      .filter((x) => x.length >= 3)
      .slice(0, 6);
    if (clamped.length === 0) {
      // No valid titles from AI — use metaTitle as fallback
      const fb = String(out.metaTitle ?? "Nursing Study Guide").slice(0, 200);
      out.titleOptions = [fb, fb];
    } else if (clamped.length === 1) {
      out.titleOptions = [clamped[0], clamped[0]]; // duplicate to satisfy min(2)
    } else {
      out.titleOptions = clamped;
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
      n.h2 = normalizePlanString(n.h2, `outline[${idx}].h2`).slice(0, 200);
      if (n.h3 !== undefined) {
        if (Array.isArray(n.h3)) {
          n.h3 = n.h3
            .map((x: unknown, j: number) => normalizePlanString(x, `outline[${idx}].h3[${j}]`).slice(0, 200))
            .filter((x: string) => x.length > 0)
            .slice(0, 8);
        } else {
          n.h3 = [normalizePlanString(n.h3, `outline[${idx}].h3`).slice(0, 200)].filter((x) => x.length > 0);
        }
      }
      if (n.bullets !== undefined) {
        if (Array.isArray(n.bullets)) {
          n.bullets = n.bullets
            .map((x: unknown, j: number) => normalizePlanString(x, `outline[${idx}].bullets[${j}]`).slice(0, 400))
            .filter((x: string) => x.length > 0)
            .slice(0, 12);
        } else {
          n.bullets = [normalizePlanString(n.bullets, `outline[${idx}].bullets`).slice(0, 400)].filter((x) => x.length > 0);
        }
      }
      return n;
    });
    // outline requires min(3) sections — pad with stubs if AI returned too few
    if (Array.isArray(out.outline) && out.outline.length < 3) {
      const metaTitleFb = String(out.metaTitle ?? "Overview").slice(0, 120);
      while ((out.outline as unknown[]).length < 3) {
        (out.outline as unknown[]).push({ h2: `${metaTitleFb} — continued` });
      }
    }
  }

  if (out.suggestedInternalLessons !== undefined) {
    let rows = out.suggestedInternalLessons;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] suggestedInternalLessons must be array or object`);
    }
    out.suggestedInternalLessons = (rows as unknown[])
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) {
          throw new Error(`[blog-plan-normalize] suggestedInternalLessons[${i}] must be object`);
        }
        const r: Record<string, unknown> = { ...row };
        r.label = normalizePlanString(r.label, `suggestedInternalLessons[${i}].label`).slice(0, 200);
        r.suggestedPath = normalizePlanString(r.suggestedPath, `suggestedInternalLessons[${i}].suggestedPath`).slice(0, 500);
        if (r.rationale !== undefined) {
          r.rationale = normalizePlanString(r.rationale, `suggestedInternalLessons[${i}].rationale`).slice(0, 400);
        }
        if (r.id !== undefined) {
          r.id = normalizePlanString(r.id, `suggestedInternalLessons[${i}].id`).slice(0, 80);
        }
        if (r.replacementPath !== undefined && r.replacementPath !== null) {
          r.replacementPath = normalizePlanString(
            r.replacementPath,
            `suggestedInternalLessons[${i}].replacementPath`,
          ).slice(0, 500);
        }
        return r;
      })
      .filter((r: Record<string, unknown>) => String(r.label ?? "").length >= 2 && String(r.suggestedPath ?? "").length >= 2)
      .slice(0, 16);
  }

  if (out.faqs !== undefined) {
    let faqs = out.faqs;
    if (!Array.isArray(faqs)) {
      if (isPlainObject(faqs) && "q" in faqs && "a" in faqs) faqs = [faqs];
      else throw new Error(`[blog-plan-normalize] faqs must be array or {q,a} object`);
    }
    out.faqs = (faqs as unknown[])
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] faqs[${i}] must be object`);
        const r: Record<string, unknown> = { ...row };
        r.q = normalizePlanString(r.q, `faqs[${i}].q`).slice(0, 300);
        r.a = normalizePlanString(r.a, `faqs[${i}].a`).slice(0, 1200);
        return r;
      })
      // Filter out items where q or a are too short to pass Zod min constraints
      .filter((r: Record<string, unknown>) => String(r.q ?? "").length >= 5 && String(r.a ?? "").length >= 10)
      .slice(0, 12);
  }

  if (out.breadcrumbs !== undefined) {
    let bc = out.breadcrumbs;
    if (!Array.isArray(bc)) {
      if (isPlainObject(bc) && "label" in bc && "href" in bc) bc = [bc];
      else throw new Error(`[blog-plan-normalize] breadcrumbs must be array or single link object`);
    }
    out.breadcrumbs = (bc as unknown[])
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] breadcrumbs[${i}] must be object`);
        const r: Record<string, unknown> = { ...row };
        r.label = normalizePlanString(r.label, `breadcrumbs[${i}].label`).slice(0, 80);
        r.href = normalizePlanString(r.href, `breadcrumbs[${i}].href`).slice(0, 500);
        return r;
      })
      .filter((r: Record<string, unknown>) => String(r.label ?? "").length >= 1 && String(r.href ?? "").length >= 1)
      .slice(0, 12);
  }

  if (out.keyTakeaways !== undefined && Array.isArray(out.keyTakeaways)) {
    out.keyTakeaways = out.keyTakeaways
      .map((x: unknown, i: number) => normalizePlanString(x, `keyTakeaways[${i}]`).slice(0, 400))
      .filter((x: string) => x.length >= 5)
      .slice(0, 10);
  }

  if (out.seoFocusKeywords !== undefined && Array.isArray(out.seoFocusKeywords)) {
    out.seoFocusKeywords = out.seoFocusKeywords
      .map((x: unknown, i: number) => normalizePlanString(x, `seoFocusKeywords[${i}]`).slice(0, 80))
      .filter((x: string) => x.length >= 2)
      .slice(0, 10);
  }

  if (out.secondaryKeywordPhrases !== undefined && Array.isArray(out.secondaryKeywordPhrases)) {
    out.secondaryKeywordPhrases = out.secondaryKeywordPhrases
      .map((x: unknown, i: number) => normalizePlanString(x, `secondaryKeywordPhrases[${i}]`).slice(0, 80))
      .filter((x: string) => x.length >= 2)
      .slice(0, 12);
  }

  if (out.needsReviewFlags !== undefined && Array.isArray(out.needsReviewFlags)) {
    out.needsReviewFlags = out.needsReviewFlags
      .map((x: unknown, i: number) => normalizePlanString(x, `needsReviewFlags[${i}]`).slice(0, 80))
      .filter((x: string) => x.length >= 2)
      .slice(0, 24);
  }

  if (out.recommendedInternalLinks !== undefined) {
    let rows = out.recommendedInternalLinks;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] recommendedInternalLinks must be array or object`);
    }
    out.recommendedInternalLinks = (rows as unknown[])
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] recommendedInternalLinks[${i}] must be object`);
        const r: Record<string, unknown> = { ...row };
        r.targetType = normalizePlanString(r.targetType, `recommendedInternalLinks[${i}].targetType`).slice(0, 48);
        r.suggestedPath = normalizePlanString(r.suggestedPath, `recommendedInternalLinks[${i}].suggestedPath`).slice(0, 500);
        r.anchorText = normalizePlanString(r.anchorText, `recommendedInternalLinks[${i}].anchorText`).slice(0, 160);
        if (r.reason !== undefined) {
          r.reason = normalizePlanString(r.reason, `recommendedInternalLinks[${i}].reason`).slice(0, 400);
        }
        return r;
      })
      .filter(
        (r: Record<string, unknown>) =>
          String(r.targetType ?? "").length >= 2 &&
          String(r.suggestedPath ?? "").length >= 2 &&
          String(r.anchorText ?? "").length >= 2,
      )
      .slice(0, 16);
  }

  if (out.sourceCandidates !== undefined) {
    let rows = out.sourceCandidates;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] sourceCandidates must be array or object`);
    }
    out.sourceCandidates = (rows as unknown[])
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] sourceCandidates[${i}] must be object`);
        const r: Record<string, unknown> = { ...row };
        r.title = normalizePlanString(r.title, `sourceCandidates[${i}].title`).slice(0, 400);
        if (r.url !== undefined && r.url !== null) {
          r.url = normalizePlanString(r.url, `sourceCandidates[${i}].url`).slice(0, 2000);
        }
        if (r.sourceType !== undefined) {
          r.sourceType = normalizePlanString(r.sourceType, `sourceCandidates[${i}].sourceType`).slice(0, 80);
        }
        if (r.notes !== undefined) {
          r.notes = normalizePlanString(r.notes, `sourceCandidates[${i}].notes`).slice(0, 500);
        }
        return r;
      })
      .filter((r: Record<string, unknown>) => String(r.title ?? "").length >= 3)
      .slice(0, 16);
  }

  if (out.schemaOpportunities !== undefined && Array.isArray(out.schemaOpportunities)) {
    out.schemaOpportunities = out.schemaOpportunities
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] schemaOpportunities[${i}] must be object`);
        const r: Record<string, unknown> = { ...row };
        if (r.rationale !== undefined) {
          r.rationale = normalizePlanString(r.rationale, `schemaOpportunities[${i}].rationale`).slice(0, 400);
        }
        return r;
      })
      .slice(0, 8);
  }

  // articleSummary — optional (min 80, max 2000): delete if too short after normalize
  if ("articleSummary" in out && out.articleSummary !== undefined && out.articleSummary !== null) {
    const v = normalizePlanString(out.articleSummary, "articleSummary").slice(0, 2000).trim();
    if (v.length >= 80) out.articleSummary = v;
    else delete out.articleSummary;
  }

  // editorialNotes — optional array of strings (min 1, max 500 each, max 20 items)
  if (out.editorialNotes !== undefined && Array.isArray(out.editorialNotes)) {
    out.editorialNotes = out.editorialNotes
      .map((x: unknown, i: number) => normalizePlanString(x, `editorialNotes[${i}]`).slice(0, 500))
      .filter((x: string) => x.length >= 1)
      .slice(0, 20);
  }

  if (out.internalAnchorOpportunities !== undefined) {
    let rows = out.internalAnchorOpportunities;
    if (!Array.isArray(rows)) {
      if (isPlainObject(rows)) rows = [rows];
      else throw new Error(`[blog-plan-normalize] internalAnchorOpportunities must be array or object`);
    }
    out.internalAnchorOpportunities = (rows as unknown[])
      .map((row: unknown, i: number) => {
        if (!isPlainObject(row)) throw new Error(`[blog-plan-normalize] internalAnchorOpportunities[${i}] must be object`);
        const r: Record<string, unknown> = { ...row };
        r.phrase = normalizePlanString(r.phrase, `internalAnchorOpportunities[${i}].phrase`).slice(0, 200);
        r.suggestedAnchorText = normalizePlanString(
          r.suggestedAnchorText,
          `internalAnchorOpportunities[${i}].suggestedAnchorText`,
        ).slice(0, 120);
        r.targetSuggestedPath = normalizePlanString(
          r.targetSuggestedPath,
          `internalAnchorOpportunities[${i}].targetSuggestedPath`,
        ).slice(0, 500);
        if (r.rationale !== undefined) {
          r.rationale = normalizePlanString(r.rationale, `internalAnchorOpportunities[${i}].rationale`).slice(0, 300);
        }
        return r;
      })
      .filter(
        (r: Record<string, unknown>) =>
          String(r.phrase ?? "").length >= 2 &&
          String(r.suggestedAnchorText ?? "").length >= 2 &&
          String(r.targetSuggestedPath ?? "").length >= 2,
      )
      .slice(0, 24);
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
export function safeParseBlogControlPanelPlan(
  raw: unknown,
  ctx?: BlogEditorialPlanNormalizeContext,
): SafeParseBlogControlPanelPlanResult {
  let normalized: Record<string, unknown>;
  try {
    normalized = normalizeBlogControlPanelPlanJson(raw, ctx);
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
