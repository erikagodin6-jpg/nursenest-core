export type MarketingScreenshotDepthLevel = 1 | 2 | 3;

export type MarketingScreenshotCaptureSurface =
  | "learning-activity"
  | "educational-content"
  | "analytics-report";

export type MarketingScreenshotDepthTarget = {
  key: string;
  route: string;
  depthLevel: MarketingScreenshotDepthLevel;
  captureSurface: MarketingScreenshotCaptureSurface;
  educationalState: string;
  demonstrates: readonly string[];
  preparationRequired: true;
  reviewGate: readonly string[];
};

export const MARKETING_SCREENSHOT_DEPTH_POLICY = {
  goldenRule: "learning_activity_over_hub",
  highestPriority: "real_learning_experience",
  rejects: ["hub", "category-page", "menu", "navigation", "landing-page", "empty-dashboard"] as const,
  requiredReviewQuestions: [
    "Can someone understand what this module does in under 3 seconds?",
    "Would this screenshot increase subscription likelihood?",
    "Does this screenshot demonstrate actual educational value?",
    "Would a competitor proudly place this screenshot on their homepage?",
  ] as const,
} as const;

export function assertMarketingScreenshotDepth(target: MarketingScreenshotDepthTarget): void {
  if (target.depthLevel > 3) {
    throw new Error(`${target.key} is too shallow for marketing capture. Use a learning activity, educational content, or meaningful analytics report.`);
  }
  if (!target.preparationRequired) {
    throw new Error(`${target.key} must behave like a learner before capture.`);
  }
  if (target.captureSurface !== "learning-activity" && target.depthLevel === 1) {
    throw new Error(`${target.key} is marked Level 1 but is not a real learning activity.`);
  }
  const searchable = `${target.key} ${target.route} ${target.educationalState}`.toLowerCase();
  for (const forbidden of MARKETING_SCREENSHOT_DEPTH_POLICY.rejects) {
    if (searchable.includes(forbidden)) {
      throw new Error(`${target.key} violates screenshot depth policy: ${forbidden}`);
    }
  }
  for (const question of MARKETING_SCREENSHOT_DEPTH_POLICY.requiredReviewQuestions) {
    if (!target.reviewGate.includes(question)) {
      throw new Error(`${target.key} is missing screenshot review gate: ${question}`);
    }
  }
}

export function marketingScreenshotReviewGate(): readonly string[] {
  return MARKETING_SCREENSHOT_DEPTH_POLICY.requiredReviewQuestions;
}
