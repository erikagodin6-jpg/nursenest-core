"use client";

import type { CountryCode, TierCode } from "@prisma/client";
import type { LessonInteractiveModule, LessonInteractiveSoundLibraryModule } from "@/lib/lessons/pathway-lesson-types";
import { PathwayEmbeddedSoundLibraries } from "@/components/lessons/pathway-lesson-sound-libraries-ui";

/**
 * Single insertion point for lesson-embedded interactive modules (sound libraries today).
 * Server passes normalized `lesson.interactiveModules` from {@link getLessonInteractiveModules}.
 */
export function PathwayLessonInteractiveModules(props: {
  modules: LessonInteractiveModule[];
  viewerTier: TierCode;
  countryCode: CountryCode;
}) {
  const { modules, viewerTier, countryCode } = props;
  const soundLibraryModules: LessonInteractiveSoundLibraryModule[] = [];
  for (const m of modules) {
    if (m.type === "sound-library") soundLibraryModules.push(m);
  }
  if (!soundLibraryModules.length) return null;

  return (
    <PathwayEmbeddedSoundLibraries modules={soundLibraryModules} viewerTier={viewerTier} countryCode={countryCode} />
  );
}
