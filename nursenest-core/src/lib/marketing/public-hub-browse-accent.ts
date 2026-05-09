import type { CSSProperties } from "react";

/** Rotates semantic chart hues for category-first cards — Blossom-friendly multi-accent without flat grey grids. */
const HUB_BROWSE_ACCENTS = [
  "--semantic-chart-5",
  "--semantic-chart-1",
  "--semantic-chart-3",
  "--semantic-chart-4",
  "--semantic-chart-2",
] as const;

export function publicHubCategoryBrowseCardStyle(index: number): CSSProperties {
  const token = HUB_BROWSE_ACCENTS[index % HUB_BROWSE_ACCENTS.length];
  return {
    "--hub-browse-accent": `var(${token})`,
  } as CSSProperties;
}
