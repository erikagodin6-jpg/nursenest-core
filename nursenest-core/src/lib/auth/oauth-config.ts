/**
 * @deprecated Prefer `@/lib/auth/oauth-config-env` (client-safe) or `@/lib/auth/oauth-config.server` (NextAuth providers).
 * Re-exports env helpers only — keeps `node:fs` out of client import graphs.
 */
export {
  isAppleOAuthConfigured,
  isGoogleOAuthConfigured,
  listConfiguredOAuthProviderIds,
} from "@/lib/auth/oauth-config-env";
