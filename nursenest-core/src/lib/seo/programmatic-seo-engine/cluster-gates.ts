/**
 * Gates for indexable programmatic cluster pages (topic hubs, blog indexes, etc.).
 * Pure thresholds — callers decide routing/sitemap inclusion.
 */

export const MIN_INDEXABLE_CLUSTER_ITEMS = 4;
export const MIN_INDEXABLE_CLUSTER_INTRO_CHARS = 120;

export type ClusterIndexabilityInput = {
  renderableItemCount: number;
  introPlainTextChars: number;
};

export function clusterPageMeetsIndexabilityThreshold(input: ClusterIndexabilityInput): boolean {
  return (
    input.renderableItemCount >= MIN_INDEXABLE_CLUSTER_ITEMS &&
    input.introPlainTextChars >= MIN_INDEXABLE_CLUSTER_INTRO_CHARS
  );
}
