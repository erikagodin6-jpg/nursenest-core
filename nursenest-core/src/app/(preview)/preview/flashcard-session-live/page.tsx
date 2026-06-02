import type { Metadata } from "next";
import { FlashcardSessionLivePreview } from "@/components/ui-preview/flashcard-session-live-preview";

export const metadata: Metadata = {
  title: "Flashcard session — live shell preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = {
  searchParams: Promise<{ audit?: string; scenario?: string; theme?: string }>;
};

export default async function FlashcardSessionLivePreviewPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <FlashcardSessionLivePreview
      serverAudit={sp.audit === "1"}
      serverScenario={sp.scenario ?? null}
      serverTheme={sp.theme ?? null}
    />
  );
}
