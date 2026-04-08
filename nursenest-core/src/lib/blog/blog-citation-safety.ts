/**
 * Citation-safe workflow for AI-assisted blog posts.
 *
 * - **Bibliography (`apaReferences`)** may only contain **admin-supplied** (or future **retrieved**)
 *   sources that pass structural checks. AI model "stubs" are never auto-included.
 * - Excluded / uncertain items are stored in {@link BlogCitationEnvelope.sourcesJson} for admin review.
 */

import type { BlogSourceRecord } from "@/lib/blog/apa7";
import { buildApa7References, coerceBlogSourceRows, formatApa7Source, validateSources } from "@/lib/blog/apa7";

export const BLOG_CITATION_ENVELOPE_VERSION = 2 as const;

export type BlogSourceProvenance = "admin_supplied" | "retrieved" | "ai_suggested";

export type VerifiedBlogSource = BlogSourceRecord & {
  provenance: Exclude<BlogSourceProvenance, "ai_suggested">;
};

export type ExcludedCitation = {
  stub: BlogSourceRecord;
  provenance: BlogSourceProvenance;
  reasons: string[];
};

/**
 * Stored in `BlogPost.sourcesJson` when using citation-safe persistence.
 */
export type BlogCitationEnvelope = {
  version: typeof BLOG_CITATION_ENVELOPE_VERSION;
  verified: VerifiedBlogSource[];
  excluded: ExcludedCitation[];
  /** ISO timestamp when this envelope was last built. */
  generatedAt: string;
};

const DOI_PREFIX = /^10\.\d{4,9}\//;
const YEAR_OK = /^(\d{4}|n\.d\.|in press)$/i;

export function isPlausibleHttpsUrl(url: string): boolean {
  const u = url.trim();
  if (!/^https:\/\//i.test(u)) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" && Boolean(parsed.hostname?.includes("."));
  } catch {
    return false;
  }
}

/** Accepts raw DOI or doi.org URL; validates Crossref-style prefix only (does not resolve). */
export function isPlausibleDoi(doi: string): boolean {
  const raw = doi
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "");
  return raw.length >= 8 && DOI_PREFIX.test(raw) && !raw.includes(" ");
}

export function normalizeDoiForStorage(doi: string): string {
  return doi
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "");
}

/**
 * Minimum bar for a source to appear in the published APA list.
 * Excludes incomplete or obviously non-verifiable rows.
 */
export function assessStructuralEligibility(record: BlogSourceRecord): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const title = (record.title ?? "").trim();
  if (title.length < 6) reasons.push("title_too_short_or_missing");

  const year = (record.year ?? "").trim();
  if (year && !YEAR_OK.test(year)) reasons.push("year_format_uncertain");

  const url = (record.url ?? "").trim();
  const doi = (record.doi ?? "").trim();
  const source = (record.source ?? "").trim();
  const publisher = (record.publisher ?? "").trim();

  const hasLocator =
    (url && isPlausibleHttpsUrl(url)) || (doi && isPlausibleDoi(doi)) || source.length >= 3 || publisher.length >= 3;

  if (!hasLocator) {
    reasons.push("missing_verifiable_locator_need_https_url_doi_or_named_source");
  }

  if (url && !isPlausibleHttpsUrl(url)) {
    reasons.push("url_must_be_https_or_omit");
  }

  if (doi && !isPlausibleDoi(doi)) {
    reasons.push("doi_format_not_accepted");
  }

  return { ok: reasons.length === 0, reasons };
}

export type CitationPartitionResult = {
  verified: VerifiedBlogSource[];
  excluded: ExcludedCitation[];
  apaLines: string[];
  sourceCheck: ReturnType<typeof validateSources>;
};

/**
 * Splits admin-supplied vs AI-suggested records. Only eligible admin (and future retrieved) sources become APA lines.
 */
