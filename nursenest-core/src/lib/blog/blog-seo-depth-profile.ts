import { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { isLongFormPathophysiologyProfile } from "@/lib/blog/blog-longform-nursing-contract";

/**
 * “SEO pillar” depth: stricter outline/body gates and higher minimum word targets.
 * Standard posts use the lower {@link BLOG_ARTICLE_MIN_WORDS_STANDARD_PUBLISH} floor.
 */
export function isBlogSeoPillarDepthProfile(input: { template: BlogPostTemplate; intent: BlogPostIntent }): boolean {
  if (isLongFormPathophysiologyProfile(input)) return true;
  if (input.template === BlogPostTemplate.MEDICATION_REVIEW) return true;
  if (input.template === BlogPostTemplate.DISEASE_PROCESS_EXPLAINER) return true;
  return false;
}
