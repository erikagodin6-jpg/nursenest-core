import "server-only";

import type { Account, Profile } from "next-auth";
import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";
import { logOAuthAudit } from "@/lib/auth/oauth-audit-log";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

const APPLE_RELAY_SUFFIX = "@privaterelay.appleid.com";

export function isApplePrivateRelayEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(APPLE_RELAY_SUFFIX);
}

export function providerSubjectFromAccount(account: Account | null | undefined): string | null {
  const id = account?.providerAccountId?.trim();
  return id && id.length > 0 ? id : null;
}

export type OAuthIdentityResolution =
  | { ok: true; collision: false }
  | { ok: false; reason: "collision" | "db_error" };

/**
 * Ensures provider subject is tracked immutably and rejects ambiguous cross-user merges.
 * Email is secondary; subject ID is authoritative when present.
 */
export async function assertOAuthProviderIdentitySafe(args: {
  userId: string;
  provider: OAuthProviderId;
  account: Account | null | undefined;
  email: string;
  requestOrigin?: string;
}): Promise<OAuthIdentityResolution> {
  const subject = providerSubjectFromAccount(args.account);
  if (!subject) {
    return { ok: true, collision: false };
  }

  const relay = isApplePrivateRelayEmail(args.email);
  if (relay) {
    logOAuthAudit("oauth_relay_email_detected", {
      provider: args.provider,
      learnerId: args.userId,
      normalizedEmail: args.email,
      providerSubjectId: subject,
      isApplePrivateRelay: true,
      requestOrigin: args.requestOrigin,
    });
  }

  try {
    const existingBySubject = await prisma.oAuthProviderLink.findUnique({
      where: {
        provider_providerAccountId: {
          provider: args.provider,
          providerAccountId: subject,
        },
      },
      select: { userId: true, emailSnapshot: true },
    });

    if (existingBySubject && existingBySubject.userId !== args.userId) {
      logOAuthAudit("oauth_provider_collision_detected", {
        provider: args.provider,
        learnerId: args.userId,
        normalizedEmail: args.email,
        providerSubjectId: subject,
        reason: "subject_bound_to_other_user",
        requestOrigin: args.requestOrigin,
      });
      return { ok: false, reason: "collision" };
    }

    if (existingBySubject) {
      await prisma.oAuthProviderLink.update({
        where: {
          provider_providerAccountId: {
            provider: args.provider,
            providerAccountId: subject,
          },
        },
        data: {
          lastSignInAt: new Date(),
          emailSnapshot: args.email.slice(0, 320),
          isApplePrivateRelay: relay,
        },
      });
      return { ok: true, collision: false };
    }

    await prisma.oAuthProviderLink.create({
      data: {
        userId: args.userId,
        provider: args.provider,
        providerAccountId: subject,
        emailSnapshot: args.email.slice(0, 320),
        isApplePrivateRelay: relay,
        lastSignInAt: new Date(),
      },
    });

    logOAuthAudit("oauth_account_linked", {
      provider: args.provider,
      learnerId: args.userId,
      normalizedEmail: args.email,
      providerSubjectId: subject,
      bridgeOccurred: true,
      requestOrigin: args.requestOrigin,
    });

    return { ok: true, collision: false };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("oauth_provider_links") || msg.includes("OAuthProviderLink")) {
      safeServerLog("auth", "oauth_identity_table_unavailable", {
        provider: args.provider,
        userIdPrefix: args.userId.slice(0, 8),
      });
      return { ok: true, collision: false };
    }
    safeServerLogCritical(
      "auth",
      "oauth_identity_persist_failed",
      { provider: args.provider, userIdPrefix: args.userId.slice(0, 8) },
      e,
    );
    return { ok: false, reason: "db_error" };
  }
}

export function profileEmailForOAuth(profile: Profile | undefined, fallback: string): string {
  const fromProfile = typeof profile?.email === "string" ? profile.email.trim().toLowerCase() : "";
  return fromProfile || fallback;
}
