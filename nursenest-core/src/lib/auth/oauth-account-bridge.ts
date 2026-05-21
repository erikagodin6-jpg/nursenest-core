import "server-only";

import type { Account, Profile, User } from "next-auth";
import { Prisma } from "@prisma/client";
import { isDeletedAccountEmail } from "@/lib/account/delete-learner-account";
import { normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import { validateUsernameForSignup } from "@/lib/auth/username-rules";
import { prisma } from "@/lib/db";
import { getUserAccess, subscriptionStatusForSession } from "@/lib/entitlements/get-user-access";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";

const OAUTH_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  country: true,
  tier: true,
  alliedProfessionKey: true,
  credentialVersion: true,
  passwordHash: true,
  authProvider: true,
  emailVerified: true,
  onboardingCompletedAt: true,
} as const;

type OAuthUserRow = Prisma.UserGetPayload<{ select: typeof OAUTH_USER_SELECT }>;

export type OAuthBridgeUser = {
  id: string;
  email: string;
  name: string;
  role: OAuthUserRow["role"];
  country: OAuthUserRow["country"];
  tier: OAuthUserRow["tier"];
  alliedProfessionKey: string | null;
  subscriptionStatus: ReturnType<typeof subscriptionStatusForSession>;
  credentialVersion: number;
  rememberMe: boolean;
  isNewUser: boolean;
  needsPathwayOnboarding: boolean;
};

function providerIdFromAccount(account: Account | null | undefined): OAuthProviderId | null {
  const p = account?.provider?.trim().toLowerCase();
  if (p === "google" || p === "apple") return p;
  return null;
}

function displayNameFromProfile(profile: Profile | undefined, email: string): string {
  const name = typeof profile?.name === "string" ? profile.name.trim() : "";
  if (name) return name.slice(0, 200);
  const local = email.split("@")[0] ?? "Learner";
  return local.replace(/[._+]/g, " ").trim() || "Learner";
}

async function suggestAvailableUsername(email: string): Promise<string> {
  const local = (email.split("@")[0] ?? "learner")
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 24);

  const base = local.length >= 3 ? local : "learner";
  for (let i = 0; i < 12; i++) {
    const candidate = i === 0 ? base : `${base}${i}`;
    const check = validateUsernameForSignup(candidate);
    if (!check.ok) continue;
    const taken = await prisma.user.findUnique({
      where: { username: check.normalized },
      select: { id: true },
    });
    if (!taken) return check.normalized;
  }
  return `learner${Date.now().toString(36).slice(-6)}`;
}

async function mapRowToBridgeUser(row: OAuthUserRow, isNewUser: boolean): Promise<OAuthBridgeUser> {
  let subscriptionStatus = subscriptionStatusForSession(
    await getUserAccess(row.id).catch(() => null),
  );

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    country: row.country,
    tier: row.tier,
    alliedProfessionKey: row.alliedProfessionKey ?? null,
    subscriptionStatus,
    credentialVersion: row.credentialVersion ?? 0,
    rememberMe: true,
    isNewUser,
    needsPathwayOnboarding: !row.onboardingCompletedAt,
  };
}

/**
 * Find or create a learner for OAuth sign-in. Links by verified email (including Apple private relay).
 * Returns null when sign-in must be rejected (deleted account, missing email).
 */
export async function resolveOAuthSignInUser(args: {
  user: User;
  account: Account | null | undefined;
  profile?: Profile;
  ip?: string;
}): Promise<OAuthBridgeUser | "account_not_linked" | null> {
  const provider = providerIdFromAccount(args.account);
  if (!provider) return null;

  const emailRaw =
    (typeof args.user.email === "string" && args.user.email) ||
    (typeof args.profile?.email === "string" && args.profile.email) ||
    "";
  const email = emailRaw.trim().toLowerCase();
  if (!email) {
    safeServerLog("auth", "oauth_missing_email", { provider });
    return null;
  }

  if (isDeletedAccountEmail(email)) {
    return null;
  }

  let existing: OAuthUserRow | null = null;
  try {
    existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          { normalizedEmail: normalizeEmailForDedup(email) },
        ],
      },
      select: OAUTH_USER_SELECT,
    });
  } catch (e) {
    safeServerLogCritical("auth", "oauth_lookup_failed", { provider }, e);
    return null;
  }

  if (existing) {
    if (existing.passwordHash && existing.authProvider === "credentials" && provider !== "google") {
      /* Apple/Google both allowed to link to credentials by email — always allow same-email merge */
    }

    try {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          emailVerified: true,
          lastLoginAt: new Date(),
          lastLoginIp: args.ip && args.ip !== "unknown" ? args.ip.slice(0, 64) : undefined,
          authProvider: existing.authProvider === "credentials" ? existing.authProvider : provider,
        },
        select: OAUTH_USER_SELECT,
      });
      return mapRowToBridgeUser(updated, false);
    } catch (e) {
      safeServerLogCritical("auth", "oauth_update_failed", { provider, userId: existing.id }, e);
      return null;
    }
  }

  const username = await suggestAvailableUsername(email);
  const name = displayNameFromProfile(args.profile, email);

  try {
    const created = await prisma.user.create({
      data: {
        email,
        normalizedEmail: normalizeEmailForDedup(email),
        username,
        name,
        passwordHash: null,
        country: "US",
        tier: "RN",
        role: "LEARNER",
        authProvider: provider,
        emailVerified: true,
        signupIp: args.ip && args.ip !== "unknown" ? args.ip.slice(0, 64) : null,
      },
      select: OAUTH_USER_SELECT,
    });

    captureServerEvent(analyticsDistinctId(created.id), "auth_oauth_signup_completed", {
      provider,
      tier: created.tier,
      country: created.country,
    });

    return mapRowToBridgeUser(created, true);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const retry = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: OAUTH_USER_SELECT,
      });
      if (retry) return mapRowToBridgeUser(retry, false);
    }
    safeServerLogCritical("auth", "oauth_create_failed", { provider }, e);
    return null;
  }
}
