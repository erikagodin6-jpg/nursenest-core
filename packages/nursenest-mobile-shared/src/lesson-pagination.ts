export type LessonPagesState = {
  readonly loadedPages: ReadonlySet<number>;
  readonly maxPageSeen: number;
};

export const initialLessonPagesState: LessonPagesState = {
  loadedPages: new Set(),
  maxPageSeen: 0,
};

/**
 * Tracks which list pages have been merged into an infinite list (dedupe guard).
 */
export function reduceLessonPageLoad(
  prev: LessonPagesState,
  page: number,
): { readonly next: LessonPagesState; readonly isNewPage: boolean } {
  const p = Math.max(1, Math.floor(page));
  if (prev.loadedPages.has(p)) {
    return { next: prev, isNewPage: false };
  }
  const loadedPages = new Set(prev.loadedPages);
  loadedPages.add(p);
  return {
    next: { loadedPages, maxPageSeen: Math.max(prev.maxPageSeen, p) },
    isNewPage: true,
  };
}
