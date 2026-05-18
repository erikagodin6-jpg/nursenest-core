export const CASPER_PRISMA_MODEL_NOTES = {
  learnerSession: {
    suggestedModel: "CasperSession",
    fields: [
      "id",
      "learnerId",
      "mode",
      "status",
      "startedAt",
      "completedAt",
      "overallRating",
    ],
  },

  typedResponse: {
    suggestedModel: "CasperTypedResponse",
    fields: [
      "id",
      "sessionId",
      "stationId",
      "responseText",
      "createdAt",
      "updatedAt",
    ],
  },

  videoResponse: {
    suggestedModel: "CasperVideoResponse",
    fields: [
      "id",
      "sessionId",
      "stationId",
      "storageKey",
      "mimeType",
      "durationSeconds",
      "createdAt",
    ],
  },

  evaluation: {
    suggestedModel: "CasperEvaluation",
    fields: [
      "id",
      "sessionId",
      "overallRating",
      "feedbackJson",
      "providerKey",
      "createdAt",
    ],
  },
} as const;
