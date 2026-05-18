export type CasperEnvironmentStatus = {
  hasStripePriceId: boolean;
  hasOpenAiKey: boolean;
  hasDatabaseUrl: boolean;
  hasBlobStorageKey: boolean;
  warnings: string[];
};

export function getCasperEnvironmentStatus(): CasperEnvironmentStatus {
  const warnings: string[] = [];

  const hasStripePriceId = Boolean(
    process.env.STRIPE_PRICE_CASPER_PREP_PREMIUM,
  );

  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  const hasBlobStorageKey = Boolean(
    process.env.CASPER_VIDEO_STORAGE_KEY,
  );

  if (!hasStripePriceId) {
    warnings.push("Missing Stripe CASPer premium price ID.");
  }

  if (!hasOpenAiKey) {
    warnings.push("Missing OpenAI API key for evaluation providers.");
  }

  if (!hasDatabaseUrl) {
    warnings.push("Missing DATABASE_URL for Prisma persistence.");
  }

  if (!hasBlobStorageKey) {
    warnings.push("Missing CASPER_VIDEO_STORAGE_KEY for cloud media uploads.");
  }

  return {
    hasStripePriceId,
    hasOpenAiKey,
    hasDatabaseUrl,
    hasBlobStorageKey,
    warnings,
  };
}
