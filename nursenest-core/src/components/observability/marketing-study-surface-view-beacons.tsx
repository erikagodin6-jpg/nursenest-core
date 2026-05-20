"use client";

import { useEffect, useRef } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { pathwayAnalyticsDimensions, trackProductEvent } from "@/lib/observability/product-analytics";

export function MarketingQuestionBankViewBeacon({
  marketingRegion,
  marketingLocale,
}: {
  marketingRegion: "US" | "CA";
  marketingLocale: string;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackProductEvent(PH.marketingQuestionBankLandingViewed, {
      actor: "anonymous",
      marketing_region: marketingRegion,
      marketing_locale: marketingLocale,
      surface: "marketing_question_bank",
    });
  }, [marketingRegion, marketingLocale]);
  return null;
}

export function MarketingPathwayCatViewBeacon({
  pathway,
  hubPath,
}: {
  pathway: Pick<ExamPathwayDefinition, "id" | "countrySlug" | "roleTrack" | "examCode" | "examKey" | "stripeTier">;
  hubPath: string;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackProductEvent(PH.marketingCatLandingViewed, {
      actor: "anonymous",
      hub_path: hubPath,
      surface: "marketing_pathway_cat",
      ...pathwayAnalyticsDimensions(pathway),
    });
  }, [pathway, hubPath]);
  return null;
}

export function MarketingPathwayLessonDetailViewBeacon({
  pathway,
  lessonSlug,
  topicSlug,
  topicLabel,
  marketingLocale,
}: {
  pathway: Pick<ExamPathwayDefinition, "id" | "countrySlug" | "roleTrack" | "examCode" | "examKey" | "stripeTier">;
  lessonSlug: string;
  topicSlug?: string | null;
  topicLabel?: string | null;
  marketingLocale: string;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackProductEvent(PH.marketingPathwayLessonDetailViewed, {
      actor: "anonymous",
      lesson_slug: lessonSlug,
      topic_slug: topicSlug ?? undefined,
      topic_label: topicLabel ?? undefined,
      marketing_locale: marketingLocale,
      surface: "marketing_pathway_lesson_detail",
      ...pathwayAnalyticsDimensions(pathway),
    });
  }, [pathway, lessonSlug, topicSlug, topicLabel, marketingLocale]);
  return null;
}
