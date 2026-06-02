"use client";

import { useRouter } from "next/navigation";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";

/**
 * Lesson detail units control — updates cookie/local storage and refreshes server-rendered lesson bodies.
 */
export function LessonMeasurementUnitsBar({
  fallbackSystem,
  initialPreference = null,
  syncToProfile = true,
  compact = true,
}: {
  fallbackSystem: MeasurementSystem;
  initialPreference?: MeasurementPreference | null;
  syncToProfile?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();

  return (
    <MeasurementSystemToggle
      fallbackSystem={fallbackSystem}
      initialPreference={initialPreference}
      compact={compact}
      variant="lesson-utility"
      syncToProfile={syncToProfile}
      title="Units"
      description="Switch between SI (metric) and conventional (US customary) values. Your choice applies across lessons, practice, CAT, and flashcards."
      onPreferenceCommitted={() => {
        router.refresh();
      }}
    />
  );
}
