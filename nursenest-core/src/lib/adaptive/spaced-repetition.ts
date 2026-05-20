export type ReviewItem = {
  id: string;
  domain: string;
  interval: number; // days
  easeFactor: number; // SM-2 style
  repetitions: number;
  dueDate: number;
  lastReviewed?: number;
};

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;

// SM-2 inspired spaced repetition update
export function updateReview(item: ReviewItem, rating: ReviewRating): ReviewItem {
  const now = Date.now();
  item.lastReviewed = now;

  // failure resets repetition
  if (rating < 3) {
    item.repetitions = 0;
    item.interval = 1;
  } else {
    item.repetitions += 1;

    if (item.repetitions === 1) item.interval = 1;
    else if (item.repetitions === 2) item.interval = 6;
    else item.interval = Math.round(item.interval * item.easeFactor);
  }

  // adjust ease factor
  const newEF =
    item.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));

  item.easeFactor = Math.max(1.3, newEF);

  // next due date
  item.dueDate = now + item.interval * 24 * 60 * 60 * 1000;

  return item;
}

export function createReviewItem(id: string, domain: string): ReviewItem {
  return {
    id,
    domain,
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    dueDate: Date.now(),
  };
}

export function isDue(item: ReviewItem): boolean {
  return Date.now() >= item.dueDate;
}

export function sortByDue(items: ReviewItem[]): ReviewItem[] {
  return [...items].sort((a, b) => a.dueDate - b.dueDate);
}

export function getDueItems(items: ReviewItem[]): ReviewItem[] {
  return items.filter(isDue);
}

export function nextBestItem(items: ReviewItem[]): ReviewItem | null {
  const due = getDueItems(items);
  if (due.length > 0) return sortByDue(due)[0];

  return sortByDue(items)[0] ?? null;
}
