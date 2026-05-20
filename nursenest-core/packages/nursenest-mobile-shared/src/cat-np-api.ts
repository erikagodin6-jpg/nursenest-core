import type { MobileApiClient } from "./mobile-api-client";
import { ApiPaths } from "./api-paths";

export function createNpCatApi(api: MobileApiClient) {
  return {
    startSession(body: { pathwayId: string; maxQuestions?: number }) {
      return api.request<unknown>(ApiPaths.catNpSession, { method: "POST", jsonBody: body });
    },

    submitAnswer(body: {
      practiceTestId: string;
      questionId: string;
      answeredCorrectly: boolean;
      responseTimeMs?: number;
    }) {
      return api.request<unknown>(ApiPaths.catNpAnswer, { method: "POST", jsonBody: body });
    },

    getAnalysis(practiceTestId: string) {
      return api.request<unknown>(ApiPaths.catNpAnalysis(practiceTestId), { method: "GET" });
    },

    getQuestionFull(questionId: string, includeRationale: boolean) {
      return api.request<unknown>(ApiPaths.questionById(questionId, { includeRationale }), { method: "GET" });
    },
  };
}
