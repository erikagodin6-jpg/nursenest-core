import "server-only";

import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";
import {
  isAppleOAuthConfigured,
  isGoogleOAuthConfigured,
} from "@/lib/auth/oauth-config-env";
import { logOAuthAudit } from "@/lib/auth/oauth-audit-log";
import { prisma } from "@/lib/db";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type ConnectedOAuthProviderView = {
  provider: OAuthProviderId;
  linkedAt: string;
  lastSignInAt: string | null;
  isApplePrivateRelay: boolean;
  emailSnapshot: string | null;
};

export type LearnerConnectedAccountsSnapshot = {
  links: ConnectedOAuthProviderView[];
  hasPassword: boolean;
  googleAvailable: boolean;
  appleAvailable: boolean;
};

export async function loadLearnerConnectedAccounts(
  userId: string,
  hasPassword: boolean,
): Promise<LearnerConnectedAccountsSnapshot> {
  const googleAvailable = isGoogleOAuthConfigured();
  const appleAvailable = isAppleOAuthConfigured();

  let links: ConnectedOAuthProviderView[] = [];
  try {
    const rows = await prisma.oAuthProviderLink.findMany({
      where: { userId },
      orderBy: { linkedAt: "asc" },
      select: {
        provider: true,
        linkedAt: true,
        lastSignInAt: true,
        isApplePrivateRelay: true,
        emailSnapshot: true,
      },
    });
    links = rows
      .filter((r): r is typeof r & { provider: OAuthProviderId } =>
        r.provider === "google" || r.provider === "apple",
      )
      .map((r) => ({
        provider: r.provider,
        linkedAt: r.linkedAt.toISOString(),
        lastSignInAt: r.lastSignInAt?.toISOString() ?? null,
        isApplePrivateRelay: r.isApplePrivateRelay,
        emailSnapshot: r.emailSnapshot,
      }));
  } catch (e) {
    safeServerLog("auth", "oauth_links_load_skipped", {
      userIdPrefix: userId.slice(0, 8),
      reason: e instanceof Error ? e.message.slice(0, 80) : "unknown",
    });
  }

  return { links, hasPassword, googleAvailable, appleAvailable };
}

export async function disconnectOAuthProviderForUser(args: {
  userId: string;
  provider: OAuthProviderId;
  hasPassword: boolean;
}): Promise<{ ok: true } | { ok: false; code: string; message: string }> {
  const linkCount = await prisma.oAuthProviderLink.count({ where: { userId: args.userId } }).catch(() => 0);
  const target = await prisma.oAuthProviderLink.findFirst({
    where: { userId: args.userId, provider: args.provider },
    select: { providerAccountId: true },
  });

  if (!target) {
    return { ok: false, code: "NOT_LINKED", message: "That provider is not connected." };
  }

  const remainingOAuth = linkCount - 1;
  if (!args.hasPassword && remainingOAuth < 1) {
    return {
      ok: false,
      code: "LAST_LOGIN_METHOD",
      message: "Add a password or keep another sign-in method before disconnecting.",
    };
  }

  try {
    await prisma.oAuthProviderLink.delete({
      where: {
        provider_providerAccountId: {
          provider: args.provider,
          providerAccountId: target.providerAccountId,
        },
      },
    });
  } catch (e) {
    safeServerLog("auth", "oauth_disconnect_failed", {
      provider: args.provider,
      userIdPrefix: args.userId.slice(0, 8),
    });
    return { ok: false, code: "DISCONNECT_FAILED", message: "Could not disconnect. Try again." };
  }

  logOAuthAudit("oauth_provider_disconnected", {
    provider: args.provider,
    learnerId: args.userId,
    requestOrigin: "account_security",
  });

  captureServerEvent(analyticsDistinctId(args.userId), "provider_disconnect_completed", {
    provider: args.provider,
  });

  return { ok: true };
}
