import { isTaxonomyLeafForSeo } from "@/lib/seo/seo-taxonomy-align";

export function primaryTaxonomyLeafForBlogPost(post: {
  category: string | null | undefined;
  tags: readonly string[];
}): string | null {
  const cat = post.category?.trim();
  if (cat && isTaxonomyLeafForSeo(cat)) return cat;
  for (const t of post.tags) {
    const s = t.trim();
    if (s && isTaxonomyLeafForSeo(s)) return s;
  }
  return null;
}
