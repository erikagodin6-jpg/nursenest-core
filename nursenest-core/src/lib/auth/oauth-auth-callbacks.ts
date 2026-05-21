import type { NextAuthConfig } from "next-auth";
import {
  resolveAuthJsRedirectUrl,
  wrapWithOnboardingIfNeeded,
} from "@/lib/auth/auth-flow-governance";
import { resolveOAuthSignInUser } from "@/lib/auth/oauth-account-bridge";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type SignInCallbackArgs = Parameters<NonNullable<NextAuthConfig["callbacks"]>["signIn"]>>[0];

export const oauthAuthCallbacks: Pick<NonNullable<NextAuthConfig["callbacks"]>, "signIn" | "redirect"> = {
  async signIn(params: SignInCallbackArgs) {
    const account = params.account;
    if (!account?.provider || account.provider === "credentials") {
      return true;
    }

    const request = "request" in params ? (params.request as Request | undefined) : undefined;
    const ip = request ? getTrustedClientIp(request) : "unknown";

    const bridged = await resolveOAuthSignInUser({
      user: params.user,
      account,
      profile: params.profile,
      ip,
    });

    if (bridged === "account_not_linked") {
      return false;
    }
    if (!bridged) {
      return false;
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

    captureServerEvent(analyticsDistinctId(bridged.id), "auth_oauth_signin_success", {
      provider: account.provider,
      is_new_user: bridged.isNewUser,
    });

    return true;
  },

  async redirect({ url, baseUrl }) {
    let target = resolveAuthJsRedirectUrl(url, baseUrl);
    try {
      const parsed = new URL(target, baseUrl);
      const needsOnboarding = parsed.searchParams.get("onboarding") === "1";
      if (needsOnboarding) {
        parsed.searchParams.delete("onboarding");
        const dest = `${parsed.pathname}${parsed.search}${parsed.hash}`;
        return wrapWithOnboardingIfNeeded(dest, true);
      }
    } catch {
      /* use target as-is */
    }
    return target;
  },
};

export function mergeAuthRedirectCallback(
  existing: NextAuthConfig["callbacks"] | undefined,
): NextAuthConfig["callbacks"]["redirect"] {
  const prior = existing?.redirect;
  return async (params) => {
    const oauthResult = await oauthAuthCallbacks.redirect!(params);
    if (prior) {
      const merged = await prior(params);
      if (merged && merged !== params.url) return merged;
    }
    return oauthResult;
  };
}
