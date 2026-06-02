/**
 * Public `/blog/[slug]` article HTML + clinical blurb helpers.
 * Strips or softens pipeline scaffolding that must remain in source markdown for authoring/validators.
 */

const FAQ_SCAFFOLD_H2 = /<h2[^>]*>\s*FAQ Schema Questions\s*<\/h2>/i;
/** APA-style reference blocks authored in long-tail HTML (no `g` — avoid exec/replace lastIndex bugs). */
const REF_H2_BLOCK_OPEN =
  /<h2[^>]*>\s*(?:APA-7\s*References|APA\s*7\s*References|References\s*\(\s*APA\s*7\s*\)|References\s*\(\s*APA-7\s*\))\s*<\/h2>/i;
const REF_H2_BLOCK_OPEN_GLOBAL =
  /<h2[^>]*>\s*(?:APA-7\s*References|APA\s*7\s*References|References\s*\(\s*APA\s*7\s*\)|References\s*\(\s*APA-7\s*\))\s*<\/h2>/gi;
/** In-body “References” alone duplicates the page-level APA list when structured refs exist. */
const REF_PLAIN_H2_OPEN = /<h2[^>]*>\s*References\s*<\/h2>/i;

function stripHtmlTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function unwrapMarkdownJsonFence(s: string): string {
  let t = s.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(t);
  if (fence?.[1]) t = fence[1].trim();
  return t;
}

