/**
 * Product targets for Canadian NP question-bank depth (reporting only — no synthetic filler).
 * Admin coverage compares live counts to these floors.
 */
export const NP_COVERAGE_THRESHOLDS = {
  /** Baseline launch: total published NP questions scoped to Canada. */
  canadaNpMinPublished: 1000,
  /** When a stream/pathway column is used, expect substantial depth before calling it “complete”. */
  streamMinPublishedIfScoped: 800,
  /** Per major clinical domain/topic bucket (best-effort from `topic` labels). */
  topicMin: 75,
  topicPreferred: 150,
  /** Minimum inferred stem-type count before we stop flagging “thin mix” for that bucket. */
  stemTypeFloor: 40,
} as const;
