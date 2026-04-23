import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { BlogInvalidSlugError, parseOptionalBlogSlug } from "@/lib/blog/blog-optional-slug";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function toScalarString(value: unknown, fieldPath: string, maxLen: number): { ok: true; value: string } | { ok: false; message: string } {
  if (value === null || value === undefined) return { ok: true, value: "" };
  if (typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value).slice(0, 12).join(",");
    return {
      ok: false,
      message: `Field "${fieldPath}" must be a string, number, boolean, or string[] — not an object (keys: ${keys || "—"})`,
    };
  }
  if (Array.isArray(value)) {
    const joined = value
      .map((x) => (x === null || x === undefined ? "" : typeof x === "string" ? x : String(x)))
      .join(", ")
      .trim()
      .slice(0, maxLen);
    return { ok: true, value: joined };
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return { ok: true, value: String(value).slice(0, maxLen) };
  }
  if (typeof value === "string") {
    return { ok: true, value: value.slice(0, maxLen) };
  }
  return { ok: true, value: String(value).slice(0, maxLen) };
}

const TEMPLATE_VALUES = new Set<string>(Object.values(BlogPostTemplate));
const INTENT_VALUES = new Set<string>(Object.values(BlogPostIntent));
const FUNNEL_VALUES = new Set<string>(Object.values(BlogFunnelStage));

/**
 * Coerces admin `/api/admin/blog/control-panel/generate` JSON into shapes compatible with Zod body parsing.
 * Rejects plain objects where strings are required (malformed LLM / copy-paste).
 */
export function normalizeBlogControlPanelGenerateRequestBody(raw: unknown):
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; code: string; message: string; path?: string } {
  if (!isPlainObject(raw)) {
    return { ok: false, code: "INVALID_JSON_ROOT", message: "Request body must be a JSON object" };
  }
  const o: Record<string, unknown> = { ...raw };

  const topicR = toScalarString(o.topic, "topic", 200);
  if (!topicR.ok) return { ok: false, code: "FIELD_TYPE", path: "topic", message: topicR.message };
  o.topic = topicR.value.trim();

  const examR = toScalarString(o.exam, "exam", 80);
  if (!examR.ok) return { ok: false, code: "FIELD_TYPE", path: "exam", message: examR.message };
  o.exam = examR.value.trim();

  for (const [key, max] of [
    ["keywords", 500],
    ["targetKeyword", 200],
    ["keywordCluster", 200],
  ] as const) {
    if (!(key in o)) continue;
    const r = toScalarString(o[key], key, max);
    if (!r.ok) return { ok: false, code: "FIELD_TYPE", path: key, message: r.message };
    const s = r.value.trim();
    if (!s) delete o[key];
    else o[key] = s;
  }

  if ("fixedSlug" in o) {
    const r = toScalarString(o.fixedSlug, "fixedSlug", 500);
    if (!r.ok) return { ok: false, code: "FIELD_TYPE", path: "fixedSlug", message: r.message };
    const raw = r.value.trim();
    if (!raw) {
      delete o.fixedSlug;
    } else {
      try {
        o.fixedSlug = parseOptionalBlogSlug(raw)!;
      } catch (e) {
        if (BlogInvalidSlugError.is(e)) {
          return { ok: false, code: "INVALID_SLUG", path: "fixedSlug", message: e.message };
        }
        throw e;
      }
    }
  }

  if (o.template === undefined || o.template === null) {
    o.template = BlogPostTemplate.TOPIC_EXPLAINED;
  } else {
    const tr = toScalarString(o.template, "template", 80);
    if (!tr.ok) return { ok: false, code: "FIELD_TYPE", path: "template", message: tr.message };
    const tv = tr.value.trim();
    o.template = TEMPLATE_VALUES.has(tv) ? tv : BlogPostTemplate.TOPIC_EXPLAINED;
  }

  if (o.intent !== undefined && o.intent !== null) {
    const ir = toScalarString(o.intent, "intent", 80);
    if (!ir.ok) return { ok: false, code: "FIELD_TYPE", path: "intent", message: ir.message };
    const iv = ir.value.trim();
    if (INTENT_VALUES.has(iv)) o.intent = iv;
    else delete o.intent;
  }

  if (o.funnelStage !== undefined && o.funnelStage !== null) {
    const fr = toScalarString(o.funnelStage, "funnelStage", 80);
    if (!fr.ok) return { ok: false, code: "FIELD_TYPE", path: "funnelStage", message: fr.message };
    const fv = fr.value.trim();
    if (FUNNEL_VALUES.has(fv)) o.funnelStage = fv;
    else delete o.funnelStage;
  }

  if (o.tone === undefined || o.tone === null) {
    o.tone = "professional";
  } else {
    const toneR = toScalarString(o.tone, "tone", 20);
    if (!toneR.ok) return { ok: false, code: "FIELD_TYPE", path: "tone", message: toneR.message };
    const tone = toneR.value.trim();
    if (tone === "professional" || tone === "supportive" || tone === "direct") o.tone = tone;
    else o.tone = "professional";
  }

  if (o.country === undefined || o.country === null) {
    o.country = "unspecified";
  } else {
    const cr = toScalarString(o.country, "country", 20);
    if (!cr.ok) return { ok: false, code: "FIELD_TYPE", path: "country", message: cr.message };
    const c = cr.value.trim().toUpperCase();
    if (c === "US" || c === "CA") o.country = c;
    else o.country = "unspecified";
  }

  if (o.includeImage !== undefined && typeof o.includeImage !== "boolean") {
    if (o.includeImage === "true" || o.includeImage === 1) o.includeImage = true;
    else if (o.includeImage === "false" || o.includeImage === 0) o.includeImage = false;
    else if (typeof o.includeImage === "string") o.includeImage = o.includeImage.toLowerCase() === "true";
  }
  if (o.includeAiImage !== undefined && typeof o.includeAiImage !== "boolean") {
    if (o.includeAiImage === "true" || o.includeAiImage === 1) o.includeAiImage = true;
    else if (o.includeAiImage === "false" || o.includeAiImage === 0) o.includeAiImage = false;
    else if (typeof o.includeAiImage === "string") o.includeAiImage = o.includeAiImage.toLowerCase() === "true";
  }
  if (o.allowInsufficientCitations !== undefined && typeof o.allowInsufficientCitations !== "boolean") {
    if (typeof o.allowInsufficientCitations === "string") {
      o.allowInsufficientCitations = o.allowInsufficientCitations.toLowerCase() === "true";
    } else if (typeof o.allowInsufficientCitations === "number") {
      o.allowInsufficientCitations = o.allowInsufficientCitations !== 0;
    }
  }
  if (o.publishImmediately !== undefined && typeof o.publishImmediately !== "boolean") {
    if (o.publishImmediately === "true" || o.publishImmediately === 1) o.publishImmediately = true;
    else if (o.publishImmediately === "false" || o.publishImmediately === 0) o.publishImmediately = false;
    else if (typeof o.publishImmediately === "string") {
      o.publishImmediately = o.publishImmediately.toLowerCase() === "true";
    }
  }

  if (o.sourceRecords !== undefined) {
    if (!Array.isArray(o.sourceRecords)) {
      return {
        ok: false,
        code: "FIELD_TYPE",
        path: "sourceRecords",
        message: "sourceRecords must be a JSON array when provided",
      };
    }
  }

  return { ok: true, data: o };
}