/** Fast path before JSON.parse on hot paths (paragraph scan, etc.). */
function engineBlogJsonHeuristic(t: string): boolean {
  if (!t.startsWith("{")) return false;
  if (/"emitFaqSchema"\s*:/.test(t)) return true;
  if (/"schemaOpportunities"\s*:\s*\[/.test(t)) return true;
  if (/"@type"\s*:\s*"BlogPosting"/.test(t) && /"breadcrumbs"\s*:\s*\[/.test(t)) return true;
  if (/"@type"\s*:\s*"BreadcrumbList"/.test(t) && /"itemListElement"/.test(t)) return true;
  return false;
}

/**
 * Detects persisted SEO/schema bundle JSON mistakenly shown as prose (clinical summary, etc.).
 */
export function looksLikeEngineBlogSchemaSummaryJson(s: string): boolean {
  const t = unwrapMarkdownJsonFence(s);
  if (!t.startsWith("{")) return false;
  if (engineBlogJsonHeuristic(t)) return true;
  try {
    const o = JSON.parse(t) as Record<string, unknown>;
    if (typeof o.emitFaqSchema === "boolean") return true;
    if (o.type === "BlogPosting" && typeof o.version === "number") return true;
    if (Array.isArray(o.schemaOpportunities)) return true;
    if (o.type === "BlogPosting" && Array.isArray(o.breadcrumbs)) return true;
  } catch {
    return false;
  }
  return false;
}

/**
 * Human-readable clinical blurb only — never raw {@link BlogPost.schemaSummary} engine JSON.
 */
export function publicBlogClinicalBlurb(args: {
  shortSummary: string | null | undefined;
  schemaSummary: string | null | undefined;
  seoSuggestedExcerpt: string | null | undefined;
}): string | null {
  const short = args.shortSummary?.trim();
  if (short && !looksLikeEngineBlogSchemaSummaryJson(short)) {
    return short.slice(0, 2000);
  }
  const seoEx = args.seoSuggestedExcerpt?.trim();
  if (seoEx) return seoEx.slice(0, 600);
  const schema = args.schemaSummary?.trim();
  if (schema && !looksLikeEngineBlogSchemaSummaryJson(schema)) {
    return schema.slice(0, 2000);
  }
  return null;
}

/**
 * Pull Q/A pairs from long-tail HTML that uses the "FAQ Schema Questions" authoring heading.
 * Call on the original body before {@link sanitizePublicBlogBodyHtml} mutates headings.
 */
export function extractFaqPairsFromFaqSchemaSectionHtml(html: string): { q: string; a: string }[] {
  const m = FAQ_SCAFFOLD_H2.exec(html);
  if (!m) return [];
  const start = m.index + m[0].length;
  const tail = html.slice(start);
  const nextH2 = tail.search(/<h2\b/i);
  const chunk = nextH2 < 0 ? tail : tail.slice(0, nextH2);
  const out: { q: string; a: string }[] = [];
  const pairRe = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi;
  let pm: RegExpExecArray | null;
  while ((pm = pairRe.exec(chunk)) !== null) {
    const q = stripHtmlTags(pm[1] ?? "");
    const a = stripHtmlTags(pm[2] ?? "");
    if (q.length > 0 && a.length > 0) out.push({ q, a });
  }
  return out;
}

function stripFirstH2SectionByOpenRegex(html: string, openRe: RegExp): string {
  const m = openRe.exec(html);
  if (!m) return html;
  const start = m.index;
  const rest = html.slice(m.index + m[0].length);
  const nextH2 = rest.search(/<h2\b/i);
  const nextAside = rest.search(/<aside\b/i);
  const candidates = [nextH2, nextAside].filter((i) => i >= 0);
  const endRel = candidates.length > 0 ? Math.min(...candidates) : rest.length;
  return html.slice(0, start) + rest.slice(endRel);
}

function stripFirstReferenceBlockFromHtml(html: string): string {
  const m = REF_H2_BLOCK_OPEN.exec(html) ?? REF_PLAIN_H2_OPEN.exec(html);
  if (!m) return html;
  const start = m.index;
  const rest = html.slice(m.index + m[0].length);
  const nextH2 = rest.search(/<h2\b/i);
  const nextAside = rest.search(/<aside\b/i);
  const candidates = [nextH2, nextAside].filter((i) => i >= 0);
  const endRel = candidates.length > 0 ? Math.min(...candidates) : rest.length;
  return html.slice(0, start) + rest.slice(endRel);
}

function stripEngineJsonLikeBlockElements(html: string): string {
  return html.replace(/<(p|pre)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi, (full) => {
    const inner = full.replace(/^<\w+[^>]*>/i, "").replace(/<\/\w+>\s*$/i, "");
    const innerText = stripHtmlTags(inner);
    const compact = innerText.trim();
    if (!compact.startsWith("{")) return full;
    if (looksLikeEngineBlogSchemaSummaryJson(innerText) || engineBlogJsonHeuristic(compact)) {
      return "";
    }
    return full;
  });
}

function isPipelineOnlyPublicH2Inner(inner: string): boolean {
  const t = inner.replace(/\s+/g, " ").trim();
  if (/^Editorial status\b/i.test(t)) return true;
  if (/^Breadcrumbs?$/i.test(t)) return true;
  if (/^Breadcrumb trail$/i.test(t)) return true;
  if (/^Breadcrumb JSON\b/i.test(t)) return true;
  if (/^BreadcrumbList\b/i.test(t)) return true;
  if (/^Suggested breadcrumbs$/i.test(t)) return true;
  return false;
}

/**
 * Single-pass removal of all pipeline-only H2 sections. Collects keep/drop spans in one
 * traversal rather than restarting from the beginning after each stripped section.
 */
function stripAllPipelineScaffoldH2Sections(html: string): string {
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const keepChunks: string[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;

  while ((m = h2Re.exec(html)) !== null) {
    const innerText = stripHtmlTags(m[1] ?? "").replace(/\s+/g, " ").trim();
    if (!isPipelineOnlyPublicH2Inner(innerText)) continue;

    // Keep everything before this H2.
    keepChunks.push(html.slice(cursor, m.index));

    // Skip the H2 tag itself plus its section content up to the next h2/aside.
    const afterTag = m.index + m[0].length;
    const rest = html.slice(afterTag);
    const nextH2 = rest.search(/<h2\b/i);
    const nextAside = rest.search(/<aside\b/i);
    const candidates = [nextH2, nextAside].filter((i) => i >= 0);
    const endRel = candidates.length > 0 ? Math.min(...candidates) : rest.length;

    cursor = afterTag + endRel;
    // Reset regex to resume scanning from the next section.
    h2Re.lastIndex = cursor;
  }

  keepChunks.push(html.slice(cursor));
  return keepChunks.join("");
}

function transformFaqSchemaSectionToAccordion(html: string): string {
  const m = FAQ_SCAFFOLD_H2.exec(html);
  if (!m) return html;
  const start = m.index;
  const after = m.index + m[0].length;
  const tail = html.slice(after);
  const nextH2 = tail.search(/<h2\b/i);
  const chunk = nextH2 < 0 ? tail : tail.slice(0, nextH2);
  const pairRe = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi;
  const items: string[] = [];
  let pm: RegExpExecArray | null;
  while ((pm = pairRe.exec(chunk)) !== null) {
    const qHtml = (pm[1] ?? "").trim();
    const aHtml = (pm[2] ?? "").trim();
    if (!qHtml || !aHtml) continue;
    items.push(
      `<details class="nn-blog-public-faq-item mb-2 rounded-lg border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-3 shadow-sm"><summary class="cursor-pointer list-none text-sm font-semibold text-[var(--theme-heading-text)] [&::-webkit-details-marker]:hidden">${qHtml}</summary><div class="mt-3 border-t border-[var(--theme-separator)] pt-3 text-sm leading-relaxed text-[var(--theme-body-text)]">${aHtml}</div></details>`,
    );
  }
  if (items.length === 0) {
    return html.slice(0, start) + '<h2 class="sr-only">Common questions</h2>' + chunk + html.slice(after + chunk.length);
  }
  const block = `<section class="nn-blog-public-faq my-6 space-y-2" aria-label="Common questions">${items.join("\n")}</section>`;
  return html.slice(0, start) + block + html.slice(after + chunk.length);
}

function wrapSuggestedInternalLinksSection(html: string): string {
  return html.replace(
    /<h2[^>]*>\s*Suggested internal links\s*<\/h2>\s*([\s\S]*?)(?=<h2\b|<section\b|$)/gi,
    (_full, inner: string) =>
      `<section class="nn-blog-related-reading-card my-6 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--theme-card-bg))] p-5 shadow-sm" aria-label="Related reading"><h2 class="mb-3 text-base font-semibold text-[var(--theme-heading-text)]">Related reading</h2>${inner}</section>`,
  );
}

function wrapPremiumLessonCtaSection(html: string): string {
  return html.replace(
    /<h2[^>]*>\s*Premium lesson CTA\s*<\/h2>\s*([\s\S]*?)(?=<h2\b|<section\b|$)/gi,
    (_full, inner: string) =>
      `<section class="nn-blog-study-cta-card my-6 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--theme-card-bg))] p-5 shadow-sm" aria-label="Study with NurseNest"><h2 class="mb-3 text-base font-semibold text-[var(--theme-heading-text)]">Study with NurseNest</h2>${inner}</section>`,
  );
}

/**
 * Removes pipeline-only headings / duplicate reference blocks for public readers.
 *
 * @param hasStructuredApaReferences When true, drop in-body APA/reference headings + prose so the
 *   page-level {@link apaReferences} list is the single public references surface.
 */
export function sanitizePublicBlogBodyHtml(
  html: string,
  opts?: { hasStructuredApaReferences?: boolean },
): string {
  let s = html;
  s = stripEngineJsonLikeBlockElements(s);
  s = stripAllPipelineScaffoldH2Sections(s);
  s = transformFaqSchemaSectionToAccordion(s);
  if (opts?.hasStructuredApaReferences) {
    let prev = "";
    while (prev !== s) {
      prev = s;
      s = stripFirstReferenceBlockFromHtml(s);
    }
  } else {
    s = s.replace(
      REF_H2_BLOCK_OPEN_GLOBAL,
      '<h2 class="nn-blog-ref-heading">References (APA 7)</h2>',
    );
  }
  s = wrapSuggestedInternalLinksSection(s);
  s = wrapPremiumLessonCtaSection(s);
  return s;
}
