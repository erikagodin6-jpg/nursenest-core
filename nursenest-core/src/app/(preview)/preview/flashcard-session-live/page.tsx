import type { Metadata } from "next";
import { FlashcardSessionLivePreview } from "@/components/ui-preview/flashcard-session-live-preview";

export const metadata: Metadata = {
  title: "Flashcard session — live shell preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function FlashcardSessionLivePreviewPage() {
  return <FlashcardSessionLivePreview />;
}
