export type MarketingHubLessonsListOptions = {
  q?: string;
  topicSlugsIn?: string[];
  /** Allied marketing hub: prefer lessons tagged for this profession when dedicated shards exist. */
  alliedProfessionKey?: string;
};

export type LoadPathwayLessonsHubPageArgs = {
  pageRequested: number;
  pageSizeRequested: number;
  lessonContentLocale: string;
  listOpts: MarketingHubLessonsListOptions | undefined;
};
