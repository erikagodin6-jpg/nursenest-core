import type { MobileApiClient } from "./mobile-api-client";
import { ApiPaths } from "./api-paths";
import { studyLaunchHeaders } from "./study-surface-headers";

export type FlashcardRating = "again" | "hard" | "good" | "easy" | "incorrect" | "unsure" | "known";

export function createFlashcardsApi(api: MobileApiClient) {
  return {
    listDecks(params: { page?: number; pageSize?: number; pathwayId?: string }) {
      const sp = new URLSearchParams();
      if (params.page != null) sp.set("page", String(params.page));
      if (params.pageSize != null) sp.set("pageSize", String(params.pageSize));
      if (params.pathwayId) sp.set("pathwayId", params.pathwayId);
      const q = sp.toString();
      return api.request<unknown>(`${ApiPaths.flashcardDecks}${q ? `?${q}` : ""}`, { method: "GET" });
    },

    getStudyBatch(deckRef: string, opts: { limit?: number; reset?: boolean; shuffle?: boolean }) {
      const sp = new URLSearchParams();
      sp.set("limit", String(opts.limit ?? 8));
      if (opts.reset) sp.set("reset", "1");
      if (opts.shuffle) sp.set("shuffle", "1");
      return api.request<unknown>(`${ApiPaths.flashcardDeckStudy(deckRef)}?${sp.toString()}`, {
        method: "GET",
      });
    },

    postDeckReview(deckRef: string, body: { flashcardId: string; rating: FlashcardRating }) {
      return api.request<unknown>(ApiPaths.flashcardDeckReview(deckRef), {
        method: "POST",
        jsonBody: body,
        studySurfaceHeader: studyLaunchHeaders("flashcards"),
      });
    },

    postCardReview(cardId: string, body: { rating: FlashcardRating }) {
      return api.request<unknown>(ApiPaths.flashcardCardReview(cardId), {
        method: "POST",
        jsonBody: { rating: body.rating },
        studySurfaceHeader: studyLaunchHeaders("flashcards"),
      });
    },
  };
}
