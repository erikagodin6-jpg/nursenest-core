/**
 * ECG / rhythm video practice — **type contracts only**.
 *
 * ## RN / NP / allied gating
 * Server routes must continue to use existing entitlement + exam-pathway SQL gates
 * (`questionAccessWhere`, non-ECG vs ECG pools) before attaching playback sessions to a user.
 * These types do **not** enforce gating; they document integration expectations for callers.
 */

export type PlaybackSessionId = string;

/** Session-scoped playback — no URLs or PHI in structured logs. */
export type EcgVideoPlaybackSession = {
  sessionId: PlaybackSessionId;
  pathwayId: string;
  /** Content id in bank/CMS — never log signed URLs or device telemetry here. */
  mediaAssetId: string;
  /** RN-heavy vs NP/advanced labeling for UI routing only; access still server-gated. */
  clinicalDepth: "rn_core" | "np_advanced" | "allied_paramedic";
};

export type RhythmFlowStepKind = "intro" | "observe" | "quiz" | "reflect";

export type RhythmFlowStep = {
  id: string;
  kind: RhythmFlowStepKind;
  /** Learner must commit answer within window — timed recognition drills. */
  recognitionDeadlineMs: number;
};

export type TimedRecognitionOutcome = "correct" | "incorrect" | "skipped" | "expired";

export type TimedRecognitionResult = {
  stepId: string;
  outcome: TimedRecognitionOutcome;
  latencyMs: number;
};
