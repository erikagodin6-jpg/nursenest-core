/**
 * Pure helpers for GSC opportunity manifest apply / dry-run (no Prisma).
 * Used by `scripts/blog-apply-gsc-opportunity-upgrades.mts` and unit tests.
 */

import type { Prisma } from "@prisma/client";

export const MARKER_LEAD = "<!-- nn:gsc-lead -->";
export const MARKER_CLUSTER = "<!-- nn:gsc-cluster -->";

export type ManifestUpgrade = {
  enabled?: boolean;
  slug?: string;
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  excerpt?: string;
  targetKeyword?: string | null;
  keywordCluster?: string | null;
  bodyLeadHtml?: string | null;
  bodyClusterHtml?: string | null;
  mergeRelatedLessonPaths?: string[];
  appendTags?: string[];
  /** Ignored by apply logic; preserved in JSON for operators. */
  queriesTargeted?: string[];
};

export type ManifestFile = { instructions?: string; upgrades: ManifestUpgrade[] };

export type ValidatedManifestRow = ManifestUpgrade & {
  /** Normalized blog slug (URL segment only). */
  slugNorm: string;
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Reject empty, trim, strip accidental leading/trailing slashes from slug segment. */
export function normalizeManifestSlug(raw: string | undefined | null): { ok: true; slug: string } | { ok: false; reason: string } {
  if (raw === undefined || raw === null) return { ok: false, reason: "slug_missing" };
  let s = String(raw).trim();
  if (!s) return { ok: false, reason: "slug_empty" };
  s = s.replace(/^\/+/g, "").replace(/\/+$/g, "");
  s = s.trim();
  if (!s) return { ok: false, reason: "slug_empty_after_normalization" };
  if (s.includes("/")) return { ok: false, reason: "slug_contains_slash_use_single_segment" };
  return { ok: true, slug: s };
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let n = 0;
  let i = 0;
  while (true) {
    const j = haystack.indexOf(needle, i);
    if (j === -1) break;
    n += 1;
    i = j + needle.length;
  }
  return n;
}

/** Manifest HTML fragments must include their marker exactly once when non-empty. */
export function validateBodyFragmentMarkers(row: ManifestUpgrade): string[] {
  const errs: string[] = [];
  const lead = row.bodyLeadHtml?.trim();
  if (lead) {
    const c = countOccurrences(lead, MARKER_LEAD);
    if (c !== 1) errs.push(`bodyLeadHtml must contain ${MARKER_LEAD} exactly once (found ${c})`);
  }
  const cluster = row.bodyClusterHtml?.trim();
  if (cluster) {
    const c = countOccurrences(cluster, MARKER_CLUSTER);
    if (c !== 1) errs.push(`bodyClusterHtml must contain ${MARKER_CLUSTER} exactly once (found ${c})`);
  }
  return errs;
}

export function assertStringArrayField(name: string, v: unknown): string[] {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) return [`${name} must be an array of strings when present`];
  const errs: string[] = [];
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "string") errs.push(`${name}[${i}] must be a string`);
  }
  return errs;
}

