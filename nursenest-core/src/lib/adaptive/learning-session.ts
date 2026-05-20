import { LearnerProfile, DomainKey, updateMastery } from "./learner-profile";
import { ReviewItem, updateReview, isDue } from "./spaced-repetition";
import { LearningItem, getRecommendations } from "./recommendation-engine";

export type SessionEvent =
  | { type: "question_answered"; itemId: string; domain: DomainKey; correct: boolean }
  | { type: "review_rated"; itemId: string; rating: number };

export type LearningSessionState = {
  profile: LearnerProfile;
  queue: LearningItem[];
  reviews: ReviewItem[];
  history: SessionEvent[];
  startedAt: number;
};

export function createSession(
  profile: LearnerProfile,
  queue: LearningItem[],
  reviews: ReviewItem[]
): LearningSessionState {
  return {
    profile,
    queue,
    reviews,
    history: [],
    startedAt: Date.now(),
  };
}

export function getNextItem(state: LearningSessionState) {
  const recs = getRecommendations(state.profile, state.queue, state.reviews);
  return recs[0] ?? null;
}

export function applyEvent(
  state: LearningSessionState,
  event: SessionEvent
): LearningSessionState {
  state.history.push(event);
  state.profile.updatedAt = Date.now();

  if (event.type === "question_answered") {
    state.profile = updateMastery(state.profile, event.domain, event.correct);
  }

  if (event.type === "review_rated") {
    const item = state.reviews.find(r => r.id === event.itemId);
    if (item) updateReview(item, event.rating as any);
  }

  return state;
}

export function getSessionProgress(state: LearningSessionState) {
  const total = state.history.length;
  const correct = state.history.filter(
    h => h.type === "question_answered" && h.correct
  ).length;

  return {
    totalEvents: total,
    accuracy: total ? correct / total : 0,
    dueReviews: state.reviews.filter(isDue).length,
    weakestDomains: state.profile.weaknesses,
  };
}
