/**
 * Lesson bookmarking — architecture only until a server route exists.
 *
 * TODO: Wire to `GET/POST /api/learner/...` when product adds a bookmark API.
 * Do not persist fake server state; SecureStore holds optimistic pointers only after server confirms.
 */

export const BOOKMARK_SECURE_STORE_PREFIX = "nn.lessonBookmark.";

export type LessonBookmarkRef = {
  readonly pathwayId: string;
  readonly slug: string;
  readonly lessonId?: string;
};

export type LessonBookmarkStore = {
  readonly listIds: () => Promise<string[]>;
  readonly get: (key: string) => Promise<string | null>;
  readonly set: (key: string, value: string) => Promise<void>;
  readonly remove: (key: string) => Promise<void>;
};

export function bookmarkStorageKey(ref: LessonBookmarkRef): string {
  return `${BOOKMARK_SECURE_STORE_PREFIX}${ref.pathwayId}:${ref.slug}`;
}

export type LessonBookmarkApi = {
  /** Placeholder — replace with real HTTP once API ships. */
  readonly listBookmarks: () => Promise<{ ok: false; message: string }>;
  readonly addBookmark: (_ref: LessonBookmarkRef) => Promise<{ ok: false; message: string }>;
  readonly removeBookmark: (_ref: LessonBookmarkRef) => Promise<{ ok: false; message: string }>;
};

export function createStubLessonBookmarkApi(): LessonBookmarkApi {
  const message = "Bookmark API not implemented — see docs/mobile-lessons-architecture.md";
  return {
    listBookmarks: async () => ({ ok: false, message }),
    addBookmark: async () => ({ ok: false, message }),
    removeBookmark: async () => ({ ok: false, message }),
  };
}
