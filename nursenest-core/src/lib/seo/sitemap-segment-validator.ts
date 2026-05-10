/**
 * Phase 4: offline validation of segmented sitemap XML — same-origin GET handlers as production routes,
 * without HTTP round-trips to staging. Used by `npm run sitemap:validate` / `sitemap:report`.
 */
import { XMLValidator } from "fast-xml-parser";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import {
  absoluteUrlsForSitemapIndexChildren,
  SITEMAP_INDEX_CHILD_FILENAMES,
} from "@/lib/seo/sitemap-index-children";
import { isEligiblePublicIndexSitemapLoc } from "@/lib/seo/sitemap-marketing-exclusions";
import { normalizeSitemapLoc } from "@/lib/seo/sitemap-public-index-filter";

/** Google’s practical limit per urlset file — warn below, fail at/above. */
export const MAX_SEGMENT_PAGE_LOCS = 48_000;
/** Emit a warning when a segment crosses this count (buffer before hard cap). */
export const SEGMENT_LOC_WARNING_THRESHOLD = 40_000;

export const DEFAULT_SEGMENT_GENERATION_BUDGET_MS = 240_000;

function readBudgetMs(): number {
  const raw = process.env.SITEMAP_VALIDATE_SEGMENT_BUDGET_MS?.trim();
  if (!raw) return DEFAULT_SEGMENT_GENERATION_BUDGET_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_SEGMENT_GENERATION_BUDGET_MS;
}

/** Extra pathname guard aligned with robots Disallow: `/seo/` and bare `/seo`. */
export function isForbiddenSeoMarketingPath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return p === "/seo" || p.startsWith("/seo/");
}

export type PageLocValidationFailure = { loc: string; reason: string };

/**
 * Validates a **page** URL that should appear inside a `<urlset>` (not a child sitemap `.xml` URL).
 */
export function validateSitemapPageLoc(loc: string, originNormalized: string): PageLocValidationFailure | null {
  const trimmed = normalizeSitemapLoc(loc);
  if (!trimmed) return { loc, reason: "empty_loc" };

  const o = originNormalized.endsWith("/") ? originNormalized.slice(0, -1) : originNormalized;
  if (!isEligiblePublicIndexSitemapLoc(trimmed, o)) {
    return { loc: trimmed, reason: "auth_noindex_or_ineligible" };
  }

  let pathname = "/";
  try {
    pathname = new URL(trimmed).pathname || "/";
  } catch {
    return { loc: trimmed, reason: "parse_url_failed" };
  }

  if (isForbiddenSeoMarketingPath(pathname)) {
    return { loc: trimmed, reason: "forbidden_seo_path" };
  }

  const staticCheck = isValidPublicUrl(trimmed, { origin: o });
  if (!staticCheck.ok) {
    return { loc: trimmed, reason: staticCheck.ok ? "unknown" : staticCheck.code };
  }

  return null;
}

export function extractLocStringsFromXml(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1]?.trim();
    if (loc) out.push(loc);
  }
  return out;
}

export function validateSitemapXmlWellFormed(xml: string): { ok: true } | { ok: false; error: string } {
  const trimmed = xml.trim();
  if (!trimmed.startsWith("<?xml")) {
    return { ok: false, error: "missing_xml_declaration" };
  }
  const result = XMLValidator.validate(trimmed);
  if (result !== true) {
    const err = typeof result === "object" && result && "err" in result ? String((result as { err: unknown }).err) : String(result);
    return { ok: false, error: err.slice(0, 500) };
  }
  const lower = trimmed.toLowerCase();
  if (!lower.includes("<urlset") && !lower.includes("<sitemapindex")) {
    return { ok: false, error: "missing_urlset_or_sitemapindex_root" };
  }
  return { ok: true };
}

function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

export function segmentLabelForFilename(filename: string): string {
  const base = filename.replace(/\.xml$/i, "");
  return base.replace(/^sitemap-/, "") || base;
}

export type SegmentFetchResult = {
  filename: string;
  generationMs: number;
  xml: string;
  status: number;
};

