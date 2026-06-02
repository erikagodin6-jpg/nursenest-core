export const PERFORMANCE_BUDGETS = {
  routes: {
    maxDurationMs: 3_000,
  },
  api: {
    maxDurationMs: 500,
  },
  database: {
    maxQueryDurationMs: 250,
  },
  components: {
    maxBytes: 100 * 1024,
    includeRoots: ["src/app", "src/components", "src/features"],
    extensions: [".tsx"],
    excludePathParts: [
      "/__tests__/",
      "/test/",
      "/tests/",
      "/fixtures/",
      "/mocks/",
      ".test.",
      ".spec.",
      ".contract.",
      ".stories.",
    ],
  },
  bundles: {
    maxBytes: 300 * 1024,
    clientChunkRoot: ".next/static/chunks",
    extensions: [".js"],
  },
  serverChunks: {
    maxBytes: 10 * 1024 * 1024,
    root: ".next/server/chunks",
  },
} as const;

export type PerformanceBudgets = typeof PERFORMANCE_BUDGETS;

