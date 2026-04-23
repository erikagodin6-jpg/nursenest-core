import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type { SeoContentDomain, SeoTier } from "@/lib/seo/seo-taxonomy-align";
import { seoDomainForTaxonomyCategory } from "@/lib/seo/seo-taxonomy-align";

const DOMAIN_LABEL: Record<SeoContentDomain, string> = {
  CLINICAL: "Clinical",
  PROFESSIONAL_PRACTICE: "Professional practice",
  PHARMACOLOGY: "Pharmacology",
  EXAM_META: "Exam readiness",
};

const TIER_LABEL: Record<SeoTier, string> = {
  RN: "RN",
  RPN: "RPN",
  NP: "NP",
  ALLIED: "Allied health",
  NEW_GRAD: "New grad",
};

/** Human label for a taxonomy leaf id (matches pathway hub naming style). */
export function taxonomyCategoryLabel(categoryId: string): string {
  return categoryId
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export type TaxonomySeoBreadcrumbInput = {
  tier: SeoTier;
  category: string;
  /** Optional override; defaults from {@link seoDomainForTaxonomyCategory}. */
  domain?: SeoContentDomain;
  /** Short topic label (last crumb). */
  topicShort: string;
};

/**
 * Human-readable crumbs: `Home > RN > Clinical > Cardiovascular > Heart failure`.
 * Does not include URLs; use {@link buildTaxonomySeoBreadcrumbJsonLd} for schema.org.
 */
export function buildTaxonomySeoBreadcrumbs(input: TaxonomySeoBreadcrumbInput): string[] {
  const domain = input.domain ?? seoDomainForTaxonomyCategory(input.category);
  const topic = input.topicShort.replace(/\s+/g, " ").trim().slice(0, 80) || "Topic";
  return [
    "Home",
    TIER_LABEL[input.tier],
    DOMAIN_LABEL[domain],
    taxonomyCategoryLabel(input.category),
    topic,
  ];
}

export type BreadcrumbJsonLdItem = { name: string; item: string };

/**
 * JSON-LD `BreadcrumbList` compatible object (serialize with JSON.stringify for `<script type="application/ld+json">`).
 */
export function buildTaxonomySeoBreadcrumbJsonLd(args: {
  items: BreadcrumbJsonLdItem[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: args.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : toAbsoluteSiteUrl(it.item),
    })),
  };
}

/** Build `item` paths from tier + domain + category + terminal topic slug (relative site paths). */
export function buildTaxonomySeoBreadcrumbItems(args: {
  tier: SeoTier;
  category: string;
  topicSlug: string;
  /** Last breadcrumb label (human topic title, not the slug). */
  topicTitleShort: string;
  domain?: SeoContentDomain;
}): BreadcrumbJsonLdItem[] {
  const domain = args.domain ?? seoDomainForTaxonomyCategory(args.category);
  const tierSeg = tierUrlSegment(args.tier);
  const catSeg = args.category.toLowerCase().replace(/_/g, "-");
  const topicSeg = args.topicSlug.replace(/^\/+|\/+$/g, "");
  const basePath = buildTaxonomyUrlPath({
    tier: tierSeg,
    domain,
    categorySlug: catSeg,
    topicSlug: topicSeg,
  });
  const crumbs = buildTaxonomySeoBreadcrumbs({
    tier: args.tier,
    category: args.category,
    domain,
    topicShort: args.topicTitleShort,
  });
  const paths: string[] = [
    "/",
    `/${tierSeg}`,
    `/${tierSeg}/${domainPathSegment(domain)}`,
    `/${tierSeg}/${domainPathSegment(domain)}/${catSeg}`,
    basePath,
  ];
  return crumbs.map((name, i) => ({ name, item: paths[i] ?? basePath }));
}

function domainPathSegment(domain: SeoContentDomain): string {
  if (domain === "PROFESSIONAL_PRACTICE") return "professional-practice";
  if (domain === "PHARMACOLOGY") return "pharmacology";
  if (domain === "EXAM_META") return "exam-readiness";
  return "clinical";
}

export function tierUrlSegment(tier: SeoTier): string {
  if (tier === "NEW_GRAD") return "new-grad";
  return tier.toLowerCase();
}

export function buildTaxonomyUrlPath(input: {
  tier: string;
  domain: SeoContentDomain;
  categorySlug: string;
  topicSlug: string;
}): string {
  const t = input.tier.toLowerCase().replace(/^\/+|\/+$/g, "");
  const d = domainPathSegment(input.domain);
  const c = input.categorySlug.toLowerCase().replace(/^\/+|\/+$/g, "");
  const s = input.topicSlug.toLowerCase().replace(/^\/+|\/+$/g, "");
  return `/${t}/${d}/${c}/${s}`.replace(/\/{2,}/g, "/");
}
