import type { MobileApiClient } from "./mobile-api-client";
import { ApiPaths } from "./api-paths";
import { studyLaunchHeaders } from "./study-surface-headers";

/** Subset of POST /api/practice-tests body — full schema lives server-side (Zod). */
export type CreatePracticeTestBody = Record<string, unknown>;

export function createPracticeTestsApi(api: MobileApiClient) {
  const hdr = studyLaunchHeaders("practice_exams");
  return {
    list() {
      return api.request<unknown>(ApiPaths.practiceTests, { method: "GET" });
    },

    create(body: CreatePracticeTestBody) {
      return api.request<unknown>(ApiPaths.practiceTests, {
        method: "POST",
        jsonBody: body,
        studySurfaceHeader: hdr,
      });
    },

    get(id: string, opts?: { teachingReview?: boolean; hydrate?: "full" | "minimal"; contractStrict?: boolean }) {
      const sp = new URLSearchParams();
      if (opts?.teachingReview) sp.set("teachingReview", "1");
      if (opts?.hydrate) sp.set("hydrate", opts.hydrate);
      if (opts?.contractStrict) sp.set("contractStrict", "1");
      const q = sp.toString();
      return api.request<unknown>(`${ApiPaths.practiceTest(id)}${q ? `?${q}` : ""}`, { method: "GET" });
    },

    getQuestion(id: string, index: number) {
      return api.request<unknown>(ApiPaths.practiceTestQuestion(id, index), { method: "GET" });
    },

    patch(id: string, body: Record<string, unknown>) {
      return api.request<unknown>(ApiPaths.practiceTest(id), {
        method: "PATCH",
        jsonBody: body,
        studySurfaceHeader: hdr,
      });
    },

    getCatStudyReview(id: string) {
      return api.request<unknown>(ApiPaths.practiceTestCatStudyReview(id), { method: "GET" });
    },
  };
}
