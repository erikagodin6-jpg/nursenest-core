"use client";

import { useEffect } from "react";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";

type SurfaceView = "hub" | "lessons_hub" | "module" | "study_plan";

const SURFACE_EVENT: Record<SurfaceView, string> = {
  hub: PH.preNursingHubViewed,
  lessons_hub: PH.preNursingLessonsHubViewed,
  module: PH.preNursingModuleViewed,
  study_plan: PH.preNursingStudyPlanViewed,
};

export function PreNursingSurfaceAnalytics({
  surface,
  moduleSlug,
}: {
  surface: SurfaceView;
  moduleSlug?: string;
}) {
  useEffect(() => {
    trackClientEvent(SURFACE_EVENT[surface], {
      source_surface: surface,
      module_slug: moduleSlug,
    });
  }, [moduleSlug, surface]);
  return null;
}

