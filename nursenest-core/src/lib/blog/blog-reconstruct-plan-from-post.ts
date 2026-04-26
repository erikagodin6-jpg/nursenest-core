import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, type CountryCode } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { parsePublishingPackage } from "@/lib/blog/blog-publishing-package";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseOutlineFromJson(raw: unknown): BlogControlPanelPlan["outline"] | null {
  if (!Array.isArray(raw) || raw.length < 3) return null;
  const out: BlogControlPanelPlan["outline"] = [];
  for (const node of raw) {
    if (!isPlainObject(node)) return null;
    const h2 = String(node.h2 ?? "").trim();
    if (h2.length < 2) return null;
    const row: BlogControlPanelPlan["outline"][number] = { h2: h2.slice(0, 200) };
    if (Array.isArray(node.h3)) {
      const h3 = node.h3
        .map((x) => String(x ?? "").trim())
        .filter((s) => s.length > 0)
        .slice(0, 8)
        .map((s) => s.slice(0, 200));
      if (h3.length) row.h3 = h3;
    }
    if (Array.isArray(node.bullets)) {
      const bullets = node.bullets
        .map((x) => String(x ?? "").trim())
        .filter((s) => s.length > 0)
        .slice(0, 12)
        .map((s) => s.slice(0, 400));
      if (bullets.length) row.bullets = bullets;
    }
    out.push(row);
  }
  return out.length >= 3 ? out : null;
}

function parseFaqsFromBlock(raw: unknown): BlogControlPanelPlan["faqs"] {
  if (!raw || typeof raw !== "object") return [];
  const items = (raw as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  const faqs: BlogControlPanelPlan["faqs"] = [];
  for (const it of items) {
    if (!isPlainObject(it)) continue;
    const q = String(it.q ?? "").trim();
    const a = String(it.a ?? "").trim();
    if (q.length < 5 || a.length < 10) continue;
    faqs.push({ q: q.slice(0, 300), a: a.slice(0, 1200) });
  }
  return faqs.slice(0, 12);
}

/**
 * Reconstructs a {@link BlogControlPanelPlan} from persisted post columns for **body-only** regeneration.
 * Returns null when the row predates the structured pipeline or outline data is missing (legacy guard).
 */
export function reconstructBlogControlPanelPlanFromPost(row: {
  title: string;
  titleAlternates: string[];
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  excerpt: string;
  outlineJson: unknown;
  faqBlock: unknown;
  internalLinkPlan: unknown;
  keyTakeaways: string[];
  featuredSnippet: string | null;
  keywordPlan: string[];
}): BlogControlPanelPlan | null {
  const outline = parseOutlineFromJson(row.outlineJson);
  if (!outline) return null;

  const parsedPlan = parseInternalLinkPlanJson(row.internalLinkPlan);
  const pkg = parsePublishingPackage(
    row.internalLinkPlan && typeof row.internalLinkPlan === "object"
      ? (row.internalLinkPlan as Record<string, unknown>).publishingPackage
      : undefined,
  );

  const titleOptions: string[] = [];
  const pushTitle = (t: string) => {
    const s = t.trim();
    if (s.length < 3) return;
    if (titleOptions.some((x) => x.toLowerCase() === s.toLowerCase())) return;
    titleOptions.push(s.slice(0, 200));
  };
  pushTitle(row.title);
  for (const alt of row.titleAlternates ?? []) pushTitle(alt);
  if (titleOptions.length < 2) {
    pushTitle(`${row.title} — clinical update`);
  }
  if (titleOptions.length < 2) {
    pushTitle(`${row.title} — exam prep notes`);
  }

  const metaTitle = (row.seoTitle?.trim() || row.title).slice(0, 70);
  const metaDescription = (row.seoDescription?.trim() || row.excerpt).slice(0, 320);
  const suggestedExcerpt =
    row.excerpt.trim().length >= 80 ? row.excerpt.trim().slice(0, 360) : metaDescription.slice(0, 360);

  const keyTakeaways = (row.keyTakeaways ?? [])
    .map((k) => k.trim())
    .filter((k) => k.length >= 5)
    .slice(0, 10)
    .map((k) => k.slice(0, 400));

  const seoFocusKeywords = (row.keywordPlan ?? [])
    .map((k) => k.trim())
    .filter((k) => k.length >= 2)
    .slice(0, 8);

  const faqs = parseFaqsFromBlock(row.faqBlock);

  return {
    titleOptions,
    h1: row.title.slice(0, 200),
    recommendedSlug: row.slug,
    metaTitle,
    metaDescription,
    outline,
    suggestedInternalLessons: parsedPlan.lessons ?? [],
    faqs,
    breadcrumbs: [],
    imagePlacements: parsedPlan.imagePlacements ?? [],
    apaSourceStubs: [],
    keyTakeaways,
    featuredSnippetHint: row.featuredSnippet?.trim() ? row.featuredSnippet.trim().slice(0, 400) : undefined,
    suggestedExcerpt,
    schemaOpportunities: undefined,
    seoFocusKeywords: seoFocusKeywords.length ? seoFocusKeywords : undefined,
    internalAnchorOpportunities: pkg?.internalAnchorOpportunities?.length
      ? pkg.internalAnchorOpportunities
      : [],
    recommendedInternalLinks: [],
    sourceCandidates: [],
    needsReviewFlags: [],
    editorialNotes: [],
  };
}

export function countryTargetToEditorialCountry(ct: CountryCode | null | undefined): "US" | "CA" | "unspecified" {
  if (ct === "US") return "US";
  if (ct === "CA") return "CA";
  return "unspecified";
}

export function safeBlogTemplateForReconstruct(t: BlogPostTemplate | null | undefined): BlogPostTemplate {
  return t ?? BlogPostTemplate.TOPIC_EXPLAINED;
}

export function safeBlogIntentForReconstruct(i: BlogPostIntent | null | undefined): BlogPostIntent {
  return i ?? BlogPostIntent.EXAM_PREP;
}

export function safeBlogFunnelForReconstruct(f: BlogFunnelStage | null | undefined): BlogFunnelStage {
  return f ?? BlogFunnelStage.CONSIDERATION;
}
