import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

export type RecommendationConfidence = "high" | "medium" | "low";

export function confidenceFromSignal(signal: number | null | undefined): RecommendationConfidence {
  const n = typeof signal === "number" ? signal : 0;
  if (n >= 0.72) return "high";
  if (n >= 0.45) return "medium";
  return "low";
}

export function deriveTopicCode(args: {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
}): string | null {
  const subtopic = (args.subtopic ?? "").trim();
  if (subtopic.length > 1) return normalizeTopicKey(subtopic);
  const topic = (args.topic ?? "").trim();
  if (topic.length > 1) return normalizeTopicKey(topic);
  const bodySystem = (args.bodySystem ?? "").trim();
  if (bodySystem.length > 1) return normalizeTopicKey(bodySystem);
  return null;
}