export function partitionCitationsForBlog(
  adminSupplied: BlogSourceRecord[],
  aiSuggested: BlogSourceRecord[],
): CitationPartitionResult {
  const verified: VerifiedBlogSource[] = [];
  const excluded: ExcludedCitation[] = [];

  for (const stub of adminSupplied) {
    const { ok, reasons } = assessStructuralEligibility(stub);
    if (ok) {
      verified.push({ ...stub, provenance: "admin_supplied" });
    } else {
      excluded.push({ stub, provenance: "admin_supplied", reasons });
    }
  }

  for (const stub of aiSuggested) {
    excluded.push({
      stub,
      provenance: "ai_suggested",
      reasons: [
        "AI-generated reference stubs are not auto-published; add the same work via admin-supplied sources after verification, or use retrieved citations when available.",
      ],
    });
  }

  const apaLines = buildApa7References(verified);
  const sourceCheck = verified.length ? validateSources(verified) : { warnings: [] as string[], reliabilityScore: 0 };

  return { verified, excluded, apaLines, sourceCheck };
}

export function buildCitationEnvelope(partition: CitationPartitionResult): BlogCitationEnvelope {
  return {
    version: BLOG_CITATION_ENVELOPE_VERSION,
    verified: partition.verified,
    excluded: partition.excluded,
    generatedAt: new Date().toISOString(),
  };
}

/** High-risk clinical topics require at least one verified admin/retrieved citation before persisting (unless overridden). */
export function citationSupportRequired(riskFlags: string[]): boolean {
  return riskFlags.length > 0;
}

export function evaluateCitationGate(params: {
  riskFlags: string[];
  verifiedCount: number;
  allowInsufficientCitations: boolean;
}): { ok: true } | { ok: false; code: "INSUFFICIENT_CITATIONS"; message: string; riskFlags: string[] } {
  if (params.allowInsufficientCitations) return { ok: true };
  if (!citationSupportRequired(params.riskFlags)) return { ok: true };
  if (params.verifiedCount >= 1) return { ok: true };
  return {
    ok: false,
    code: "INSUFFICIENT_CITATIONS",
    message:
      "This topic is flagged for clinical/medication sensitivity. Provide at least one admin-supplied reference with title, year (or n.d.), and a verifiable HTTPS URL, valid DOI, or named organizational source. AI-generated stubs are not used in the bibliography.",
    riskFlags: params.riskFlags,
  };
}

/**
 * Parse DB `sourcesJson` into envelope or legacy array of records.
 */
export function parseBlogSourcesJson(raw: unknown): {
  envelope: BlogCitationEnvelope | null;
  /** Legacy: flat array stored before envelope v2 */
  legacyRecords: BlogSourceRecord[];
} {
  if (raw == null || raw === undefined) {
    return { envelope: null, legacyRecords: [] };
  }
  if (Array.isArray(raw)) {
    return { envelope: null, legacyRecords: coerceBlogSourceRows(raw) };
  }
  if (typeof raw === "object" && raw !== null) {
    const o = raw as Record<string, unknown>;
    if (o.version === BLOG_CITATION_ENVELOPE_VERSION && Array.isArray(o.verified) && Array.isArray(o.excluded)) {
      return {
        envelope: {
          version: BLOG_CITATION_ENVELOPE_VERSION,
          verified: o.verified as VerifiedBlogSource[],
          excluded: o.excluded as ExcludedCitation[],
          generatedAt: typeof o.generatedAt === "string" ? o.generatedAt : new Date().toISOString(),
        },
        legacyRecords: [],
      };
    }
  }
  return { envelope: null, legacyRecords: [] };
}

/** Rebuild APA strings from a stored envelope or legacy array (admin-only paths). */
export function apaLinesFromStoredSourcesJson(sourcesJson: unknown): string[] {
  const { envelope, legacyRecords } = parseBlogSourcesJson(sourcesJson);
  if (envelope) {
    return envelope.verified.map((v) => formatApa7Source(v)).filter(Boolean);
  }
  if (legacyRecords.length) {
    const partition = partitionCitationsForBlog(legacyRecords, []);
    return partition.apaLines;
  }
  return [];
}
