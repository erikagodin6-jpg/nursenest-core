import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import {
  resolveAuthJsRedirectUrl,
  wrapWithOnboardingIfNeeded,
} from "@/lib/auth/auth-flow-governance";
import { trackAuthCallbackRejected } from "@/lib/auth/auth-redirect-telemetry";
import { logOAuthAudit } from "@/lib/auth/oauth-audit-log";
import { resolveOAuthSignInUser } from "@/lib/auth/oauth-account-bridge";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";

const OAUTH_ONBOARDING_COOKIE = "nn_oauth_needs_onboarding";

export const oauthAuthCallbacks: Pick<NonNullable<NextAuthConfig["callbacks"]>, "signIn" | "redirect"> = {
  async signIn(params) {
    const account = params.account;
    if (!account?.provider || account.provider === "credentials") {
      return true;
    }

    const request = "request" in params ? (params.request as Request | undefined) : undefined;
    const ip = request ? getTrustedClientIp(request) : "unknown";

    const requestOrigin =
      request && "headers" in request
        ? (request.headers.get("referer") ?? request.headers.get("origin") ?? undefined)
        : undefined;

    const bridged = await resolveOAuthSignInUser({
      user: params.user,
      account,
      profile: params.profile,
      ip,
      requestOrigin,
    });

    if (!bridged) {
      logOAuthAudit("oauth_signin_failure", {
        provider: account.provider as "google" | "apple",
        reason: "bridge_rejected",
        requestOrigin,
      });
      return false;
    }

    if (bridged.needsPathwayOnboarding) {
      try {
        const jar = await cookies();
        jar.set(OAUTH_ONBOARDING_COOKIE, "1", {
          maxAge: 120,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });
      } catch {
        /* cookies() unavailable in some edge paths — learner /app routes still gate onboarding */
      }
    }

    params.user.id = bridged.id;
    params.user.email = bridged.email;
    params.user.name = bridged.name;
    (params.user as { role?: string }).role = bridged.role;
    (params.user as { country?: string }).country = bridged.country;
    (params.user as { tier?: string }).tier = bridged.tier;
    (params.user as { alliedProfessionKey?: string | null }).alliedProfessionKey =
      bridged.alliedProfessionKey;
    (params.user as { subscriptionStatus?: string }).subscriptionStatus = bridged.subscriptionStatus;
    (params.user as { credentialVersion?: number }).credentialVersion = bridged.credentialVersion;
    (params.user as { rememberMe?: boolean }).rememberMe = bridged.rememberMe;
    (params.user as { nnNeedsOnboarding?: boolean }).nnNeedsOnboarding = bridged.needsPathwayOnboarding;
    (params.user as { nnIsNewOAuthUser?: boolean }).nnIsNewOAuthUser = bridged.isNewUser;
    (params.user as { nnOAuthProvider?: string }).nnOAuthProvider = account.provider;

    logOAuthAudit("oauth_signin_success", {
      provider: account.provider as "google" | "apple",
      learnerId: bridged.id,
      accountCreated: bridged.isNewUser,
      bridgeOccurred: !bridged.isNewUser,
      requestOrigin,
    });

    captureServerEvent(analyticsDistinctId(bridged.id), "auth_oauth_signin_success", {
      provider: account.provider,
      is_new_user: bridged.isNewUser,
    });

    return true;
  },

  async redirect({ url, baseUrl }) {
    const resolved = resolveAuthJsRedirectUrl(url, baseUrl);
    const fallback = `${baseUrl}/login`;
    if (resolved === fallback && url !== fallback && !url.startsWith("/login")) {
      trackAuthCallbackRejected("unsafe_redirect_target", "oauth_redirect");
    }
    const target = resolved;
    let needsOnboarding = false;
    try {
      const jar = await cookies();
      needsOnboarding = jar.get(OAUTH_ONBOARDING_COOKIE)?.value === "1";
      if (needsOnboarding) {
        jar.delete(OAUTH_ONBOARDING_COOKIE);
      }
    } catch {
      /* no cookie access */
    }
    if (needsOnboarding) {
      return wrapWithOnboardingIfNeeded(target, true);
    }
    return target;
  },
};
