import type { PathwayLessonYieldLevel } from "@/lib/lessons/pathway-lesson-types";

export function pathwayLessonYieldWeight(level: PathwayLessonYieldLevel | undefined): number {
  switch (level) {
    case "must_know":
      return 0;
    case "common":
      return 1;
    case "advanced":
      return 2;
    case "rare":
      return 3;
    default:
      return 4;
  }
}

export function pathwayLessonYieldLabel(level: PathwayLessonYieldLevel | undefined): string | null {
  switch (level) {
    case "must_know":
      return "Must Know";
    case "common":
      return "Common";
    case "advanced":
      return "Advanced";
    case "rare":
      return "Rare";
    default:
      return null;
  }
}