/** Root-relative internal paths only; conservative (no spaces, no schemes). */
export function isSafeRootRelativeInternalPath(p: string): boolean {
  const t = p.trim();
  if (!t || t !== p) return false;
  if (!t.startsWith("/")) return false;
  if (t.includes("//")) return false;
  if (/[\s<>"'`]/.test(t)) return false;
  if (/^[a-z]+:/i.test(t)) return false;
  // letters, digits, path segments, hyphens, underscores; optional single dots in segment (not used in listed paths)
  if (!/^\/[A-Za-z0-9/_-]+$/.test(t)) return false;
  return true;
}

const HREF_RE = /\bhref\s*=\s*["']([^"']+)["']/gi;

export function extractHrefPathsFromHtml(html: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(HREF_RE.source, HREF_RE.flags);
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    if (raw.startsWith("/")) out.push(raw.split("#")[0] ?? raw);
  }
  return out;
}

export function collectPathsToValidate(row: ManifestUpgrade): string[] {
  const paths = new Set<string>();
  for (const p of row.mergeRelatedLessonPaths ?? []) {
    const t = typeof p === "string" ? p.trim() : "";
    if (t) paths.add(t);
  }
  const html = [row.bodyLeadHtml, row.bodyClusterHtml].filter(Boolean).join("\n");
  for (const h of extractHrefPathsFromHtml(html)) {
    if (h.startsWith("/")) paths.add(h);
  }
  return [...paths];
}

export function validateManifestInternalPaths(row: ManifestUpgrade): string[] {
  const paths = collectPathsToValidate(row);
  const errs: string[] = [];
  for (const p of paths) {
    if (!isSafeRootRelativeInternalPath(p)) errs.push(`unsafe_or_malformed_internal_path:${p}`);
  }
  return errs;
}

export type RowValidationResult =
  | { ok: true; row: ValidatedManifestRow }
  | { ok: false; reasons: string[] };

/**
 * Validate one manifest row when enabled (strict). Disabled rows only get structural warnings as non-blocking if desired — here we still type-check shape.
 */
export function validateEnabledManifestRow(u: unknown, index: number): RowValidationResult {
  if (!isPlainObject(u)) return { ok: false, reasons: [`upgrades[${index}] is not an object`] };
  const slugNorm = normalizeManifestSlug(u.slug as string | undefined);
  if (!slugNorm.ok) return { ok: false, reasons: [`upgrades[${index}]:${slugNorm.reason}`] };

  const errs: string[] = [];
  errs.push(...assertStringArrayField("mergeRelatedLessonPaths", u.mergeRelatedLessonPaths));
  errs.push(...assertStringArrayField("appendTags", u.appendTags));
  if (errs.length) return { ok: false, reasons: errs.map((e) => `upgrades[${index}]:${e}`) };

  const row = u as ManifestUpgrade;
  errs.push(...validateBodyFragmentMarkers(row).map((e) => `upgrades[${index}]:${e}`));
  errs.push(...validateManifestInternalPaths(row).map((e) => `upgrades[${index}]:${e}`));
  if (errs.length) return { ok: false, reasons: errs };

  return { ok: true, row: { ...row, slugNorm: slugNorm.slug } };
}

/** Non-blocking warnings for disabled rows (shape / markers / paths for operator hygiene). */
export function validateDisabledRowWarnings(u: unknown, index: number): string[] {
  if (!isPlainObject(u)) return [`upgrades[${index}] (disabled): not an object`];
  const row = u as ManifestUpgrade;
  if (row.enabled === true) return [];
  const out: string[] = [];
  out.push(
    ...assertStringArrayField("mergeRelatedLessonPaths", row.mergeRelatedLessonPaths).map(
      (e) => `upgrades[${index}] (disabled):${e}`,
    ),
  );
  out.push(...assertStringArrayField("appendTags", row.appendTags).map((e) => `upgrades[${index}] (disabled):${e}`));
  out.push(...validateBodyFragmentMarkers(row).map((e) => `upgrades[${index}] (disabled):${e}`));
  out.push(...validateManifestInternalPaths(row).map((e) => `upgrades[${index}] (disabled):${e}`));
  return out;
}

export function parseManifestFile(json: unknown): { ok: true; manifest: ManifestFile } | { ok: false; error: string } {
  if (!isPlainObject(json)) return { ok: false, error: "root must be a JSON object" };
  if (!Array.isArray(json.upgrades)) return { ok: false, error: "missing or invalid upgrades[]" };
  const upgrades = json.upgrades as unknown[];
  for (let i = 0; i < upgrades.length; i++) {
    if (!isPlainObject(upgrades[i])) return { ok: false, error: `upgrades[${i}] must be an object` };
  }
  return {
    ok: true,
    manifest: {
      instructions: typeof json.instructions === "string" ? json.instructions : undefined,
      upgrades: json.upgrades as ManifestUpgrade[],
    },
  };
}

export function mergePathsDedupe(existing: string[], add: string[] | undefined): string[] {
  if (!add?.length) return [...existing];
  const set = new Set(existing.map((p) => p.trim()).filter(Boolean));
  for (const p of add) {
    const t = typeof p === "string" ? p.trim() : "";
    if (t) set.add(t);
  }
  return [...set];
}

export function mergeTagsDedupe(existing: string[], add: string[] | undefined): string[] {
  if (!add?.length) return [...existing];
  const set = new Set<string>();
  for (const t of existing) set.add(t);
  for (const t of add) {
    const s = typeof t === "string" ? t.trim() : "";
    if (s) set.add(s);
  }
  return [...set];
}

export function arraysShallowEqualSorted(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].map((x) => x.trim()).sort();
  const sb = [...b].map((x) => x.trim()).sort();
  return sa.every((v, i) => v === sb[i]);
}

