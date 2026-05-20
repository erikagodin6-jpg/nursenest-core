import type { PostExamDashboardFeed } from "@/lib/learner/post-exam-coaching/types";

const KEY = "nn:last-post-exam-dashboard-feed";

export function persistDashboardFeedToSession(feed: PostExamDashboardFeed): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(feed));
  } catch {
    // Session storage is optional; never block results rendering.
  }
}
