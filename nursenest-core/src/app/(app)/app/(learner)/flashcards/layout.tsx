import type { Metadata } from "next";
import "@/app/learner-flashcard-premium.css";
import "@/app/learner-flashcard-branding-revamp.css";

/** Private learner flashcard study surfaces — not indexed (SEO pages live under `/flashcards`). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LearnerFlashcardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