export type ApplyBodyResult = {
  next: string;
  insertedLead: boolean;
  insertedCluster: boolean;
};

/** Idempotent: does not prepend/append if the corresponding marker already exists in the working body. */
export function applyBodyFragmentsIdempotent(
  body: string,
  lead: string | null | undefined,
  cluster: string | null | undefined,
): ApplyBodyResult {
  let next = body;
  let insertedLead = false;
  let insertedCluster = false;
  const leadT = lead?.trim();
  if (leadT) {
    if (!next.includes(MARKER_LEAD)) {
      next = `${leadT}\n\n${next}`;
      insertedLead = true;
    }
  }
  const clusterT = cluster?.trim();
  if (clusterT) {
    if (!next.includes(MARKER_CLUSTER)) {
      next = `${next.trimEnd()}\n\n${clusterT}\n`;
      insertedCluster = true;
    }
  }
  return { next, insertedLead, insertedCluster };
}

export type DbPostSnapshot = {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  relatedLessonPaths: string[];
  tags: string[];
  targetKeyword: string | null;
  keywordCluster: string | null;
};

export type UpdatePreview = {
  slug: string;
  postId: string | null;
  currentTitle: string;
  newTitle: string | null;
  titleWillChange: boolean;
  seoTitleWillChange: boolean;
  seoDescriptionWillChange: boolean;
  excerptWillChange: boolean;
  targetKeywordWillChange: boolean;
  keywordClusterWillChange: boolean;
  leadInsert: "none" | "insert" | "already_present";
  clusterInsert: "none" | "insert" | "already_present";
  pathsToAdd: string[];
  tagsToAdd: string[];
  decision: "apply" | "skip";
  skipReason?: string;
  prismaKeys: string[];
};

function normSeoFromManifestField(v: string | null | undefined): string | null {
  if (v === undefined || v === null) return null;
  const t = v.trim();
  return t.length ? t : null;
}

