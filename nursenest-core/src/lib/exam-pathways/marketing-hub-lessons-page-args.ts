export type LoadPathwayLessonsHubPageArgs = {
  pageRequested: number;
  pageSizeRequested: number;
  lessonContentLocale: string;
  listOpts: { q?: string; topicSlugsIn?: string[] } | undefined;
};
