export const CONTENT_SECURITY_CONFIG = {
  featureEnabled: process.env.CONTENT_PROTECTION_ENABLED !== "false",

  watermark: {
    opacity: parseFloat(process.env.WATERMARK_OPACITY || "0.08"),
    rotationDeg: -30,
    fontSize: 14,
    spacing: 200,
  },

  rateLimits: {
    premiumContentWindowMs: 60 * 1000,
    premiumContentMaxRequests: parseInt(process.env.RATE_LIMIT_PREMIUM_MAX || "30", 10),
    rapidRequestThreshold: parseInt(process.env.RAPID_REQUEST_THRESHOLD || "10", 10),
    rapidRequestWindowMs: parseInt(process.env.RAPID_REQUEST_WINDOW_MS || "10000", 10),
    blockDurationMs: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MS || "300000", 10),
  },

  dailyLimits: {
    free: {
      questionsViewed: parseInt(process.env.FREE_DAILY_QUESTIONS || "5", 10),
      flashcardsOpened: parseInt(process.env.FREE_DAILY_FLASHCARDS || "10", 10),
      lessonsAccessed: parseInt(process.env.FREE_DAILY_LESSONS || "3", 10),
    },
    trial: {
      questionsViewed: parseInt(process.env.TRIAL_DAILY_QUESTIONS || "20", 10),
      flashcardsOpened: parseInt(process.env.TRIAL_DAILY_FLASHCARDS || "30", 10),
      lessonsAccessed: parseInt(process.env.TRIAL_DAILY_LESSONS || "10", 10),
    },
  },

  suspiciousPatterns: {
    maxSequentialRequests: 15,
    sequentialWindowMs: 5000,
  },
};

export type ContentSecurityConfig = typeof CONTENT_SECURITY_CONFIG;
