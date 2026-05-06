import dynamic from "next/dynamic";

/**
 * QA-only render trace — loaded in a separate client chunk so learner hubs avoid
 * eagerly bundling the trace banner on the critical hub path (Phase 3 perf).
 */
export const LearnerRenderTraceBanner = dynamic(
  () => import("./learner-render-trace-banner").then((m) => m.LearnerRenderTraceBanner),
  { ssr: false, loading: () => null },
);
