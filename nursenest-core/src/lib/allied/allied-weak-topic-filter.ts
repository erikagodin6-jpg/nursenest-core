import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function topicMatchesSlug(topicLabel: string, slug: string): boolean {
  const t = topicLabel.trim().toLowerCase();
  const s = slug.trim().toLowerCase();
  if (!t || !s) return false;
  if (t === s) return true;
  const tDash = t.replace(/\s+/g, "-");
  const sSpaces = s.replace(/-/g, " ");
  return tDash.includes(s) || t.includes(sSpaces) || tDash === s;
}

/** When a profession defines `topicSlugsIn`, keep weak areas that plausibly match those slugs. */
export function filterWeakTopicsForAlliedProfession(
  weakTopics: WeakTopicRow[],
  prof: Pick<AlliedProfessionMarketing, "topicSlugsIn"> | null | undefined,
): WeakTopicRow[] {
  const slugs = prof?.topicSlugsIn?.filter(Boolean) ?? [];
  if (slugs.length === 0) return weakTopics;
  return weakTopics.filter((w) => slugs.some((slug) => topicMatchesSlug(w.topic, slug)));
}

/** Same slug scoping for trend rows / any `{ topic: string }` list. */
export function filterTopicRowsForAlliedProfession<T extends { topic: string }>(
  rows: T[],
  prof: Pick<AlliedProfessionMarketing, "topicSlugsIn"> | null | undefined,
): T[] {
  const slugs = prof?.topicSlugsIn?.filter(Boolean) ?? [];
  if (slugs.length === 0) return rows;
  return rows.filter((w) => slugs.some((slug) => topicMatchesSlug(w.topic, slug)));
}
