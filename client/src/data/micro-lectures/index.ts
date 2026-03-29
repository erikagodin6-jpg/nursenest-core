import { heartFailureLecture } from "./heart-failure";
import { hyperkalemiaHypokalemiaMicroLecture } from "./hyperkalemia-hypokalemia";
import { getAssetUrl } from "@/lib/asset-url";

export interface LectureMetadata {
  slug: string;
  title: string;
  duration: string;
  level: string;
  category: string;
  tiers: ("rpn" | "rn" | "np")[];
  relatedLessonIds: string[];
  videoUrl?: string;
  free?: boolean;
}

export const lectureRegistry: LectureMetadata[] = [
  {
    slug: "cell-anatomy",
    title: "Cell Anatomy & Cellular Biology - Foundations for Nursing",
    duration: "Video Lecture",
    level: "All Levels",
    category: "Anatomy & Physiology",
    tiers: ["rpn", "rn", "np"],
    relatedLessonIds: [],
    videoUrl: getAssetUrl("cell-anatomy-lecture.mp4"),
    free: true,
  },
  {
    slug: "heart-failure",
    title: heartFailureLecture.title,
    duration: heartFailureLecture.duration,
    level: heartFailureLecture.level,
    category: heartFailureLecture.category,
    tiers: ["rn"],
    relatedLessonIds: ["hf-advanced", "hf-advanced-np", "cardiac-meds"],
  },
  {
    slug: "hyperkalemia-hypokalemia",
    title: hyperkalemiaHypokalemiaMicroLecture.title,
    duration: hyperkalemiaHypokalemiaMicroLecture.duration,
    level: hyperkalemiaHypokalemiaMicroLecture.level,
    category: "Renal & Metabolic",
    tiers: ["rpn", "rn"],
    relatedLessonIds: [
      "potassium-imbalance-rpn",
      "electrolyte-safety",
      "electrolyte-safety-np",
      "electrolyte-emergency-patterns-rpn",
    ],
  },
];

export const lectureData: Record<string, typeof heartFailureLecture> = {
  "heart-failure": heartFailureLecture,
  "hyperkalemia-hypokalemia": hyperkalemiaHypokalemiaMicroLecture as any,
};

export function getLecturesForTier(tier: string): LectureMetadata[] {
  return lectureRegistry.filter((l) => l.tiers.includes(tier as any));
}

export function getLecturesForLesson(lessonId: string): LectureMetadata[] {
  return lectureRegistry.filter((l) => l.relatedLessonIds.includes(lessonId));
}
