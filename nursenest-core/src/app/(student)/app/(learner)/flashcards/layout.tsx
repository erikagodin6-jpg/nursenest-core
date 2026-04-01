import type { Metadata } from "next";

/** Private learner flashcard study surfaces — not indexed (SEO pages live under `/flashcards`). */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LearnerFlashcardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
