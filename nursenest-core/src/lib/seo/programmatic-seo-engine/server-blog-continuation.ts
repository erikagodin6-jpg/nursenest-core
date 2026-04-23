import "server-only";

import type { CountryCode, PrismaClient } from "@prisma/client";
import { defaultPathwayIdForMarketingOffering } from "@/lib/marketing/country-exam-offerings";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { blogCountryFromPrismaTarget, marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";
import { blogOfferingForCat } from "@/lib/blog/blog-public-seo-helpers";
import { mapExamStringToSeoTier, seoDomainForTaxonomyCategory } from "@/lib/seo/seo-taxonomy-align";
import { resolveRelatedInternalLinks } from "@/lib/seo/internal-links";
import { sanitizeProgrammaticInternalLinks } from "@/lib/seo/programmatic-seo-engine/link-plan";
import type { ProgrammaticInternalLink } from "@/lib/seo/programmatic-seo-engine/types";
import { primaryTaxonomyLeafForBlogPost } from "@/lib/seo/programmatic-seo-engine/blog-taxonomy";

function marketingRegionForBlog(country: ReturnType<typeof blogCountryFromPrismaTarget>): MarketingRegionToggle {
  return country === "US" ? "US" : "CA";
}

function pathwayIdForBlogExam(exam: string | null | undefined, country: ReturnType<typeof blogCountryFromPrismaTarget>) {
  const region = marketingRegionForBlog(country);
  const offering = blogOfferingForCat(exam);
  return defaultPathwayIdForMarketingOffering(region, offering);
}

/**
 * Curated, crawlable internal links for public blog posts: same-pathway study surfaces first,
 * then bounded related content from {@link resolveRelatedInternalLinks}. No DB writes.
 */
export async function buildProgrammaticBlogContinuationLinks(
  prisma: PrismaClient,
  post: {
    slug: string;
    category: string | null | undefined;
    tags: string[];
    exam: string | null | undefined;
    countryTarget: CountryCode | null | undefined;
  },
): Promise<ProgrammaticInternalLink[]> {
  const country = blogCountryFromPrismaTarget(post.countryTarget);
  const hubs = marketingStudyHubsForBlogExam(post.exam ?? "", country);
  const selfPrefix = `/blog/${post.slug}`;

  const structural: ProgrammaticInternalLink[] = [
    { href: hubs.lessonsHub, anchor: "Browse exam-scoped lessons", kind: "lessons_index" },
    { href: hubs.questionBankHub, anchor: "Practice questions hub", kind: "hub" },
  ];
  if (hubs.pathwayQuestionsHub) {
    structural.push({
      href: hubs.pathwayQuestionsHub,
      anchor: "Pathway practice questions",
      kind: "pathway_questions",
    });
  }
  if (hubs.pathwayCatHub) {
    structural.push({
      href: hubs.pathwayCatHub,
      anchor: "Adaptive CAT-style practice",
      kind: "pathway_cat",
    });
  }
  structural.push({ href: hubs.flashcardsHub, anchor: "Flashcards hub", kind: "hub" });

  const leaf = primaryTaxonomyLeafForBlogPost(post);
  let semantic: ProgrammaticInternalLink[] = [];
  if (leaf) {
    const domain = seoDomainForTaxonomyCategory(leaf);
    const tier = mapExamStringToSeoTier(post.exam);
    const pathwayId = pathwayIdForBlogExam(post.exam, country);
    const fromDb = await resolveRelatedInternalLinks(prisma, {
      category: leaf,
      domain,
      tier,
      pathwayId,
      locale: "en",
      limit: 5,
    });
    semantic = fromDb.map(
      (l): ProgrammaticInternalLink => ({
        href: l.href,
        anchor: l.anchor,
        kind: l.kind,
      }),
    );
  }

  return sanitizeProgrammaticInternalLinks([...structural, ...semantic], {
    excludeHrefPrefixes: [selfPrefix],
    max: 6,
  });
}