export type PerSegmentPageStats = {
  filename: string;
  label: string;
  generationMs: number;
  pageLocCount: number;
  invalidLocCount: number;
  invalidSamples: PageLocValidationFailure[];
  overBudget: boolean;
  nearOrOver48k: "ok" | "warn" | "error";
  xmlOk: boolean;
  xmlError?: string;
};

export type SitemapSegmentationValidationReport = {
  origin: string;
  budgetMsPerSegment: number;
  index: {
    generationMs: number;
    xmlOk: boolean;
    xmlError?: string;
    childUrlsFromXml: string[];
    approvedChildUrls: string[];
    childSetMatchesApproved: boolean;
  };
  segments: PerSegmentPageStats[];
  duplicatePageLocs: Array<{ loc: string; segments: string[] }>;
  /** Sum of invalid page locs across segments (same loc counted per segment if duplicated there). */
  totalInvalidPageLocOccurrences: number;
  errors: string[];
  warnings: string[];
};

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) {
    if (!b.has(x)) return false;
  }
  return true;
}

export type RouteGetter = () => Promise<{ GET: (req: Request) => Promise<Response> }>;

/**
 * Runs validation by invoking the same App Router `GET` handlers used in production (no new HTTP server).
 */
export async function runSitemapSegmentationValidation(options: {
  origin?: string;
  /** Inject route modules for tests (avoid importing Next app routes). */
  routeGetters?: Record<string, RouteGetter>;
}): Promise<SitemapSegmentationValidationReport> {
  const origin = normalizeOrigin(options.origin ?? resolveCanonicalSiteOrigin());
  const budgetMs = readBudgetMs();
  const errors: string[] = [];
  const warnings: string[] = [];

  const approvedChildUrls = absoluteUrlsForSitemapIndexChildren(origin);

  const routeGetters: Record<string, RouteGetter> =
    options.routeGetters ??
    ({
      "sitemap.xml": () => import("@/app/sitemap.xml/route"),
      "sitemap-core.xml": () => import("@/app/sitemap-core.xml/route"),
      "sitemap-blog.xml": () => import("@/app/sitemap-blog.xml/route"),
      "sitemap-pathways.xml": () => import("@/app/sitemap-pathways.xml/route"),
      "sitemap-lessons.xml": () => import("@/app/sitemap-lessons.xml/route"),
      "sitemap-localized.xml": () => import("@/app/sitemap-localized.xml/route"),
      "sitemap-clinical-modules.xml": () => import("@/app/sitemap-clinical-modules.xml/route"),
      "sitemap-allied.xml": () => import("@/app/sitemap-allied.xml/route"),
      "sitemap-new-grad.xml": () => import("@/app/sitemap-new-grad.xml/route"),
    } satisfies Record<string, RouteGetter>);

  async function fetchXml(routeFile: string): Promise<SegmentFetchResult> {
    const getter = routeGetters[routeFile];
    if (!getter) {
      throw new Error(`missing_route_getter:${routeFile}`);
    }
    const mod = await getter();
    const t0 = performance.now();
    const res = await mod.GET(new Request("http://127.0.0.1/sitemap-internal"));
    const xml = await res.text();
    const generationMs = Math.round(performance.now() - t0);
    return { filename: routeFile, generationMs, xml, status: res.status };
  }

  const indexFetch = await fetchXml("sitemap.xml");
  const indexXml = indexFetch.xml;
  const indexWellFormed = validateSitemapXmlWellFormed(indexXml);
  if (!indexWellFormed.ok) {
    errors.push(`sitemap_index_xml_invalid:${indexWellFormed.error}`);
  }
  if (indexFetch.status !== 200) {
    errors.push(`sitemap_index_http_${indexFetch.status}`);
  }

  const childUrlsFromXml = extractLocStringsFromXml(indexXml);
  const approvedSet = new Set(approvedChildUrls.map((u) => normalizeSitemapLoc(u)));
  const actualChildSet = new Set(childUrlsFromXml.map((u) => normalizeSitemapLoc(u)));
  const childSetMatchesApproved = setsEqual(approvedSet, actualChildSet);
  if (!childSetMatchesApproved) {
    errors.push("sitemap_index_child_locs_mismatch_approved_list");
    const onlyApproved = [...approvedSet].filter((u) => !actualChildSet.has(u));
    const onlyActual = [...actualChildSet].filter((u) => !approvedSet.has(u));
    if (onlyApproved.length) errors.push(`index_missing_children:${onlyApproved.slice(0, 20).join(",")}`);
    if (onlyActual.length) errors.push(`index_unexpected_children:${onlyActual.slice(0, 20).join(",")}`);
  }

  if (indexFetch.generationMs > budgetMs) {
    errors.push(`sitemap_index_generation_over_budget_ms:${indexFetch.generationMs}>${budgetMs}`);
  }

  const segments: PerSegmentPageStats[] = [];
  const locToSegments = new Map<string, Set<string>>();

  let totalInvalidOccurrences = 0;

  for (const filename of SITEMAP_INDEX_CHILD_FILENAMES) {
    const label = segmentLabelForFilename(filename);
    let fetchResult: SegmentFetchResult;
    try {
      fetchResult = await fetchXml(filename);
    } catch (e) {
      errors.push(`segment_fetch_failed:${filename}:${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    if (fetchResult.status !== 200) {
      errors.push(`segment_http_${filename}_${fetchResult.status}`);
    }

    const wf = validateSitemapXmlWellFormed(fetchResult.xml);
    const xmlOk = wf.ok;
    if (!wf.ok) {
      errors.push(`segment_xml_invalid:${filename}:${wf.error}`);
    }

    const pageLocs = extractLocStringsFromXml(fetchResult.xml);
    const invalidSamples: PageLocValidationFailure[] = [];
    let invalidCount = 0;

    for (const loc of pageLocs) {
      const fail = validateSitemapPageLoc(loc, origin);
      if (fail) {
        invalidCount += 1;
        totalInvalidOccurrences += 1;
        if (invalidSamples.length < 12) invalidSamples.push(fail);
      }
    }

    if (invalidCount > 0) {
      errors.push(`segment_invalid_page_locs:${filename}:${invalidCount}`);
    }

    let nearOrOver48k: PerSegmentPageStats["nearOrOver48k"] = "ok";
    if (pageLocs.length >= MAX_SEGMENT_PAGE_LOCS) {
      nearOrOver48k = "error";
      errors.push(`segment_page_loc_cap_exceeded:${filename}:${pageLocs.length}`);
    } else if (pageLocs.length >= SEGMENT_LOC_WARNING_THRESHOLD) {
      nearOrOver48k = "warn";
      warnings.push(`segment_approaching_48k_urls:${filename}:${pageLocs.length}`);
    }

    const overBudget = fetchResult.generationMs > budgetMs;
    if (overBudget) {
      errors.push(`segment_generation_over_budget:${filename}:${fetchResult.generationMs}>${budgetMs}`);
    }

    for (const loc of pageLocs) {
      const norm = normalizeSitemapLoc(loc);
      let set = locToSegments.get(norm);
      if (!set) {
        set = new Set();
        locToSegments.set(norm, set);
      }
      set.add(filename);
    }

    segments.push({
      filename,
      label,
      generationMs: fetchResult.generationMs,
      pageLocCount: pageLocs.length,
      invalidLocCount: invalidCount,
      invalidSamples,
      overBudget,
      nearOrOver48k,
      xmlOk,
      xmlError: wf.ok ? undefined : wf.error,
    });
  }

  const duplicatePageLocs: Array<{ loc: string; segments: string[] }> = [];
  for (const [loc, segs] of locToSegments) {
    if (segs.size > 1) {
      duplicatePageLocs.push({ loc, segments: [...segs].sort() });
    }
  }
  if (duplicatePageLocs.length > 0) {
    errors.push(`duplicate_page_locs_across_segments:${duplicatePageLocs.length}`);
  }

  return {
    origin,
    budgetMsPerSegment: budgetMs,
    index: {
      generationMs: indexFetch.generationMs,
      xmlOk: indexWellFormed.ok,
      xmlError: indexWellFormed.ok ? undefined : indexWellFormed.error,
      childUrlsFromXml,
      approvedChildUrls,
      childSetMatchesApproved,
    },
    segments,
    duplicatePageLocs,
    totalInvalidPageLocOccurrences: totalInvalidOccurrences,
    errors,
    warnings,
  };
}

export function formatSitemapSegmentationReportMarkdown(report: SitemapSegmentationValidationReport): string {
  const lines: string[] = [];
  const now = new Date().toISOString();
  lines.push("# Sitemap segmentation validation report");
  lines.push("");
  lines.push(`Generated: **${now}** (Phase 4 offline validator — App Router GET handlers).`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`| Field | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Origin | \`${report.origin}\` |`);
  lines.push(`| Per-segment time budget (ms) | \`${report.budgetMsPerSegment}\` (env \`SITEMAP_VALIDATE_SEGMENT_BUDGET_MS\`) |`);
  lines.push(`| Index child set matches approved | ${report.index.childSetMatchesApproved ? "yes" : "**no**"} |`);
  lines.push(`| Duplicate page \`<loc>\` count | **${report.duplicatePageLocs.length}** |`);
  lines.push(`| Invalid page loc occurrences (excluded/private) | **${report.totalInvalidPageLocOccurrences}** |`);
  lines.push(`| Errors | **${report.errors.length}** |`);
  lines.push(`| Warnings | **${report.warnings.length}** |`);
  lines.push("");

  lines.push("## Segment names, URL counts, generation time");
  lines.push("");
  lines.push("| Segment | URLs | Invalid locs | Gen time (ms) | 48k band |");
  lines.push("| --- | ---: | ---: | ---: | --- |");
  for (const s of report.segments) {
    const warn =
      s.nearOrOver48k === "error" ? "At/over cap" : s.nearOrOver48k === "warn" ? "Approaching cap (warn)" : "OK";
    lines.push(`| **${s.label}** (\`${s.filename}\`) | ${s.pageLocCount} | ${s.invalidLocCount} | ${s.generationMs} | ${warn} |`);
  }
  lines.push("");

  lines.push("## Index validation");
  lines.push("");
  lines.push(`- Generation time: **${report.index.generationMs}** ms`);
  lines.push(`- XML well-formed: **${report.index.xmlOk ? "yes" : "no"}**`);
  if (report.index.xmlError) lines.push(`- Parse error: \`${report.index.xmlError}\``);
  lines.push(`- Approved children (\`${report.index.approvedChildUrls.length}\`): ${report.index.approvedChildUrls.map((u) => `\`${u}\``).join(", ")}`);
  lines.push("");

  if (report.duplicatePageLocs.length > 0) {
    lines.push("## Duplicate `<loc>` values (across segments)");
    lines.push("");
    for (const d of report.duplicatePageLocs.slice(0, 50)) {
      lines.push(`- \`${d.loc}\` → ${d.segments.join(", ")}`);
    }
    if (report.duplicatePageLocs.length > 50) {
      lines.push(`- … ${report.duplicatePageLocs.length - 50} more`);
    }
    lines.push("");
  }

  if (report.warnings.length) {
    lines.push("## Warnings (e.g. approaching 48k URLs)");
    lines.push("");
    for (const w of report.warnings) lines.push(`- ${w}`);
    lines.push("");
  }

  if (report.errors.length) {
    lines.push("## Errors");
    lines.push("");
    for (const e of report.errors) lines.push(`- ${e}`);
    lines.push("");
  }

  lines.push("## Tests run");
  lines.push("");
  lines.push("- `npm run typecheck:critical`");
  lines.push("- `npm run sitemap:validate`");
  lines.push("- `npm run sitemap:report`");
  lines.push("- `node --import tsx --test src/lib/seo/sitemap-segment-validator.test.ts`");
  lines.push("");

  lines.push("## Follow-up recommendations");
  lines.push("");
  lines.push("- Keep segment collectors disjoint; resolve duplicate `<loc>` rows before scaling pathway/blog inventory.");
  lines.push("- Raise `SITEMAP_VALIDATE_SEGMENT_BUDGET_MS` locally if cold DB causes false timeouts.");
  lines.push("- Pair with `verify:sitemap` / HTTP smoke against a deployed origin when validating live responses.");
  lines.push("");

  return lines.join("\n");
}
