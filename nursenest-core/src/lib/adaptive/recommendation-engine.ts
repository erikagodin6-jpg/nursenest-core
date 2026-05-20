import { LearnerProfile, DomainKey } from "./learner-profile";
import { ReviewItem, isDue } from "./spaced-repetition";

export type LearningItem = {
  id: string;
  domain: DomainKey;
  type: "question" | "lesson" | "simulation";
  difficulty: "easy" | "medium" | "hard";
};

export type Recommendation = {
  itemId: string;
  domain: DomainKey;
  priority: number;
  reason: string;
};

function weakness(profile: LearnerProfile, domain: DomainKey): number {
  const d = profile.domain[domain];
  const total = d.correct + d.incorrect;
  if (total === 0) return 1;
  return 1 - d.correct / total;
}

function difficultyWeight(profile: LearnerProfile, difficulty: LearningItem["difficulty"]): number {
  if (profile.preferredDifficulty === "easy") {
    return difficulty === "hard" ? 0.8 : difficulty === "easy" ? 1.2 : 1;
  }
  if (profile.preferredDifficulty === "hard") {
    return difficulty === "hard" ? 1.3 : 1;
  }
  return difficulty === "medium" ? 1.1 : 1;
}

export function getRecommendations(
  profile: LearnerProfile,
  items: LearningItem[],
  reviews: ReviewItem[]
): Recommendation[] {
  const due = new Set(reviews.filter(isDue).map(r => r.id));

  return items
    .map(item => {
      const w = weakness(profile, item.domain);
      const d = difficultyWeight(profile, item.difficulty);
      const reviewBoost = due.has(item.id) ? 1.5 : 1;

      const priority = w * d * reviewBoost;

      let reason = "general practice";
      if (due.has(item.id)) reason = "due for review";
      else if (w > 0.7) reason = "weak domain focus";

      return { itemId: item.id, domain: item.domain, priority, reason };
    })
    .sort((a, b) => b.priority - a.priority);
}

export function nextRecommendation(
  profile: LearnerProfile,
  items: LearningItem[],
  reviews: ReviewItem[]
): Recommendation | null {
  return getRecommendations(profile, items, reviews)[0] ?? null;
}
