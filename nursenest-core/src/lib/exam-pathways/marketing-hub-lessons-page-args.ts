export type MarketingHubLessonsListOptions = {
  q?: string;
  topicSlugsIn?: string[];
  /** Allied marketing hub: prefer lessons tagged for this profession when dedicated shards exist. */
  alliedProfessionKey?: string;
  /**
   * Allied marketing hub: filter to lessons mapped into these profession taxonomy slugs
   * (see `allied-profession-taxonomy.ts`). Primary or secondary taxonomy match counts.
   */
  taxonomySlugsIn?: string[];
};

export type LoadPathwayLessonsHubPageArgs = {
  pageRequested: number;
  pageSizeRequested: number;
  lessonContentLocale: string;
  listOpts: MarketingHubLessonsListOptions | undefined;
};