export function buildUpdatePreview(
  slug: string,
  post: DbPostSnapshot | null,
  manifest: ValidatedManifestRow,
  slugResolution: "unique" | "not_found" | "ambiguous",
): UpdatePreview {
  const base: Omit<UpdatePreview, "decision" | "skipReason" | "prismaKeys"> = {
    slug,
    postId: post?.id ?? null,
    currentTitle: post?.title ?? "",
    newTitle: manifest.title?.trim() ? manifest.title.trim() : null,
    titleWillChange: Boolean(manifest.title?.trim() && post && manifest.title.trim() !== post.title),
    seoTitleWillChange: false,
    seoDescriptionWillChange: false,
    excerptWillChange: false,
    targetKeywordWillChange: false,
    keywordClusterWillChange: false,
    leadInsert: "none",
    clusterInsert: "none",
    pathsToAdd: [],
    tagsToAdd: [],
  };

  if (slugResolution === "ambiguous") {
    return {
      ...base,
      decision: "skip",
      skipReason: "slug_ambiguous_multiple_rows",
      prismaKeys: [],
    };
  }
  if (slugResolution === "not_found" || !post) {
    return {
      ...base,
      decision: "skip",
      skipReason: "slug_not_found",
      prismaKeys: [],
    };
  }

  const { next, insertedLead, insertedCluster } = applyBodyFragmentsIdempotent(
    post.body,
    manifest.bodyLeadHtml,
    manifest.bodyClusterHtml,
  );
  base.leadInsert = !manifest.bodyLeadHtml?.trim() ? "none" : insertedLead ? "insert" : "already_present";
  base.clusterInsert = !manifest.bodyClusterHtml?.trim() ? "none" : insertedCluster ? "insert" : "already_present";

  if (manifest.seoTitle !== undefined) {
    const nextSeo = normSeoFromManifestField(manifest.seoTitle);
    base.seoTitleWillChange = (post.seoTitle ?? null) !== nextSeo;
  }
  if (manifest.seoDescription !== undefined) {
    const nextSeo = normSeoFromManifestField(manifest.seoDescription);
    base.seoDescriptionWillChange = (post.seoDescription ?? null) !== nextSeo;
  }
  if (manifest.excerpt?.trim()) base.excerptWillChange = manifest.excerpt.trim() !== post.excerpt;

  if (manifest.targetKeyword !== undefined) {
    const nk = manifest.targetKeyword === null ? null : manifest.targetKeyword.trim() || null;
    base.targetKeywordWillChange = (post.targetKeyword ?? null) !== nk;
  }
  if (manifest.keywordCluster !== undefined) {
    const nk = manifest.keywordCluster === null ? null : manifest.keywordCluster.trim() || null;
    base.keywordClusterWillChange = (post.keywordCluster ?? null) !== nk;
  }

  const nextPaths = mergePathsDedupe(post.relatedLessonPaths, manifest.mergeRelatedLessonPaths);
  base.pathsToAdd = nextPaths.filter((p) => !post.relatedLessonPaths.includes(p));

  const nextTags = mergeTagsDedupe(post.tags, manifest.appendTags);
  base.tagsToAdd = nextTags.filter((t) => !post.tags.includes(t));

  const prismaKeys: string[] = [];
  if (base.titleWillChange && manifest.title?.trim()) prismaKeys.push("title");
  if (base.seoTitleWillChange && manifest.seoTitle !== undefined) prismaKeys.push("seoTitle");
  if (base.seoDescriptionWillChange && manifest.seoDescription !== undefined) prismaKeys.push("seoDescription");
  if (base.excerptWillChange && manifest.excerpt?.trim()) prismaKeys.push("excerpt");
  if (base.targetKeywordWillChange && manifest.targetKeyword !== undefined) prismaKeys.push("targetKeyword");
  if (base.keywordClusterWillChange && manifest.keywordCluster !== undefined) prismaKeys.push("keywordCluster");
  if (next !== post.body) prismaKeys.push("body");
  if (!arraysShallowEqualSorted(nextPaths, post.relatedLessonPaths)) prismaKeys.push("relatedLessonPaths");
  if (!arraysShallowEqualSorted(nextTags, post.tags)) prismaKeys.push("tags");

  if (prismaKeys.length === 0) {
    return {
      ...base,
      decision: "skip",
      skipReason: "no_changes",
      prismaKeys: [],
    };
  }

  return { ...base, decision: "apply", prismaKeys };
}

