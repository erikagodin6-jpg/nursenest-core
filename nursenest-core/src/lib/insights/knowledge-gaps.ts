import type { KnowledgeGap } from "@/lib/insights/types";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

/**
 * Deterministic gap detection from topic ledger + weak list (no heavy catalog joins).
 */
export function detectKnowledgeGaps(args: {
  weakTopics: WeakTopicRow[];
  strongTopics: WeakTopicRow[];
  topicStatCount: number;
}): KnowledgeGap[] {
  const gaps: KnowledgeGap[] = [];
  const seen = new Set<string>();

  for (const w of args.weakTopics) {
    if (w.attempted === 0) continue;
    const key = `${w.topic}:fail`;
    if (seen.has(key)) continue;
    seen.add(key);

    if ((w.wrongStreak ?? 0) >= 3) {
      gaps.push({
        kind: "repeated_failure",
        topic: w.topic,
        detail: `Several misses in a row on ${w.topic} — likely a concept gap, not a one-off.`,
        suggestedAction: `Review a lesson on ${w.topic}, then a 5-question bank block.`,
      });
    } else if (w.attempted >= 4 && w.missRate >= 55) {
      gaps.push({
        kind: "poor_retention",
        topic: w.topic,
        detail: `High miss rate on ${w.topic} with enough tries to be confident it is not noise.`,
        suggestedAction: `Spaced repetition: alternate flashcards and short quizzes on ${w.topic}.`,
      });
    }
  }

  for (const s of args.strongTopics) {
    if (s.attempted >= 3 && s.missRate <= 18) continue;
  }

  if (args.topicStatCount > 0 && args.weakTopics.length === 0 && args.strongTopics.length < 2) {
    gaps.push({
      kind: "under_practiced",
      topic: "Multiple systems",
      detail: "Topic coverage is still thin — we need more graded attempts to map gaps precisely.",
      suggestedAction: "Complete mixed question sets so the ledger can attribute errors to topics.",
    });
  }

  return gaps.slice(0, 8);
}
