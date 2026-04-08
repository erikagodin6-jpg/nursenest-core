"use client";

import Link from "next/link";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { PathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";

export type NpQuestionsHubBoardLinkContext = PathwayMarketingHubLinkContext;

/** NP question hubs: point to the same pathway’s lesson hub (no separate SEO-alias destinations). */
export function NpQuestionsHubBoardLinks({
  pathwayId,
}: {
  pathwayId: string;
  /** Kept for API compatibility with the questions page; analytics props are unused here. */
  linkContext?: NpQuestionsHubBoardLinkContext;
  surface?: string;
}) {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway || pathway.roleTrack !== "np") return null;
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  return (
    <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
      Structured prep:{" "}
      <Link href={lessonsHref} className="font-semibold text-primary hover:underline">
        {pathway.shortName} clinical lessons
      </Link>
      .
    </p>
  );
}
