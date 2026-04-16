import type { CountryCode, SubscriptionStatus, TierCode, TrialStatus, UserRole } from "@prisma/client";

export type BillingSubscriptionRow = {
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  stripeCustomerId: string | null;
  planTier: TierCode | null;
  planCountry: CountryCode | null;
  alliedCareer: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BillingUserRow = {
  tier: TierCode;
  country: string;
  role: UserRole;
  trialStatus: TrialStatus;
  trialEndsAt: Date | null;
  trialStartedAt: Date | null;
  learnerPath: string | null;
  passwordHash: string | null;
};
