import "server-only";

import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import { recommendNextActions, type PostTestRemediationInputRow, type PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { resolveTopicRemediationLinks } from "@/lib/learner/topic-remediation-links";
import { formatTopicLabelForDisplay } from "@/lib/learner/topic-normalize";

type TopicAgg = {
  topicKey: string;
  missCount: number;
  lastMissIndex: number;
  topicCode: string | null;
};

function aggregateIncorrectByTopic(review: ExamReviewJson): TopicAgg[] {
  const incorrect = review.items.filter((i) => !i.correct);
  if (incorrect.length === 0) return [];

  const byKey = new Map<string, TopicAgg>();
  for (const it of incorrect) {
    const key = it.topic;
    const idx = typeof it.itemIndex === "number" ? it.itemIndex : 0;
    let cur = byKey.get(key);
    if (!cur) {
      cur = { topicKey: key, missCount: 0, lastMissIndex: -1, topicCode: it.topicCode ?? null };
      byKey.set(key, cur);
    }
    cur.missCount += 1;
    if (idx > cur.lastMissIndex) cur.lastMissIndex = idx;
    if (it.topicCode) cur.topicCode = it.topicCode;
  }

  return [...byKey.values()].sort((a, b) => {
    if (b.missCount !== a.missCount) return b.missCount - a.missCount;
    if (b.lastMissIndex !== a.lastMissIndex) return b.lastMissIndex - a.lastMissIndex;
    return a.topicKey.localeCompare(b.topicKey);
  });
}

/**
 * Builds post-submit “what to study next” from the graded review payload (no persistence, same request as submit).
 */
export async function buildPostTestStudyNextFromReview(review: ExamReviewJson): Promise<PostTestStudyNextBundle | null> {
  const ranked = aggregateIncorrectByTopic(review);
  if (ranked.length === 0) return null;

  const enriched: PostTestRemediationInputRow[] = [];
  for (const t of ranked.slice(0, 8)) {
    const topicLabel = formatTopicLabelForDisplay(t.topicKey);
    const { lessonHref, qbankHref } = await resolveTopicRemediationLinks(t.topicCode, topicLabel);
    enriched.push({
      topicLabel,
      topicCode: t.topicCode,
      missCount: t.missCount,
      lessonHref,
      qbankHref,
    });
  }

  return recommendNextActions(enriched);
}
