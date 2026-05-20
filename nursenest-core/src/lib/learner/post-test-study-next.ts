import "server-only";

import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { recommendNextActions, type PostTestRemediationInputRow, type PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { resolveTopicRemediationLinks } from "@/lib/learner/topic-remediation-links";
import { formatTopicLabelForDisplay, normalizeTopicKey } from "@/lib/learner/topic-normalize";

type TopicAgg = {
  topicKey: string;
  missCount: number;
  lastMissIndex: number;
  topicCode: string | null;
};

function aggregateIncorrectByTopic(review: ExamReviewJson): TopicAgg[] {
  const incorrect = review.items.filter((i) => !i.correct);
  if (incorrect.length === 0) return [];

  /** Canonical topic identity — merges label variants (spacing/case) into one recommendation row. */
  const byNorm = new Map<string, TopicAgg>();
  for (const it of incorrect) {
    const normKey = normalizeTopicKey(it.topic);
    const idx = typeof it.itemIndex === "number" ? it.itemIndex : 0;
    let cur = byNorm.get(normKey);
    if (!cur) {
      cur = { topicKey: normKey, missCount: 0, lastMissIndex: -1, topicCode: it.topicCode ?? null };
      byNorm.set(normKey, cur);
    }
    cur.missCount += 1;
    if (idx > cur.lastMissIndex) cur.lastMissIndex = idx;
    if (it.topicCode) cur.topicCode = it.topicCode;
  }

  return [...byNorm.values()].sort((a, b) => {
    if (b.missCount !== a.missCount) return b.missCount - a.missCount;
    if (b.lastMissIndex !== a.lastMissIndex) return b.lastMissIndex - a.lastMissIndex;
    return a.topicKey.localeCompare(b.topicKey);
  });
}

/**
 * Builds post-submit “what to study next” from the graded review payload (no persistence, same request as submit).
 * Links respect the subscriber’s country/pathway (no cross-region pathway or catalog lessons).
 */
export async function buildPostTestStudyNextFromReview(
  review: ExamReviewJson,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
): Promise<PostTestStudyNextBundle | null> {
  const ranked = aggregateIncorrectByTopic(review);
  if (ranked.length === 0) return null;

  const enriched: PostTestRemediationInputRow[] = [];
  for (const t of ranked.slice(0, 8)) {
    const topicLabel = formatTopicLabelForDisplay(t.topicKey);
    const codeForLinks = t.topicCode ?? t.topicKey;
    const { lessonHref, qbankHref } = await resolveTopicRemediationLinks(codeForLinks, topicLabel, entitlement, learnerPath);
    enriched.push({
      topicLabel,
      topicCode: t.topicCode ?? t.topicKey,
      missCount: t.missCount,
      lessonHref,
      qbankHref,
    });
  }

  return recommendNextActions(enriched);
}
