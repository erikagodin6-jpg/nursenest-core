/** Slim stats shape passed from the homepage server component — avoids client fetch and “0 → value” flashes. */
export type HomeMarketingStats = {
  questionCount: number;
  registeredLearners: number;
  totalLessons: number;
};
