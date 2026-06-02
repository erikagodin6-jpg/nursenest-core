export type LearnerHealthBand = "power_user" | "healthy" | "moderate_risk" | "at_risk";

export type LearnerHealthScore = {
  userId: string;
  score: number;
  band: LearnerHealthBand;
  bandLabel: string;
  components: {
    studyFrequency: number;
    consistency: number;
    activityDiversity: number;
    retention: number;
    lessonEngagement: number;
    catParticipation: number;
  };
  signals: string[];
  computedAt: string;
};

export function healthBandColor(band: LearnerHealthBand): string {
  switch (band) {
    case "power_user": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "healthy": return "text-green-700 bg-green-50 border-green-200";
    case "moderate_risk": return "text-amber-700 bg-amber-50 border-amber-200";
    case "at_risk": return "text-red-700 bg-red-50 border-red-200";
  }
}