export function buildPrismaUpdateData(post: DbPostSnapshot, manifest: ValidatedManifestRow): Prisma.BlogPostUpdateInput {
  const data: Prisma.BlogPostUpdateInput = {};

  if (manifest.title?.trim() && manifest.title.trim() !== post.title) {
    data.title = manifest.title.trim();
  }
  if (manifest.seoTitle !== undefined) {
    const v = manifest.seoTitle === null ? null : manifest.seoTitle.trim() || null;
    if ((post.seoTitle ?? null) !== v) data.seoTitle = v;
  }
  if (manifest.seoDescription !== undefined) {
    const v = manifest.seoDescription === null ? null : manifest.seoDescription.trim() || null;
    if ((post.seoDescription ?? null) !== v) data.seoDescription = v;
  }
  if (manifest.excerpt?.trim() && manifest.excerpt.trim() !== post.excerpt) {
    data.excerpt = manifest.excerpt.trim();
  }
  if (manifest.targetKeyword !== undefined) {
    const v = manifest.targetKeyword === null ? null : manifest.targetKeyword.trim() || null;
    if ((post.targetKeyword ?? null) !== v) data.targetKeyword = v;
  }
  if (manifest.keywordCluster !== undefined) {
    const v = manifest.keywordCluster === null ? null : manifest.keywordCluster.trim() || null;
    if ((post.keywordCluster ?? null) !== v) data.keywordCluster = v;
  }

  const { next } = applyBodyFragmentsIdempotent(post.body, manifest.bodyLeadHtml, manifest.bodyClusterHtml);
  if (next !== post.body) data.body = next;

  const nextPaths = mergePathsDedupe(post.relatedLessonPaths, manifest.mergeRelatedLessonPaths);
  if (!arraysShallowEqualSorted(nextPaths, post.relatedLessonPaths)) data.relatedLessonPaths = nextPaths;

  const nextTags = mergeTagsDedupe(post.tags, manifest.appendTags);
  if (!arraysShallowEqualSorted(nextTags, post.tags)) data.tags = nextTags;

  return data;
}

export type PostApplyVerification = {
  slug: string;
  postId: string;
  ok: boolean;
  errors: string[];
  snapshot: {
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    excerpt: string;
    leadMarkerCount: number;
    clusterMarkerCount: number;
    relatedLessonPaths: string[];
    tags: string[];
  };
};

export function verifyPostAfterApply(
  slug: string,
  post: DbPostSnapshot,
  manifest: ValidatedManifestRow,
): PostApplyVerification {
  const errors: string[] = [];
  if (manifest.title?.trim() && post.title !== manifest.title.trim()) errors.push(`title_mismatch`);
  if (manifest.seoTitle !== undefined) {
    const want = normSeoFromManifestField(manifest.seoTitle);
    if ((post.seoTitle ?? null) !== want) errors.push("seoTitle_mismatch");
  }
  if (manifest.seoDescription !== undefined) {
    const want = normSeoFromManifestField(manifest.seoDescription);
    if ((post.seoDescription ?? null) !== want) errors.push("seoDescription_mismatch");
  }
  if (manifest.excerpt?.trim() && post.excerpt !== manifest.excerpt.trim()) errors.push("excerpt_mismatch");

  if (manifest.bodyLeadHtml?.trim()) {
    const c = countOccurrences(post.body, MARKER_LEAD);
    if (c !== 1) errors.push(`lead_marker_expected_once_found_${c}`);
  }
  if (manifest.bodyClusterHtml?.trim()) {
    const c = countOccurrences(post.body, MARKER_CLUSTER);
    if (c !== 1) errors.push(`cluster_marker_expected_once_found_${c}`);
  }

  for (const p of manifest.mergeRelatedLessonPaths ?? []) {
    const t = typeof p === "string" ? p.trim() : "";
    if (t && !post.relatedLessonPaths.includes(t)) errors.push(`missing_related_path:${t}`);
  }
  for (const t of manifest.appendTags ?? []) {
    const s = typeof t === "string" ? t.trim() : "";
    if (s && !post.tags.includes(s)) errors.push(`missing_tag:${s}`);
  }

  return {
    slug,
    postId: post.id,
    ok: errors.length === 0,
    errors,
    snapshot: {
      title: post.title,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      excerpt: post.excerpt,
      leadMarkerCount: countOccurrences(post.body, MARKER_LEAD),
      clusterMarkerCount: countOccurrences(post.body, MARKER_CLUSTER),
      relatedLessonPaths: post.relatedLessonPaths,
      tags: post.tags,
    },
  };
}
