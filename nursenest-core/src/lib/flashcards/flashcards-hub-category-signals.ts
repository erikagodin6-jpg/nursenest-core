import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";

export type FlashcardsCategorySignals = {
  metaBySystem: Partial<Record<CanonicalStudyCategoryId, string>>;
  weakSystemIds: Set<string>;
  strengthPctBySystem: Partial<Record<CanonicalStudyCategoryId, number>>;
  suggestedSystemId: CanonicalStudyCategoryId | null;
};

function topicMatchesSystem(topic: string, label: string, id: string): boolean {
  const t = topic.trim().toLowerCase();
  const l = label.toLowerCase();
  const slug = id.replace(/_/g, " ");
  return t === l || t.includes(l) || l.includes(t) || t.includes(slug);
}

export function buildFlashcardsCategorySignals(args: {
  countsBySystem: Record<CanonicalStudyCategoryId, number>;
  weakTopics: TopicPerformanceSnapshot | null;
}): FlashcardsCategorySignals {
  const meta: Partial<Record<CanonicalStudyCategoryId, string>> = {};
  const strengthPctBySystem: Partial<Record<CanonicalStudyCategoryId, number>> = {};
  const weakSystemIds = new Set<string>();
  const weakRows = args.weakTopics?.weakTopics ?? [];

  let suggestedSystemId: CanonicalStudyCategoryId | null = null;
  let lowestAcc = 101;

  for (const s of CANONICAL_STUDY_CATEGORIES) {
    const count = args.countsBySystem[s.id] ?? 0;
    const weak = weakRows.find((w) => topicMatchesSystem(w.topic, s.label, s.id));
    if (weak && weak.attempted > 0) {
      weakSystemIds.add(s.id);
      const acc = Math.max(0, Math.min(100, 100 - weak.missRate));
      strengthPctBySystem[s.id] = acc;
      if (acc < lowestAcc) {
        lowestAcc = acc;
        suggestedSystemId = s.id;
      }
      if (acc >= 75) {
        meta[s.id] = `${s.label} recall is stabilizing`;
      } else if (acc >= 55) {
        meta[s.id] = `${s.label} is improving — review today`;
      } else {
        meta[s.id] = `${s.label} needs reinforcement`;
      }
    } else if (count > 0) {
      meta[s.id] = `${count} cards ready · tap to focus`;
    }
  }

  if (suggestedSystemId && meta[suggestedSystemId]) {
    meta[suggestedSystemId] = `Suggested focus · ${meta[suggestedSystemId]}`;
  }

  return { metaBySystem: meta, weakSystemIds, strengthPctBySystem, suggestedSystemId };
}
