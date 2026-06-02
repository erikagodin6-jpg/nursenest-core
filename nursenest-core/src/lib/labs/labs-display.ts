import type { LabTrack } from "@/lib/labs/labs-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

/** Sentence-case labels for workstation UI (avoid shouty ALL CAPS). */
export function labTrackFocusLabel(track: LabTrack): string {
  switch (track) {
    case "allied":
      return "Allied focus";
    case "np":
      return "NP focus";
    case "pn":
      return "PN focus";
    default:
      return "RN focus";
  }
}

export function labLessonStatusLabel(hasAccess: boolean): string {
  return hasAccess ? "Full lesson" : "Preview";
}

export function estimateLabLessonMinutes(blockCount: number): number {
  return Math.max(8, Math.min(28, Math.round(blockCount * 1.4)));
}

export function labProgressStatusLabel(status: PathwayLessonProgressStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In progress";
    default:
      return "Not started";
  }
}
