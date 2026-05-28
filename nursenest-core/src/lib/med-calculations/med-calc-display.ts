import type { MedCalcTrack } from "@/lib/med-calculations/med-calculations-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function medCalcTrackFocusLabel(track: MedCalcTrack): string {
  if (track === "np") return "NP focus";
  if (track === "pn") return "PN focus";
  return "RN focus";
}

export function medCalcLessonStatusLabel(hasAccess: boolean): string {
  return hasAccess ? "Full drills" : "Preview";
}

export function medCalcProgressStatusLabel(status: PathwayLessonProgressStatus): string {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In progress";
  return "Not started";
}
